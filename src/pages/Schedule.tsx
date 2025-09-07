import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, CheckCircle, AlertCircle } from "lucide-react";

const Schedule = () => {
  const todaySchedule = [
    {
      id: 1,
      time: "7:00 AM",
      therapy: "Morning Meditation",
      practitioner: "Self-guided",
      duration: "20 minutes",
      location: "Meditation Hall",
      status: "completed",
      description: "Mindfulness and breathwork session"
    },
    {
      id: 2,
      time: "9:00 AM",
      therapy: "Abhyanga Oil Massage",
      practitioner: "Dr. Priya Sharma",
      duration: "60 minutes",
      location: "Treatment Room A",
      status: "in-progress",
      description: "Full body therapeutic oil massage"
    },
    {
      id: 3,
      time: "11:30 AM",
      therapy: "Swedana Steam Therapy",
      practitioner: "Therapist Raj",
      duration: "30 minutes",
      location: "Steam Chamber",
      status: "scheduled",
      description: "Herbal steam treatment for detox"
    },
    {
      id: 4,
      time: "2:00 PM",
      therapy: "Ayurvedic Consultation",
      practitioner: "Dr. Arun Gupta",
      duration: "45 minutes",
      location: "Consultation Room",
      status: "scheduled",
      description: "Progress review and diet planning"
    },
    {
      id: 5,
      time: "6:00 PM",
      therapy: "Evening Yoga",
      practitioner: "Yogi Meera",
      duration: "45 minutes",
      location: "Yoga Studio",
      status: "scheduled",
      description: "Gentle restorative yoga practice"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-wellness text-wellness-foreground';
      case 'in-progress': return 'bg-primary text-primary-foreground';
      case 'scheduled': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4 animate-pulse" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-saffron border-0 shadow-soft text-primary-foreground">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <h3 className="font-heading font-semibold">Today's Sessions</h3>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-healing border-0 shadow-soft text-secondary-foreground">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <h3 className="font-heading font-semibold">Total Duration</h3>
            <p className="text-2xl font-bold">4h 20m</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-sunset border-0 shadow-soft text-accent-foreground">
          <CardContent className="p-4 text-center">
            <User className="w-6 h-6 mx-auto mb-2" />
            <h3 className="font-heading font-semibold">Practitioners</h3>
            <p className="text-2xl font-bold">4</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule List */}
      <Card className="shadow-elevated border-0">
        <CardHeader>
          <h2 className="font-heading text-xl font-semibold text-foreground">Today's Schedule</h2>
          <p className="text-muted-foreground">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaySchedule.map((session) => (
            <div
              key={session.id}
              className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-gentle"
            >
              <div className="flex-shrink-0 text-center">
                <div className="text-lg font-bold text-foreground">{session.time.split(' ')[0]}</div>
                <div className="text-xs text-muted-foreground">{session.time.split(' ')[1]}</div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{session.therapy}</h3>
                  <Badge className={getStatusColor(session.status)}>
                    {getStatusIcon(session.status)}
                    <span className="ml-1 capitalize">{session.status.replace('-', ' ')}</span>
                  </Badge>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">{session.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{session.practitioner}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{session.location}</span>
                  </div>
                </div>
                
                {session.status === 'scheduled' && (
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="border-muted text-muted-foreground hover:bg-muted">
                      Reschedule
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
};

export default Schedule;