class WeightSortingGame {
    constructor() {
        // Game state
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = false;
        this.packageItems = [];
        this.timer = null;
        this.packageGenerationTimer = null;
        this.streak = 0;
        this.multiplier = 1;
        this.mistakesMade = 0;
        this.totalPackagesSorted = 0;
        this.perfectRounds = 0;

        // DOM Elements
        this.gameContainer = null;
        this.conveyorBelt = null;

        // Fixed game settings
        this.baseScore = 10;
        this.penaltyScore = 5;
        this.packageInterval = 3000;
        this.packageSpeed = 8;    // seconds to cross belt
        this.mistakesAllowed = 3;

        this.weightRanges = {
            individual: { min: 1, max: 49 },
            team: { min: 50, max: 75 },
            mechanical: { min: 76, max: 100 }
        };

        this.zoneCounts = {
            individual: 0,
            team: 0,
            mechanical: 0
        };
    }

    initialize() {
        console.log('Initializing Weight Sorting Game');
        this.gameContainer = document.getElementById('weightSortingGame');
        this.conveyorBelt = document.getElementById('conveyorBelt');

        if (!this.gameContainer || !this.conveyorBelt) {
            console.error('Required game elements not found');
            return;
        }

        const gameContent = document.querySelector('.game-content');
        const instructionsPanel = document.querySelector('.game-instructions-panel');

        if (gameContent) gameContent.style.display = 'none';
        if (instructionsPanel) instructionsPanel.style.display = 'block';

        this.resetGame();
        this.setupEventListeners();
        this.updateDisplay();
        this.loadGameStats();
    }

    loadGameStats() {
        if (window.gameState) {
            const stats = gameState.gameStats.weightSorting;
            document.getElementById('weightSortingHighScore').textContent = stats.highScore;
            document.getElementById('weightSortingPerfectRounds').textContent = stats.perfectRounds;
        }
    }

    resetGame() {
        if (this.conveyorBelt) {
            this.conveyorBelt.innerHTML = '';
        }
        if (this.timer) clearInterval(this.timer);
        if (this.packageGenerationTimer) clearInterval(this.packageGenerationTimer);

        this.score = 0;
        this.timeLeft = 60;
        this.streak = 0;
        this.multiplier = 1;
        this.mistakesMade = 0;
        this.totalPackagesSorted = 0;
        this.zoneCounts = {
            individual: 0,
            team: 0,
            mechanical: 0
        };
        this.packageItems = [];
        this.isPlaying = false;

        this.updateDisplay();
    }

    startGame() {
        this.resetGame();
        this.isPlaying = true;
        this.timeLeft = 60;

        const instructionsPanel = document.querySelector('.game-instructions-panel');
        const gameContent = document.querySelector('.game-content');

        if (instructionsPanel) instructionsPanel.style.display = 'none';
        if (gameContent) gameContent.style.display = 'block';

        this.startPackageGeneration();
        this.startTimer();
        this.updateDisplay();
    }

    startPackageGeneration() {
        this.generatePackage();
        this.packageGenerationTimer = setInterval(() => {
            if (this.isPlaying && this.packageItems.length < 5) {
                this.generatePackage();
            }
        }, this.packageInterval);
    }
    generatePackage() {
        if (!this.conveyorBelt || !this.isPlaying) return;

        const weight = this.generateWeight();
        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        packageElement.dataset.weight = weight;
        packageElement.id = 'package-' + Date.now();

        const weightDisplay = document.createElement('span');
        weightDisplay.className = 'weight-display';
        weightDisplay.textContent = `${weight} lbs`;
        packageElement.appendChild(weightDisplay);

        packageElement.style.animationDuration = `${this.packageSpeed}s`;

        // Replace drag events with click event
        packageElement.addEventListener('click', (e) => this.handlePackageClick(e));
        packageElement.addEventListener('animationend', () => {
            if (packageElement.parentNode === this.conveyorBelt) {
                this.handleMissedPackage(packageElement);
            }
        });

        this.conveyorBelt.appendChild(packageElement);
        this.packageItems.push(packageElement);
    }


