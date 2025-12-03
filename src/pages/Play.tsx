import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { Play as PlayIcon, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PlayerSelector } from "@/components/match/PlayerSelector";
import { ScoreInput } from "@/components/match/ScoreInput";
import { MatchResults } from "@/components/match/MatchResults";
import { 
  db, 
  Player, 
  addMatch, 
  updatePlayerStats,
  calculateRoundScore,
  calculateEloChanges,
  MatchPlayer,
  Round,
} from "@/lib/db";
import { toast } from "@/hooks/use-toast";

type GameStep = "select" | "play" | "results";

const TOTAL_ROUNDS = 5;

const Play = () => {
  const navigate = useNavigate();
  const players = useLiveQuery(() => db.players.orderBy('name').toArray());
  
  const [step, setStep] = useState<GameStep>("select");
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [matchResults, setMatchResults] = useState<MatchPlayer[]>([]);

  const initializeRounds = useCallback((players: Player[]) => {
    const initialRounds: Round[] = [];
    for (let i = 1; i <= TOTAL_ROUNDS; i++) {
      initialRounds.push({
        roundNumber: i,
        scores: players.map(p => ({
          playerId: p.id!,
          bid: 0,
          tricks: 0,
          points: 0,
        })),
      });
    }
    setRounds(initialRounds);
  }, []);

  const handleTogglePlayer = (player: Player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      }
      if (prev.length < 4) {
        return [...prev, player];
      }
      return prev;
    });
  };

  const handleStartMatch = () => {
    if (selectedPlayers.length !== 4) {
      toast({
        title: "Select 4 players",
        description: "You need exactly 4 players to start a match",
        variant: "destructive",
      });
      return;
    }
    initializeRounds(selectedPlayers);
    setStep("play");
  };

  const handleScoreChange = (roundIndex: number, playerId: number, field: "bid" | "tricks", value: number) => {
    setRounds(prev => {
      const updated = [...prev];
      const scoreIndex = updated[roundIndex].scores.findIndex(s => s.playerId === playerId);
      if (scoreIndex !== -1) {
        updated[roundIndex].scores[scoreIndex][field] = value;
        const score = updated[roundIndex].scores[scoreIndex];
        score.points = calculateRoundScore(score.bid, score.tricks);
      }
      return updated;
    });
  };

  const isRoundComplete = (roundIndex: number) => {
    const round = rounds[roundIndex];
    if (!round) return false;
    
    const totalTricks = round.scores.reduce((sum, s) => sum + s.tricks, 0);
    const allBidsSet = round.scores.every(s => s.bid > 0);
    
    return allBidsSet && totalTricks === 13;
  };

  const calculateFinalResults = async () => {
    // Calculate total points for each player
    const playerTotals = selectedPlayers.map((player, index) => {
      const total = rounds.reduce((sum, round) => {
        const score = round.scores.find(s => s.playerId === player.id);
        return sum + (score?.points ?? 0);
      }, 0);

      return {
        playerId: player.id!,
        playerName: player.name,
        seat: index + 1,
        totalPoints: total,
        rank: 0,
        ratingBefore: player.rating,
        ratingAfter: player.rating,
        ratingChange: 0,
      };
    });

    // Sort by points and assign ranks
    const sorted = [...playerTotals].sort((a, b) => b.totalPoints - a.totalPoints);
    sorted.forEach((p, i) => {
      const playerIndex = playerTotals.findIndex(pt => pt.playerId === p.playerId);
      playerTotals[playerIndex].rank = i + 1;
    });

    // Calculate ELO changes
    const eloChanges = calculateEloChanges(
      playerTotals.map(p => ({
        playerId: p.playerId,
        rating: p.ratingBefore,
        rank: p.rank,
      }))
    );

    // Apply ELO changes
    playerTotals.forEach(p => {
      const change = eloChanges.get(p.playerId) ?? 0;
      p.ratingChange = change;
      p.ratingAfter = p.ratingBefore + change;
    });

    // Save match to database
    await addMatch({
      timestamp: new Date(),
      players: playerTotals,
      rounds: rounds,
      completed: true,
    });

    // Update player stats
    for (const result of playerTotals) {
      const player = selectedPlayers.find(p => p.id === result.playerId)!;
      
      const updates: Partial<Player> = {
        matchesPlayed: player.matchesPlayed + 1,
        totalPoints: player.totalPoints + result.totalPoints,
        rating: result.ratingAfter,
        highestScore: Math.max(player.highestScore, result.totalPoints),
      };

      switch (result.rank) {
        case 1: updates.rank1Count = player.rank1Count + 1; break;
        case 2: updates.rank2Count = player.rank2Count + 1; break;
        case 3: updates.rank3Count = player.rank3Count + 1; break;
        case 4: updates.rank4Count = player.rank4Count + 1; break;
      }

      await updatePlayerStats(result.playerId, updates);
    }

    setMatchResults(playerTotals);
    setStep("results");
  };

  const handleFinishMatch = async () => {
    // Validate all rounds
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      if (!isRoundComplete(i)) {
        toast({
          title: "Incomplete rounds",
          description: `Round ${i + 1} is not complete. Each round must have 13 tricks total.`,
          variant: "destructive",
        });
        setCurrentRound(i + 1);
        return;
      }
    }

    await calculateFinalResults();
    toast({
      title: "Match complete!",
      description: "Results have been saved and ratings updated.",
    });
  };

  const handleNewMatch = () => {
    setStep("select");
    setSelectedPlayers([]);
    setCurrentRound(1);
    setRounds([]);
    setMatchResults([]);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
            <PlayIcon className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">
            {step === "select" && "New Match"}
            {step === "play" && `Round ${currentRound} of ${TOTAL_ROUNDS}`}
            {step === "results" && "Match Complete"}
          </h1>
          <p className="text-muted-foreground">
            {step === "select" && "Select 4 players to start"}
            {step === "play" && "Enter bids and tricks won"}
            {step === "results" && "Final standings and rating changes"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {players && players.length >= 4 ? (
                <>
                  <PlayerSelector
                    players={players}
                    selectedPlayers={selectedPlayers}
                    onTogglePlayer={handleTogglePlayer}
                  />
                  
                  <div className="mt-8 flex justify-center">
                    <Button
                      variant="gold"
                      size="xl"
                      onClick={handleStartMatch}
                      disabled={selectedPlayers.length !== 4}
                    >
                      Start Match
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="card-surface rounded-xl p-12 text-center">
                  <PlayIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Need More Players
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You need at least 4 players to start a match
                  </p>
                  <Button variant="emerald" onClick={() => navigate("/players")}>
                    Add Players
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {step === "play" && (
            <motion.div
              key="play"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Round navigation */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentRound(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                      currentRound === i + 1
                        ? "bg-gold text-secondary-foreground"
                        : isRoundComplete(i)
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {isRoundComplete(i) ? <Check className="w-4 h-4 mx-auto" /> : i + 1}
                  </button>
                ))}
              </div>

              <ScoreInput
                roundNumber={currentRound}
                players={selectedPlayers}
                scores={rounds[currentRound - 1]?.scores ?? []}
                onScoreChange={(playerId, field, value) => 
                  handleScoreChange(currentRound - 1, playerId, field, value)
                }
              />

              {/* Running totals */}
              <div className="mt-6 card-surface rounded-xl p-4">
                <h4 className="font-display font-semibold mb-3">Running Totals</h4>
                <div className="grid grid-cols-4 gap-3">
                  {selectedPlayers.map((player, index) => {
                    const total = rounds.reduce((sum, round) => {
                      const score = round.scores.find(s => s.playerId === player.id);
                      return sum + (score?.points ?? 0);
                    }, 0);

                    return (
                      <div key={player.id} className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-gold/20 text-gold font-bold text-xs flex items-center justify-center mx-auto mb-1">
                          {index + 1}
                        </div>
                        <p className="text-sm font-medium truncate">{player.name}</p>
                        <p className={`font-bold ${total >= 0 ? "text-emerald-light" : "text-destructive"}`}>
                          {total.toFixed(1)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => currentRound > 1 ? setCurrentRound(currentRound - 1) : setStep("select")}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {currentRound > 1 ? "Previous" : "Back"}
                </Button>

                {currentRound < TOTAL_ROUNDS ? (
                  <Button
                    variant="emerald"
                    onClick={() => setCurrentRound(currentRound + 1)}
                    disabled={!isRoundComplete(currentRound - 1)}
                  >
                    Next Round
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="gold"
                    onClick={handleFinishMatch}
                  >
                    Finish Match
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <MatchResults results={matchResults} />
              
              <div className="mt-8 flex justify-center gap-4">
                <Button variant="emerald" size="lg" onClick={handleNewMatch}>
                  New Match
                </Button>
                <Button variant="glass" size="lg" onClick={() => navigate("/leaderboard")}>
                  View Leaderboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default Play;
