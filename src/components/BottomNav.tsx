import { useLocation, useNavigate } from "react-router-dom";
import { Home, MessageCircle, Calendar, TrendingUp, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Schedule", href: "/schedule", icon: Calendar },
  { label: "Progress", href: "/progress", icon: TrendingUp },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-xl">
        <ul className="grid grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.href;
            return (
              <li key={item.href}>
                <button
                  onClick={() => navigate(item.href)}
                  className={`w-full py-2.5 flex flex-col items-center justify-center gap-1 transition-gentle ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "scale-110" : ""}`} />
                  <span className="text-[11px] leading-none">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </nav>
  );
}


