import { motion } from "framer-motion";
import { Check, User } from "lucide-react";
import { Player } from "@/lib/db";
import { cn } from "@/lib/utils";

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayers: Player[];
  onTogglePlayer: (player: Player) => void;
  maxPlayers?: number;
}

export const PlayerSelector = ({
  players,
  selectedPlayers,
  onTogglePlayer,
  maxPlayers = 4,
}: PlayerSelectorProps) => {
  const isSelected = (player: Player) => 
    selectedPlayers.some(p => p.id === player.id);
  
  const selectionIndex = (player: Player) => 
    selectedPlayers.findIndex(p => p.id === player.id) + 1;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {players.map((player, index) => {
        const selected = isSelected(player);
        const seatNumber = selectionIndex(player);
        const canSelect = selected || selectedPlayers.length < maxPlayers;

        return (
          <motion.button
            key={player.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => canSelect && onTogglePlayer(player)}
            disabled={!canSelect}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
              selected
                ? "border-gold bg-gold/10 glow-gold"
                : canSelect
                ? "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                : "border-border/50 bg-card/30 opacity-50 cursor-not-allowed"
            )}
          >
            {selected && (
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-secondary-foreground font-bold text-sm shadow-lg">
                {seatNumber}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                selected ? "bg-gold/20" : "bg-muted"
              )}>
                {selected ? (
                  <Check className="w-5 h-5 text-gold" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium truncate",
                  selected ? "text-gold" : "text-foreground"
                )}>
                  {player.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {player.rating} rating
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
