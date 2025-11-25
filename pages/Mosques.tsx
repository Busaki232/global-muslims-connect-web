import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroButton } from "@/components/ui/hero-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Clock, Phone, Globe, Search, Filter, Users, Calendar, Book, Navigation } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MosqueDetailModal from "@/components/MosqueDetailModal";
import PrayerTimeUpdateModal from "@/components/PrayerTimeUpdateModal";
import { useState } from "react";
import mosqueImage from "@/assets/nigerian-islamic-association-chicago.png";
import muslimCenterDetroitImage from "@/assets/muslim-center-detroit-exterior.png";
import islamicCenterMinnesotaImage from "@/assets/islamic-center-minnesota.png";
import masjidAlHikmahClevelandImage from "@/assets/masjid-al-hikmah-cleveland.png";
import islamicSocietyGreaterMilwaukeeImage from "@/assets/islamic-society-greater-milwaukee.png";
import islamicSocietyMidwestImage from "@/assets/islamic-society-midwest.png";

const Mosques = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMosque, setSelectedMosque] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrayerTimeUpdateOpen, setIsPrayerTimeUpdateOpen] = useState(false);

  const handleSubmitMosque = () => {
    if (!user) {
      toast({
        title: "Sign in Required",
        description: "Please sign in to submit a mosque.",
        variant: "default",
      });
      navigate("/auth");
      return;
    }
    navigate("/submit-mosque");
  };

  const handleGetDirections = (mosque: any) => {
    const encodedAddress = encodeURIComponent(mosque.address);
    window.open(`https://maps.google.com/maps?daddr=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  const handleMoreDetails = (mosque: any) => {
    setSelectedMosque(mosque);
    setIsModalOpen(true);
  };

  const handleVisitWebsite = (website: string) => {
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrayerTimeUpdates = () => {
    if (!user) {
      toast({
        title: "Sign in Required",
        description: "Please sign in to submit prayer time updates.",
        variant: "default",
      });
      navigate("/auth");
      return;
    }
    setIsPrayerTimeUpdateOpen(true);
  };

  const mosques = [
    {
      id: 1,
      name: "Nigerian Islamic Association in Chicago",
      address: "932 W Sheridan RD, Chicago, Illinois 60613",
      city: "Chicago",
      state: "IL",
      phone: "(312) 555-0100",
      website: "www.niaichicago.org",
      image: mosqueImage,
      featured: true,
      rating: 4.9,
      reviews: 187,
      nigerianCommunity: true,
      languages: ["English", "Hausa", "Yoruba", "Arabic"],
      services: [
        "Jummah Prayers",
        "Nigerian Community",
        "Youth Programs", 
        "Sister Circles",
        "Islamic Education",
        "Community Outreach"
      ],
      prayerTimes: {
        fajr: "5:30 AM",
        dhuhr: "12:45 PM",
        asr: "3:30 PM",
        maghrib: "6:15 PM",
        isha: "8:00 PM",
        jummah: "1:00 PM"
      },
      imam: "Sheikh Musa Abdullahi",
      description: "Premier Islamic center serving the Chicago area with weekly Friday prayers featuring sermons in multiple languages including English, Hausa, and Yoruba. Active youth programs, sister circles, and extensive community outreach programs."
    },
    {
      id: 2,
      name: "Islamic Society of Midwest",
      address: "2750 W Devon Ave, Chicago, IL 60659",
      city: "Chicago",
      state: "IL",
      phone: "(847) 640-7272",
      website: "www.islamicsocietymidwest.org",
      image: islamicSocietyMidwestImage,
      featured: true,
      rating: 4.8,
      reviews: 124,
      nigerianCommunity: true,
      languages: ["English", "Hausa", "Yoruba", "Arabic"],
      services: [
        "Friday Prayers",
        "Nigerian Community",
        "Youth Programs",
        "Islamic Education",
        "Cultural Events",
        "Community Outreach"
      ],
      prayerTimes: {
        fajr: "5:30 AM",
        dhuhr: "12:50 PM",
        asr: "3:35 PM",
        maghrib: "6:20 PM",
        isha: "8:05 PM",
        jummah: "1:15 PM"
      },
      imam: "Sheikh Abdulrahman Tijani",
      description: "Beautiful Islamic center serving the local Muslim community with stunning traditional architecture. Offers comprehensive programs for families, youth development, and cultural preservation."
    },
    {
      id: 3,
      name: "Muslim Center of Detroit",
      address: "14525 Outer Dr, Detroit, MI 48239",
      city: "Detroit",
      state: "MI",
      phone: "(313) 883-3330",
      website: "www.mcddetroit.org",
      image: muslimCenterDetroitImage,
      featured: true,
      rating: 4.7,
      reviews: 156,
      nigerianCommunity: true,
      languages: ["English", "Hausa", "Yoruba", "Arabic"],
      services: [
        "Daily Prayers",
        "Youth Programs",
        "Nigerian Community",
        "Islamic School",
        "Women's Programs"
      ],
      prayerTimes: {
        fajr: "5:35 AM",
        dhuhr: "12:55 PM",
        asr: "3:40 PM",
        maghrib: "6:25 PM",
        isha: "8:10 PM",
        jummah: "1:30 PM"
      },
      imam: "Sheikh Aminu Dantata",
      description: "Comprehensive Islamic center serving Detroit's diverse Muslim community with special programs for Nigerian families, youth development, and women's empowerment initiatives."
    },
    {
      id: 4,
      name: "Islamic Center of Minnesota",
      address: "1401 Gardena Ave, Saint Paul, MN 55108",
      city: "Minneapolis",
      state: "MN",
      phone: "(763) 571-5604",
      website: "www.icmn.org",
      image: islamicCenterMinnesotaImage,
      featured: false,
      rating: 4.6,
      reviews: 89,
      nigerianCommunity: false,
      languages: ["English", "Arabic", "Somali"],
      services: [
        "Friday Prayers",
        "Islamic School",
        "Cultural Events",
        "Youth Activities",
        "Community Support"
      ],
      prayerTimes: {
        fajr: "5:25 AM",
        dhuhr: "12:40 PM",
        asr: "3:25 PM",
        maghrib: "6:10 PM",
        isha: "7:55 PM",
        jummah: "12:45 PM"
      },
      imam: "Sheikh Abdullah Hassan",
      description: "Established Islamic center in Minneapolis area offering comprehensive religious and educational services for the diverse Muslim community."
    },
    {
      id: 5,
      name: "Masjid Al-Hikmah Cleveland",
      address: "3606 Steelyard Dr, Cleveland, OH 44109",
      city: "Cleveland",
      state: "OH",
      phone: "(216) 362-0786",
      website: "www.alhikmahcle.org",
      image: masjidAlHikmahClevelandImage,
      featured: false,
      rating: 4.5,
      reviews: 67,
      nigerianCommunity: true,
      languages: ["English", "Hausa", "Arabic"],
      services: [
        "Jummah Prayers",
        "Quran Classes",
        "Nigerian Fellowship",
        "Youth Programs",
        "Community Iftar"
      ],
      prayerTimes: {
        fajr: "5:40 AM",
        dhuhr: "1:00 PM",
        asr: "3:45 PM",
        maghrib: "6:30 PM",
        isha: "8:15 PM",
        jummah: "1:15 PM"
      },
      imam: "Sheikh Yusuf Abdulrahman",
      description: "Growing Islamic community in Cleveland with active Nigerian fellowship programs and strong emphasis on youth Islamic education and community building."
    },
    {
      id: 6,
      name: "Islamic Society of Greater Milwaukee",
      address: "4707 S 13th St, Milwaukee, WI 53221",
      city: "Milwaukee",
      state: "WI",
      phone: "(414) 282-1812",
      website: "www.isgm.org",
      image: islamicSocietyGreaterMilwaukeeImage,
      featured: false,
      rating: 4.4,
      reviews: 45,
      nigerianCommunity: false,
      languages: ["English", "Arabic"],
      services: [
        "Friday Prayers",
        "Islamic Education",
        "Community Events",
        "Interfaith Dialogue",
        "Social Services"
      ],
      prayerTimes: {
        fajr: "5:45 AM",
        dhuhr: "1:05 PM",
        asr: "3:50 PM",
        maghrib: "6:35 PM",
        isha: "8:20 PM",
        jummah: "1:30 PM"
      },
      imam: "Sheikh Omar Al-Rashid",
      description: "Welcoming Islamic center in Milwaukee focused on community building, interfaith dialogue, and comprehensive Islamic education for all ages."
    },
    {
      id: 7,
      name: "Nigerian American Integrated Community of New York",
      address: "801 Dewan St, Brooklyn, NY 11238",
      city: "Brooklyn",
      state: "NY",
      phone: "(718) 623-8193",
      website: "www.naicny.org",
      image: mosqueImage,
      featured: false,
      rating: 4.6,
      reviews: 52,
      nigerianCommunity: true,
      languages: ["English", "Hausa", "Yoruba", "Igbo", "Arabic"],
      services: [
        "Jummah Prayers",
        "Nigerian Community",
        "Youth Programs",
        "Islamic Education",
        "Cultural Events",
        "Community Outreach"
      ],
      prayerTimes: {
        fajr: "5:20 AM",
        dhuhr: "12:40 PM",
        asr: "3:25 PM",
        maghrib: "6:10 PM",
        isha: "7:55 PM",
        jummah: "1:15 PM"
      },
      imam: "Sheikh Ibrahim Olaleye",
      description: "Vibrant Nigerian Islamic community center in Brooklyn serving New York's diverse Nigerian Muslim population with comprehensive religious services, cultural programs, and youth development initiatives."
    }
  ];

  const countries = ["All Locations", "United States", "Canada", "United Kingdom", "Nigeria", "Kenya", "South Africa", "Saudi Arabia", "UAE", "Malaysia", "Indonesia", "Pakistan", "Bangladesh", "Turkey", "Egypt"];
  const serviceFilters = ["All Services", "Daily Prayers", "Jummah Prayers", "Islamic Education", "Youth Programs", "Women's Programs", "Community Events", "Islamic School", "Marriage Services", "Funeral Services"];

  return (
    <main className="min-h-screen bg-background pt-16">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-secondary/30 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find Mosques & Islamic Centers
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Discover welcoming Islamic centers across the Midwest. Find prayer times, 
              diverse Muslim communities, and Islamic education programs near you.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input 
                    placeholder="Search mosques by name, city, or imam..."
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <HeroButton size="lg" className="md:w-auto w-full">
                  <Filter className="mr-2" size={20} />
                  Filter Results
                </HeroButton>
              </div>
            </CardContent>
          </Card>

          {/* Filter Badges */}
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">Locations:</span>
              {countries.map((country) => (
                <Badge 
                  key={country}
                  variant="secondary" 
                  className="cursor-pointer hover:bg-islamic-green hover:text-white transition-colors"
                >
                  {country}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">Services:</span>
              {serviceFilters.map((service) => (
                <Badge 
                  key={service}
                  variant="outline" 
                  className="cursor-pointer hover:bg-islamic-green hover:text-white hover:border-islamic-green transition-colors"
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mosques Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Islamic Centers ({mosques.length} locations)
            </h2>
            <p className="text-muted-foreground">
              Comprehensive directory of mosques and Islamic centers across the Midwest
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mosques.map((mosque) => (
              <Card key={mosque.id} className={`shadow-lg hover:shadow-xl transition-all ${mosque.featured ? 'ring-2 ring-islamic-green' : ''}`}>
                <div className="relative">
                  <img 
                    src={mosque.image} 
                    alt={mosque.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {mosque.featured && (
                    <Badge className="absolute top-3 left-3 bg-islamic-green text-white">
                      Featured
                    </Badge>
                  )}
                  {mosque.nigerianCommunity && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 bg-islamic-gold text-white"
                    >
                      Nigerian Community
                    </Badge>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{mosque.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-islamic-gold text-islamic-gold" />
                      <span className="text-sm font-medium">{mosque.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({mosque.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{mosque.address}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {mosque.description}
                  </p>

                  {/* Imam and Languages */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-islamic-green" />
                      <span className="font-medium">Imam:</span>
                      <span>{mosque.imam}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-islamic-green" />
                      <span className="font-medium">Languages:</span>
                      <span>{mosque.languages.join(", ")}</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {mosque.services.slice(0, 4).map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {mosque.services.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{mosque.services.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Prayer Times */}
                  <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-islamic-green" />
                      <span className="font-medium text-sm">Prayer Times Today</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>Fajr: <span className="font-medium">{mosque.prayerTimes.fajr}</span></div>
                      <div>Dhuhr: <span className="font-medium">{mosque.prayerTimes.dhuhr}</span></div>
                      <div>Asr: <span className="font-medium">{mosque.prayerTimes.asr}</span></div>
                      <div>Maghrib: <span className="font-medium">{mosque.prayerTimes.maghrib}</span></div>
                      <div>Isha: <span className="font-medium">{mosque.prayerTimes.isha}</span></div>
                      <div className="font-semibold text-islamic-green">Jummah: {mosque.prayerTimes.jummah}</div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-islamic-green" />
                      <span>{mosque.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-islamic-green" />
                      <span 
                        className="text-islamic-green hover:underline cursor-pointer"
                        onClick={() => handleVisitWebsite(mosque.website)}
                      >
                        {mosque.website}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <HeroButton 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleGetDirections(mosque)}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Get Directions
                    </HeroButton>
                    <HeroButton 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleMoreDetails(mosque)}
                    >
                      More Details
                    </HeroButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-secondary/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Missing Your Mosque?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Help us build a comprehensive directory. Submit your mosque or Islamic center 
              to be featured in our community directory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HeroButton size="lg" onClick={handleSubmitMosque}>
                <Calendar className="mr-2" />
                Submit Mosque
              </HeroButton>
              <HeroButton variant="outline" size="lg" onClick={handlePrayerTimeUpdates}>
                <Book className="mr-2" />
                Prayer Time Updates
              </HeroButton>
            </div>
          </div>
        </div>
      </section>

      <MosqueDetailModal 
        mosque={selectedMosque}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      <PrayerTimeUpdateModal
        isOpen={isPrayerTimeUpdateOpen}
        onClose={() => setIsPrayerTimeUpdateOpen(false)}
      />
    </main>
  );
};

export default Mosques;