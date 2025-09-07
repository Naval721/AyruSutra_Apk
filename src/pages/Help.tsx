import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search,
  ChevronRight,
  Book,
  Video,
  Users,
  ExternalLink
} from "lucide-react";

const Help = () => {
  const faqItems = [
    {
      category: "Getting Started",
      questions: [
        { q: "How do I begin my Panchakarma journey?", a: "Start by completing your dosha assessment and consulting the in-app assistant for personalized guidance." },
        { q: "What should I expect in my first week?", a: "Initial consultations, preparation phase activities, and gentle introduction to Ayurvedic practices." },
        { q: "How do I use the wellness assistant?", a: "Simply tap the chat icon and ask any questions about your treatment, diet, or wellness practices." }
      ]
    },
    {
      category: "Treatments & Therapies",
      questions: [
        { q: "What is Abhyanga and how should I prepare?", a: "Abhyanga is a warm oil massage. Arrive hydrated, avoid heavy meals 2 hours before, and wear comfortable clothing." },
        { q: "How often should I have Swedana therapy?", a: "Frequency depends on your constitution and treatment plan. Your practitioner will provide specific guidance." },
        { q: "Can I reschedule my appointments?", a: "Yes, use the schedule section to reschedule up to 24 hours in advance." }
      ]
    },
    {
      category: "Assistant",
      questions: [
        { q: "How accurate is the guidance?", a: "Insights are based on traditional Ayurvedic texts and modern research, but always consult your practitioner for medical decisions." },
        { q: "Can the assistant replace my practitioner?", a: "No, it’s a supportive tool that complements professional medical care." },
        { q: "Is my chat data private?", a: "Yes, all conversations are encrypted and used only to improve your personalized experience." }
      ]
    }
  ];

  const supportChannels = [
    {
      title: "Live Chat Support",
      description: "Get instant help from our wellness experts",
      icon: MessageCircle,
      action: "Start Chat",
      availability: "24/7 Available"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our support team",
      icon: Phone,
      action: "Call Now",
      availability: "Mon-Fri 9AM-6PM"
    },
    {
      title: "Email Support",
      description: "Send detailed questions via email",
      icon: Mail,
      action: "Send Email",
      availability: "Response within 24h"
    }
  ];

  const resources = [
    { title: "Ayurvedic Principles Guide", icon: Book, type: "PDF Guide" },
    { title: "Meditation Tutorial Videos", icon: Video, type: "Video Series" },
    { title: "Community Forum", icon: Users, type: "Discussion" },
    { title: "Dosha Assessment Test", icon: HelpCircle, type: "Interactive" }
  ];

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Search Help */}
      <Card className="shadow-soft border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search for help topics..."
                className="pl-10 bg-background border-muted focus:border-primary"
              />
            </div>
            <Button className="bg-gradient-saffron hover:shadow-glow text-primary-foreground">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportChannels.map((channel, index) => {
          const Icon = channel.icon;
          return (
            <Card key={index} className="shadow-soft border-0 hover:shadow-elevated transition-gentle">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-saffron rounded-full mx-auto flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{channel.title}</h3>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                  <Badge variant="outline" className="mt-2 border-wellness text-wellness">
                    {channel.availability}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  {channel.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card className="shadow-elevated border-0">
        <CardHeader>
          <h2 className="font-heading text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Find answers to common questions about your wellness journey</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-primary">{category.category}</h3>
              <div className="space-y-2">
                {category.questions.map((item, questionIndex) => (
                  <details key={questionIndex} className="group border border-border rounded-lg">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-gentle">
                      <span className="font-medium text-foreground">{item.q}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <h2 className="font-heading text-xl font-semibold text-foreground">Learning Resources</h2>
          <p className="text-muted-foreground">Expand your knowledge of Ayurvedic wellness</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-gentle cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gradient-healing rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground">{resource.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className="shadow-soft border-0">
        <CardHeader>
          <h2 className="font-heading text-xl font-semibold text-foreground">Still Need Help?</h2>
          <p className="text-muted-foreground">Send us a message and we'll get back to you soon</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input placeholder="Your full name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" placeholder="your.email@example.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Subject</label>
            <Input placeholder="Brief description of your issue" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Message</label>
            <Textarea 
              placeholder="Please describe your question or issue in detail..."
              rows={4}
            />
          </div>
          
          <Button className="w-full bg-gradient-saffron hover:shadow-glow text-primary-foreground">
            <Mail className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default Help;