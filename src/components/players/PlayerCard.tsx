import { motion } from "framer-motion";
import { Trophy, Target, TrendingUp, Trash2 } from "lucide-react";
import { Player } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: Player;
  onDelete?: (id: string) => void;
  rank?: number;
  showDelete?: boolean;
}

export const PlayerCard = ({ player, onDelete, rank, showDelete = false }: PlayerCardProps) => {
  const winPercentage = player.matchesPlayed > 0 
    ? ((player.rank1Count / player.matchesPlayed) * 100).toFixed(1) 
    : "0.0";
  
  const avgPoints = player.matchesPlayed > 0 
    ? (player.totalPoints / player.matchesPlayed).toFixed(1) 
    : "0.0";

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1: return "from-gold to-gold-light text-secondary-foreground";
      case 2: return "from-gray-400 to-gray-300 text-gray-800";
      case 3: return "from-amber-700 to-amber-600 text-amber-100";
      default: return "from-muted to-muted text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {rank && (
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm bg-gradient-to-br",
              getRankBadgeColor(rank)
            )}>
              {rank}
            </div>
          )}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
              {player.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {player.matchesPlayed} matches played
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-display text-2xl font-bold text-gradient-gold">
            {player.rating}
          </div>
          <p className="text-xs text-muted-foreground">Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <Trophy className="w-4 h-4 mx-auto mb-1 text-gold" />
          <div className="text-sm font-semibold">{player.rank1Count}</div>
          <div className="text-xs text-muted-foreground">Wins</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <Target className="w-4 h-4 mx-auto mb-1 text-primary" />
          <div className="text-sm font-semibold">{player.highestScore}</div>
          <div className="text-xs text-muted-foreground">Best</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-emerald-light" />
          <div className="text-sm font-semibold">{avgPoints}</div>
          <div className="text-xs text-muted-foreground">Avg</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-2">
          <span className="px-2 py-1 rounded bg-rank-1/20 text-rank-1 font-medium">{player.rank1Count}</span>
          <span className="px-2 py-1 rounded bg-rank-2/20 text-rank-2 font-medium">{player.rank2Count}</span>
          <span className="px-2 py-1 rounded bg-rank-3/20 text-rank-3 font-medium">{player.rank3Count}</span>
          <span className="px-2 py-1 rounded bg-rank-4/20 text-rank-4 font-medium">{player.rank4Count}</span>
        </div>
        
        {showDelete && onDelete && player._id && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(player._id!)}
            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};
