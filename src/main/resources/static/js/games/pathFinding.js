class PathFindingGame {
    constructor() {
        // Game state with pause functionality
        this.state = {
            isPlaying: false,
            isPaused: false,
            timeLeft: 60,
            score: 0,
            collectedItems: 0,
            playerPosition: { x: 0, y: 0 },
            moves: 0,
            combo: 0,
            lastCollectTime: 0,
            modalVisible: false
        };

        // Game configuration
        this.config = {
            gridSize: { width: 5, height: 5 },
            basePoints: 100,
            comboMultiplier: 1.5,
            comboTimeWindow: 3000,
            bonusTimeThreshold: 30,
            animationDuration: 300,
            modalTransitionTime: 300
        };

        // PACE Items with detailed information
        this.paceItems = [
            {
                id: 'application',
                icon: 'fa-laptop',
                name: 'Application Status',
                hint: 'Check hiring.amazon.com',
                details: {
                    title: 'Check Your Application Status',
                    steps: [
                        'Log in to hiring.amazon.com',
                        'Click on "My Jobs"',
                        'Click on the job with your active application',
                        'View your application status and pre-employment screening results'
                    ],
                    importance: 'Required to track your pre-employment progress'
                },
                points: 100,
                collected: false,
                position: null
            },
            {
                id: 'shoes',
                icon: 'fa-shoe-prints',
                name: 'Safety Shoes',
                hint: '$110 Zappos credit',
                details: {
                    title: 'Order Safety Shoes',
                    steps: [
                        'Wait for pre-employment screenings to complete',
                        'Receive $110 Zappos.com credit',
                        'Access credit on hiring.amazon.com in new hire checklist',
                        'Use blue button to go to Zappos website',
                        'Click "Accept & Shop" for Amazon Approved Shoes',
                        'Credit will be applied at checkout'
                    ],
                    important_notes: [
                        'Safety shoes are required to enter Amazon worksites',
                        'Temporary safety-shoe covers provided if shoes don\'t arrive before Day 1',
                        'Many shoes are under $110',
                        'Remaining credit can be used for insoles',
                        'Contact Zappos Customer Care for shoe-related questions'
                    ],
                    contactInfo: 'See onsite HR for Unique ID issues'
                },
                points: 100,
                collected: false,
                position: null
            },
            {
                id: 'paperwork',
                icon: 'fa-file-signature',
                name: 'Pre-hire Paperwork',
                hint: 'Complete employment forms',
                details: {
                    title: 'Complete Pre-hire Documentation',
                    required_forms: [
                        'Payroll Direct Deposit',
                        'Terms of Employment',
                        'Non-Disclosure Agreement',
                        'Other employment-related forms'
                    ],
                    steps: [
                        'Log in to hiring.amazon.com',
                        'Click "Start employment paperwork"',
                        'Complete all forms before Day 1',
                        'Contact HR on first day for any questions'
                    ]
                },
                points: 100,
                collected: false,
                position: null
            },
            {
                id: 'id',
                icon: 'fa-id-card',
                name: 'Photo ID',
                hint: 'Required for Day 1',
                details: {
                    title: 'Photo ID Requirements',
                    importance: 'Essential for receiving your Amazon badge',
                    when: 'Must bring on Day 1',
                    note: 'Cannot receive badge without valid photo ID'
                },
                points: 100,
                collected: false,
                position: null
            },
            {
                id: 'dress_code',
                icon: 'fa-tshirt',
                name: 'Dress Code',
                hint: 'Comfortable & appropriate attire',
                details: {
                    title: 'Day 1 Dress Code',
                    requirements: [
                        'Wear comfortable clothing',
                        'Dress appropriately for work',
                        'Closed toe/closed heel shoes if safety shoes haven\'t arrived',
                        'No interview attire needed'
                    ],
                    note: 'You will be working in an active facility'
                },
                points: 100,
                collected: false,
                position: null
            }
        ];

        // Initialize tracking
        this.collectedInfoPanels = new Set();
        this.timer = null;

        // Bind methods
        this.handleKeydown = this.handleKeydown.bind(this);
        this.startGame = this.startGame.bind(this);
        this.movePlayer = this.movePlayer.bind(this);
        this.endGame = this.endGame.bind(this);
        this.closePaceItemPopup = this.closePaceItemPopup.bind(this);
        this.resumeGame = this.resumeGame.bind(this);
    }
    initialize() {
        console.log('Initializing PACE Navigator Game');
        this.gameContainer = document.getElementById('pathFindingGame');
        if (!this.gameContainer) {
            console.error('Game container not found');
            return;
        }

        this.resetGameState();
        this.setupEventListeners();
        this.showInstructions();
    }

    resetGameState() {
        this.state = {
            isPlaying: false,
            isPaused: false,
            timeLeft: 60,
            score: 0,
            collectedItems: 0,
            playerPosition: { x: 0, y: 0 },
            moves: 0,
            combo: 0,
            lastCollectTime: 0,
            modalVisible: false
        };

        // Reset PACE items
        this.paceItems.forEach(item => {
            item.collected = false;
            item.position = null;
        });

        // Clear UI elements
        const gameArea = this.gameContainer.querySelector('.game-area');
        if (gameArea) gameArea.innerHTML = '';

        const infoContainer = this.gameContainer.querySelector('.collected-items-container');
        if (infoContainer) infoContainer.innerHTML = '';

        const progressBar = this.gameContainer.querySelector('.progress');
        if (progressBar) progressBar.style.width = '0%';

        const progressText = this.gameContainer.querySelector('.progress-text');
        if (progressText) progressText.textContent = '0/5 Items';

        // Clear any existing modal
        const modal = this.gameContainer.querySelector('.pace-item-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }

        this.collectedInfoPanels.clear();

        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.updateUI();
    }


    setupEventListeners() {
        // Remove existing listeners
        document.removeEventListener('keydown', this.handleKeydown);

        // Add keyboard controls
        document.addEventListener('keydown', this.handleKeydown);

        // Touch controls
        const touchControls = this.gameContainer.querySelectorAll('.control-button');
        touchControls.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', () => {
                if (this.state.isPlaying && !this.state.isPaused) {
                    this.movePlayer(newButton.dataset.direction);
                }
            });
        });

        // Modal controls
        const modal = this.gameContainer.querySelector('.pace-item-modal');
        if (modal) {
            const closeButton = modal.querySelector('.modal-close');
            const continueButton = modal.querySelector('.continue-button');

            if (closeButton) {
                closeButton.addEventListener('click', this.closePaceItemPopup);
            }
            if (continueButton) {
                continueButton.addEventListener('click', this.closePaceItemPopup);
            }
        }

        // Start game button
        const startButton = this.gameContainer.querySelector('.start-game-btn');
        if (startButton) {
            const newStartButton = startButton.cloneNode(true);
            startButton.parentNode.replaceChild(newStartButton, startButton);
            newStartButton.addEventListener('click', this.startGame);
        }
    }

    showInstructions() {
        const instructionsPanel = this.gameContainer.querySelector('.game-instructions-panel');
        const gameContent = this.gameContainer.querySelector('.game-content');

        if (instructionsPanel) {
            instructionsPanel.style.display = 'block';
            requestAnimationFrame(() => {
                instructionsPanel.style.opacity = '1';
            });
        }

        if (gameContent) {
            gameContent.style.display = 'none';
            gameContent.style.opacity = '0';
        }
    }

    setupGameArea() {
        const gameArea = this.gameContainer.querySelector('.game-area');
        if (!gameArea) return;

        gameArea.innerHTML = '';

        // Create grid
        for (let y = 0; y < this.config.gridSize.height; y++) {
            for (let x = 0; x < this.config.gridSize.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                gameArea.appendChild(cell);
            }
        }

        // Add player with icon
        const player = document.createElement('div');
        player.id = 'player';
        player.innerHTML = '<i class="fas fa-user-circle"></i>';
        gameArea.appendChild(player);

        // Place PACE items
        this.placePaceItems();
        this.updatePlayerPosition(this.state.playerPosition);
    }



    placePaceItems() {
        this.paceItems.forEach(item => {
            const position = this.getRandomEmptyPosition();
            item.position = position;

            const cell = this.getCellAt(position);
            if (cell) {
                const paceItem = document.createElement('div');
                paceItem.className = 'pace-item';
                paceItem.dataset.id = item.id;
                paceItem.innerHTML = `
                <div class="item-icon">
                    <i class="fas ${item.icon}"></i>
                </div>
            `;
                cell.appendChild(paceItem);
            }
        });
    }


    getRandomEmptyPosition() {
        let position;
        let attempts = 0;
        const maxAttempts = 50;

        do {
            position = {
                x: Math.floor(Math.random() * this.config.gridSize.width),
                y: Math.floor(Math.random() * this.config.gridSize.height)
            };
            attempts++;
        } while (
            (this.isPositionOccupied(position) ||
                (position.x === 0 && position.y === 0)) &&
            attempts < maxAttempts
            );

        return position;
    }

    isPositionOccupied(position) {
        const cell = this.getCellAt(position);
        return cell && cell.querySelector('.pace-item');
    }

    getCellAt(position) {
        return this.gameContainer.querySelector(
            `.game-cell[data-x="${position.x}"][data-y="${position.y}"]`
        );
    }
    startGame() {
        if (this.state.isPlaying) return;

        this.state.isPlaying = true;
        this.state.isPaused = false;

        const instructionsPanel = this.gameContainer.querySelector('.game-instructions-panel');
        const gameContent = this.gameContainer.querySelector('.game-content');

        if (instructionsPanel) {
            instructionsPanel.style.opacity = '0';
            setTimeout(() => {
                instructionsPanel.style.display = 'none';
            }, this.config.animationDuration);
        }

        if (gameContent) {
            gameContent.style.display = 'flex';
            requestAnimationFrame(() => {
                gameContent.style.opacity = '1';
            });
        }

        this.setupGameArea();
        this.startTimer();
        this.updateUI();
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            if (!this.state.isPaused && this.state.timeLeft > 0) {
                this.state.timeLeft--;
                this.updateUI();

                if (this.state.timeLeft === 0) {
                    this.endGame(false);
                }
            }
        }, 1000);
    }

    pauseGame() {
        this.state.isPaused = true;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resumeGame() {
        this.state.isPaused = false;
        this.startTimer();
    }

    movePlayer(direction) {
        if (!this.state.isPlaying || this.state.isPaused || this.state.modalVisible) return;

        const newPosition = { ...this.state.playerPosition };

        switch (direction) {
            case 'up':
                if (newPosition.y > 0) newPosition.y--;
                break;
            case 'down':
                if (newPosition.y < this.config.gridSize.height - 1) newPosition.y++;
                break;
            case 'left':
                if (newPosition.x > 0) newPosition.x--;
                break;
            case 'right':
                if (newPosition.x < this.config.gridSize.width - 1) newPosition.x++;
                break;
            default:
                return;
        }

        this.updatePlayerPosition(newPosition);
    }

    updatePlayerPosition(newPosition) {
        const player = document.getElementById('player');
        const gameArea = this.gameContainer.querySelector('.game-area');

        if (player && gameArea) {
            const cellSize = (gameArea.offsetWidth - 20) / 5; // 20 is total padding (10px * 2)
            const newX = newPosition.x * cellSize + 2; // +2 for margin
            const newY = newPosition.y * cellSize + 2; // +2 for margin

            player.style.transform = `translate(${newX}px, ${newY}px)`;

            this.state.playerPosition = newPosition;
            this.checkForItem(newPosition);
        }
    }


    showPaceItemPopup(item, points) {
        const modal = this.gameContainer.querySelector('.pace-item-modal');
        if (!modal) return;

        // Pause the game
        this.pauseGame();

        // Update modal content
        const modalIcon = modal.querySelector('.modal-icon');
        const modalTitle = modal.querySelector('.modal-title');
        const itemContent = modal.querySelector(`.modal-item-content[data-item="${item.id}"]`);
        const pointsDisplay = modal.querySelector('.points-earned .points');
        const comboDisplay = modal.querySelector('.points-earned .combo');

        if (modalIcon) modalIcon.className = `modal-icon fas ${item.icon}`;
        if (modalTitle) modalTitle.textContent = item.name;

        // Hide all content sections and show the relevant one
        modal.querySelectorAll('.modal-item-content').forEach(content => {
            content.style.display = 'none';
        });
        if (itemContent) itemContent.style.display = 'block';

        if (pointsDisplay) pointsDisplay.textContent = `+${points}`;
        if (comboDisplay) {
            comboDisplay.textContent = this.state.combo > 1 ? `Combo x${this.state.combo}!` : '';
        }

        // Show modal with animation
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }


    checkForItem(position) {
        const cell = this.getCellAt(position);
        if (!cell) return;

        const paceItem = cell.querySelector('.pace-item');
        if (paceItem && !this.state.modalVisible) {
            const item = this.paceItems.find(item => item.id === paceItem.dataset.id);
            if (item && !item.collected) {
                this.collectItem(item, cell);
            }
        }
    }

    collectItem(item, cell) {
        const now = Date.now();
        const timeSinceLastCollect = now - this.state.lastCollectTime;

        // Update combo
        if (timeSinceLastCollect < this.config.comboTimeWindow) {
            this.state.combo++;
        } else {
            this.state.combo = 1;
        }

        // Calculate points
        const points = Math.floor(
            this.config.basePoints * Math.pow(this.config.comboMultiplier, this.state.combo - 1)
        );

        // Update game state
        item.collected = true;
        this.state.collectedItems++;
        this.state.score += points;
        this.state.lastCollectTime = now;

        // Remove item from grid
        const paceItem = cell.querySelector('.pace-item');
        if (paceItem) {
            paceItem.classList.add('collected');
            setTimeout(() => cell.removeChild(paceItem), this.config.animationDuration);
        }

        // Show popup with information
        this.showPaceItemPopup(item, points);

        // Update progress
        this.addInfoCard(item);
        this.updateProgressBar();

        if (this.state.collectedItems === this.paceItems.length) {
            this.completeGame();
        }
    }


    closePaceItemPopup() {
        const modal = this.gameContainer.querySelector('.pace-item-modal');
        if (!modal) return;

        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            this.state.modalVisible = false;
            this.resumeGame();
        }, this.config.modalTransitionTime);
    }


    updateProgressBar() {
        const progressBar = this.gameContainer.querySelector('.progress');
        const progressText = this.gameContainer.querySelector('.progress-text');
        const progress = (this.state.collectedItems / this.paceItems.length) * 100;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `${this.state.collectedItems}/5 Items`;
        }
    }

    handleKeydown(e) {
        if (!this.state.isPlaying || this.state.isPaused || this.state.modalVisible) return;

        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                this.movePlayer('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                this.movePlayer('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                this.movePlayer('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                this.movePlayer('right');
                break;
            case 'Escape':
                if (this.state.modalVisible) {
                    this.closePaceItemPopup();
                }
                break;
        }
    }

    updateUI() {
        // Update timer
        const timerElement = document.getElementById('pathFindingTimer');
        if (timerElement) {
            timerElement.textContent = this.state.timeLeft;
            timerElement.classList.toggle('warning', this.state.timeLeft <= 10);
        }

        // Update score
        const scoreElement = document.getElementById('pathFindingScore');
        if (scoreElement) {
            scoreElement.textContent = this.state.score;
        }

        // Update collected items
        const stepsElement = document.getElementById('pathFindingSteps');
        if (stepsElement) {
            stepsElement.textContent = `${this.state.collectedItems}/5`;
        }
    }

    completeGame() {
        const timeBonus = this.state.timeLeft * 10;
        this.state.score += timeBonus;

        // Ensure modal is closed before showing completion
        if (this.state.modalVisible) {
            this.closePaceItemPopup();
            setTimeout(() => {
                this.showCompletionMessage(true, timeBonus);
                this.endGame(true);
            }, this.config.modalTransitionTime);
        } else {
            this.showCompletionMessage(true, timeBonus);
            this.endGame(true);
        }
    }

    showCompletionMessage(completed, timeBonus = 0) {
        const messageEl = document.createElement('div');
        messageEl.className = 'completion-message';

        messageEl.innerHTML = `
            <div class="message-content ${completed ? 'success' : 'timeout'}">
                <div class="message-header">
                    <i class="fas ${completed ? 'fa-trophy' : 'fa-clock'}"></i>
                    <h3>${completed ? 'Congratulations!' : 'Time\'s Up!'}</h3>
                </div>
                <div class="score-breakdown">
                    <div class="score-item">
                        <span class="label">Items Collected:</span>
                        <span class="value">${this.state.collectedItems}/5</span>
                    </div>
                    ${completed ? `
                        <div class="score-item">
                            <span class="label">Time Bonus:</span>
                            <span class="value">+${timeBonus}</span>
                        </div>
                        <div class="score-item">
                            <span class="label">Time Remaining:</span>
                            <span class="value">${this.state.timeLeft}s</span>
                        </div>
                    ` : ''}
                    <div class="score-item total">
                        <span class="label">Final Score:</span>
                        <span class="value">${this.state.score}</span>
                    </div>
                </div>
                <button class="replay-button" onclick="window.pathFindingGame.initialize()">
                    <i class="fas fa-redo"></i> Play Again
                </button>
            </div>
        `;

        this.gameContainer.appendChild(messageEl);
        requestAnimationFrame(() => messageEl.classList.add('show'));
    }

    endGame(completed = false) {
        this.state.isPlaying = false;
        this.state.isPaused = true;

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Store high score
        if (completed) {
            const currentHighScore = localStorage.getItem('paceNavigatorHighScore') || 0;
            if (this.state.score > currentHighScore) {
                localStorage.setItem('paceNavigatorHighScore', this.state.score);
            }
        }

        // Remove completion message after delay
        setTimeout(() => {
            const messageEl = this.gameContainer.querySelector('.completion-message');
            if (messageEl) {
                messageEl.classList.remove('show');
                setTimeout(() => {
                    messageEl.remove();
                    this.showInstructions();
                }, this.config.animationDuration);
            }
        }, 5000);
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new PathFindingGame();
    window.pathFindingGame = game;
    game.initialize();
});
