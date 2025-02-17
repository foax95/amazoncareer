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
        packageElement.draggable = true;
        packageElement.dataset.weight = weight;
        packageElement.id = 'package-' + Date.now();

        const weightDisplay = document.createElement('span');
        weightDisplay.className = 'weight-display';
        weightDisplay.textContent = `${weight} lbs`;
        packageElement.appendChild(weightDisplay);

        packageElement.style.animationDuration = `${this.packageSpeed}s`;

        packageElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
        packageElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
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

    handleMissedPackage(packageElement) {
        this.handleIncorrectSort();
        packageElement.remove();
        this.packageItems = this.packageItems.filter(item => item !== packageElement);
    }

    handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.weight);
        if (!e.target.id) {
            e.target.id = 'package-' + Date.now();
        }
        e.dataTransfer.setData('packageId', e.target.id);
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.animationPlayState = 'paused';
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        if (e.target.parentNode === this.conveyorBelt) {
            e.target.style.animationPlayState = 'running';
        }
        document.querySelectorAll('.drag-over').forEach(element => {
            element.classList.remove('drag-over');
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        const zone = e.currentTarget;
        zone.classList.remove('drag-over');

        const packageId = e.dataTransfer.getData('packageId');
        const packageElement = document.getElementById(packageId);

        if (!packageElement) return;

        const weight = parseInt(packageElement.dataset.weight);
        const isCorrect = this.checkCorrectZone(weight, zone.dataset.type);

        if (isCorrect) {
            this.packageItems = this.packageItems.filter(item => item !== packageElement);
            this.handleCorrectSort(zone, packageElement);
        } else {
            this.handleIncorrectSort();
            packageElement.style.animationPlayState = 'running';
        }
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

            const timerDisplay = document.getElementById('weightSortingTimerDisplay');
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
    endGame() {
        this.isPlaying = false;
        clearInterval(this.timer);
        clearInterval(this.packageGenerationTimer);

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

        // Show game over modal briefly
        this.showGameOverModal();

        // Automatically transition to next game after delay
        setTimeout(() => {
            completeGame('weightSortingGame');
        }, 3000); // Show results for 3 seconds before transitioning
    }


    showGameOverModal() {
        const modalHTML = `
            <div class="game-over-modal">
                <h2>Game Over!</h2>
                <div class="score-breakdown">
                    <p class="final-score">Final Score: ${this.score}</p>
                    <p>Packages Sorted: ${this.totalPackagesSorted}</p>
                    <p>Highest Streak: ${this.streak}x</p>
                    <p>Mistakes: ${this.mistakesMade}</p>
                    ${this.mistakesMade === 0 ? '<p class="perfect-round">Perfect Round!</p>' : ''}
                </div>
                <div class="modal-buttons">
                    <button class="button-primary" onclick="weightSortingGame.restart()">
                        <i class="fas fa-redo"></i> Play Again
                    </button>
                    <button class="button-secondary" onclick="returnToGamesMenu()">
                        <i class="fas fa-times"></i> Back to Games
                    </button>
                </div>
            </div>
        `;

        const existingModal = this.gameContainer.querySelector('.game-over-modal');
        if (existingModal) existingModal.remove();

        this.gameContainer.insertAdjacentHTML('beforeend', modalHTML);
    }

    restart() {
        const modal = this.gameContainer.querySelector('.game-over-modal');
        if (modal) modal.remove();
        this.startGame();
    }

    setupEventListeners() {
        const zones = document.querySelectorAll('.zone');
        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
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
