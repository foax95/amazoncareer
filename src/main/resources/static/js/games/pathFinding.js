/** PACE Navigator Game Class */
class PathFindingGame {
    constructor() {
        // Game state
        this.state = {
            isPlaying: false,
            timeLeft: 60,
            score: 0,
            collectedItems: 0,
            playerPosition: { x: 0, y: 0 }
        };

        // PACE Items to collect (matching actual PACE checklist)
        this.paceItems = [
            {
                id: 'laptop',
                icon: 'fa-laptop',
                name: 'PACE Terminal',
                hint: 'Check hiring.amazon.com',
                collected: false
            },
            {
                id: 'shoes',
                icon: 'fa-shoe-prints',
                name: 'Safety Shoes',
                hint: '$110 Zappos credit',
                collected: false
            },
            {
                id: 'documents',
                icon: 'fa-file-signature',
                name: 'Paperwork',
                hint: 'Complete pre-hire forms',
                collected: false
            },
            {
                id: 'id',
                icon: 'fa-id-card',
                name: 'Photo ID',
                hint: 'Required for Day 1',
                collected: false
            },
            {
                id: 'uniform',
                icon: 'fa-tshirt',
                name: 'Dress Code',
                hint: 'Comfortable & safe attire',
                collected: false
            }
        ];

        // Game configuration
        this.gridSize = { width: 5, height: 5 };
        this.timer = null;
        this.gameContainer = null;

        // Bind methods to ensure proper 'this' context
        this.startGame = this.startGame.bind(this);
        this.movePlayer = this.movePlayer.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    initialize() {
        console.log('Initializing PACE Navigator Game');
        this.gameContainer = document.getElementById('pathFindingGame');

        if (!this.gameContainer) {
            console.error('Game container not found');
            return;
        }

        // Reset game state
        this.state = {
            isPlaying: false,
            timeLeft: 60,
            score: 0,
            collectedItems: 0,
            playerPosition: { x: 0, y: 0 }
        };

        // Clear and prepare game area
        const gameContent = this.gameContainer.querySelector('.game-content');
        if (gameContent) {
            gameContent.innerHTML = '<div class="game-area"></div>';
        }

        this.setupEventListeners();
        this.updateUI();
        console.log('PACE Navigator Game initialized');
    }

    setupGameArea() {
        console.log('Setting up game area');
        const gameArea = this.gameContainer.querySelector('.game-area');
        if (!gameArea) return;

        gameArea.innerHTML = ''; // Clear existing content

        // Create grid cells
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                gameArea.appendChild(cell);
            }
        }

        // Place PACE items randomly
        this.paceItems.forEach(item => {
            const position = this.getRandomEmptyPosition();
            const cell = gameArea.children[position.y * this.gridSize.width + position.x];
            cell.innerHTML = `
                <div class="pace-item" data-id="${item.id}">
                    <i class="fas ${item.icon}"></i>
                </div>
            `;
            cell.dataset.item = item.id;
        });

        // Add player
        const player = document.createElement('div');
        player.id = 'player';
        player.className = 'player';
        player.innerHTML = '<i class="fas fa-user"></i>';
        gameArea.appendChild(player);

