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
                    perfectRounds: 0, // Changed from perfectLevels to match current implementation
                    totalPackagesSorted: 0,
                    lastScore: 0 // Added to match current implementation
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
                    perfectMatches: 0, // Changed from perfectGames to match current implementation
                    totalAttempts: 0,
                    bestMatchTime: null
                }
            },
            quizProgress: { // Changed from quizStats to match current implementation
                safety: { bestScore: 0, completed: 0 },
                benefits: { bestScore: 0, completed: 0 },
                workplace: { bestScore: 0, completed: 0 },
                procedures: { bestScore: 0, completed: 0 }
            },
            settings: {
                soundEnabled: true,
                musicEnabled: true // Changed to match current implementation
            }
        };
    }

    initializeState() {
        if (!this.state.player.startDate) {
            this.state.player.startDate = new Date().toISOString();
        }
        this.state.player.lastLogin = new Date().toISOString();
        this.saveState();
        this.updateUI();
    }

    loadState() {
        try {
            const savedState = localStorage.getItem('amazonGameState'); // Updated storage key
            return savedState ? JSON.parse(savedState) : null;
        } catch (error) {
            console.error('Error loading game state:', error);
            return null;
        }
    }

    saveState() {
        try {
            localStorage.setItem('amazonGameState', JSON.stringify(this.state));
        } catch (error) {
            console.error('Error saving game state:', error);
        }
    }

    updateScore(points) {
        this.state.player.score += points;
        this.saveState();
        this.updateUI();
    }

    updateUI() {
        try {
            const scoreDisplay = document.getElementById('scoreDisplay');
            const levelDisplay = document.getElementById('levelDisplay');

            if (scoreDisplay) scoreDisplay.textContent = this.state.player.score;
            if (levelDisplay) levelDisplay.textContent = this.state.player.level;

            this.updateGameStats();
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    }

    updateGameStats() {
        try {
            // Weight Sorting Stats
            const weightSortingStats = {
                highScore: document.getElementById('weightSortingHighScore'),
                perfectRounds: document.getElementById('weightSortingPerfectRounds')
            };

            if (weightSortingStats.highScore) {
                weightSortingStats.highScore.textContent =
                    this.state.gameStats.weightSorting.highScore;
            }
            if (weightSortingStats.perfectRounds) {
                weightSortingStats.perfectRounds.textContent =
                    this.state.gameStats.weightSorting.perfectRounds;
            }

            // Update other game stats as needed
        } catch (error) {
            console.error('Error updating game stats:', error);
        }
    }

    showSection(sectionId) {
        try {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none';
            });

            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.classList.add('active');
                selectedSection.style.display = 'block';

                if (!this.state.player.visitedSections.includes(sectionId)) {
                    this.state.player.visitedSections.push(sectionId);
                    this.saveState();
                }
            }
        } catch (error) {
            console.error('Error showing section:', error);
        }
    }

    async handleRegistration(event) {
        try {
            event.preventDefault();

            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;

            if (name && email) {
                this.state.player.name = name;
                this.state.player.email = email;
                this.saveState();

                await showLoadingScreen();
                await hideLoadingScreen();
                this.showSection('games');
            }
        } catch (error) {
            console.error('Error handling registration:', error);
        }
    }

    resetProgress() {
        try {
            const resetModal = document.getElementById('resetModal');
            if (resetModal) {
                resetModal.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error showing reset modal:', error);
        }
    }

    confirmReset() {
        try {
            localStorage.removeItem('amazonGameState');
            location.reload();
        } catch (error) {
            console.error('Error resetting progress:', error);
        }
    }
}

// Initialize game state
const gameState = new GameState();

// Export for other modules
window.gameState = gameState;

// Bind methods to window for HTML access
window.handleRegistration = (event) => gameState.handleRegistration(event);
window.resetProgress = () => gameState.resetProgress();
window.confirmReset = () => gameState.confirmReset();
