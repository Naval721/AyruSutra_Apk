import Navigation from "@/components/Navigation";
import ChatInterface from "@/components/ChatInterface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Database } from "lucide-react";

const Chat = () => {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="font-heading text-4xl font-bold text-foreground">
              Wellness Assistant
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with your personalized Ayurvedic guide powered by AI. 
              Get instant answers to your wellness questions and treatment guidance.
            </p>
          </div>

          {/* Supabase Integration Notice */}
          <Card className="bg-gradient-saffron border-0 shadow-elevated p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                  Enable AI-Powered Responses
                </h3>
                <p className="text-primary-foreground/90 leading-relaxed">
                  To unlock personalized guidance, connect your app to Supabase. 
                  This enables secure API key storage and advanced wellness features tailored to your Ayurvedic journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="secondary" 
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Supabase
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Chat Interface */}
          <Card className="shadow-elevated border-0 overflow-hidden">
            <ChatInterface />
          </Card>

          {/* Quick Questions */}
          <Card className="bg-card/60 border-0 shadow-soft p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Popular Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "What should I eat before my therapy?",
                "How should I prepare for Abhyanga?",
                "What are the benefits of Swedana?",
                "How to maintain progress after treatment?"
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left border-muted text-foreground hover:border-primary hover:text-primary transition-gentle h-auto p-3"
                >
                  {question}
                </Button>
              ))}
            </div>
          </Card>
        </div>
    </main>
  );
};

export default Chat;