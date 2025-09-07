import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";

const ProgressTracker = () => {
  const therapies = [
    {
      name: "Abhyanga (Oil Massage)",
      status: "completed",
      date: "2024-01-15",
      description: "Full body oil massage with warm sesame oil"
    },
    {
      name: "Swedana (Steam Therapy)",
      status: "completed",
      date: "2024-01-16",
      description: "Herbal steam therapy for toxin elimination"
    },
    {
      name: "Virechana (Therapeutic Purgation)",
      status: "in-progress",
      date: "2024-01-17",
      description: "Gentle cleansing therapy scheduled for today"
    },
    {
      name: "Basti (Medicated Enema)",
      status: "pending",
      date: "2024-01-20",
      description: "Final phase of Panchakarma treatment"
    }
  ];

  const completedTherapies = therapies.filter(t => t.status === 'completed').length;
  const progressPercentage = (completedTherapies / therapies.length) * 100;

  return (
    <Card className="bg-card border-0 shadow-soft animate-lotus-bloom">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl font-semibold text-foreground">Treatment Progress</h3>
          <Badge variant="secondary" className="bg-wellness/20 text-wellness font-semibold">
            {completedTherapies}/{therapies.length} Complete
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="w-full h-2" />
          <p className="text-sm text-muted-foreground">
            {progressPercentage.toFixed(0)}% of your Panchakarma journey completed
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {therapies.map((therapy, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-gentle hover:bg-muted/30 ${
              therapy.status === 'in-progress' ? 'bg-primary/5 border border-primary/20' : ''
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {therapy.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-wellness" />
              ) : therapy.status === 'in-progress' ? (
                <Clock className="w-5 h-5 text-primary animate-breathe" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{therapy.name}</h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(therapy.date).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {therapy.description}
              </p>
              
              {therapy.status === 'in-progress' && (
                <Badge variant="outline" className="text-xs border-primary text-primary">
                  Scheduled Today
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;