import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Player, calculateRoundScore } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScoreInputProps {
  roundNumber: number;
  players: Player[];
  scores: { playerId: string; bid: number; tricks: number }[];
  onScoreChange: (playerId: string, field: "bid" | "tricks", value: number) => void;
}

export const ScoreInput = ({
  roundNumber,
  players,
  scores,
  onScoreChange,
}: ScoreInputProps) => {
  const getPlayerScore = (playerId: string) => {
    return scores.find(s => s.playerId === playerId) || { bid: 0, tricks: 0 };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card-surface rounded-xl p-5"
    >
      <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
          {roundNumber}
        </span>
        Round {roundNumber}
      </h3>

      <div className="space-y-3">
        {players.map((player, index) => {
          const score = getPlayerScore(player._id!);
          const points = calculateRoundScore(score.bid, score.tricks);
          const isPositive = points >= 0;

          return (
            <div
              key={player._id}
              className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{player.name}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Bid</p>
                  <Input
                    type="number"
                    min={1}
                    max={13}
                    value={score.bid || ""}
                    onChange={(e) => {
                      const value = Math.min(13, Math.max(0, parseInt(e.target.value) || 0));
                      onScoreChange(player._id!, "bid", value);
                    }}
                    className="w-16 h-9 text-center"
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Won</p>
                  <Input
                    type="number"
                    min={0}
                    max={13}
                    value={score.tricks || ""}
                    onChange={(e) => {
                      const value = Math.min(13, Math.max(0, parseInt(e.target.value) || 0));
                      onScoreChange(player._id!, "tricks", value);
                    }}
                    className="w-16 h-9 text-center"
                  />
                </div>

                <div className={cn(
                  "w-16 text-center font-bold text-lg",
                  isPositive ? "text-emerald-light" : "text-destructive"
                )}>
                  {score.bid > 0 ? (isPositive ? "+" : "") + points.toFixed(1) : "-"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
