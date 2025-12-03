import { Player, Match } from './types';

// Deployed Express server URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://call-break-master-98.onrender.com/api';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Player APIs
  async getPlayers(): Promise<Player[]> {
    return this.request<Player[]>('/players');
  }

  async addPlayer(name: string): Promise<Player> {
    return this.request<Player>('/players', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async deletePlayer(id: string): Promise<void> {
    await this.request(`/players/${id}`, {
      method: 'DELETE',
    });
  }

  async updatePlayerStats(id: string, stats: Partial<Player>): Promise<Player> {
    return this.request<Player>(`/players/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(stats),
    });
  }

  // Match APIs
  async getMatches(): Promise<Match[]> {
    return this.request<Match[]>('/matches');
  }

  async addMatch(match: Omit<Match, '_id'>): Promise<Match> {
    return this.request<Match>('/matches', {
      method: 'POST',
      body: JSON.stringify(match),
    });
  }

  async updateMatch(id: string, match: Partial<Match>): Promise<Match> {
    return this.request<Match>(`/matches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(match),
    });
  }
}

export const api = new ApiClient();
