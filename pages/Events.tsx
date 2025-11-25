import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CreateEventModal } from "@/components/CreateEventModal";
import { EventDetailModal } from "@/components/EventDetailModal";
import { logger } from "@/lib/logger";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
  attendees_count: number;
  max_attendees?: number;
  image_url?: string;
  organizer_id: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'upcoming')
        .order('event_date', { ascending: true });

      if (error) {
        logger.error('Error fetching events', error);
        toast.error('Failed to load events');
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      logger.error('Error fetching events', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      religious: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      educational: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      cultural: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      social: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      general: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const handleEventCreated = () => {
    fetchEvents();
    setShowCreateModal(false);
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const getCapacityInfo = (event: Event) => {
    if (!event.max_attendees) return null;
    const percentage = (event.attendees_count / event.max_attendees) * 100;
    const isFull = event.attendees_count >= event.max_attendees;
    return { percentage, isFull };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading events...</p>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Community Events</h1>
              <p className="text-muted-foreground">Discover and join events in the global Muslim community</p>
            </div>
            {user && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="religious">Religious</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || categoryFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "No events are currently scheduled"}
            </p>
            {user && (
              <Button onClick={() => setShowCreateModal(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create the first event
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                {event.image_url && (
                  <div className="w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                    {(() => {
                      const capacityInfo = getCapacityInfo(event);
                      if (capacityInfo?.isFull) {
                        return <Badge variant="destructive">Full</Badge>;
                      } else if (capacityInfo && capacityInfo.percentage >= 80) {
                        return <Badge variant="outline">Almost Full</Badge>;
                      }
                      return null;
                    })()}
                  </div>
                  <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.event_date)} at {formatTime(event.event_time)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {event.attendees_count} attending
                      {event.max_attendees && ` / ${event.max_attendees} max`}
                    </div>
                  </div>

                  {event.max_attendees && (
                    <div className="mt-3">
                      <Progress 
                        value={getCapacityInfo(event)?.percentage || 0} 
                        className="h-1.5"
                      />
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-border">
                    <Button 
                      className="w-full"
                      onClick={() => handleViewDetails(event)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Event Modal */}
        <CreateEventModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onEventCreated={handleEventCreated}
        />

        {/* Event Detail Modal */}
        <EventDetailModal
          event={selectedEvent}
          open={showEventDetail}
          onOpenChange={setShowEventDetail}
        />
      </div>
    </div>
  );
};

export default Events;