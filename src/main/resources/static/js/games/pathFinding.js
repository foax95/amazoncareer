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
            },
            {
                id: 'muscle_soreness',
                icon: 'fa-dumbbell',
                name: 'Physical Readiness',
                hint: 'Prepare for activity',
                details: {
                    title: 'Physical Readiness - OUCH!',
                    what_to_expect: [
                        'General muscle soreness in first two weeks',
                        'Normal response to new physical activity',
                        'Improves with proper self-care'
                    ],
                    prevention_tips: [
                        'Stay well hydrated throughout the day',
                        'Perform proper stretching before/after work',
                        'Get adequate rest between shifts',
                        'Consider using compression gear'
                    ]
                },
                points: 100,
                collected: false,
                position: null,
                isSpecial: true
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

    // ... (methods will follow in subsequent parts)
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
        if (progressText) progressText.textContent = '0/6 Items';

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

        // Place initial PACE items (excluding muscle_soreness)
        this.placePaceItems();
        this.updatePlayerPosition(this.state.playerPosition);
    }

    placePaceItems() {
        this.paceItems.forEach(item => {
            // Skip the muscle_soreness item initially
            if (item.isSpecial) return;

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

    placeOuchItem() {
        const ouchItem = this.paceItems.find(item => item.id === 'muscle_soreness');
        if (!ouchItem) return;

        const position = this.getRandomEmptyPosition();
        ouchItem.position = position;

        const cell = this.getCellAt(position);
        if (cell) {
            const paceItem = document.createElement('div');
            paceItem.className = 'pace-item special-item';
            paceItem.dataset.id = ouchItem.id;
            paceItem.innerHTML = `
                <div class="item-icon">
                    <i class="fas ${ouchItem.icon}"></i>
                </div>
            `;
            cell.appendChild(paceItem);

            // Add animation for appearance
            requestAnimationFrame(() => {
                paceItem.classList.add('appear');
            });
        }
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

    updateUI() {
        // Update timer
        const timerElement = document.getElementById('pathFindingTimer');
        if (timerElement) {
            timerElement.textContent = this.state.timeLeft;
            timerElement.classList.toggle('warning', this.state.timeLeft <= 10);
        }

        // Update collected items
        const stepsElement = document.getElementById('pathFindingSteps');
        if (stepsElement) {
            stepsElement.textContent = `${this.state.collectedItems}/6`;
        }

        // Update progress bar
        this.updateProgressBar();
    }

    updateProgressBar() {
        const progressBar = this.gameContainer.querySelector('.progress');
        const progressText = this.gameContainer.querySelector('.progress-text');
        const progress = (this.state.collectedItems / this.paceItems.length) * 100;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `${this.state.collectedItems}/6 Items`;
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

        // Check if all regular items are collected
        const regularItems = this.paceItems.filter(item => !item.isSpecial);
        const allRegularItemsCollected = regularItems.every(item => item.collected);

        if (allRegularItemsCollected &&
            !this.paceItems.find(i => i.id === 'muscle_soreness').collected) {
            // Place the OUCH item after a short delay
            setTimeout(() => {
                this.placeOuchItem();
            }, this.config.animationDuration);
        }

        // Check if this is the last item (including OUCH)
        const isLastItem = this.state.collectedItems === this.paceItems.length;

        // Show popup with information
        this.showPaceItemPopup(item, points, isLastItem);

        // Update progress
        this.updateProgressBar();
    }

    showPaceItemPopup(item, points, isLastItem) {
        const modal = this.gameContainer.querySelector('.pace-item-modal');
        if (!modal) return;

        // Pause the game
        this.pauseGame();
        this.state.modalVisible = true;

        // Update modal content
        const modalIcon = modal.querySelector('.modal-icon');
        const modalTitle = modal.querySelector('.modal-title');
        const itemContent = modal.querySelector(`.modal-item-content[data-item="${item.id}"]`);
        const pointsDisplay = modal.querySelector('.points-earned .points');
        const comboDisplay = modal.querySelector('.points-earned .combo');
        const continueButton = modal.querySelector('.continue-button');

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

        // Update continue button for last item
        if (isLastItem && continueButton) {
            continueButton.innerHTML = 'Complete Game <i class="fas fa-check"></i>';
        } else if (continueButton) {
            continueButton.innerHTML = 'Continue <i class="fas fa-arrow-right"></i>';
        }

        // Show modal with animation
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        // Store isLastItem state
        this.state.isLastItem = isLastItem;
    }

    closePaceItemPopup() {
        const modal = this.gameContainer.querySelector('.pace-item-modal');
        if (!modal) return;

        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            this.state.modalVisible = false;

            // If this was the last item, complete the game after closing the popup
            if (this.state.isLastItem) {
                const timeBonus = this.state.timeLeft * 10;
                this.state.score += timeBonus;
                this.endGame(true);
            } else {
                this.resumeGame();
            }
        }, this.config.modalTransitionTime);
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
        <div class="modal-buttons">
            <button class="continue-button button-primary" onclick="window.pathFindingGame.navigateToMatchingGame()">
                <i class="fas fa-arrow-right"></i> Continue to Benefits
            </button>
            <button class="replay-button button-secondary" onclick="window.pathFindingGame.initialize()">
                <i class="fas fa-redo"></i> Play Again
            </button>
        </div>
    </div>
`;

        this.gameContainer.appendChild(messageEl);
        requestAnimationFrame(() => messageEl.classList.add('show'));
    }

    navigateToMatchingGame() {
        const pathFindingGame = document.querySelector('.pace-section');
        const matchingGame = document.querySelector('.matching-section');

        if (!matchingGame || !pathFindingGame) {
            console.error('Required sections not found');
            return;
        }

        // Hide pathfinding game
        pathFindingGame.style.display = 'none';
        pathFindingGame.classList.remove('active');

        // Remove completion message if exists
        const completionMessage = pathFindingGame.querySelector('.completion-message');
        if (completionMessage) {
            completionMessage.remove();
        }

        // Show matching game
        matchingGame.style.display = 'block';
        matchingGame.classList.add('active');

        // Initialize matching game
        if (window.matchingGame) {
            window.matchingGame.initialize();
        } else {
            window.matchingGame = new BenefitsMatchingGame();
            window.matchingGame.initialize();
        }
    }


   async endGame(completed = false) {
        this.state.isPlaying = false;
        this.state.isPaused = true;

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Calculate final score with time bonus if completed
        if (completed) {
            const timeBonus = this.state.timeLeft * 10;
            this.state.score += timeBonus;
        }

        // Save score to database
       await gameDB.saveScore('pathFinding', this.state.score);

        // Update game state if available
        if (window.gameState) {
            if (!window.gameState.gameStats) {
                window.gameState.gameStats = {};
            }
            if (!window.gameState.gameStats.pathFinding) {
                window.gameState.gameStats.pathFinding = {};
            }

            const stats = window.gameState.gameStats.pathFinding;
            stats.lastScore = this.state.score;
            stats.highScore = Math.max(this.state.score, stats.highScore || 0);
            stats.pathsCompleted = (stats.pathsCompleted || 0) + (completed ? 1 : 0);
            stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;

            if (!window.gameState.player) {
                window.gameState.player = {};
            }
            if (!Array.isArray(window.gameState.player.completedSections)) {
                window.gameState.player.completedSections = [];
            }
            if (completed && !window.gameState.player.completedSections.includes('pathFindingGame')) {
                window.gameState.player.completedSections.push('pathFindingGame');
            }

            if (typeof saveGameState === 'function') {
                saveGameState();
            }
        }

        this.showCompletionMessage(completed, completed ? this.state.timeLeft * 10 : 0);
    }

}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance of the game
    const game = new PathFindingGame();
    window.pathFindingGame = game;
    game.initialize();

    // Add touch control detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (game.state.isPlaying) {
                game.updatePlayerPosition(game.state.playerPosition);
            }
        }, 250);
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && game.state.isPlaying && !game.state.isPaused) {
            game.pauseGame();
        }
    });

    // Handle modal clicks outside
    document.addEventListener('click', (e) => {
        const modal = document.querySelector('.pace-item-modal');
        if (modal && e.target === modal) {
            game.closePaceItemPopup();
        }
    });

    // Prevent scrolling when using arrow keys
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            if (game.state.isPlaying) {
                e.preventDefault();
            }
        }
    });
});
