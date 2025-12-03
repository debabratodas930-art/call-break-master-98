import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLiveQuery } from "dexie-react-hooks";
import { Play, Users, Trophy, History, Spade, Heart, Diamond, Club } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

const Index = () => {
  const players = useLiveQuery(() => db.players.count());
  const matches = useLiveQuery(() => db.matches.count());
  const topPlayer = useLiveQuery(() => 
    db.players.orderBy('rating').reverse().first()
  );

  const stats = [
    { label: "Players", value: players ?? 0, icon: Users },
    { label: "Matches", value: matches ?? 0, icon: History },
    { label: "Top Rating", value: topPlayer?.rating ?? 1000, icon: Trophy },
  ];

  const quickActions = [
    { label: "New Match", path: "/play", icon: Play, variant: "gold" as const },
    { label: "Players", path: "/players", icon: Users, variant: "emerald" as const },
    { label: "Leaderboard", path: "/leaderboard", icon: Trophy, variant: "glass" as const },
    { label: "History", path: "/history", icon: History, variant: "glass" as const },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 text-center overflow-hidden">
        {/* Decorative cards */}
        <motion.div
          initial={{ opacity: 0, rotate: -15, y: 50 }}
          animate={{ opacity: 0.1, rotate: -15, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute top-10 left-10 text-gold"
        >
          <Spade className="w-32 h-32" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: 15, y: 50 }}
          animate={{ opacity: 0.1, rotate: 15, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute top-20 right-10 text-destructive"
        >
          <Heart className="w-24 h-24" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: -10, y: 50 }}
          animate={{ opacity: 0.1, rotate: -10, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute bottom-10 left-1/4 text-destructive"
        >
          <Diamond className="w-20 h-20" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: 20, y: 50 }}
          animate={{ opacity: 0.1, rotate: 20, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-20 right-1/4 text-foreground"
        >
          <Club className="w-28 h-28" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-xl animate-pulse-gold">
              <Spade className="w-12 h-12 text-secondary-foreground" />
            </div>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gradient-gold">Call Break</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2 font-display">
            Score Tracker & Stats
          </p>
          <p className="text-muted-foreground max-w-md mx-auto">
            Track your games, monitor player stats, and climb the leaderboard with our advanced ELO rating system.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-3 gap-4 mb-12"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card-surface rounded-xl p-6 text-center"
            >
              <Icon className="w-8 h-8 mx-auto mb-3 text-gold" />
              <div className="font-display text-3xl font-bold text-gradient-gold mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="font-display text-2xl font-semibold mb-6 text-center">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link to={action.path}>
                  <Button
                    variant={action.variant}
                    size="xl"
                    className="w-full flex-col h-auto py-6 gap-3"
                  >
                    <Icon className="w-8 h-8" />
                    <span>{action.label}</span>
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Top Player Highlight */}
      {topPlayer && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12"
        >
          <div className="card-surface-elevated rounded-2xl p-8 text-center border-gold/30 glow-gold">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gold" />
            <p className="text-muted-foreground mb-2">Current Leader</p>
            <h3 className="font-display text-3xl font-bold text-gradient-gold mb-2">
              {topPlayer.name}
            </h3>
            <p className="text-lg text-foreground">
              {topPlayer.rating} Rating • {topPlayer.rank1Count} Wins
            </p>
          </div>
        </motion.section>
      )}
    </Layout>
  );
};

export default Index;
