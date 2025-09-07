import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sunrise, Droplets, Leaf, ArrowRight } from "lucide-react";
import { dailyReport } from "@/lib/ai";
import { supabase } from "@/lib/supabase";

const DailyWellnessCard = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      try {
        if (!supabase) {
          setMessage("Good morning! Stay hydrated and favor warm, nourishing foods today.");
          return;
        }
        const profileRaw = localStorage.getItem('profile:patient');
        const profile = profileRaw ? JSON.parse(profileRaw) : {};
        const data = await dailyReport({ dosha: profile?.primaryDosha, name: profile?.name });
        if (!ignore) setMessage(data?.message || null);
      } catch {
        if (!ignore) setMessage("Wishing you balance and wellness today.");
      }
    };
    run();
    return () => { ignore = true; };
  }, []);

  return (
    <Card className="bg-gradient-earth border-0 shadow-elevated animate-lotus-bloom">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-sunrise rounded-full flex items-center justify-center shadow-soft animate-breathe">
              <Sunrise className="w-6 h-6 text-wellness-foreground" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Daily Wellness Guidance</h3>
              <p className="text-sm text-muted-foreground">{today}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* AI-Generated Wellness Message */}
        <div className="bg-card/60 rounded-lg p-4 border border-border/50">
          <p className="text-foreground leading-relaxed font-body">
            {message ?? "Wishing you balance and wellness today."}
          </p>
        </div>

        {/* Today's Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2 bg-wellness/10 rounded-lg p-3">
            <Droplets className="w-4 h-4 text-wellness" />
            <span className="text-sm font-medium text-foreground">Hydration Focus</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-secondary/10 rounded-lg p-3">
            <Leaf className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">Herb Reminder</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-accent/10 rounded-lg p-3">
            <Sunrise className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Morning Routine</span>
          </div>
        </div>

        {/* Quick Action */}
        <Button 
          variant="outline" 
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-gentle group"
        >
          <span>Get Personalized Guidance</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyWellnessCard;