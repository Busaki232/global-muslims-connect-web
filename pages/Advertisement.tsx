import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroButton } from "@/components/ui/hero-button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Globe, Mail, MessageCircle, Eye, Plus, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ContactRequestModal } from "@/components/ContactRequestModal";
import { logger } from "@/lib/logger";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  location: string | null;
  contact_phone?: string | null; // Optional - excluded from public listings for security
  contact_email?: string | null; // Optional - excluded from public listings for security
  website: string | null;
  image_url: string | null;
  featured: boolean;
  view_count: number;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

const Advertisement = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [contactModal, setContactModal] = useState<{
    isOpen: boolean;
    advertisementId: string;
    businessName: string;
  }>({
    isOpen: false,
    advertisementId: '',
    businessName: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAdvertisements();
    fetchCategories();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      // Use the secure function that excludes contact information from public listings
      const { data, error } = await supabase.rpc('get_public_advertisements');

      if (error) {
        logger.error('Error fetching advertisements', error);
        toast({
          title: 'Error',
          description: 'Failed to load advertisements. Please refresh the page to try again.',
          variant: 'destructive',
        });
        return;
      }

      // Fetch categories separately for each advertisement
      const adsWithCategories = await Promise.all(
        (data || []).map(async (ad) => {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('name, slug')
            .eq('id', ad.category_id)
            .single();
          
          return {
            ...ad,
            categories: categoryData || { name: 'Uncategorized', slug: 'uncategorized' },
            // Note: contact_phone and contact_email are intentionally excluded 
            // from get_public_advertisements() for security
          };
        })
      );

      setAdvertisements(adsWithCategories);
    } catch (error) {
      // Error fetching advertisements - handled silently in production
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        return;
      }

      // Add count for each category
      const categoriesWithCount = await Promise.all(
        (data || []).map(async (category) => {
          // Count approved advertisements using the secure RPC function
          const { data: ads } = await supabase.rpc('get_public_advertisements');
          const categoryCount = ads?.filter(ad => ad.category_id === category.id).length || 0;
          
          return {
            ...category,
            count: categoryCount,
          };
        })
      );

      // Add "All" category
      const totalCount = advertisements.length;
      setCategories([
        { id: 'all', name: 'All', slug: 'all', count: totalCount },
        ...categoriesWithCount,
      ]);
    } catch (error) {
      // Error fetching categories - handled silently in production
    }
  };

  const filteredAds = selectedCategory === 'All' 
    ? advertisements 
    : advertisements.filter(ad => ad.categories.name === selectedCategory);

  const handlePostBusiness = () => {
    navigate('/submit-ad');
  };

  const handleContactRequest = async (ad: Advertisement) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request contact information.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      // Use the new secure contact function to check access
      const { data: contactInfo, error } = await supabase
        .rpc('get_advertisement_contact_secure', { 
          _advertisement_id: ad.id 
        });

      if (error) {
        logger.error('Error checking contact access', error);
      }

      // Always open contact request modal for secure messaging
      // This ensures all contact goes through the secured system
      setContactModal({
        isOpen: true,
        advertisementId: ad.id,
        businessName: ad.title,
      });
    } catch (error) {
      logger.error('Error with secure contact check', error);
      // Fallback to contact request modal for security
      setContactModal({
        isOpen: true,
        advertisementId: ad.id,
        businessName: ad.title,
      });
    }
  };

  const closeContactModal = () => {
    setContactModal({
      isOpen: false,
      advertisementId: '',
      businessName: '',
    });
  };

  return (
    <main className="min-h-screen bg-background pt-16">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-secondary/30 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Community Marketplace
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Discover halal businesses, Islamic services, and community resources 
              trusted by Muslims worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user && (
                <HeroButton 
                  variant="outline"
                  size="lg" 
                  onClick={() => navigate('/my-ads')}
                  className="touch-manipulation active:opacity-70"
                  style={{ 
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    WebkitTouchCallout: 'none',
                  }}
                >
                  <Store className="mr-2" size={20} />
                  My Ads
                </HeroButton>
              )}
              <HeroButton 
                size="lg" 
                onClick={handlePostBusiness}
                className="touch-manipulation active:opacity-70"
                style={{ 
                  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                  WebkitTouchCallout: 'none',
                }}
              >
                Post Your Business
              </HeroButton>
              <HeroButton 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  setSelectedCategory('All');
                  const categoriesSection = document.getElementById('categories-section');
                  if (categoriesSection) {
                    categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="touch-manipulation active:opacity-70"
                style={{ 
                  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                  WebkitTouchCallout: 'none',
                }}
              >
                Browse Categories
              </HeroButton>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section id="categories-section" className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Badge 
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "secondary"}
                className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors touch-manipulation active:opacity-70"
                onClick={() => setSelectedCategory(category.name)}
                style={{ 
                  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                  WebkitTouchCallout: 'none',
                  minHeight: '44px',
                }}
              >
                {category.name} ({category.count || 0})
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Featured Listings
            </h2>
            <p className="text-muted-foreground">
              Premium businesses and services recommended by our community
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading advertisements...</p>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                {advertisements.length === 0 
                  ? "No advertisements available yet. Be the first to showcase your business to the community!"
                  : selectedCategory === 'All'
                    ? "No advertisements found."
                    : `No advertisements found in the ${selectedCategory} category. Try browsing all categories or post your business here.`
                }
              </p>
              <HeroButton onClick={handlePostBusiness} className="inline-flex items-center">
                <Mail className="mr-2" size={18} />
                {advertisements.length === 0 ? "Post the First Business" : "Post Your Business"}
              </HeroButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map((ad) => (
                <Card key={ad.id} className={`shadow-lg hover:shadow-xl transition-shadow ${ad.featured ? 'ring-2 ring-primary' : ''}`}>
                  <div className="relative">
                    {ad.image_url ? (
                      <img 
                        src={ad.image_url} 
                        alt={ad.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    {ad.featured && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 bg-white/90 text-foreground"
                    >
                      {ad.categories.name}
                    </Badge>
                  </div>
                  
                   <CardHeader>
                     <CardTitle className="text-xl">{ad.title}</CardTitle>
                     <div className="flex items-center gap-2">
                       <Eye className="w-4 h-4 text-muted-foreground" />
                       <span className="text-sm text-muted-foreground">{ad.view_count} views</span>
                     </div>
                   </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {ad.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                       {ad.location && (
                         <div className="flex items-center gap-2 text-sm">
                           <MapPin className="w-4 h-4 text-primary" />
                           <span>{ad.location}</span>
                         </div>
                       )}
                      
                      {ad.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-primary" />
                          <a 
                            href={ad.website.startsWith('http') ? ad.website : `https://${ad.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline cursor-pointer"
                          >
                            {ad.website}
                          </a>
                        </div>
                      )}
                    </div>
                    
                     <div className="flex gap-2">
                       <HeroButton 
                         size="sm" 
                         className="flex-1"
                         onClick={() => handleContactRequest(ad)}
                       >
                         <MessageCircle className="w-4 h-4 mr-2" />
                         {user ? 'Request Contact' : 'Sign in to Contact'}
                       </HeroButton>
                       {ad.website && (
                         <HeroButton 
                           variant="outline" 
                           size="sm" 
                           className="flex-1"
                           onClick={() => window.open(ad.website?.startsWith('http') ? ad.website : `https://${ad.website}`, '_blank')}
                         >
                           Website
                         </HeroButton>
                       )}
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-secondary/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Grow Your Business with Our Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Reach thousands of Muslims worldwide. 
              List your halal business, service, or organization today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HeroButton 
                size="lg" 
                onClick={handlePostBusiness}
                className="touch-manipulation active:opacity-70"
                style={{ 
                  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                  WebkitTouchCallout: 'none',
                }}
              >
                <Mail className="mr-2" />
                List Your Business
              </HeroButton>
              <HeroButton 
                variant="outline" 
                size="lg" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="touch-manipulation active:opacity-70"
                style={{ 
                  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                  WebkitTouchCallout: 'none',
                }}
              >
                Browse Marketplace
              </HeroButton>
            </div>
          </div>
        </div>
      </section>

      <ContactRequestModal
        isOpen={contactModal.isOpen}
        onClose={closeContactModal}
        advertisementId={contactModal.advertisementId}
        businessName={contactModal.businessName}
      />
    </main>
  );
};

export default Advertisement;