    generateWeight() {
        const ranges = [
            {
                weight: this.weightRanges.individual,
                probability: 0.5
            },
            {
                weight: this.weightRanges.team,
                probability: 0.3
            },
            {
                weight: this.weightRanges.mechanical,
                probability: 0.2
            }
        ];

        const rand = Math.random();
        let range;

        if (rand < ranges[0].probability) {
            range = ranges[0].weight;
        } else if (rand < ranges[0].probability + ranges[1].probability) {
            range = ranges[1].weight;
        } else {
            range = ranges[2].weight;
        }

        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
    handlePackageClick(e) {
        const packageElement = e.currentTarget;

        // Remove selection from other packages
        this.packageItems.forEach(item => item.classList.remove('selected'));

        // Toggle selection on clicked package
        packageElement.classList.add('selected');
        packageElement.style.animationPlayState = 'paused';
    }

    // Add new method to handle zone clicks
        handleZoneClick(e) {
        const zone = e.currentTarget;
        const selectedPackage = this.conveyorBelt.querySelector('.package.selected');

        if (!selectedPackage) return;

        const weight = parseInt(selectedPackage.dataset.weight);
        const isCorrect = this.checkCorrectZone(weight, zone.dataset.type);

        if (isCorrect) {
            this.packageItems = this.packageItems.filter(item => item !== selectedPackage);
            this.handleCorrectSort(zone, selectedPackage);
        } else {
            this.handleIncorrectSort();
            selectedPackage.style.animationPlayState = 'running';
            selectedPackage.classList.remove('selected');
        }
    }

    handleMissedPackage(packageElement) {
        this.handleIncorrectSort();
        packageElement.remove();
        this.packageItems = this.packageItems.filter(item => item !== packageElement);
    }
    handleCorrectSort(zone, packageElement) {
        const points = Math.round(this.baseScore * this.multiplier);

        this.score += points;
        this.streak++;
        this.multiplier = Math.min(8, 1 + Math.floor(this.streak / 2));
        this.zoneCounts[zone.dataset.type]++;
        this.totalPackagesSorted++;

        if (packageElement && packageElement.parentNode) {
            packageElement.remove();
        }

        document.getElementById('scoreDisplay').textContent = this.score;
        this.updateDisplay();
        this.showFeedback(true, `+${points} (x${this.multiplier})`);
    }

    checkCorrectZone(weight, zoneType) {
        switch(zoneType) {
            case 'individual':
                return weight <= this.weightRanges.individual.max;
            case 'team':
                return weight > this.weightRanges.individual.max && weight <= this.weightRanges.team.max;
            case 'mechanical':
                return weight > this.weightRanges.team.max;
            default:
                return false;
        }
    }

    handleIncorrectSort() {
        this.score = Math.max(0, this.score - this.penaltyScore);
        this.streak = 0;
        this.multiplier = 1;
        this.mistakesMade++;

        document.getElementById('scoreDisplay').textContent = this.score;
        this.updateDisplay();
        this.showFeedback(false, `-${this.penaltyScore}`);

        if (this.mistakesMade >= this.mistakesAllowed) {
            this.endGame();
        }
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            if (!this.isPlaying) return;

            this.timeLeft -= 0.1;

            const timerDisplay = document.getElementById('timeDisplay');
            if (timerDisplay) {
                timerDisplay.textContent = Math.ceil(this.timeLeft);
            }

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 100);
    }

    showFeedback(isSuccess, message) {
        const feedback = document.createElement('div');
        feedback.className = `game-feedback ${isSuccess ? 'success' : 'error'}`;
        feedback.textContent = message;

        const scoreDisplay = document.getElementById('weightSortingScoreDisplay');
        if (scoreDisplay) {
            const rect = scoreDisplay.getBoundingClientRect();
            feedback.style.top = `${rect.bottom + 10}px`;
            feedback.style.left = `${rect.left}px`;
        }

        this.gameContainer.appendChild(feedback);

        requestAnimationFrame(() => {
            feedback.classList.add('show');
            setTimeout(() => {
                feedback.classList.remove('show');
                setTimeout(() => feedback.remove(), 300);
            }, 700);
        });
    }

