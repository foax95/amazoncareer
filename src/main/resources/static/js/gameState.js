class GameState {
    constructor() {
        this.state = this.loadState() || this.getInitialState();
    }

    getInitialState() {
        return {
            player: {
                name: '',
                email: '',
                score: 0,
                level: 1,
                achievements: []
            },
            progress: {
                facilitiesCompleted: false,
                gamesCompleted: [],
                quizzesTaken: [],
                achievementsUnlocked: []
            },
            gameStats: {
                weightSorting: { highScore: 0, gamesPlayed: 0 },
                pathFinding: { bestTime: null, pathsCompleted: 0 },
                matching: { highScore: 0, matchesFound: 0 }
            }
        };
    }

    loadState() {
        const savedState = localStorage.getItem('amazonCareerAdventure');
        return savedState ? JSON.parse(savedState) : null;
    }

    saveState() {
        localStorage.setItem('amazonCareerAdventure', JSON.stringify(this.state));
    }

    updateScore(points) {
        this.state.player.score += points;
        this.checkLevelUp();
        this.saveState();
        this.updateUI();
    }

    checkLevelUp() {
        const currentLevel = this.state.player.level;
        const currentScore = this.state.player.score;

        for (const [level, data] of Object.entries(CONFIG.GAME_LEVELS)) {
            if (currentScore >= data.pointsNeeded && currentLevel < level) {
                this.levelUp(level);
                break;
            }
        }
    }

    levelUp(newLevel) {
        this.state.player.level = parseInt(newLevel);
        showLevelUpNotification(newLevel);
        this.saveState();
    }

    updateUI() {
        document.getElementById('scoreDisplay').textContent = this.state.player.score;
        document.getElementById('levelDisplay').textContent = this.state.player.level;
    }

    resetProgress() {
        this.state = this.getInitialState();
        this.saveState();
        location.reload();
    }
}

const gameState = new GameState();
