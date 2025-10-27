const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface RaceData {
    date: string;
    place: string;
    discipline: string;
    country: string;
    category: string;
    position: string;
    fisPoints: string;
    link: string;
    season?: string; // e.g., "2024/2025" or "2025/2026"
}

export const raceService = {
    async getLatestRace(season?: string): Promise<RaceData | null> {
        try {
            const url = season ? `${API_BASE_URL}/fis/latest?season=${season}` : `${API_BASE_URL}/fis/test`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch latest race');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching latest race:', error);
            return null;
        }
    },

    async getAllRaces(): Promise<RaceData[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/fis/all`);
            if (!response.ok) {
                throw new Error('Failed to fetch all races');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching all races:', error);
            return [];
        }
    }
};

