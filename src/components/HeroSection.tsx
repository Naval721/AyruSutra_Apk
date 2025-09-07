import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-ayurvedic.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ayurvedic wellness meditation with lotus flowers and healing elements"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-wellness/20 rounded-full animate-gentle-float"></div>
      <div className="absolute top-40 right-16 w-16 h-16 bg-accent/20 rounded-full animate-gentle-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-secondary/20 rounded-full animate-gentle-float" style={{animationDelay: '4s'}}></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="animate-lotus-bloom">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Your AI-Powered
            <span className="block bg-gradient-saffron bg-clip-text text-transparent">
              Ayurvedic Companion
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed font-body">
            Experience personalized Panchakarma guidance with ancient wisdom 
            enhanced by modern technology. Your journey to holistic wellness starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/chat')}
              size="lg" 
              className="bg-gradient-saffron hover:shadow-glow text-primary-foreground border-0 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chat
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-gentle"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Schedule
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center animate-breathe">
            <div className="bg-gradient-lotus w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-soft">
              <Sparkles className="w-8 h-8 text-wellness-foreground" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Personalized AI</h3>
            <p className="text-muted-foreground">Tailored guidance based on your dosha and treatment plan</p>
          </div>
          
          <div className="text-center animate-breathe" style={{animationDelay: '1s'}}>
            <div className="bg-gradient-healing w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-soft">
              <Calendar className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Smart Scheduling</h3>
            <p className="text-muted-foreground">Intelligent therapy tracking and progress monitoring</p>
          </div>
          
          <div className="text-center animate-breathe" style={{animationDelay: '2s'}}>
            <div className="bg-gradient-sunset w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-soft">
              <MessageCircle className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">24/7 Support</h3>
            <p className="text-muted-foreground">Always available wellness assistant for your queries</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;