// scoreManager.js

class ScoreManager {
    constructor() {
        this.apiEndpoint = '/api/scores'; // Adjust this to your API endpoint
    }

    // Helper method for making API calls
    async makeApiRequest(url, method, data = null) {
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // Include credentials for cross-origin requests if needed
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Add a new score
    async addScore(playerData) {
        const scoreEntry = {
            userId: playerData.userId || crypto.randomUUID(), // Generate UUID if not provided
            email: playerData.email,
            name: playerData.name,
            score: playerData.score,
            date: new Date().toISOString(),
            progress: playerData.progress || {},
            completedSections: playerData.completedSections || [],
            achievements: playerData.achievements || []
        };

        try {
            const savedScore = await this.makeApiRequest(
                `${this.apiEndpoint}/add`,
                'POST',
                scoreEntry
            );
            return savedScore;
        } catch (error) {
            console.error('Failed to save score:', error);
            throw error;
        }
    }

    // Get top scores
    async getTopScores(limit = 10) {
        try {
            return await this.makeApiRequest(
                `${this.apiEndpoint}/top?limit=${limit}`,
                'GET'
            );
        } catch (error) {
            console.error('Failed to get top scores:', error);
            throw error;
        }
    }

    // Get scores for a specific player
    async getPlayerScores(email) {
        try {
            return await this.makeApiRequest(
                `${this.apiEndpoint}/player/${encodeURIComponent(email)}`,
                'GET'
            );
        } catch (error) {
            console.error('Failed to get player scores:', error);
            throw error;
        }
    }

    // Clear all scores (admin only)
    async clearScores(adminKey) {
        try {
            return await this.makeApiRequest(
                `${this.apiEndpoint}/clear`,
                'DELETE',
                { adminKey }
            );
        } catch (error) {
            console.error('Failed to clear scores:', error);
            throw error;
        }
    }

    // Get player's highest score
    async getPlayerHighScore(email) {
        try {
            const scores = await this.getPlayerScores(email);
            return scores.length > 0
                ? Math.max(...scores.map(s => s.score))
                : 0;
        } catch (error) {
            console.error('Failed to get player high score:', error);
            throw error;
        }
    }

    // Get total number of games played by a player
    async getPlayerGamesPlayed(email) {
        try {
            const scores = await this.getPlayerScores(email);
            return scores.length;
        } catch (error) {
            console.error('Failed to get games played:', error);
            throw error;
        }
    }
}

// Initialize the score manager
const scoreManager = new ScoreManager();
window.scoreManager = scoreManager;
