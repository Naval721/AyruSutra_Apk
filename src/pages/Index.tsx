import DailyWellnessCard from "@/components/DailyWellnessCard";
import ProgressTracker from "@/components/ProgressTracker";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Calendar, 
  Target, 
  Heart, 
  Leaf, 
  Clock,
  TrendingUp,
  Star
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1">
      {/* Hero Section - Simplified for app layout */}
      <div className="bg-gradient-saffron text-primary-foreground p-6 mb-6">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-2">
            Welcome to Your Wellness Journey
          </h1>
          <p className="text-primary-foreground/90">
            Continue your Ayurvedic healing with personalized guidance
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-saffron border-0 shadow-soft text-primary-foreground">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 animate-breathe" />
              <h3 className="font-heading font-semibold">Days Active</h3>
              <p className="text-2xl font-bold">7</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-healing border-0 shadow-soft text-secondary-foreground">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2" />
              <h3 className="font-heading font-semibold">Progress</h3>
              <p className="text-2xl font-bold">65%</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-sunset border-0 shadow-soft text-accent-foreground">
            <CardContent className="p-4 text-center">
              <Leaf className="w-6 h-6 mx-auto mb-2" />
              <h3 className="font-heading font-semibold">Chats</h3>
              <p className="text-2xl font-bold">12</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-lotus border-0 shadow-soft text-wellness-foreground">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 animate-gentle-float" />
              <h3 className="font-heading font-semibold">Your Dosha</h3>
              <p className="text-lg font-bold">Vata</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <DailyWellnessCard />
            <ProgressTracker />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-card border-0 shadow-soft">
              <CardHeader>
                <h3 className="font-heading text-xl font-semibold text-foreground">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/chat')}
                  className="w-full bg-gradient-saffron hover:shadow-glow text-primary-foreground border-0 justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  Chat with Assistant
                </Button>
                
                <Button 
                  onClick={() => navigate('/schedule')}
                  variant="outline" 
                  className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground justify-start transition-gentle"
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  View Today's Schedule
                </Button>
                
                <Button 
                  onClick={() => navigate('/progress')}
                  variant="outline" 
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground justify-start transition-gentle"
                >
                  <TrendingUp className="w-4 h-4 mr-3" />
                  Track Progress
                </Button>
              </CardContent>
            </Card>

            {/* Today's Reminders */}
            <Card className="bg-card border-0 shadow-soft">
              <CardHeader>
                <h3 className="font-heading text-xl font-semibold text-foreground">Today's Reminders</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-wellness/10 rounded-lg">
                  <Clock className="w-4 h-4 text-wellness flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Morning Meditation</p>
                    <p className="text-xs text-muted-foreground">6:00 AM - 20 minutes</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-wellness text-wellness">
                    Pending
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-lg">
                  <Leaf className="w-4 h-4 text-secondary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Herbal Tea</p>
                    <p className="text-xs text-muted-foreground">Before lunch</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-secondary text-secondary">
                    Pending
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                  <Heart className="w-4 h-4 text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Evening Reflection</p>
                    <p className="text-xs text-muted-foreground">8:00 PM - Journal</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-accent text-accent">
                    Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Tip */}
            <Card className="bg-gradient-healing border-0 shadow-glow text-secondary-foreground">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-secondary-foreground/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold mb-2">Today's Wisdom</h4>
                    <p className="text-sm leading-relaxed opacity-90">
                      "Like a lotus that rises from muddy water, your healing journey transforms 
                      challenges into growth. Trust the process, dear soul."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-4 text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Built with 💚 for your Ayurvedic wellness journey
        </p>
      </footer>
    </main>
  );
};

export default Index;