    updateDisplay() {
        const displays = {
            'weightSortingTimerDisplay': Math.ceil(this.timeLeft),
            'streakCount': this.streak,
            'multiplier': `${this.multiplier}x`
        };

        Object.entries(displays).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        Object.entries(this.zoneCounts).forEach(([zone, count]) => {
            const countElement = document.getElementById(`${zone}Count`);
            if (countElement) countElement.textContent = count;
        });
    }
   async endGame(completed = false) {
        this.isPlaying = false;
        clearInterval(this.timer);
        clearInterval(this.packageGenerationTimer);

        // Calculate final score with any bonuses
        if (completed && this.mistakesMade === 0) {
            this.score += 100; // Perfect round bonus
        }


       await gameDB.saveScore('weightSorting', this.score);

        // Update game state if available
        if (window.gameState) {
            if (!window.gameState.gameStats) {
                window.gameState.gameStats = {};
            }
            if (!window.gameState.gameStats.weightSorting) {
                window.gameState.gameStats.weightSorting = {};
            }

            const stats = window.gameState.gameStats.weightSorting;
            stats.lastScore = this.score;
            stats.highScore = Math.max(this.score, stats.highScore || 0);
            stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
            stats.perfectRounds = (stats.perfectRounds || 0) +
                (this.mistakesMade === 0 ? 1 : 0);

            if (!window.gameState.player) {
                window.gameState.player = {};
            }
            if (!Array.isArray(window.gameState.player.completedSections)) {
                window.gameState.player.completedSections = [];
            }
            if (completed && !window.gameState.player.completedSections.includes('weightSortingGame')) {
                window.gameState.player.completedSections.push('weightSortingGame');
            }

            if (typeof saveGameState === 'function') {
                saveGameState();
            }
        }

        this.showCompletionMessage(completed);
    }

    showCompletionMessage() {
        const messageEl = document.createElement('div');
        messageEl.className = 'completion-message';

        messageEl.innerHTML = `
        <div class="message-content success">
            <div class="message-header">
                <i class="fas fa-trophy"></i>
                <h3>Game Complete!</h3>
            </div>
            <div class="score-breakdown">
                <div class="score-item">
                    <span class="label">Packages Sorted:</span>
                    <span class="value">${this.totalPackagesSorted}</span>
                </div>
                <div class="score-item">
                    <span class="label">Highest Streak:</span>
                    <span class="value">${this.streak}x</span>
                </div>
                <div class="score-item">
                    <span class="label">Mistakes:</span>
                    <span class="value">${this.mistakesMade}</span>
                </div>
                ${this.mistakesMade === 0 ? `
                    <div class="score-item">
                        <span class="label">Perfect Round!</span>
                        <span class="value">+100</span>
                    </div>
                ` : ''}
                <div class="score-item total">
                    <span class="label">Final Score:</span>
                    <span class="value">${this.score}</span>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="continue-button button-primary" onclick="completeGame('weightSortingGame')">
                    <i class="fas fa-arrow-right"></i> Continue
                </button>
                <button class="replay-button button-secondary" onclick="window.weightSortingGame.restart()">
                    <i class="fas fa-redo"></i> Play Again
                </button>
            </div>
        </div>
    `;

        this.gameContainer.appendChild(messageEl);
        requestAnimationFrame(() => messageEl.classList.add('show'));

        // Update stats
        if (window.gameState) {
            const stats = gameState.gameStats.weightSorting;
            stats.highScore = Math.max(this.score, stats.highScore);
            stats.gamesPlayed++;
            stats.lastScore = this.score;
            if (this.mistakesMade === 0) {
                stats.perfectRounds++;
            }
            saveGameState();
        }
    }

    restart() {
        const messageEl = this.gameContainer.querySelector('.completion-message');
        if (messageEl) messageEl.remove();
        this.startGame();
    }

    setupEventListeners() {
        // Replace drag-and-drop listeners with click listeners
        const zones = document.querySelectorAll('.zone');
        zones.forEach(zone => {
            zone.addEventListener('click', (e) => this.handleZoneClick(e));
        });
    }
}

// Initialize game and export to window
const weightSortingGame = new WeightSortingGame();
window.weightSortingGame = weightSortingGame;

// Function to start the game from the instruction panel
function startWeightSortingGame() {
    weightSortingGame.startGame();
}

// Initialize when the game section is shown
document.addEventListener('DOMContentLoaded', () => {
    weightSortingGame.initialize();
});

console.log('Weight Sorting Game script loaded');
