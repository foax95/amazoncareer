class WeightSortingGame {
    constructor() {
        this.score = 0;
        this.timeLeft = CONFIG.GAME_DURATION;
        this.isPlaying = false;
        this.packageItems = [];
        this.timer = null;
        this.level = 1;
        this.streak = 0;
        this.multiplier = 1;
        this.levelProgress = 0;
        this.difficulty = 'normal';
        this.gameSpeed = 'normal';

        this.difficultySettings = {
            normal: {
                timeLimit: 60,
                baseScore: 10,
                penaltyScore: 5,
                packageInterval: 3000
            },
            hard: {
                timeLimit: 45,
                baseScore: 15,
                penaltyScore: 10,
                packageInterval: 2000
            },
            expert: {
                timeLimit: 30,
                baseScore: 20,
                penaltyScore: 15,
                packageInterval: 1500
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

        this.gameContainer = document.getElementById('weightSortingGame');
    }

    initialize() {
        console.log('Initializing Weight Sorting Game');
        this.gameContainer = document.getElementById('weightSortingGame');
        if (!this.gameContainer) {
            console.error('Weight Sorting game container not found');
            return;
        }

        this.resetGame();
        this.setupDifficultyControls();
        this.setupSpeedControls();
        this.updateDisplay();

        // Show instructions panel, hide game content
        const gameContent = document.querySelector('.game-content');
        const instructionsPanel = document.querySelector('.game-instructions-panel');

        if (gameContent) gameContent.style.display = 'none';
        if (instructionsPanel) instructionsPanel.style.display = 'block';

        this.setupEventListeners();
    }

    resetGame() {
        this.score = 0;
        this.timeLeft = this.difficultySettings[this.difficulty].timeLimit;
        this.level = 1;
        this.streak = 0;
        this.multiplier = 1;
        this.levelProgress = 0;
        this.zoneCounts = {
            individual: 0,
            team: 0,
            mechanical: 0
        };
        this.isPlaying = false;
        this.packageItems = [];
        if (this.timer) clearInterval(this.timer);
    }

    setDifficulty(level) {
        this.difficulty = level;
        this.timeLeft = this.difficultySettings[level].timeLimit;
        this.updateDisplay();
    }

    setGameSpeed(speed) {
        this.gameSpeed = speed;
        const packages = document.querySelectorAll('.package');
        packages.forEach(pkg => {
            pkg.style.transitionDuration = `${1 / this.speedSettings[speed]}s`;
        });
    }

    startGame() {
        this.resetGame();
        this.isPlaying = true;

        // Hide instructions panel and show game content
        const instructionsPanel = document.querySelector('.game-instructions-panel');
        const gameContent = document.querySelector('.game-content');

        if (instructionsPanel) instructionsPanel.style.display = 'none';
        if (gameContent) gameContent.style.display = 'block';

        this.createPackageItems();
        this.startTimer();
        this.updateDisplay();
    }

    updateDisplay() {
        const scoreDisplay = document.getElementById('weightSortingScoreDisplay');
        const timerDisplay = document.getElementById('weightSortingTimerDisplay');
        const levelDisplay = document.getElementById('weightSortingLevelDisplay');
        const streakDisplay = document.getElementById('streakDisplay');
        const multiplierDisplay = document.getElementById('multiplierDisplay');
        const progressDisplay = document.getElementById('levelProgressDisplay');

        if (scoreDisplay) scoreDisplay.textContent = this.score;
        if (timerDisplay) timerDisplay.textContent = this.timeLeft;
        if (levelDisplay) levelDisplay.textContent = this.level;
        if (streakDisplay) streakDisplay.textContent = this.streak;
        if (multiplierDisplay) multiplierDisplay.textContent = `${this.multiplier}x`;
        if (progressDisplay) progressDisplay.textContent = `${this.levelProgress}/10`;

        // Update zone counts
        Object.keys(this.zoneCounts).forEach(zone => {
            const countDisplay = document.querySelector(`[data-zone-type="${zone}"] .sorted-count`);
            if (countDisplay) {
                countDisplay.textContent = this.zoneCounts[zone];
            }
        });
    }

    createPackageItems() {
        const conveyorBelt = document.getElementById('conveyorBelt');
        if (!conveyorBelt) return;

        conveyorBelt.innerHTML = '';
        this.packageItems = [];

        const itemCount = 3 + this.level;

        for (let i = 0; i < itemCount; i++) {
            const packageItem = this.createPackageItem();
            conveyorBelt.appendChild(packageItem);
            this.packageItems.push(packageItem);
        }
    }

    createPackageItem() {
        const weight = this.generateWeight();
        const div = document.createElement('div');
        div.className = 'package';
        div.draggable = true;
        div.dataset.weight = weight;
        div.innerHTML = `${weight} lbs`;

        div.style.transitionDuration = `${1 / this.speedSettings[this.gameSpeed]}s`;

        div.addEventListener('dragstart', this.handleDragStart.bind(this));
        div.addEventListener('dragend', this.handleDragEnd.bind(this));

        return div;
    }

    generateWeight() {
        const ranges = [
            { weight: this.weightRanges.individual, probability: 0.5 },
            { weight: this.weightRanges.team, probability: 0.3 },
            { weight: this.weightRanges.mechanical, probability: 0.2 }
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

    setupEventListeners() {
        const zones = document.querySelectorAll('.zone');
        zones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver.bind(this));
            zone.addEventListener('drop', this.handleDrop.bind(this));
            zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
            zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }

    setupDifficultyControls() {
        const difficultyButtons = document.querySelectorAll('[data-difficulty]');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setDifficulty(button.dataset.difficulty);
            });
        });
    }

    setupSpeedControls() {
        const speedButtons = document.querySelectorAll('[data-speed]');
        speedButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setGameSpeed(button.dataset.speed);
            });
        });
    }

    handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.weight);
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
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

        const weight = parseInt(e.dataTransfer.getData('text/plain'));
        const isCorrect = this.checkCorrectZone(weight, zone.dataset.type);

        if (isCorrect) {
            this.handleCorrectSort(zone);
        } else {
            this.handleIncorrectSort();
        }
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

    handleCorrectSort(zone) {
        const baseScore = this.difficultySettings[this.difficulty].baseScore;
        const points = baseScore * this.multiplier * this.level;
        this.score += points;
        this.streak++;
        this.multiplier = Math.min(4, 1 + Math.floor(this.streak / 3));
        this.zoneCounts[zone.dataset.type]++;
        this.levelProgress++;

        if (this.levelProgress >= 10) {
            this.levelUp();
            this.levelProgress = 0;
        }

        this.updateDisplay();
        this.showFeedback(true, `Combo! x${this.multiplier} +${points}`);

        const packageItem = document.querySelector('.package.dragging');
        if (packageItem) {
            packageItem.remove();
            this.packageItems = this.packageItems.filter(item => item !== packageItem);
        }

        if (this.checkAllItemsSorted()) {
            this.createPackageItems();
        }
    }

    handleIncorrectSort() {
        const penalty = this.difficultySettings[this.difficulty].penaltyScore;
        this.score = Math.max(0, this.score - penalty);
        this.streak = 0;
        this.multiplier = 1;
        this.updateDisplay();
        this.showFeedback(false, `Wrong zone! -${penalty} points`);
    }

    checkAllItemsSorted() {
        return this.packageItems.length === 0;
    }

    showFeedback(isCorrect, message) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback ${isCorrect ? 'success' : 'error'}`;
        feedbackDiv.textContent = message;

        if (this.gameContainer) {
            this.gameContainer.appendChild(feedbackDiv);
            setTimeout(() => feedbackDiv.remove(), 2000);
        }
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    levelUp() {
        this.level++;
        this.timeLeft += 30; // Bonus time
        this.updateDisplay();
        this.createPackageItems();
        this.showFeedback(true, `Level ${this.level}! +30 seconds!`);
    }

    endGame() {
        clearInterval(this.timer);
        this.isPlaying = false;

        const currentHighScore = parseInt(localStorage.getItem('weightSortingHighScore')) || 0;
        if (this.score > currentHighScore) {
            localStorage.setItem('weightSortingHighScore', this.score);
        }

        this.showGameOverModal();
    }

    showGameOverModal() {
        const modalHTML = `
            <div class="game-over-modal">
                <h2>Game Over!</h2>
                <p>Final Score: ${this.score}</p>
                <p>Level Reached: ${this.level}</p>
                <p>Highest Streak: ${this.streak}</p>
                <div class="modal-buttons">
                    <button class="button-primary" onclick="weightSortingGame.restart()">Play Again</button>
                    <button class="button-secondary" onclick="returnToGamesMenu()">Back to Games</button>
                </div>
            </div>
        `;

        const existingModal = this.gameContainer.querySelector('.game-over-modal');
        if (existingModal) {
            existingModal.remove();
        }
        this.gameContainer.insertAdjacentHTML('beforeend', modalHTML);
    }

    restart() {
        const modal = this.gameContainer.querySelector('.game-over-modal');
        if (modal) {
            modal.remove();
        }
        this.startGame();
    }
}

// Initialize game and export to window
const weightSortingGame = new WeightSortingGame();
window.weightSortingGame = weightSortingGame;

// Function to start the game from the instruction panel
function startWeightSortingGame() {
    weightSortingGame.startGame();
}

// Function to return to games menu
function returnToGamesMenu() {
    if (weightSortingGame.timer) {
        clearInterval(weightSortingGame.timer);
    }
    weightSortingGame.isPlaying = false;
    document.getElementById('weightSortingGame').style.display = 'none';
    document.getElementById('gamesMenu').style.display = 'block';
}

// Initialize when the game section is shown
document.addEventListener('DOMContentLoaded', () => {
    weightSortingGame.initialize();
});

console.log('Weight Sorting Game script loaded');
