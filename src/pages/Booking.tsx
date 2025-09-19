import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Mic, Headphones, Volume2, ExternalLink } from "lucide-react";

const Booking = () => {
  const [selectedService, setSelectedService] = useState("");

  const services = [
    {
      id: "recording",
      name: "Recording Session",
      icon: <Mic className="h-5 w-5" />,
      duration: "1-4 hours",
      price: "From $75/hour",
      description: "Professional recording in our state-of-the-art booths"
    },
    {
      id: "mixing",
      name: "Mixing Service",
      icon: <Headphones className="h-5 w-5" />,
      duration: "1-3 days",
      price: "From $150/song",
      description: "Expert mixing to bring your tracks to life"
    },
    {
      id: "mastering",
      name: "Mastering Service",
      icon: <Volume2 className="h-5 w-5" />,
      duration: "1-2 days",
      price: "From $75/song",
      description: "Final polish and optimization for your music"
    }
  ];

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
    "8:00 PM - 10:00 PM"
  ];

  // Placeholder for Calendly integration
  const handleCalendlyRedirect = () => {
    // This would redirect to your actual Calendly booking page
    window.open("https://calendly.com/area51booths", "_blank");
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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Service Selection */}
            <div>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-green">
                    <Calendar className="h-6 w-6 mr-2" />
                    Select Your Service
                  </CardTitle>
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
                              <Badge variant="outline" className="mb-1">{service.price}</Badge>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {service.duration}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="mt-6 bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Studio Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Location:</strong> Downtown Recording District
                    </div>
                    <div>
                      <strong>Hours:</strong> 9 AM - 10 PM (7 days a week)
                    </div>
                    <div>
                      <strong>Cancellation:</strong> 24-hour notice required
                    </div>
                    <div>
                      <strong>What to Bring:</strong> Your music, lyrics, and creative energy!
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calendly Integration */}
            <div>
              <Card className="bg-card/80 backdrop-blur-sm border-border h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center text-neon-green">
                    <Clock className="h-6 w-6 mr-2" />
                    Schedule Your Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Calendly Placeholder */}
                  <div className="bg-muted/50 rounded-lg p-8 text-center border-2 border-dashed border-border">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-neon-cyan opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Calendly Integration</h3>
                    <p className="text-muted-foreground mb-6">
                      Our booking calendar will be integrated here. For now, click below to open our external booking system.
                    </p>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      onClick={handleCalendlyRedirect}
                      className="w-full"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Open Booking Calendar
                    </Button>
                  </div>

                  {/* Sample Time Slots */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Available Today:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {timeSlots.slice(0, 4).map((slot, index) => (
                        <Button 
                          key={index}
                          variant="outline" 
                          className="justify-start hover:text-neon-green hover:border-neon-green"
                          disabled={index === 1} // Sample unavailable slot
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {slot}
                          {index === 1 && <Badge variant="destructive" className="ml-auto">Booked</Badge>}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact for Custom Bookings */}
              <Card className="mt-6 bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-neon-purple">Need a Custom Package?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Looking for extended sessions, album packages, or have special requirements? Get in touch for a personalized quote.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/contact">Contact for Custom Quote</a>
                  </Button>
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