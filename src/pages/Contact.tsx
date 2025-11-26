import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Instagram, Music, Send, MessageCircle, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createBooking, getBookingsForDate, isTimeSlotAvailable, BookingData } from "@/lib/booking-api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customDuration, setCustomDuration] = useState(1);
  const [existingBookings, setExistingBookings] = useState<{time: string; status: string; duration?: number}[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  const { toast } = useToast();

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
  }, [customDuration, existingBookings, selectedTime, selectedDate, toast]);

  const fetchExistingBookings = async () => {
    setLoadingAvailability(true);
    try {
      const bookings = await getBookingsForDate(selectedDate);
      setExistingBookings(bookings);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load availability. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingAvailability(false);
    }
  };

  const hourlyRate = 10; // £10 per hour
  const totalPrice = customDuration * hourlyRate;

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // If booking details are provided, create a booking first
      if (selectedDate && selectedTime && formData.service) {
        const serviceMap: { [key: string]: string } = {
          'recording': 'Recording Session',
          'mixing': 'Mixing Service', 
          'mastering': 'Mastering Service',
          'package': 'Full Production Package',
          'other': 'General Inquiry'
        };

        const bookingData: BookingData = {
          service: serviceMap[formData.service] || formData.service,
          date: selectedDate,
          time: selectedTime,
          duration: customDuration,
          price: totalPrice,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          notes: formData.message
        };

        await createBooking(bookingData);
        
        toast({
          title: "Booking Created!",
          description: `Your ${serviceMap[formData.service]} has been booked for ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}.`,
        });
      }

      // Submit contact form
      const { data, error } = await supabase.functions.invoke('submit-contact', {
        body: {
          ...formData,
          bookingDetails: selectedDate && selectedTime ? {
            date: selectedDate,
            time: selectedTime,
            duration: customDuration,
            price: totalPrice
          } : null
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Message sent!",
          description: "Thanks for reaching out! We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
        setSelectedDate("");
        setSelectedTime("");
        setCustomDuration(1);
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your musical vision to life? Let's start the conversation.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-green">
                    <MessageCircle className="h-6 w-6 mr-2" />
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          className="bg-muted/50 border-border focus:border-neon-green"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="bg-muted/50 border-border focus:border-neon-green"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-muted/50 border-border focus:border-neon-green"
                      />
                    </div>

                    <div>
                      <Label htmlFor="service">Service Interest</Label>
                      <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                        <SelectTrigger className="bg-muted/50 border-border focus:border-neon-green">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recording">Recording Session</SelectItem>
                          <SelectItem value="mixing">Mixing Service</SelectItem>
                          <SelectItem value="mastering">Mastering Service</SelectItem>
                          <SelectItem value="package">Full Production Package</SelectItem>
                          <SelectItem value="other">Other / General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Booking Details Section */}
                    {(formData.service === 'recording' || formData.service === 'mixing' || formData.service === 'mastering') && (
                      <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-neon-green/30">
                        <div className="flex items-center text-neon-green font-semibold">
                          <Calendar className="h-5 w-5 mr-2" />
                          Book Your Session (Optional)
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Preferred Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                              className="bg-muted/50 border-border focus:border-neon-green"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="time">Preferred Time</Label>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                              <SelectTrigger className="bg-muted/50 border-border focus:border-neon-green">
                                <SelectValue placeholder={loadingAvailability ? "Loading availability..." : "Select time"} />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => {
                                  const isAvailable = selectedDate ? isTimeSlotAvailable(time, customDuration, existingBookings) : true;
                                  return (
                                    <SelectItem 
                                      key={time} 
                                      value={time}
                                      disabled={selectedDate && !isAvailable}
                                      className={selectedDate && !isAvailable ? "text-muted-foreground" : ""}
                                    >
                                      {time} {selectedDate && !isAvailable && "(Unavailable)"}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="duration">Session Duration (hours)</Label>
                          <Select value={customDuration.toString()} onValueChange={(value) => setCustomDuration(parseInt(value))}>
                            <SelectTrigger className="bg-muted/50 border-border focus:border-neon-green">
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

                        {selectedDate && selectedTime && (
                          <div className="p-3 bg-neon-green/10 rounded-lg border border-neon-green/30">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-neon-green font-semibold">Estimated Total:</span>
                              <span className="text-neon-green font-bold">£{totalPrice}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(selectedDate).toLocaleDateString()} at {selectedTime} • {customDuration} hour{customDuration > 1 ? 's' : ''}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                        rows={5}
                        placeholder="Tell us about your project, timeline, and any specific requirements..."
                        className="bg-muted/50 border-border focus:border-neon-green resize-none"
                      />
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      <Send className="h-5 w-5 mr-2" />
                      {selectedDate && selectedTime ? "Send Message & Book Session" : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Chatbot Info */}
              <Card className="mt-6 bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-neon-cyan/20 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-neon-cyan">Auto-Reply System</h3>
                      <p className="text-sm text-muted-foreground">
                        Thanks for reaching out! Our auto-reply system will confirm your message within minutes, 
                        and our team will get back to you within 24 hours with detailed information about your inquiry.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-neon-green/20 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-neon-green" />
                    </div>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-muted-foreground">+44 7405 821414</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-neon-purple/20 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-neon-purple" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-muted-foreground">area51booths@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-neon-cyan/20 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-neon-cyan" />
                    </div>
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-muted-foreground">
                        Durnford Street<br />
                        Bristol, BS3 2AW
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-neon-green">Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start hover:text-neon-purple hover:border-neon-purple" asChild>
                      <a href="https://instagram.com/area51booths" target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-5 w-5 mr-3" />
                        @area51booths - Studio sessions & behind-the-scenes
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start hover:text-neon-cyan hover:border-neon-cyan" asChild>
                      <a href="https://tiktok.com/@area51booths" target="_blank" rel="noopener noreferrer">
                        <Music className="h-5 w-5 mr-3" />
                        @area51booths - Quick tips & studio vibes
                      </a>
                    </Button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">
                      📸 <strong>Instagram Feed:</strong> Check out our latest studio sessions, 
                      client testimonials, and behind-the-scenes content showcasing our services.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-neon-purple">Studio Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-8 text-center border-2 border-dashed border-border">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-neon-purple opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                    <p className="text-muted-foreground text-sm">
                      Google Maps integration will be added here to show our exact location, 
                      parking information, and nearby landmarks.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Studio Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="text-neon-green">9:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="text-neon-green">10:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-neon-green">12:00 PM - 6:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;