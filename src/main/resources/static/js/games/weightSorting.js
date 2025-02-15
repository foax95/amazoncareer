// weightSorting.js

class WeightSortingGame {
    constructor() {
        // Game state
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = false;
        this.packageItems = [];
        this.timer = null;
        this.packageGenerationTimer = null;
        this.level = 1;
        this.streak = 0;
        this.multiplier = 1;
        this.levelProgress = 0;
        this.difficulty = 'normal';
        this.gameSpeed = 'normal';
        this.mistakesMade = 0;
        this.totalPackagesSorted = 0;
        this.perfectRounds = 0;

        // DOM Elements
        this.gameContainer = null;
        this.conveyorBelt = null;
        this.progressBar = null;

        // Game settings
        this.difficultySettings = {
            normal: {
                timeLimit: 60,
                baseScore: 10,
                penaltyScore: 5,
                packageInterval: 3000,
                packageSpeed: 8,    // seconds to cross belt
                mistakesAllowed: 3
            },
            hard: {
                timeLimit: 45,
                baseScore: 15,
                penaltyScore: 10,
                packageInterval: 2000,
                packageSpeed: 6,
                mistakesAllowed: 2
            },
            expert: {
                timeLimit: 30,
                baseScore: 20,
                penaltyScore: 15,
                packageInterval: 1500,
                packageSpeed: 4,
                mistakesAllowed: 1
            }
        };

        this.speedSettings = {
            slow: 1,
            normal: 1.5,
            fast: 2
        };

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
        this.progressBar = document.getElementById('weightSortingProgress');

        if (!this.gameContainer || !this.conveyorBelt) {
            console.error('Required game elements not found');
            return;
        }

        // Show instructions, hide game content
        const gameContent = document.querySelector('.game-content');
        const instructionsPanel = document.querySelector('.game-instructions-panel');

        if (gameContent) gameContent.style.display = 'none';
        if (instructionsPanel) instructionsPanel.style.display = 'block';

        this.resetGame();
        this.setupDifficultyControls();
        this.setupSpeedControls();
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
        // Clear any existing packages and timers
        if (this.conveyorBelt) {
            this.conveyorBelt.innerHTML = '';
        }
        if (this.timer) clearInterval(this.timer);
        if (this.packageGenerationTimer) clearInterval(this.packageGenerationTimer);

        // Reset game state
        this.score = 0;
        this.timeLeft = this.difficultySettings[this.difficulty].timeLimit;
        this.level = 1;
        this.streak = 0;
        this.multiplier = 1;
        this.levelProgress = 0;
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
        // Reset and start new game
        this.resetGame();
        this.isPlaying = true;

        // Hide instructions panel and show game content
        const instructionsPanel = document.querySelector('.game-instructions-panel');
        const gameContent = document.querySelector('.game-content');

        if (instructionsPanel) instructionsPanel.style.display = 'none';
        if (gameContent) gameContent.style.display = 'block';

        // Start package generation and timer
        this.startPackageGeneration();
        this.startTimer();
        this.updateDisplay();
    }

    startPackageGeneration() {
        // Initial package
        this.generatePackage();

        // Set up continuous package generation
        const interval = this.difficultySettings[this.difficulty].packageInterval;
        this.packageGenerationTimer = setInterval(() => {
            if (this.isPlaying && this.packageItems.length < 5) {
                this.generatePackage();
            }
        }, interval / this.speedSettings[this.gameSpeed]);
    }
    generatePackage() {
        if (!this.conveyorBelt || !this.isPlaying) return;

        const weight = this.generateWeight();
        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        packageElement.draggable = true;
        packageElement.dataset.weight = weight;
        packageElement.id = 'package-' + Date.now(); // Add unique ID

        // Create weight display
        const weightDisplay = document.createElement('span');
        weightDisplay.className = 'weight-display';
        weightDisplay.textContent = `${weight} lbs`;
        packageElement.appendChild(weightDisplay);

        // Set animation duration based on difficulty and speed
        const baseDuration = this.difficultySettings[this.difficulty].packageSpeed;
        const speedMultiplier = this.speedSettings[this.gameSpeed];
        const duration = baseDuration / speedMultiplier;

        packageElement.style.animationDuration = `${duration}s`;

        // Add event listeners
        packageElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
        packageElement.addEventListener('dragend', (e) => this.handleDragEnd(e));

        // Add animation end listener
        packageElement.addEventListener('animationend', () => {
            if (packageElement.parentNode === this.conveyorBelt) {
                this.handleMissedPackage(packageElement);
            }
        });

        this.conveyorBelt.appendChild(packageElement);
        this.packageItems.push(packageElement);
    }

