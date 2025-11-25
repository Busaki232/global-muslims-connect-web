import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import EmailConfirmed from "./pages/EmailConfirmed";
import Advertisement from "./pages/Advertisement";
import Mosques from "./pages/Mosques";
import SubmitAd from "./pages/SubmitAd";
import MyAds from "./pages/MyAds";
import SubmitMosque from "./pages/SubmitMosque";
import Events from "./pages/Events";
import IslamicCalendar from "./pages/IslamicCalendar";
import LeadershipApplication from "./pages/LeadershipApplication";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Partnerships from "./pages/Partnerships";
import NotFound from "./pages/NotFound";
import PrivateMessaging from "./components/PrivateMessaging";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import ModerationDashboard from "./pages/ModerationDashboard";
import AntiExtremismEducation from "./pages/AntiExtremismEducation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <PrivateMessaging />
            </ProtectedRoute>
          } />
            <Route path="/mosques" element={<Mosques />} />
            <Route path="/events" element={<Events />} />
            <Route path="/islamic-calendar" element={<IslamicCalendar />} />
            <Route path="/marketplace" element={<Advertisement />} />
            <Route path="/submit-ad" element={
              <ProtectedRoute>
                <SubmitAd />
              </ProtectedRoute>
            } />
            <Route path="/my-ads" element={
              <ProtectedRoute>
                <MyAds />
              </ProtectedRoute>
            } />
            <Route path="/submit-mosque" element={
              <ProtectedRoute>
                <SubmitMosque />
              </ProtectedRoute>
            } />
            <Route path="/leadership-application" element={
              <ProtectedRoute>
                <LeadershipApplication />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/anti-extremism" element={<AntiExtremismEducation />} />
            <Route path="/moderation" element={
              <ProtectedRoute requireAdmin>
                <ModerationDashboard />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
