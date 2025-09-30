import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Mic, Headphones, Volume2, CreditCard, User, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { redirectToCheckout } from "@/lib/stripe";
import { createBooking, createCheckoutSession, BookingData, getBookingsForDate, isTimeSlotAvailable } from "@/lib/booking-api";
import { setUserCookie, getUserCookie } from "@/lib/cookies";

const Booking = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customDuration, setCustomDuration] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const { toast } = useToast();

  // Load user data from cookies on component mount
  useEffect(() => {
    const userData = getUserCookie();
    if (userData) {
      setCustomerInfo(prev => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || ""
      }));
    }
  }, []);

  // Fetch existing bookings when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchExistingBookings();
    } else {
      setExistingBookings([]);
    }
  }, [selectedDate]);

  // Clear selected time when duration changes (as availability might change)
  useEffect(() => {
    if (selectedTime && selectedDate) {
      const isAvailable = isTimeSlotAvailable(selectedTime, customDuration, existingBookings);
      if (!isAvailable) {
        setSelectedTime("");
        toast({
          title: "Time Slot Unavailable",
          description: "The selected time is no longer available for this duration. Please choose another time.",
          variant: "destructive"
        });
      }
    }
  }, [customDuration, existingBookings]);

  const fetchExistingBookings = async () => {
    setLoadingAvailability(true);
    try {
      const bookings = await getBookingsForDate(selectedDate);
      setExistingBookings(bookings);
    } catch (error) {
      console.error('Error fetching existing bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load availability. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingAvailability(false);
    }
  };

  const services = [
    {
      id: "recording",
      name: "Recording Session",
      icon: <Mic className="h-5 w-5" />,
      description: "Professional recording in our state-of-the-art booths"
    },
    {
      id: "mixing",
      name: "Mixing Service",
      icon: <Headphones className="h-5 w-5" />,
      description: "Expert mixing to bring your tracks to life"
    },
    {
      id: "mastering",
      name: "Mastering Service",
      icon: <Volume2 className="h-5 w-5" />,
      description: "Final polish and optimization for your music"
    }
  ];

  const hourlyRate = 10; // £10 per hour
  const totalPrice = customDuration * hourlyRate;

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
  ];

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!selectedServiceData || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a service, date, and time.",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Save user data to cookies
      setUserCookie(customerInfo);

      // Create booking
      const bookingData: BookingData = {
        service: selectedServiceData.name,
        date: selectedDate,
        time: selectedTime,
        duration: customDuration,
        price: totalPrice,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        notes: customerInfo.notes
      };

      const booking = await createBooking(bookingData);

      // Create Stripe checkout session
      const checkoutSession = await createCheckoutSession(
        booking.id,
        totalPrice,
        customerInfo.email,
        customerInfo.name,
        selectedServiceData.name,
        selectedDate,
        selectedTime,
        customDuration
      );

      // Redirect to Stripe Checkout
      await redirectToCheckout(checkoutSession.sessionId);

    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Book Your Session</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Reserve your spot in our futuristic recording studios and bring your musical vision to life
          </p>
        </div>
      </section>

      {/* Booking Interface */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-green">
                    <Calendar className="h-6 w-6 mr-2" />
                    Select Your Service
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    All services: £{hourlyRate}/hour • Choose custom duration below
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <Card 
                        key={service.id}
                        className={`cursor-pointer transition-all duration-300 hover:glow-green ${
                          selectedService === service.id ? 'ring-2 ring-neon-green glow-green' : 'hover:border-neon-green/50'
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-neon-green">
                                {service.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold">{service.name}</h3>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-1">£{hourlyRate}/hour</Badge>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                Custom duration
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date & Time Selection */}
            <div>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-cyan">
                    <Clock className="h-6 w-6 mr-2" />
                    Choose Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 90 days in advance
                      className="bg-muted/50 border-border focus:border-neon-cyan"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="bg-muted/50 border-border focus:border-neon-cyan">
                        <SelectValue placeholder={loadingAvailability ? "Loading availability..." : "Select time"} />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => {
                          const isAvailable = isTimeSlotAvailable(time, customDuration, existingBookings);
                          return (
                            <SelectItem 
                              key={time} 
                              value={time}
                              disabled={!isAvailable}
                              className={!isAvailable ? "text-muted-foreground" : ""}
                            >
                              {time} {!isAvailable && "(Unavailable)"}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {loadingAvailability && (
                      <p className="text-xs text-muted-foreground mt-1">Checking availability...</p>
                    )}
                    {selectedDate && existingBookings.length > 0 && (
                      <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Existing bookings for {new Date(selectedDate).toLocaleDateString()}:</p>
                        {existingBookings.map((booking, index) => (
                          <p key={index} className="text-xs text-muted-foreground">
                            • {booking.time} - {booking.status}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Session Duration (hours)</Label>
                    <Select value={customDuration.toString()} onValueChange={(value) => setCustomDuration(parseInt(value))}>
                      <SelectTrigger className="bg-muted/50 border-border focus:border-neon-cyan">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                          <SelectItem key={hours} value={hours.toString()}>
                            {hours} hour{hours > 1 ? 's' : ''} - £{hours * hourlyRate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card className="mt-6 bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-purple">
                    <User className="h-6 w-6 mr-2" />
                    Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="bg-muted/50 border-border focus:border-neon-purple"
                    />
                    </div>
                  
                    <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="bg-muted/50 border-border focus:border-neon-purple"
                    />
                    </div>
                  
                    <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-muted/50 border-border focus:border-neon-purple"
                    />
                    </div>
                  
                    <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any special requirements or notes..."
                      className="bg-muted/50 border-border focus:border-neon-purple resize-none"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Summary */}
            <div>
              <Card className="bg-card/80 backdrop-blur-sm border-border h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-green">
                    <CreditCard className="h-6 w-6 mr-2" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedServiceData ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>{selectedServiceData.name}</span>
                        <span>£{hourlyRate}/hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span>{customDuration} hour{customDuration > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate</span>
                        <span>£{hourlyRate} × {customDuration}</span>
                      </div>
                      {selectedDate && (
                        <div className="flex justify-between">
                          <span>Date</span>
                          <span>{new Date(selectedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedTime && (
                        <div className="flex justify-between">
                          <span>Time</span>
                          <div className="flex items-center space-x-2">
                            <span>{selectedTime}</span>
                            {selectedDate && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                isTimeSlotAvailable(selectedTime, customDuration, existingBookings)
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {isTimeSlotAvailable(selectedTime, customDuration, existingBookings) ? 'Available' : 'Unavailable'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <hr className="border-border" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>£{totalPrice}</span>
                      </div>
                      
                    <Button 
                        onClick={handlePayment}
                        disabled={
                          isProcessing || 
                          !selectedServiceData || 
                          !selectedDate || 
                          !selectedTime || 
                          !customerInfo.name || 
                          !customerInfo.email ||
                          (selectedDate && !isTimeSlotAvailable(selectedTime, customDuration, existingBookings))
                        }
                      variant="hero" 
                      size="lg" 
                        className="w-full mt-6"
                      >
                        {isProcessing ? "Processing..." : 
                         (selectedDate && !isTimeSlotAvailable(selectedTime, customDuration, existingBookings)) ? "Time Slot Unavailable" :
                         "Pay with Stripe"}
                        </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Select a service to see pricing
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Booking FAQ</h2>
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-neon-green">What should I prepare before my session?</h3>
                <p className="text-muted-foreground">
                  Bring your song ideas, lyrics if recording vocals, and any reference tracks. We'll handle all the technical setup!
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-neon-cyan">Can I reschedule my booking?</h3>
                <p className="text-muted-foreground">
                  Yes! Just give us 24 hours notice and we'll help you find a new time that works.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-neon-purple">What's included in my session?</h3>
                <p className="text-muted-foreground">
                  All sessions include professional equipment, an experienced engineer, and comfortable amenities. Raw files are provided after recording sessions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;