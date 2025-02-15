// scoreManager.js

class ScoreManager {
    constructor() {
        this.storageKey = 'amazonGameScores';
        this.scores = this.loadScores();
    }

    // Load scores from localStorage
    loadScores() {
        const savedScores = localStorage.getItem(this.storageKey);
        return savedScores ? JSON.parse(savedScores) : [];
    }

    // Save scores to localStorage
    saveScores() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    }

    // Add a new score
    addScore(playerData) {
        const scoreEntry = {
            name: playerData.name,
            email: playerData.email,
            score: playerData.score,
            gameType: 'weightSorting',
            date: new Date().toISOString(),
        };

        this.scores.push(scoreEntry);
        // Sort scores in descending order
        this.scores.sort((a, b) => b.score - a.score);
        // Keep only top 100 scores
        if (this.scores.length > 100) {
            this.scores = this.scores.slice(0, 100);
        }
        this.saveScores();
        return scoreEntry;
    }

    // Get top scores
    getTopScores(limit = 10) {
        return this.scores.slice(0, limit);
    }

    // Get scores for a specific player
    getPlayerScores(email) {
        return this.scores.filter(score => score.email === email);
    }

    // Clear all scores
    clearScores() {
        this.scores = [];
        this.saveScores();
    }

    // Get player's highest score
    getPlayerHighScore(email) {
        const playerScores = this.getPlayerScores(email);
        return playerScores.length > 0 ? Math.max(...playerScores.map(s => s.score)) : 0;
    }

    // Get total number of games played by a player
    getPlayerGamesPlayed(email) {
        return this.getPlayerScores(email).length;
    }
}

// Initialize the score manager
const scoreManager = new ScoreManager();
window.scoreManager = scoreManager;
