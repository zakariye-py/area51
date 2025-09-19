import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Instagram, Music, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out! We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
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
                      Send Message
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
                      <p className="text-muted-foreground">(555) 123-AREA (2732)</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-neon-purple/20 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-neon-purple" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-muted-foreground">info@area51booths.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-neon-cyan/20 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-neon-cyan" />
                    </div>
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-muted-foreground">
                        123 Music District Blvd<br />
                        Studio City, CA 91604
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