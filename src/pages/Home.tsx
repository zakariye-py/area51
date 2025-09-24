import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mic, Headphones, Volume2, Instagram, Music, Zap } from "lucide-react";
import heroImage from "@/assets/hero-studio.jpg";
import recordingImage from "@/assets/recording-service.jpg";
import mixingImage from "@/assets/mixing-service.jpg";
import masteringImage from "@/assets/mastering-service.jpg";

const Home = () => {
  const services = [
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Recording",
      description: "Professional vocal and instrument recording in our state-of-the-art booths.",
      image: recordingImage,
      link: "/services#recording"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Mixing",
      description: "Expert mixing services to bring your tracks to life with perfect balance.",
      image: mixingImage,
      link: "/services#mixing"
    },
    {
      icon: <Volume2 className="h-8 w-8" />,
      title: "Mastering",
      description: "Final polish and optimization for professional-grade sound quality.",
      image: masteringImage,
      link: "/services#mastering"
    }
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-neon-cyan" />,
      title: "Cutting-Edge Technology",
      description: "Latest recording equipment and software"
    },
    {
      icon: <Music className="h-6 w-6 text-neon-green" />,
      title: "Professional Expertise",
      description: "Years of experience in music production"
    },
    {
      icon: <Instagram className="h-6 w-6 text-neon-purple" />,
      title: "Social Media Ready",
      description: "Content optimized for all platforms"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
            Step into{" "}
            <span className="bg-gradient-neon bg-clip-text text-transparent animate-neon-flicker">
              Area 51
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Reach your musical potential in our futuristic recording studios
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/booking">Book Your Session</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>

        {/* Promo Video Placeholder */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">📽️ Promo Video Coming Soon</p>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional music production services tailored to your creative vision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group hover:glow-green transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-border"
              >
                <CardContent className="p-6">
                  <div className="relative mb-6 overflow-hidden rounded-lg">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-cosmic opacity-20"></div>
                  </div>
                  
                  <div className="flex items-center mb-4 text-neon-green">
                    {service.icon}
                    <h3 className="text-xl font-semibold ml-3">{service.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  <Button variant="ghost" className="w-full group-hover:text-neon-green" asChild>
                    <Link to={service.link}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Area 51 Booths?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card/50 mb-4 glow-cyan">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Follow Our Journey</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Check out our latest sessions and behind-the-scenes content
          </p>
          
          <div className="flex justify-center space-x-6">
            <Button variant="outline" size="lg" asChild>
              <a href="https://instagram.com/area51booths" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 mr-2" />
                Instagram
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://tiktok.com/area51booths" target="_blank" rel="noopener noreferrer">
                <Music className="h-5 w-5 mr-2" />
                TikTok
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;