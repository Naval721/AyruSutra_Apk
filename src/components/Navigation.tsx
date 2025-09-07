import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, Calendar, User, Heart } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/", icon: Heart },
    { name: "Assistant", href: "/chat", icon: MessageCircle },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-saffron rounded-full flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-heading text-lg font-bold">Om</span>
            </div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              AyurSutra
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => navigate(item.href)}
                  className={`flex items-center space-x-2 transition-gentle ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-lotus-bloom">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => {
                    navigate(item.href);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-start space-x-3 transition-gentle ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;