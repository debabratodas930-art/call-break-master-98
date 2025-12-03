import Dexie, { type EntityTable } from 'dexie';

export interface Player {
  id?: number;
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
  id?: number;
  timestamp: Date;
  players: MatchPlayer[];
  rounds: Round[];
  completed: boolean;
}

export interface MatchPlayer {
  playerId: number;
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
  playerId: number;
  bid: number;
  tricks: number;
  points: number;
}

const db = new Dexie('CallBreakDB') as Dexie & {
  players: EntityTable<Player, 'id'>;
  matches: EntityTable<Match, 'id'>;
};

db.version(1).stores({
  players: '++id, name, rating, matchesPlayed',
  matches: '++id, timestamp, completed',
});

export { db };

// Helper functions
export const getPlayers = async () => {
  return await db.players.orderBy('rating').reverse().toArray();
};

export const addPlayer = async (name: string) => {
  const existingPlayer = await db.players.where('name').equalsIgnoreCase(name).first();
  if (existingPlayer) {
    throw new Error('Player with this name already exists');
  }
  
  return await db.players.add({
    name,
    createdAt: new Date(),
    matchesPlayed: 0,
    rank1Count: 0,
    rank2Count: 0,
    rank3Count: 0,
    rank4Count: 0,
    highestScore: 0,
    totalPoints: 0,
    rating: 1000,
  });
};

export const deletePlayer = async (id: number) => {
  return await db.players.delete(id);
};

export const getMatches = async () => {
  return await db.matches.orderBy('timestamp').reverse().toArray();
};

export const addMatch = async (match: Omit<Match, 'id'>) => {
  return await db.matches.add(match);
};

export const updateMatch = async (id: number, match: Partial<Match>) => {
  return await db.matches.update(id, match);
};

export const updatePlayerStats = async (playerId: number, stats: Partial<Player>) => {
  return await db.players.update(playerId, stats);
};

// Calculate Call Break score for a round
export const calculateRoundScore = (bid: number, tricks: number): number => {
  if (tricks >= bid) {
    // Made bid: get bid points + 0.1 for each overtrick
    return bid + (tricks - bid) * 0.1;
  } else {
    // Failed bid: lose bid points
    return -bid;
  }
};

// ELO Rating calculation for multiplayer
export const calculateEloChanges = (players: { playerId: number; rating: number; rank: number }[]): Map<number, number> => {
  const K = 32; // K-factor
  const changes = new Map<number, number>();
  
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