    generateWeight() {
        const levelModifier = Math.min(0.1 * (this.level - 1), 0.5);
        const ranges = [
            {
                weight: this.weightRanges.individual,
                probability: 0.5 - levelModifier
            },
            {
                weight: this.weightRanges.team,
                probability: 0.3
            },
            {
                weight: this.weightRanges.mechanical,
                probability: 0.2 + levelModifier
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
        // Store the dragged element ID or create one if it doesn't exist
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
            // Remove from packageItems array
            this.packageItems = this.packageItems.filter(item => item !== packageElement);
            // Handle correct sort will remove the element
            this.handleCorrectSort(zone, packageElement);
        } else {
            this.handleIncorrectSort();
            // Resume animation if incorrect
            packageElement.style.animationPlayState = 'running';
        }
    }

    handleCorrectSort(zone, packageElement) {
        const baseScore = this.difficultySettings[this.difficulty].baseScore;
        const speedMultiplier = this.speedSettings[this.gameSpeed];
        const points = Math.round(baseScore * this.multiplier * this.level * speedMultiplier);

        // Update game state
        this.score += points;
        this.streak++;
        this.multiplier = Math.min(8, 1 + Math.floor(this.streak / 2));
        this.zoneCounts[zone.dataset.type]++;
        this.levelProgress++;
        this.totalPackagesSorted++;

        // Remove the package element
        if (packageElement && packageElement.parentNode) {
            packageElement.remove();
        }

        // Update global score
        if (window.gameState) {
            gameState.player.score += points;
            saveGameState();
            document.getElementById('scoreDisplay').textContent = gameState.player.score;
        }

        if (this.levelProgress >= 8) {
            this.levelUp();
        }

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
        const penalty = this.difficultySettings[this.difficulty].penaltyScore;
        this.score = Math.max(0, this.score - penalty);
        this.streak = 0;
        this.multiplier = 1;
        this.mistakesMade++;

        // Update global score
        if (window.gameState) {
            gameState.player.score = Math.max(0, gameState.player.score - penalty);
            saveGameState();
            document.getElementById('scoreDisplay').textContent = gameState.player.score;
        }

        this.updateDisplay();
        this.showFeedback(false, `-${penalty}`);

        // Check for game over due to mistakes
        if (this.mistakesMade >= this.difficultySettings[this.difficulty].mistakesAllowed) {
            this.endGame();
        }
    }
    levelUp() {
        this.level++;
        // Reduced time bonus for higher difficulty
        const timeBonus = Math.max(10, 30 - (this.level * 2));
        this.timeLeft += timeBonus;
        this.levelProgress = 0;

        // Increase difficulty
        this.adjustDifficulty();

        this.updateDisplay();
        this.showFeedback(true, `Level ${this.level}! +${timeBonus}s`);

        // Play level up animation
        this.playLevelUpAnimation();
    }

    adjustDifficulty() {
        // Decrease package interval with each level
        Object.keys(this.difficultySettings).forEach(difficulty => {
            this.difficultySettings[difficulty].packageInterval *= 0.95;
            this.difficultySettings[difficulty].packageSpeed *= 0.95;
        });

        // Restart package generation with new timing
        if (this.packageGenerationTimer) {
            clearInterval(this.packageGenerationTimer);
            this.startPackageGeneration();
        }
    }

    playLevelUpAnimation() {
        const levelDisplay = document.getElementById('weightSortingLevelDisplay');
        if (levelDisplay) {
            levelDisplay.classList.add('level-up-animation');
            setTimeout(() => levelDisplay.classList.remove('level-up-animation'), 1000);
        }
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            if (!this.isPlaying) return;

            // Decrease time
            this.timeLeft -= 0.1;

            // Add time pressure at higher levels
            if (this.level > 5) {
                this.timeLeft -= 0.05;
            }

            // Update display
            const timerDisplay = document.getElementById('weightSortingTimerDisplay');
            if (timerDisplay) {
                timerDisplay.textContent = Math.ceil(this.timeLeft);
            }

            // Check for game end
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 100); // Update every 0.1 seconds for smoother countdown
    }

