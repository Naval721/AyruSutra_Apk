import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callAssistant } from "@/lib/ai";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Namaste! I'm your AyurSutra guide. I'm here to support your Panchakarma journey with personalized wisdom. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      if (!supabase) {
        toast({
          title: "Assistant not configured",
          description: "Add Supabase + OpenAI keys to enable AI responses.",
          variant: "default"
        });
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "AI isn’t configured yet. Once connected, I’ll tailor guidance to your dosha and plan.",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
        return;
      }

      const profileRaw = localStorage.getItem('profile:patient');
      const profile = profileRaw ? JSON.parse(profileRaw) : {};
      const context = {
        dosha: profile?.primaryDosha,
        name: profile?.name,
      };
      const data = await callAssistant(userMessage.content, context);
      const answer = typeof data === 'string' ? data : (data?.answer ?? '');
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: answer || "I'm here to help.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      toast({ title: 'Assistant error', description: String(err?.message || err) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Chat Header */}
      <div className="bg-gradient-saffron p-4 rounded-t-lg shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-primary-foreground">AyurSutra Guide</h3>
            <p className="text-primary-foreground/80 text-sm">Your Ayurvedic Wellness Companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-earth">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-soft ${
              message.sender === 'ai' 
                ? 'bg-gradient-healing' 
                : 'bg-gradient-sunset'
            }`}>
              {message.sender === 'ai' ? (
                <Bot className="w-4 h-4 text-secondary-foreground" />
              ) : (
                <User className="w-4 h-4 text-accent-foreground" />
              )}
            </div>
            
            <Card className={`max-w-[80%] p-3 shadow-soft border-0 animate-lotus-bloom ${
              message.sender === 'ai'
                ? 'bg-card text-card-foreground'
                : 'bg-gradient-saffron text-primary-foreground'
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className={`text-xs opacity-70 mt-1 block ${
                message.sender === 'ai' ? 'text-muted-foreground' : 'text-primary-foreground/70'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-healing flex items-center justify-center animate-breathe shadow-soft">
              <Bot className="w-4 h-4 text-secondary-foreground" />
            </div>
            <Card className="bg-card text-card-foreground p-3 shadow-soft border-0">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card rounded-b-lg">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask about your Ayurvedic journey..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-muted bg-background focus:border-primary focus:ring-primary transition-gentle"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-saffron hover:shadow-glow text-primary-foreground border-0 transition-gentle"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;