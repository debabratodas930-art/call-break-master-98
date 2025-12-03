import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddPlayer } from "@/hooks/use-players";
import { toast } from "@/hooks/use-toast";

export const AddPlayerForm = () => {
  const [name, setName] = useState("");
  const addPlayerMutation = useAddPlayer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid player name",
        variant: "destructive",
      });
      return;
    }

    if (trimmedName.length > 30) {
      toast({
        title: "Name too long",
        description: "Player name must be 30 characters or less",
        variant: "destructive",
      });
      return;
    }

    try {
      await addPlayerMutation.mutateAsync(trimmedName);
      setName("");
      toast({
        title: "Player added!",
        description: `${trimmedName} has been added to the roster`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add player",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card-surface rounded-xl p-5"
    >
      <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-gold" />
        Add New Player
      </h3>
      
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="Enter player name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          className="flex-1"
        />
        <Button type="submit" variant="gold" disabled={addPlayerMutation.isPending}>
          {addPlayerMutation.isPending ? "Adding..." : "Add"}
        </Button>
      </div>
    </motion.form>
  );
};
