import { Building2, Users, TrendingUp, Target, CheckCircle2, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

// SEO Meta Tags
const updateMetaTags = () => {
  document.title = "Corporate Partnerships & Advertising | Tariq Islam - Reach Global Muslim Community";
  
  // Meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", "Partner with Tariq Islam to reach engaged Muslims worldwide. Enterprise advertising solutions starting from $99/month. Trusted global community platform.");
  } else {
    const meta = document.createElement('meta');
    meta.name = "description";
    meta.content = "Partner with Tariq Islam to reach engaged Muslims worldwide. Enterprise advertising solutions starting from $99/month. Trusted global community platform.";
    document.head.appendChild(meta);
  }

  // Keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute("content", "Muslim advertising, Islamic community marketing, Muslim business partnerships, global Muslim community, faith-based marketing, halal business advertising");
  } else {
    const meta = document.createElement('meta');
    meta.name = "keywords";
    meta.content = "Muslim advertising, Islamic community marketing, Muslim business partnerships, global Muslim community, faith-based marketing, halal business advertising";
    document.head.appendChild(meta);
  }

  // Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", "Corporate Partnerships & Advertising | Tariq Islam");
  }

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute("content", "Reach Muslims worldwide through targeted advertising and enterprise partnerships on a trusted community platform.");
  }
};

const contactSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(200),
  contact_name: z.string().trim().min(1, "Contact name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

const Partnerships = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Update SEO meta tags on component mount
  useEffect(() => {
    updateMetaTags();
  }, []);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = contactSchema.parse(formData);
      setLoading(true);

      const { error } = await supabase
        .from('partnership_inquiries')
        .insert({
          company_name: validated.company_name,
          contact_name: validated.contact_name,
          email: validated.email,
          phone: validated.phone || null,
          message: validated.message,
          inquiry_type: 'enterprise'
        });

      if (error) throw error;

      toast({
        title: "Thank you for your interest!",
        description: "We'll contact you within 24-48 hours to discuss partnership opportunities.",
      });

      setFormData({
        company_name: "",
        contact_name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit inquiry. Please try emailing us directly.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const pricingTiers = [
    {
      name: "Free Tier",
      price: "$0",
      period: "/month",
      description: "For small businesses getting started",
      features: [
        "Basic business listing",
        "Category placement",
        "Contact form integration",
        "Community visibility",
      ],
      cta: "Get Started",
      ctaLink: "/submit-ad",
    },
    {
      name: "Featured Tier",
      price: "$99",
      period: "/month",
      description: "Stand out in search results",
      features: [
        "All Free features",
        "Featured badge",
        "Priority in search results",
        "Enhanced analytics",
        "Priority support",
      ],
      cta: "Contact Us",
      ctaLink: "#contact",
      popular: true,
    },
    {
      name: "Premium Tier",
      price: "$299",
      period: "/month",
      description: "Maximum visibility and impact",
      features: [
        "All Featured features",
        "Top placement guarantee",
        "Homepage banner ads",
        "Dedicated account manager",
        "Custom integration options",
        "Quarterly performance reports",
      ],
      cta: "Contact Us",
      ctaLink: "#contact",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For major brands and corporations",
      features: [
        "All Premium features",
        "Custom partnership terms",
        "Sponsored category placement",
        "Community event sponsorships",
        "API access for integration",
        "Dedicated support team",
        "White-label opportunities",
      ],
      cta: "Schedule Call",
      ctaLink: "#contact",
    },
  ];

  const stats = [
    { label: "Active Users", value: "50,000+", icon: Users },
    { label: "Monthly Engagement", value: "200,000+", icon: TrendingUp },
    { label: "Community Events", value: "500+", icon: Target },
    { label: "Partner Businesses", value: "1,000+", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Partner with Tariq Islam
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Reach Muslims worldwide through a trusted, community-driven platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-primary shadow-islamic" asChild>
                <a href="#contact">
                  Start Partnership <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#pricing">View Pricing</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center space-y-2">
                  <Icon className="h-8 w-8 mx-auto text-islamic-green" />
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Partner with Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-islamic-green mb-4" />
                <CardTitle>Niche Market Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Direct pipeline to Muslim consumers worldwide—a highly engaged demographic with strong purchasing power and community trust.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle2 className="h-12 w-12 text-islamic-green mb-4" />
                <CardTitle>Trust Factor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Community-vetted platform where recommendations carry weight. Your brand gains credibility through association with trusted Islamic values.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-islamic-green mb-4" />
                <CardTitle>Proven ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lower competition than generic ad platforms, with higher conversion rates through culturally relevant targeting and engagement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Partnership Tiers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business goals. All tiers include access to our engaged community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={tier.popular ? "border-islamic-green shadow-lg relative" : ""}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-islamic-green shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={tier.popular ? "w-full bg-gradient-primary" : "w-full"} 
                    variant={tier.popular ? "default" : "outline"}
                    asChild
                  >
                    <a href={tier.ctaLink}>{tier.cta}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Get in Touch</CardTitle>
              <CardDescription>
                Interested in partnering with Tariq Islam? Fill out the form below and we'll contact you within 24-48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="company_name" className="text-sm font-medium">
                      Company Name *
                    </label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="Amazon, Target, etc."
                      required
                      maxLength={200}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact_name" className="text-sm font-medium">
                      Contact Name *
                    </label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      placeholder="John Doe"
                      required
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="partnerships@company.com"
                      required
                      maxLength={255}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      maxLength={20}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your partnership interests and goals..."
                    required
                    rows={5}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.message.length}/1000 characters
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary shadow-islamic" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit Partnership Inquiry"}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Or contact us directly:</p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <a 
                      href="mailto:partnerships@tariqislam.com" 
                      className="flex items-center gap-2 text-islamic-green hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      partnerships@tariqislam.com
                    </a>
                    <a 
                      href="tel:+13129701766" 
                      className="flex items-center gap-2 text-islamic-green hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      +1 (312) 970-1766
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Partnerships;
