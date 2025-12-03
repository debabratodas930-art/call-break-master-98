import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PlayerCard } from "@/components/players/PlayerCard";
import { AddPlayerForm } from "@/components/players/AddPlayerForm";
import { db, deletePlayer } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

const Players = () => {
  const players = useLiveQuery(() => 
    db.players.orderBy('rating').reverse().toArray()
  );

  const handleDeletePlayer = async (id: number) => {
    const player = players?.find(p => p.id === id);
    if (!player) return;

    if (player.matchesPlayed > 0) {
      toast({
        title: "Cannot delete player",
        description: "Players with match history cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    try {
      await deletePlayer(id);
      toast({
        title: "Player removed",
        description: `${player.name} has been removed from the roster`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete player",
        variant: "destructive",
      });
    }
  };

  const refreshPlayers = () => {
    // Dexie live query will auto-refresh
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Players</h1>
          <p className="text-muted-foreground">
            Manage your player roster and view stats
          </p>
        </div>

        <div className="mb-8">
          <AddPlayerForm onPlayerAdded={refreshPlayers} />
        </div>

        {players && players.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {players.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                rank={index + 1}
                showDelete
                onDelete={handleDeletePlayer}
              />
            ))}
          </div>
        ) : (
          <div className="card-surface rounded-xl p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-display text-xl font-semibold mb-2">No Players Yet</h3>
            <p className="text-muted-foreground">
              Add your first player above to get started
            </p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Players;
