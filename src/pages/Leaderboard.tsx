import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { usePlayers } from "@/hooks/use-players";
import { cn } from "@/lib/utils";

const Leaderboard = () => {
  const { data: players, isLoading } = usePlayers();
  
  const sortedPlayers = players?.sort((a, b) => b.rating - a.rating) ?? [];

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: <Trophy className="w-6 h-6" />,
          bg: "bg-gradient-to-r from-gold to-gold-light",
          text: "text-secondary-foreground",
          glow: "glow-gold",
        };
      case 2:
        return {
          icon: <Medal className="w-6 h-6" />,
          bg: "bg-gradient-to-r from-gray-400 to-gray-300",
          text: "text-gray-800",
          glow: "",
        };
      case 3:
        return {
          icon: <Award className="w-6 h-6" />,
          bg: "bg-gradient-to-r from-amber-700 to-amber-600",
          text: "text-amber-100",
          glow: "",
        };
      default:
        return {
          icon: <span className="font-bold">{rank}</span>,
          bg: "bg-muted",
          text: "text-muted-foreground",
          glow: "",
        };
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top players ranked by ELO rating
          </p>
        </div>

        {isLoading ? (
          <div className="card-surface rounded-xl p-12 text-center">
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        ) : sortedPlayers.length > 0 ? (
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const rank = index + 1;
              const display = getRankDisplay(rank);
              const winRate = player.matchesPlayed > 0 
                ? ((player.rank1Count / player.matchesPlayed) * 100).toFixed(0)
                : "0";

              return (
                <motion.div
                  key={player._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl card-surface hover:border-primary/30 transition-all duration-300",
                    rank <= 3 && "border-2",
                    rank === 1 && "border-gold/50",
                    rank === 2 && "border-gray-400/50",
                    rank === 3 && "border-amber-600/50",
                    display.glow
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    display.bg,
                    display.text
                  )}>
                    {display.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-display text-lg font-semibold truncate",
                      rank === 1 && "text-gold"
                    )}>
                      {player.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {player.matchesPlayed} matches • {winRate}% win rate
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-display text-2xl font-bold text-gradient-gold">
                      {player.rating}
                    </div>
                    <p className="text-xs text-muted-foreground">rating</p>
                  </div>

                  <div className="hidden sm:flex gap-1 shrink-0">
                    <span className="px-2 py-1 rounded bg-rank-1/20 text-rank-1 text-xs font-medium">
                      {player.rank1Count}
                    </span>
                    <span className="px-2 py-1 rounded bg-rank-2/20 text-rank-2 text-xs font-medium">
                      {player.rank2Count}
                    </span>
                    <span className="px-2 py-1 rounded bg-rank-3/20 text-rank-3 text-xs font-medium">
                      {player.rank3Count}
                    </span>
                    <span className="px-2 py-1 rounded bg-rank-4/20 text-rank-4 text-xs font-medium">
                      {player.rank4Count}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="card-surface rounded-xl p-12 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-display text-xl font-semibold mb-2">No Rankings Yet</h3>
            <p className="text-muted-foreground">
              Add players and complete matches to see the leaderboard
            </p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Leaderboard;
