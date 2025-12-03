export interface Player {
  _id?: string;
  name: string;
  createdAt: Date;
  matchesPlayed: number;
  rank1Count: number;
  rank2Count: number;
  rank3Count: number;
  rank4Count: number;
  highestScore: number;
  totalPoints: number;
  rating: number;
}

export interface Match {
  _id?: string;
  timestamp: Date;
  players: MatchPlayer[];
  rounds: Round[];
  completed: boolean;
}

export interface MatchPlayer {
  playerId: string;
  playerName: string;
  seat: number;
  totalPoints: number;
  rank: number;
  ratingBefore: number;
  ratingAfter: number;
  ratingChange: number;
}

export interface Round {
  roundNumber: number;
  scores: RoundScore[];
}

export interface RoundScore {
  playerId: string;
  bid: number;
  tricks: number;
  points: number;
}

// Calculate Call Break score for a round
export const calculateRoundScore = (bid: number, tricks: number): number => {
  if (tricks >= bid) {
    return bid + (tricks - bid) * 0.1;
  } else {
    return -bid;
  }
};

// ELO Rating calculation for multiplayer
export const calculateEloChanges = (players: { playerId: string; rating: number; rank: number }[]): Map<string, number> => {
  const K = 32;
  const changes = new Map<string, number>();
  
  players.forEach(player => {
    let ratingChange = 0;
    
    players.forEach(opponent => {
      if (player.playerId !== opponent.playerId) {
        const expectedScore = 1 / (1 + Math.pow(10, (opponent.rating - player.rating) / 400));
        const actualScore = player.rank < opponent.rank ? 1 : player.rank === opponent.rank ? 0.5 : 0;
        ratingChange += K * (actualScore - expectedScore);
      }
    });
    
    changes.set(player.playerId, Math.round(ratingChange));
  });
  
  return changes;
};
