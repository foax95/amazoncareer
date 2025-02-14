class GameState {
    constructor() {
        this.state = this.loadState() || this.getInitialState();
        this.initializeState();
    }

    getInitialState() {
        return {
            player: {
                name: '',
                email: '',
                score: 0,
                level: 1,
                achievements: [],
                completedSections: [],
                startDate: null,
                lastLogin: null,
                visitedSections: []
            },
            progress: {
                facilitiesCompleted: false,
                gamesCompleted: [],
                quizzesTaken: [],
                achievementsUnlocked: []
            },
            gameStats: {
                weightSorting: {
                    highScore: 0,
                    gamesPlayed: 0,
                    perfectLevels: 0,
                    totalPackagesSorted: 0,
                    longestStreak: 0,
                    currentStreak: 0
                },
                pathFinding: {
                    bestTime: null,
                    pathsCompleted: 0,
                    totalSteps: 0,
                    perfectPaths: 0,
                    averageTime: 0
                },
                matching: {
                    highScore: 0,
                    matchesFound: 0,
                    perfectGames: 0,
                    totalAttempts: 0,
                    bestMatchTime: null
                }
            },
            quizStats: {
                completed: 0,
                correctAnswers: 0,
                totalQuestions: 0,
                perfectScores: 0,
                categoryProgress: {
                    safety: 0,
                    benefits: 0,
                    workplace: 0,
                    procedures: 0
                }
            },
            settings: {
                soundEnabled: true,
                assistantEnabled: true,
                difficulty: 'normal'
            }
        };
    }

    initializeState() {
        if (!this.state.player.startDate) {
            this.state.player.startDate = new Date().toISOString();
        }
        this.state.player.lastLogin = new Date().toISOString();
        this.saveState();
    }

    loadState() {
        try {
            const savedState = localStorage.getItem('amazonCareerAdventure');
            return savedState ? JSON.parse(savedState) : null;
        } catch (error) {
            console.error('Error loading game state:', error);
            return null;
        }
    }

    saveState() {
        try {
            localStorage.setItem('amazonCareerAdventure', JSON.stringify(this.state));
        } catch (error) {
            console.error('Error saving game state:', error);
        }
    }

    updateScore(points) {
        this.state.player.score += points;
        this.checkLevelUp();
        this.checkAchievements();
        this.saveState();
        this.updateUI();
    }

    updateProgress(sectionId, percentage) {
        const progressBar = document.querySelector(`#${sectionId}Progress .progress-fill`);
        if (progressBar) {
            window.animateProgress(progressBar, percentage);
        }
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
        const scoreDisplay = document.getElementById('scoreDisplay');
        const levelDisplay = document.getElementById('levelDisplay');

        if (scoreDisplay) scoreDisplay.textContent = this.state.player.score;
        if (levelDisplay) levelDisplay.textContent = this.state.player.level;
    }

    // Game Stats Methods
    updateGameStats(game, stats) {
        if (this.state.gameStats[game]) {
            this.state.gameStats[game] = {
                ...this.state.gameStats[game],
                ...stats
            };
            this.saveState();
            this.checkAchievements();
        }
    }

    // Section Tracking
    trackSectionVisit(sectionId) {
        if (!this.state.player.visitedSections.includes(sectionId)) {
            this.state.player.visitedSections.push(sectionId);
            this.saveState();
            this.checkAchievements();
        }
    }

    completeSection(sectionId) {
        if (!this.state.player.completedSections.includes(sectionId)) {
            this.state.player.completedSections.push(sectionId);
            this.updateScore(CONFIG.SECTION_COMPLETION_POINTS);
            this.saveState();
            this.checkAchievements();
        }
    }

    // Quiz Methods
    updateQuizProgress(categoryId, result) {
        this.state.quizStats.completed++;
        this.state.quizStats.correctAnswers += result.correct;
        this.state.quizStats.totalQuestions += result.total;

        if (result.correct === result.total) {
            this.state.quizStats.perfectScores++;
        }

        if (this.state.quizStats.categoryProgress[categoryId] !== undefined) {
            this.state.quizStats.categoryProgress[categoryId] =
                Math.max(this.state.quizStats.categoryProgress[categoryId],
                    (result.correct / result.total) * 100);
        }

        this.saveState();
        this.checkAchievements();
    }

    // Achievement Methods
    checkAchievements() {
        if (window.achievementSystem) {
            window.achievementSystem.checkAchievements();
        }
    }

    unlockAchievement(achievementId) {
        if (!this.state.progress.achievementsUnlocked.includes(achievementId)) {
            this.state.progress.achievementsUnlocked.push(achievementId);
            this.saveState();
        }
    }

    // Settings Methods
    updateSettings(settings) {
        this.state.settings = {
            ...this.state.settings,
            ...settings
        };
        this.saveState();
    }

    // Reset Progress
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            this.state = this.getInitialState();
            this.initializeState();
            this.saveState();
            location.reload();
        }
    }

    // Debug Method
    debugState() {
        console.log('Current Game State:', this.state);
    }
}

// Initialize game state
const gameState = new GameState();

// Export for other modules
window.gameState = gameState;
