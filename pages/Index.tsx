import HeroSection from "@/components/HeroSection";
import PrayerTimes from "@/components/PrayerTimes";
import CommunitySection from "@/components/CommunitySection";
import QuranSection from "@/components/QuranSection";
import CallToActionSection from "@/components/CallToActionSection";
import GlobalLocations from "@/components/GlobalLocations";
import FeaturesSection from "@/components/FeaturesSection";
import MobileDownload from "@/components/MobileDownload";
import Footer from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Floating Theme Toggle */}
      <div className="fixed top-20 right-4 z-40">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
          <ThemeToggle />
        </div>
      </div>

      <HeroSection />
      <PrayerTimes />
      <CommunitySection />
      <QuranSection />
      <CallToActionSection />
      <GlobalLocations />
      <FeaturesSection />
      <MobileDownload />
      <Footer />
    </main>
  );
};

export default Index;
