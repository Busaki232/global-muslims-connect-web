import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, ShoppingBag, Calendar, Building, MessageSquare, Users, Plus, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface UserStats {
  advertisements: number;
  events: number;
  mosqueSubmissions: number;
  leadershipApplications: number;
  messages: number;
}

interface Advertisement {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  view_count: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  status: string;
  created_at: string;
  attendees_count: number;
}

interface MosqueSubmission {
  id: string;
  mosque_name: string;
  city: string;
  state: string;
  status: string;
  created_at: string;
}

interface LeadershipApplication {
  id: string;
  full_name: string;
  location: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    advertisements: 0,
    events: 0,
    mosqueSubmissions: 0,
    leadershipApplications: 0,
    messages: 0
  });
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mosqueSubmissions, setMosqueSubmissions] = useState<MosqueSubmission[]>([]);
  const [leadershipApplications, setLeadershipApplications] = useState<LeadershipApplication[]>([]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch advertisements
      const { data: ads, error: adsError } = await supabase
        .from('advertisements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;

      // Fetch events
      const { data: userEvents, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch mosque submissions
      const { data: mosques, error: mosquesError } = await supabase
        .from('mosque_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (mosquesError) throw mosquesError;

      // Fetch leadership applications
      const { data: leadership, error: leadershipError } = await supabase
        .from('leadership_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (leadershipError) throw leadershipError;

      // Fetch messages count
      const { count: messageCount, error: messagesError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', user.id);

      if (messagesError) throw messagesError;

      // Update state
      setAdvertisements(ads || []);
      setEvents(userEvents || []);
      setMosqueSubmissions(mosques || []);
      setLeadershipApplications(leadership || []);
      
      setStats({
        advertisements: ads?.length || 0,
        events: userEvents?.length || 0,
        mosqueSubmissions: mosques?.length || 0,
        leadershipApplications: leadership?.length || 0,
        messages: messageCount || 0
      });

    } catch (error) {
      logger.error('Error fetching user data', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case 'rejected':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case 'upcoming':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your contributions and activity in the community</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Ads</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.advertisements}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.events}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mosques</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mosqueSubmissions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leadershipApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messages}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Create new content or manage existing submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={() => navigate('/submit-ad')} className="h-auto p-4 flex flex-col items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                <span>List Business</span>
              </Button>
              <Button onClick={() => navigate('/events')} className="h-auto p-4 flex flex-col items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span>Create Event</span>
              </Button>
              <Button onClick={() => navigate('/submit-mosque')} className="h-auto p-4 flex flex-col items-center gap-2">
                <Building className="w-6 h-6" />
                <span>Submit Mosque</span>
              </Button>
              <Button onClick={() => navigate('/leadership-application')} className="h-auto p-4 flex flex-col items-center gap-2">
                <Users className="w-6 h-6" />
                <span>Apply Leadership</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="advertisements" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="advertisements">My Ads ({stats.advertisements})</TabsTrigger>
            <TabsTrigger value="events">My Events ({stats.events})</TabsTrigger>
            <TabsTrigger value="mosques">Mosques ({stats.mosqueSubmissions})</TabsTrigger>
            <TabsTrigger value="leadership">Applications ({stats.leadershipApplications})</TabsTrigger>
          </TabsList>

          <TabsContent value="advertisements" className="space-y-4">
            {advertisements.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No advertisements yet</h3>
                  <p className="text-muted-foreground mb-4">Start by listing your first business or service</p>
                  <Button onClick={() => navigate('/submit-ad')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Ad
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {advertisements.map((ad) => (
                  <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2">{ad.title}</CardTitle>
                        <Badge className={getStatusColor(ad.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(ad.status)}
                            {ad.status}
                          </div>
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{ad.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {ad.view_count} views
                        </div>
                        <div>Created: {formatDate(ad.created_at)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {events.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first community event</p>
                  <Button onClick={() => navigate('/events')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                        <Badge className={getStatusColor(event.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(event.status)}
                            {event.status}
                          </div>
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {event.attendees_count} attending
                        </div>
                        <div>Event Date: {formatDate(event.event_date)}</div>
                        <div>Created: {formatDate(event.created_at)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mosques" className="space-y-4">
            {mosqueSubmissions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No mosque submissions yet</h3>
                  <p className="text-muted-foreground mb-4">Help expand our mosque directory</p>
                  <Button onClick={() => navigate('/submit-mosque')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Mosque
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mosqueSubmissions.map((mosque) => (
                  <Card key={mosque.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2">{mosque.mosque_name}</CardTitle>
                        <Badge className={getStatusColor(mosque.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(mosque.status)}
                            {mosque.status}
                          </div>
                        </Badge>
                      </div>
                      <CardDescription>{mosque.city}, {mosque.state}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Submitted: {formatDate(mosque.created_at)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leadership" className="space-y-4">
            {leadershipApplications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No leadership applications yet</h3>
                  <p className="text-muted-foreground mb-4">Apply to become a community leader</p>
                  <Button onClick={() => navigate('/leadership-application')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leadershipApplications.map((app) => (
                  <Card key={app.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-2">Leadership Application</CardTitle>
                        <Badge className={getStatusColor(app.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(app.status)}
                            {app.status}
                          </div>
                        </Badge>
                      </div>
                      <CardDescription>{app.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Applied: {formatDate(app.created_at)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;