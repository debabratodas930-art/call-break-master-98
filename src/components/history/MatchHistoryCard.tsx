import { motion } from "framer-motion";
import { Calendar, Users, Trophy } from "lucide-react";
import { Match } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MatchHistoryCardProps {
  match: Match;
  index: number;
}

export const MatchHistoryCard = ({ match, index }: MatchHistoryCardProps) => {
  const sortedPlayers = [...match.players].sort((a, b) => a.rank - b.rank);
  const winner = sortedPlayers[0];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-rank-1";
      case 2: return "text-rank-2";
      case 3: return "text-rank-3";
      default: return "text-rank-4";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center"><Trophy className="w-5 h-5 text-gold" /></div>
          <div><h3 className="font-display font-semibold text-gold">{winner.playerName}</h3><p className="text-sm text-muted-foreground">Winner</p></div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4" />{format(new Date(match.timestamp), "MMM d, yyyy • h:mm a")}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sortedPlayers.map((player) => (
          <div key={player.playerId} className="bg-muted/30 rounded-lg p-3 text-center">
            <div className={cn("font-display font-bold text-lg mb-1", getRankColor(player.rank))}>#{player.rank}</div>
            <p className="text-sm font-medium truncate">{player.playerName}</p>
            <p className="text-xs text-muted-foreground">{player.totalPoints.toFixed(1)} pts</p>
            <p className={cn("text-xs font-medium", player.ratingChange >= 0 ? "text-emerald-light" : "text-destructive")}>{player.ratingChange >= 0 ? "+" : ""}{player.ratingChange}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Users className="w-4 h-4" /><span>{match.rounds.length} rounds played</span></div>
    </motion.div>
  );
};