        // Position player at start
        this.updatePlayerPosition(this.state.playerPosition);
    }

    getRandomEmptyPosition() {
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * this.gridSize.width),
                y: Math.floor(Math.random() * this.gridSize.height)
            };
        } while (
            (position.x === 0 && position.y === 0) || // Starting position
            this.isPositionOccupied(position)
            );
        return position;
    }

    isPositionOccupied(position) {
        const cell = this.gameContainer.querySelector(
            `.game-cell[data-x="${position.x}"][data-y="${position.y}"]`
        );
        return cell && cell.dataset.item;
    }

    startGame() {
        console.log('Starting game');
        this.state.isPlaying = true;
        this.state.timeLeft = 60;
        this.state.score = 0;
        this.state.collectedItems = 0;
        this.state.playerPosition = { x: 0, y: 0 };

        // Reset items
        this.paceItems.forEach(item => item.collected = false);

        // Update UI
        const instructionsPanel = this.gameContainer.querySelector('.game-instructions-panel');
        const gameContent = this.gameContainer.querySelector('.game-content');

        if (instructionsPanel) instructionsPanel.style.display = 'none';
        if (gameContent) gameContent.style.display = 'block';

        this.setupGameArea();
        this.startTimer();
        this.updateUI();
    }

    movePlayer(direction) {
        if (!this.state.isPlaying) return;

        const newPosition = { ...this.state.playerPosition };

        switch(direction) {
            case 'up':
                if (newPosition.y > 0) newPosition.y--;
                break;
            case 'down':
                if (newPosition.y < this.gridSize.height - 1) newPosition.y++;
                break;
            case 'left':
                if (newPosition.x > 0) newPosition.x--;
                break;
            case 'right':
                if (newPosition.x < this.gridSize.width - 1) newPosition.x++;
                break;
        }

        this.updatePlayerPosition(newPosition);
        this.checkForItem(newPosition);
    }

    updatePlayerPosition(newPosition) {
        const player = document.getElementById('player');
        if (!player) return;

        const cell = this.gameContainer.querySelector(
            `.game-cell[data-x="${newPosition.x}"][data-y="${newPosition.y}"]`
        );
        if (!cell) return;

        const cellRect = cell.getBoundingClientRect();
        const gameAreaRect = cell.parentElement.getBoundingClientRect();

        player.style.transform = `translate(
            ${newPosition.x * cellRect.width}px,
            ${newPosition.y * cellRect.height}px
        )`;

        this.state.playerPosition = newPosition;
    }

    checkForItem(position) {
        const cell = this.gameContainer.querySelector(
            `.game-cell[data-x="${position.x}"][data-y="${position.y}"]`
        );
        const itemId = cell?.dataset.item;

        if (itemId) {
            const item = this.paceItems.find(i => i.id === itemId);
            if (item && !item.collected) {
                this.collectItem(item, cell);
            }
        }
    }

    collectItem(item, cell) {
        item.collected = true;
        this.state.collectedItems++;
        this.state.score += Math.max(50, this.state.timeLeft);

        const paceItem = cell.querySelector('.pace-item');
        if (paceItem) {
            paceItem.classList.add('collected');
            this.showCollectionEffect(item);
        }

        if (this.state.collectedItems === this.paceItems.length) {
            this.completeGame();
        }
    }

    showCollectionEffect(item) {
        const effect = document.createElement('div');
        effect.className = 'collection-effect';
        effect.innerHTML = `
            <i class="fas ${item.icon}"></i>
            <span>${item.name}</span>
            <p>${item.hint}</p>
        `;

        this.gameContainer.appendChild(effect);
        setTimeout(() => effect.remove(), 1500);
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            if (this.state.timeLeft > 0) {
                this.state.timeLeft--;
                this.updateUI();

                if (this.state.timeLeft === 0) {
                    this.endGame();
                }
            }
        }, 1000);
    }

    updateUI() {
        const elements = {
            'pathFindingTimer': this.state.timeLeft,
            'pathFindingSteps': this.state.collectedItems,
            'pathFindingScore': this.state.score
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    completeGame() {
        this.state.score += this.state.timeLeft * 10; // Time bonus
        this.endGame(true);
    }

    endGame(completed = false) {
        this.state.isPlaying = false;
        clearInterval(this.timer);

        if (window.gameState) {
            const stats = gameState.gameStats.pathFinding;
            stats.pathsCompleted++;
            if (!stats.bestTime || this.state.timeLeft > stats.bestTime) {
                stats.bestTime = this.state.timeLeft;
            }
            saveGameState();
        }

        this.showCompletionMessage(completed);

        setTimeout(() => {
            completeGame('pathFindingGame');
        }, 3000);
    }

    showCompletionMessage(completed) {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <div class="message-content">
                <h3>${completed ? 'PACE Tasks Complete!' : 'Time\'s Up!'}</h3>
                <div class="score-breakdown">
                    <p>Items Collected: ${this.state.collectedItems}/5</p>
                    <p>Time Bonus: ${this.state.timeLeft * 10}</p>
                    <p>Final Score: ${this.state.score}</p>
                </div>
            </div>
        `;

        this.gameContainer.appendChild(message);
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', this.handleKeydown);

        // Touch controls
        const touchControls = this.gameContainer.querySelectorAll('.control-button');
        touchControls.forEach(button => {
            button.addEventListener('click', () => {
                if (this.state.isPlaying) {
                    this.movePlayer(button.dataset.direction);
                }
            });
        });
    }

    handleKeydown(e) {
        if (!this.state.isPlaying) return;

        switch(e.key) {
            case 'ArrowUp':
            case 'w':
                this.movePlayer('up');
                break;
            case 'ArrowDown':
            case 's':
                this.movePlayer('down');
                break;
            case 'ArrowLeft':
            case 'a':
                this.movePlayer('left');
                break;
            case 'ArrowRight':
            case 'd':
                this.movePlayer('right');
                break;
        }
    }
}

// Initialize game and export to window
const pathFindingGame = new PathFindingGame();
window.pathFindingGame = pathFindingGame;

// Initialize when the game section is shown
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - PACE Navigator');
    if (document.getElementById('pathFindingGame')) {
        window.pathFindingGame.initialize();
    }
});
