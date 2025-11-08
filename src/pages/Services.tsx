import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Mic, Headphones, Volume2, Clock, DollarSign, Star } from "lucide-react";
import recordingImage from "@/assets/IMG_1340.jpeg";
import mixingImage from "@/assets/IMG_1341.jpeg";
import masteringImage from "@/assets/IMG_1342.jpeg";

const Services = () => {
  const services = [
    {
      id: "recording",
      icon: <Mic className="h-12 w-12" />,
      title: "Recording",
      subtitle: "Professional Vocal & Instrument Recording",
      description: "State-of-the-art recording booths with professional microphones, preamps, and monitoring. Perfect for vocals, instruments, voiceovers, and podcasts.",
      image: recordingImage,
      duration: "1-4 hours",
      pricing: [
        { type: "Hourly Rate", price: "£15/hour", description: "Perfect for short sessions (MIMIMUM 2 HOURS)" },
        { type: "Half Day", price: "£75", description: "5 hours of recording time" },
        { type: "Full Day", price: "£140", description: "10 hours of recording time" }
      ],
      features: [
        "Professional condenser microphones",
        "Isolated recording booths",
        "High-end preamps and interfaces",
        "Real-time monitoring",
        "Comfortable artist lounge"
      ]
    },
    {
      id: "mixing",
      icon: <Headphones className="h-12 w-12" />,
      title: "Mixing",
      subtitle: "Expert Audio Mixing Services",
      description: "Transform your raw recordings into polished, professional tracks. Our experienced engineers will balance, EQ, and enhance your music to industry standards.",
      image: mixingImage,
      duration: "1-3 days",
      pricing: [
        { type: "Per Song", price: "£?", description: "Professional mix for one track" },
        { type: "EP Package", price: "£?", description: "4-6 songs mixed" },
        { type: "Album Package", price: "£?", description: "10+ songs mixed" }
      ],
      features: [
        "Professional mixing consoles",
        "Industry-standard plugins",
        "Reference monitoring",
        "Unlimited revisions",
        "Stems delivery included"
      ]
    },
    {
      id: "mastering",
      icon: <Volume2 className="h-12 w-12" />,
      title: "Mastering",
      subtitle: "Final Polish & Optimization",
      description: "The final step to make your music sound its best across all playback systems. Mastering adds the professional sheen that makes your tracks radio and streaming-ready.",
      image: masteringImage,
      duration: "1-2 days",
      pricing: [
        { type: "Per Song", price: "$75", description: "Professional master for one track" },
        { type: "EP Package", price: "$250", description: "4-6 songs mastered" },
        { type: "Album Package", price: "$500", description: "10+ songs mastered" }
      ],
      features: [
        "High-end mastering suite",
        "Reference-grade monitors",
        "Multiple format delivery",
        "Streaming optimization",
        "Vinyl preparation available"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional music production services designed to elevate your sound to the next level
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              id={service.id}
              className="mb-20 last:mb-0"
            >
              <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border hover:glow-green transition-all duration-300">
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-cosmic opacity-20"></div>
                  </div>

                  {/* Content */}
                  <div className={`p-8 lg:p-12 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="flex items-center mb-4 text-neon-green">
                      {service.icon}
                      <div className="ml-4">
                        <h2 className="text-3xl font-bold">{service.title}</h2>
                        <p className="text-lg text-muted-foreground">{service.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                      {service.description}
                    </p>

                    {/* Duration */}
                    <div className="flex items-center mb-6 text-neon-cyan">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>Typical Duration: {service.duration}</span>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">What's Included:</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <Star className="h-4 w-4 text-neon-green mr-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-neon-green" />
                        Pricing Options:
                      </h3>
                      <div className="grid gap-4">
                        {service.pricing.map((option, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                            <div>
                              <Badge variant="outline" className="mb-2">{option.type}</Badge>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                            <div className="text-2xl font-bold text-neon-green">
                              {option.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="hero" size="lg" asChild>
                      <Link to="/booking">Book This Service</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss your vision and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/booking">Book Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Get Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;