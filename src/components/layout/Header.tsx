import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Spade, Users, Trophy, History, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Spade },
  { path: "/players", label: "Players", icon: Users },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/history", label: "History", icon: History },
  { path: "/play", label: "New Match", icon: Play },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Spade className="w-6 h-6 text-secondary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-gradient-gold hidden sm:block">
              Call Break
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-gold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:block">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-gold/10 rounded-lg border border-gold/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
