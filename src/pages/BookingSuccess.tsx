import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, Mic, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-green mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Card className="bg-card/80 backdrop-blur-sm border-border max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Booking Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find your booking. Please contact support if you believe this is an error.
            </p>
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Success Header */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-24 w-24 text-neon-green animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-6 text-neon-green">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your session has been booked and payment processed. We'll send you a confirmation email shortly.
          </p>
        </div>
      </section>

      {/* Booking Details */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-neon-cyan">
                <Calendar className="h-6 w-6 mr-2" />
                Booking Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mic className="h-5 w-5 text-neon-green" />
                    <div>
                      <p className="font-semibold">Service</p>
                      <p className="text-muted-foreground">{booking.service}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-neon-cyan" />
                    <div>
                      <p className="font-semibold">Date</p>
                      <p className="text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-neon-purple" />
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-muted-foreground">{booking.time}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Duration</p>
                    <p className="text-muted-foreground">{booking.duration} hour{booking.duration > 1 ? 's' : ''}</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold">Total Paid</p>
                    <p className="text-neon-green font-semibold text-lg">£{booking.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-neon-cyan" />
                    <div>
                      <p className="font-semibold">Confirmation Email</p>
                      <p className="text-muted-foreground">{booking.customer_email}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {booking.notes && (
                <div>
                  <p className="font-semibold mb-2">Special Notes</p>
                  <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {booking.notes}
                  </p>
                </div>
              )}
              
              <div className="bg-neon-green/10 border border-neon-green/20 rounded-lg p-4">
                <h3 className="font-semibold text-neon-green mb-2">What's Next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll receive a confirmation email within 5 minutes</li>
                  <li>• Our team will contact you 24 hours before your session</li>
                  <li>• Please arrive 15 minutes early for setup</li>
                  <li>• Bring your music files, lyrics, and creative energy!</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" className="flex-1" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BookingSuccess;
