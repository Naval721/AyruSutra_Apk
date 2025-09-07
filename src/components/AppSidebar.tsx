import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, 
  MessageCircle, 
  Calendar, 
  User, 
  Heart,
  TrendingUp,
  Settings,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Assistant", url: "/chat", icon: MessageCircle },
  { title: "My Schedule", url: "/schedule", icon: Calendar },
  { title: "Progress", url: "/progress", icon: TrendingUp },
  { title: "Profile", url: "/profile", icon: User },
];

const supportItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useSidebar();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={open ? "w-72" : "w-16"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-saffron rounded-full flex items-center justify-center shadow-glow animate-breathe">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!open && (
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">AyurSutra</h2>
              <p className="text-xs text-muted-foreground">Wellness Guide</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={`w-full justify-start transition-gentle rounded-lg ${
                        active 
                          ? 'bg-gradient-saffron text-primary-foreground shadow-soft' 
                          : 'hover:bg-muted/70 text-foreground hover:text-primary'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${open ? 'mr-3' : 'mx-auto'}`} />
                      {open && <span className="font-medium">{item.title}</span>}
                      {active && open && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full ml-auto animate-breathe" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {supportItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={`w-full justify-start transition-gentle rounded-lg ${
                        active 
                          ? 'bg-gradient-healing text-secondary-foreground shadow-soft' 
                          : 'hover:bg-muted/70 text-foreground hover:text-secondary'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${open ? 'mr-3' : 'mx-auto'}`} />
                      {open && <span className="font-medium">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8 border-2 border-primary/20">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-gradient-sunset text-accent-foreground text-sm font-semibold">
              JP
            </AvatarFallback>
          </Avatar>
          {open && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground">Vata Dosha</p>
            </div>
          )}
        </div>
        {open && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-3 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-gentle"
          >
            <Heart className="w-4 h-4 mr-2" />
            Wellness Score: 85%
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}