// weightSorting.js
class WeightSortingGame {
    constructor() {
        this.score = 0;
        this.timeLeft = CONFIG.GAME_DURATION;
        this.isPlaying = false;
        this.packageItems = [];
        this.timer = null;
        this.level = 1;
        this.weightRanges = CONFIG.WEIGHT_RANGES;
    }

    initialize() {
        console.log('Initializing Weight Sorting Game'); // Debug log
        this.setupGameContainer();
        this.createPackageItems();
        this.setupEventListeners();
        this.startGame();
    }

    setupGameContainer() {
        const container = document.getElementById('weightSortingGame');
        if (!container) {
            console.error('Weight Sorting game container not found');
            return;
        }

        // Clear any existing content
        container.innerHTML = `
            <div class="game-header">
                <div class="game-stats">
                    <span class="score">Score: <span id="weightSortingScore">0</span></span>
                    <span class="timer">Time: <span id="weightSortingTimer">${CONFIG.GAME_DURATION}</span>s</span>
                    <span class="level">Level: <span id="weightSortingLevel">1</span></span>
                </div>
            </div>
            <div class="game-content">
                <div id="conveyorBelt" class="conveyor-belt"></div>
                <div class="sorting-zones">
                    <div class="zone" data-type="individual">
                        <h3>Individual Lift</h3>
                        <p>Up to 49 lbs</p>
                    </div>
                    <div class="zone" data-type="team">
                        <h3>Team Lift</h3>
                        <p>50-75 lbs</p>
                    </div>
                    <div class="zone" data-type="mechanical">
                        <h3>Mechanical Aid</h3>
                        <p>Over 75 lbs</p>
                    </div>
                </div>
            </div>
        `;
    }

    createPackageItems() {
        const conveyorBelt = document.getElementById('conveyorBelt');
        if (!conveyorBelt) return;

        conveyorBelt.innerHTML = '';
        this.packageItems = [];

        const itemCount = 5 + (this.level * 2);

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

        div.innerHTML = `
            <div class="package-weight">${weight} lbs</div>
            <i class="fas fa-box"></i>
        `;

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

    handleDragStart(e) {
        console.log('Drag started'); // Debug log
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
        e.currentTarget.classList.add('highlight');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('highlight');
    }

    handleDrop(e) {
        e.preventDefault();
        console.log('Item dropped'); // Debug log

        const zone = e.currentTarget;
        zone.classList.remove('highlight');

        const weight = parseInt(e.dataTransfer.getData('text/plain'));
        const isCorrect = this.checkCorrectZone(weight, zone.dataset.type);

        if (isCorrect) {
            this.handleCorrectSort(zone);
        } else {
            this.handleIncorrectSort();
        }

        // Check if all packages are sorted
        if (this.checkAllItemsSorted()) {
            this.levelUp();
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
        this.score += CONFIG.POINTS.CORRECT_SORT * this.level;
        const scoreDisplay = document.getElementById('weightSortingScore');
        if (scoreDisplay) {
            scoreDisplay.textContent = this.score;
        }

        // Visual feedback
        this.showFeedback(true, 'Correct! Great job!');

        // Remove package from conveyor
        const packageItem = document.querySelector('.dragging');
        if (packageItem) {
            packageItem.remove();
            this.packageItems = this.packageItems.filter(item => item !== packageItem);
        }
    }

    handleIncorrectSort() {
        this.showFeedback(false, 'Try again! Check the weight limits.');
    }

    checkAllItemsSorted() {
        return this.packageItems.length === 0;
    }

    showFeedback(isCorrect, message) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback ${isCorrect ? 'success' : 'error'}`;
        feedbackDiv.textContent = message;

        const container = document.getElementById('weightSortingGame');
        if (container) {
            container.appendChild(feedbackDiv);
            setTimeout(() => feedbackDiv.remove(), 2000);
        }
    }

    startGame() {
        this.isPlaying = true;
        this.startTimer();
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            this.timeLeft--;
            const timerDisplay = document.getElementById('weightSortingTimer');
            if (timerDisplay) {
                timerDisplay.textContent = this.timeLeft;
            }

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    levelUp() {
        this.level++;
        this.timeLeft += 30; // Bonus time

        const levelDisplay = document.getElementById('weightSortingLevel');
        if (levelDisplay) {
            levelDisplay.textContent = this.level;
        }

        this.createPackageItems();
        this.showFeedback(true, `Level ${this.level}! +30 seconds!`);
    }

    endGame() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.isPlaying = false;

        // Update high score if needed
        if (this.score > gameState.state.gameStats.weightSorting.highScore) {
            gameState.state.gameStats.weightSorting.highScore = this.score;
            gameState.saveState();
        }

        this.showGameOverModal();
    }

    showGameOverModal() {
        const modalHTML = `
            <div class="game-over-modal">
                <h2>Game Over!</h2>
                <p>Final Score: ${this.score}</p>
                <p>Level Reached: ${this.level}</p>
                <div class="modal-buttons">
                    <button class="button-primary" onclick="weightSortingGame.restart()">Play Again</button>
                    <button class="button-secondary" onclick="returnToGamesMenu()">Back to Games</button>
                </div>
            </div>
        `;

        const container = document.getElementById('weightSortingGame');
        if (container) {
            container.innerHTML += modalHTML;
        }
    }

    restart() {
        this.score = 0;
        this.timeLeft = CONFIG.GAME_DURATION;
        this.level = 1;
        this.packageItems = [];
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.initialize();
    }
}

// Initialize game and export to window
const weightSortingGame = new WeightSortingGame();
window.weightSortingGame = weightSortingGame;

// Debug log
console.log('Weight Sorting Game script loaded');
