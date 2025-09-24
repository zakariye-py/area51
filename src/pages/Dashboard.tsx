import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Star, User, LogOut, Settings, Music, Headphones, Disc } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  user_id: string | null;
  service_type: string;
  date: string;
  time: string;
  status: 'available' | 'booked' | 'canceled' | 'completed';
  notes: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export default function Dashboard() {
  const { user, isAdmin, signOut, loading } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [availableBookings, setAvailableBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, isAdmin]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      if (isAdmin) {
        // Admin can see all bookings with user details
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email
            )
          `)
          .order('date', { ascending: true });

        if (error) throw error;
        setBookings((data as any) || []);
      } else {
        // Regular users see their bookings + available slots
        const [userBookingsRes, availableBookingsRes] = await Promise.all([
          supabase
            .from('bookings')
            .select('*')
            .eq('user_id', user!.id)
            .order('date', { ascending: true }),
          supabase
            .from('bookings')
            .select('*')
            .eq('status', 'available')
            .order('date', { ascending: true })
        ]);

        if (userBookingsRes.error) throw userBookingsRes.error;
        if (availableBookingsRes.error) throw availableBookingsRes.error;

        setUserBookings(userBookingsRes.data || []);
        setAvailableBookings(availableBookingsRes.data || []);
      }
    } catch (error: any) {
      toast({
        title: "Error loading bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  const bookSlot = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          user_id: user!.id,
          status: 'booked'
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking confirmed!",
        description: "Your session has been booked successfully.",
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'available' | 'booked' | 'canceled' | 'completed') => {
    try {
      const updateData: any = { status };
      if (status === 'available') {
        updateData.user_id = null;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking updated",
        description: `Status changed to ${status}`,
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking deleted",
        description: "The booking has been removed.",
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'recording':
        return <Music className="h-4 w-4" />;
      case 'mixing':
        return <Headphones className="h-4 w-4" />;
      case 'mastering':
        return <Disc className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: 'secondary',
      booked: 'default',
      canceled: 'destructive',
      completed: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center space-y-4">
          <div className="w-8 h-8 bg-primary/20 rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              {isAdmin ? <Star className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut} className="border-primary/20">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {isAdmin ? (
          /* Admin View */
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  All Bookings Management
                </CardTitle>
                <CardDescription>
                  Manage all studio bookings and user sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {bookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No bookings found
                    </p>
                  ) : (
                    bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-primary/5"
                      >
                        <div className="flex items-center gap-4">
                          {getServiceIcon(booking.service_type)}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{booking.service_type}</span>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(booking.date), 'MMM dd, yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.time}
                              </span>
                              {booking.profiles && (
                                <span>• {booking.profiles.full_name || booking.profiles.email}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'available')}
                            disabled={booking.status === 'available'}
                          >
                            Make Available
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            disabled={booking.status === 'completed'}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteBooking(booking.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* User View */
          <div className="grid gap-8 lg:grid-cols-2">
            {/* My Bookings */}
            <Card className="border-primary/20 shadow-elegant">
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>Your upcoming and past sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userBookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No bookings yet. Book your first session!
                    </p>
                  ) : (
                    userBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-primary/5"
                      >
                        <div className="flex items-center gap-3">
                          {getServiceIcon(booking.service_type)}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{booking.service_type}</span>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(booking.date), 'MMM dd, yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Available Bookings */}
            <Card className="border-primary/20 shadow-elegant">
              <CardHeader>
                <CardTitle>Available Sessions</CardTitle>
                <CardDescription>Book your next studio session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableBookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No available sessions at the moment
                    </p>
                  ) : (
                    availableBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getServiceIcon(booking.service_type)}
                          <div className="space-y-1">
                            <span className="font-medium">{booking.service_type}</span>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(booking.date), 'MMM dd, yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button onClick={() => bookSlot(booking.id)}>
                          Book Now
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}