import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Wifi } from "lucide-react";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

const AppHeader = ({ title, subtitle }: AppHeaderProps) => {
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40 px-4 pt-[calc(env(safe-area-inset-top)+8px)] pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-foreground hover:text-primary transition-gentle" />
          <div>
            <h1 className="font-heading text-lg font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status Indicators */}
          <div className="hidden sm:flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-wellness" />
            <span className="text-xs font-mono text-muted-foreground">{currentTime}</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary">
            <Bell className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              2
            </Badge>
          </Button>

          {/* Search */}
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;