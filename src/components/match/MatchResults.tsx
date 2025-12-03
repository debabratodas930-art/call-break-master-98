import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Medal } from "lucide-react";
import { MatchPlayer } from "@/lib/db";
import { cn } from "@/lib/utils";

interface MatchResultsProps {
  results: MatchPlayer[];
}

export const MatchResults = ({ results }: MatchResultsProps) => {
  const sortedResults = [...results].sort((a, b) => a.rank - b.rank);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6" />;
      case 2: return <Medal className="w-6 h-6" />;
      case 3: return <Medal className="w-6 h-6" />;
      default: return <span className="text-xl font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "from-gold to-gold-light text-secondary-foreground border-gold glow-gold";
      case 2: return "from-gray-400 to-gray-300 text-gray-800 border-gray-400";
      case 3: return "from-amber-700 to-amber-600 text-amber-100 border-amber-600";
      default: return "from-muted to-muted text-muted-foreground border-border";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <h2 className="font-display text-2xl font-bold text-center text-gradient-gold mb-6">
        Match Results
      </h2>

      <div className="space-y-3">
        {sortedResults.map((result, index) => (
          <motion.div
            key={result.playerId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-4 p-5 rounded-xl border-2 bg-gradient-to-r",
              getRankStyle(result.rank)
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-background/20 flex items-center justify-center">
              {getRankIcon(result.rank)}
            </div>

            <div className="flex-1">
              <h3 className="font-display text-xl font-semibold">
                {result.playerName}
              </h3>
              <p className="text-sm opacity-80">
                Seat {result.seat} • {result.totalPoints.toFixed(1)} points
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                {result.ratingChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-light" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className={cn(
                  "font-bold",
                  result.ratingChange >= 0 ? "text-emerald-light" : "text-destructive"
                )}>
                  {result.ratingChange >= 0 ? "+" : ""}{result.ratingChange}
                </span>
              </div>
              <p className="text-sm opacity-80">
                {result.ratingAfter} rating
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