    showFeedback(isSuccess, message) {
        const feedback = document.createElement('div');
        feedback.className = `game-feedback ${isSuccess ? 'success' : 'error'}`;
        feedback.textContent = message;

        // Position feedback near the score display
        const scoreDisplay = document.getElementById('weightSortingScoreDisplay');
        if (scoreDisplay) {
            const rect = scoreDisplay.getBoundingClientRect();
            feedback.style.top = `${rect.bottom + 10}px`;
            feedback.style.left = `${rect.left}px`;
        }

        this.gameContainer.appendChild(feedback);

        // Animate and remove
        requestAnimationFrame(() => {
            feedback.classList.add('show');
            setTimeout(() => {
                feedback.classList.remove('show');
                setTimeout(() => feedback.remove(), 300);
            }, 700);
        });
    }

    updateDisplay() {
        // Update score and game stats
        const displays = {
            'weightSortingScoreDisplay': this.score,
            'weightSortingTimerDisplay': Math.ceil(this.timeLeft),
            'weightSortingLevelDisplay': this.level,
            'streakCount': this.streak,
            'multiplier': `${this.multiplier}x`,
            'levelProgress': `${this.levelProgress}/8`
        };

        Object.entries(displays).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Update zone counts
        Object.entries(this.zoneCounts).forEach(([zone, count]) => {
            const countElement = document.getElementById(`${zone}Count`);
            if (countElement) countElement.textContent = count;
        });

        // Update progress bar
        if (this.progressBar) {
            const progress = (this.levelProgress / 8) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.timer);
        clearInterval(this.packageGenerationTimer);

        // Update high score and stats
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

        this.showGameOverModal();
    }

    showGameOverModal() {
        const modalHTML = `
            <div class="game-over-modal">
                <h2>Game Over!</h2>
                <div class="score-breakdown">
                    <p class="final-score">Final Score: ${this.score}</p>
                    <p>Level Reached: ${this.level}</p>
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
        // Set up drop zones
        const zones = document.querySelectorAll('.zone');
        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });

        // Set up difficulty controls
        const difficultyButtons = document.querySelectorAll('[data-difficulty]');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!this.isPlaying) {
                    this.setDifficulty(button.dataset.difficulty);
                }
            });
        });

        // Set up speed controls
        const speedButtons = document.querySelectorAll('[data-speed]');
        speedButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.setGameSpeed(button.dataset.speed);
                }
            });
        });
    }

    setDifficulty(level) {
        this.difficulty = level;
        this.timeLeft = this.difficultySettings[level].timeLimit;

        // Update UI
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === level);
        });

        this.updateDisplay();
    }

    setGameSpeed(speed) {
        this.gameSpeed = speed;

        // Update UI
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.speed === speed);
        });

        // Update existing packages
        const packages = document.querySelectorAll('.package');
        packages.forEach(pkg => {
            const baseDuration = this.difficultySettings[this.difficulty].packageSpeed;
            const duration = baseDuration / this.speedSettings[speed];
            pkg.style.animationDuration = `${duration}s`;
        });

        // Restart package generation with new speed
        if (this.packageGenerationTimer) {
            clearInterval(this.packageGenerationTimer);
            this.startPackageGeneration();
        }
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
