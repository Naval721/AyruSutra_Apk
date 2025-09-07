import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Award, Heart, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Progress = () => {
  const [total, setTotal] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [nextTitle, setNextTitle] = useState<string>("—");
  const [nextTime, setNextTime] = useState<string>("—");

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        // fallback demo values
        setTotal(12);
        setCompleted(7);
        setNextTitle("Abhyanga Oil Massage");
        setNextTime(new Date(new Date().setHours(9,0,0,0)).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }));
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('therapies')
        .select('title,start_time,status')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });
      if (!data) return;
      setTotal(data.length);
      setCompleted(data.filter(d => d.status === 'completed').length);
      const upcoming = data.find(d => d.status === 'upcoming' && new Date(d.start_time).getTime() >= Date.now());
      if (upcoming) {
        setNextTitle(upcoming.title);
        setNextTime(new Date(upcoming.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }));
      }
    };
    load();
  }, []);

  const overallProgress = useMemo(() => total ? Math.round((completed / total) * 100) : 0, [completed, total]);
  const progressData = {
    overallProgress,
    treatmentPhase: "Personalized Care",
    daysCompleted: completed,
    totalDays: total || 1,
    wellnessScore: 85,
    improvements: [
      { area: "Sleep Quality", before: 45, current: 82, improvement: 37 },
      { area: "Energy Levels", before: 38, current: 75, improvement: 37 },
      { area: "Digestion", before: 52, current: 88, improvement: 36 },
      { area: "Stress Levels", before: 78, current: 42, improvement: -36 },
      { area: "Mental Clarity", before: 48, current: 79, improvement: 31 },
    ]
  };

  const milestones = [
    { title: "Started Panchakarma", date: "Jan 1, 2024", completed: true },
    { title: "Completed Preparatory Phase", date: "Jan 5, 2024", completed: true },
    { title: "Entered Purification Phase", date: "Jan 8, 2024", completed: true },
    { title: "Halfway Milestone", date: "Jan 12, 2024", completed: true },
    { title: "Complete Purification Phase", date: "Jan 18, 2024", completed: false },
    { title: "Enter Rejuvenation Phase", date: "Jan 19, 2024", completed: false },
    { title: "Complete Full Treatment", date: "Jan 25, 2024", completed: false },
  ];

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-saffron border-0 shadow-soft text-primary-foreground">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 animate-breathe" />
            <h3 className="font-heading font-semibold">Overall Progress</h3>
            <p className="text-2xl font-bold">{progressData.overallProgress}%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-healing border-0 shadow-soft text-secondary-foreground">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <h3 className="font-heading font-semibold">Completed</h3>
            <p className="text-2xl font-bold">{progressData.daysCompleted}/{progressData.totalDays}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-sunset border-0 shadow-soft text-accent-foreground">
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 animate-gentle-float" />
            <h3 className="font-heading font-semibold">Wellness Score</h3>
            <p className="text-2xl font-bold">{progressData.wellnessScore}/100</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-lotus border-0 shadow-soft text-wellness-foreground">
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2" />
            <h3 className="font-heading font-semibold">Next Session</h3>
            <p className="text-sm font-bold">{nextTitle} • {nextTime}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <Card className="shadow-elevated border-0">
          <CardHeader>
            <h2 className="font-heading text-xl font-semibold text-foreground">Wellness Improvements</h2>
            <p className="text-muted-foreground">Your health metrics over time</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {progressData.improvements.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{metric.area}</span>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={metric.improvement > 0 ? "default" : "destructive"}
                      className={metric.improvement > 0 ? "bg-wellness text-wellness-foreground" : ""}
                    >
                      {metric.improvement > 0 ? "+" : ""}{metric.improvement}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Before: {metric.before}%</span>
                      <span>Current: {metric.current}%</span>
                    </div>
                    <ProgressBar value={metric.current} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="shadow-elevated border-0">
          <CardHeader>
            <h2 className="font-heading text-xl font-semibold text-foreground">Treatment Milestones</h2>
            <p className="text-muted-foreground">Your journey progress</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-gentle ${
                  milestone.completed 
                    ? 'bg-wellness/10 border border-wellness/20' 
                    : 'bg-muted/30 border border-muted'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                  milestone.completed 
                    ? 'bg-wellness text-wellness-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {milestone.completed ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <div className="w-2 h-2 bg-current rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    milestone.completed ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{milestone.date}</p>
                </div>
                {milestone.completed && (
                  <Badge className="bg-wellness text-wellness-foreground">
                    <Zap className="w-3 h-3 mr-1" />
                    Done
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Progress;