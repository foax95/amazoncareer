class BenefitsMatchingGame {
    constructor() {
        // Game state
        this.state = {
            isPlaying: false,
            isPaused: false,
            timeLeft: 60,
            score: 0,
            matchesFound: 0,
            attempts: 0,
            firstCard: null,
            secondCard: null,
            canFlip: true,
            modalVisible: false
        };

        // Game configuration
        this.config = {
            totalPairs: 8,
            basePoints: 100,
            timeBonus: 10,
            animationDuration: 600,
            modalTransitionTime: 300
        };

        // Benefits information
        this.benefits = {
            health: {
                name: "Health Insurance",
                icon: "fa-heart",
                description: "Comprehensive medical coverage starting day one",
                details: "Full medical, prescription, and preventive care coverage"
            },
            dental: {
                name: "Dental Coverage",
                icon: "fa-tooth",
                description: "Complete dental care including preventive services",
                details: "Covers cleanings, fillings, and major procedures"
            },
            vision: {
                name: "Vision Care",
                icon: "fa-eye",
                description: "Eye exams, glasses, and contact lens coverage",
                details: "Annual eye exams and vision correction coverage"
            },
            '401k': {
                name: "401(k) Plan",
                icon: "fa-piggy-bank",
                description: "Retirement savings with company match",
                details: "Company matches contributions up to 6% of salary"
            },
            career: {
                name: "Career Choice",
                icon: "fa-graduation-cap",
                description: "Education funding for in-demand careers",
                details: "Up to $5,250 per year for eligible programs"
            },
            pto: {
                name: "Paid Time Off",
                icon: "fa-umbrella-beach",
                description: "Flexible vacation and personal time",
                details: "Accrued PTO based on tenure and position"
            },
            parental: {
                name: "Parental Leave",
                icon: "fa-baby",
                description: "Paid leave for new parents",
                details: "Up to 20 weeks of paid parental leave"
            },
            discount: {
                name: "Employee Discount",
                icon: "fa-tags",
                description: "Special savings on Amazon purchases",
                details: "10% off eligible Amazon.com purchases"
            }
        };

        // Initialize tracking
        this.timer = null;

        // Bind methods
        this.handleCardClick = this.handleCardClick.bind(this);
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.closeBenefitPopup = this.closeBenefitPopup.bind(this);
        this.resumeGame = this.resumeGame.bind(this);
    }

    initialize() {
        console.log('Initializing Benefits Matching Game');
        this.gameContainer = document.getElementById('matchingGame');
        if (!this.gameContainer) {
            console.error('Game container not found');
            return;
        }

        this.resetGameState();
        this.setupEventListeners();
        this.showInstructions();
    }

    resetGameState() {
        // Reset game state
        Object.assign(this.state, {
            isPlaying: false,
            isPaused: false,
            timeLeft: 60,
            score: 0,
            matchesFound: 0,
            attempts: 0,
            firstCard: null,
            secondCard: null,
            canFlip: true,
            modalVisible: false
        });

        // Reset UI
        this.updateUI();
        this.resetCards();

        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    setupEventListeners() {
        // Card click events
        const cards = this.gameContainer.querySelectorAll('.benefit-card');
        cards.forEach(card => {
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            newCard.addEventListener('click', () => this.handleCardClick(newCard));
        });

        // Start game button
        const startButton = this.gameContainer.querySelector('.start-game-btn');
        if (startButton) {
            const newStartButton = startButton.cloneNode(true);
            startButton.parentNode.replaceChild(newStartButton, startButton);
            newStartButton.addEventListener('click', this.startGame);
        }

        // Modal close button
        const closeButton = this.gameContainer.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', this.closeBenefitPopup);
        }
    }

    showInstructions() {
        const instructionsPanel = this.gameContainer.querySelector('.game-instructions-panel');
        if (instructionsPanel) {
            instructionsPanel.style.display = 'block';
            requestAnimationFrame(() => {
                instructionsPanel.style.opacity = '1';
            });
        }
    }

    startGame() {
        if (this.state.isPlaying) return;

        this.state.isPlaying = true;
        this.shuffleCards();
        this.startTimer();

        // Hide instructions, show game
        const instructionsPanel = this.gameContainer.querySelector('.game-instructions-panel');
        const gameContent = this.gameContainer.querySelector('.game-content');

        if (instructionsPanel) {
            instructionsPanel.style.opacity = '0';
            setTimeout(() => {
                instructionsPanel.style.display = 'none';
            }, this.config.animationDuration);
        }

        if (gameContent) {
            gameContent.style.display = 'block';
            requestAnimationFrame(() => {
                gameContent.style.opacity = '1';
            });
        }
    }

    shuffleCards() {
        const cards = Array.from(this.gameContainer.querySelectorAll('.benefit-card'));
        const cardsGrid = this.gameContainer.querySelector('.cards-grid');

        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            cardsGrid.appendChild(cards[j]);
        }
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

    handleCardClick(card) {
        if (!this.state.isPlaying ||
            !this.state.canFlip ||
            this.state.modalVisible ||
            card.classList.contains('matched') ||
            card.classList.contains('flipped')) {
            return;
        }

        this.flipCard(card);

        if (!this.state.firstCard) {
            this.state.firstCard = card;
        } else if (!this.state.secondCard) {
            this.state.secondCard = card;
            this.state.attempts++;
            this.checkMatch();
        }
    }
    flipCard(card) {
        card.classList.add('flipped');
    }

    unflipCard(card) {
        card.classList.remove('flipped');
    }

    checkMatch() {
        this.state.canFlip = false;
        const firstBenefit = this.state.firstCard.dataset.benefit;
        const secondBenefit = this.state.secondCard.dataset.benefit;
        const isMatch = firstBenefit === secondBenefit;

        if (isMatch) {
            this.handleMatch(firstBenefit);
        } else {
            this.handleMismatch();
        }

        this.updateUI();
    }

    handleMatch(benefitType) {
        this.state.matchesFound++;
        const points = this.calculatePoints();
        this.state.score += points;

        const matchedCards = [this.state.firstCard, this.state.secondCard];
        matchedCards.forEach(card => {
            card.classList.add('matched');
        });

        this.showBenefitPopup(benefitType, points);

        if (this.state.matchesFound === this.config.totalPairs) {
            this.endGame(true);
        } else {
            this.resetTurn();
        }
    }

    handleMismatch() {
        setTimeout(() => {
            this.unflipCard(this.state.firstCard);
            this.unflipCard(this.state.secondCard);
            this.resetTurn();
        }, 1000);
    }

    resetTurn() {
        this.state.firstCard = null;
        this.state.secondCard = null;
        this.state.canFlip = true;
    }

    calculatePoints() {
        const basePoints = this.config.basePoints;
        const timeBonus = Math.floor(this.state.timeLeft / 10) * 10;
        return basePoints + timeBonus;
    }

    showBenefitPopup(benefitType, points) {
        const benefit = this.benefits[benefitType];
        if (!benefit) return;

        this.state.isPaused = true;
        this.state.modalVisible = true;

        const modal = this.gameContainer.querySelector('.benefit-info-modal');
        if (!modal) return;

        // Update modal content
        modal.querySelector('.modal-icon').className = `modal-icon fas ${benefit.icon}`;
        modal.querySelector('.modal-title').textContent = benefit.name;
        modal.querySelector('.modal-description').textContent = benefit.description;
        modal.querySelector('.modal-details').textContent = benefit.details;
        modal.querySelector('.points-earned').textContent = `+${points} points`;

        // Show modal with animation
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }

    closeBenefitPopup() {
        const modal = this.gameContainer.querySelector('.benefit-info-modal');
        if (!modal) return;

        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            this.state.modalVisible = false;
            this.state.isPaused = false;
        }, this.config.modalTransitionTime);
    }

    updateUI() {
        // Update timer
        const timerDisplay = this.gameContainer.querySelector('#matchingTimer');
        if (timerDisplay) {
            timerDisplay.textContent = this.state.timeLeft;
            timerDisplay.classList.toggle('warning', this.state.timeLeft <= 10);
        }

        // Update matches
        const matchesCounter = this.gameContainer.querySelector('#matchesFound');
        if (matchesCounter) {
            matchesCounter.textContent = this.state.matchesFound;
        }

        // Update attempts
        const attemptsCounter = this.gameContainer.querySelector('#attemptCounter');
        if (attemptsCounter) {
            attemptsCounter.textContent = this.state.attempts;
        }
    }

    showCompletionMessage(completed) {
        const messageEl = document.createElement('div');
        messageEl.className = 'completion-message';

        const timeBonus = completed ? this.state.timeLeft * this.config.timeBonus : 0;
        const finalScore = this.state.score + timeBonus;

        messageEl.innerHTML = `
            <div class="message-content ${completed ? 'success' : 'timeout'}">
                <div class="message-header">
                    <i class="fas ${completed ? 'fa-trophy' : 'fa-clock'}"></i>
                    <h3>${completed ? 'Congratulations!' : 'Time\'s Up!'}</h3>
                </div>
                <div class="score-breakdown">
                    <div class="score-item">
                        <span class="label">Matches Found:</span>
                        <span class="value">${this.state.matchesFound}/${this.config.totalPairs}</span>
                    </div>
                    <div class="score-item">
                        <span class="label">Attempts:</span>
                        <span class="value">${this.state.attempts}</span>
                    </div>
                    ${completed ? `
                        <div class="score-item">
                            <span class="label">Time Bonus:</span>
                            <span class="value">+${timeBonus}</span>
                        </div>
                    ` : ''}
                    <div class="score-item total">
                        <span class="label">Final Score:</span>
                        <span class="value">${finalScore}</span>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="continue-button button-primary" onclick="navigateToNextGame()">
                        <i class="fas fa-arrow-right"></i> Continue
                    </button>
                    <button class="replay-button button-secondary" onclick="window.matchingGame.initialize()">
                        <i class="fas fa-redo"></i> Play Again
                    </button>
                </div>
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

        // Store final score
        localStorage.setItem('matchingGameScore', this.state.score.toString());

        // Update gameState if completion was successful
        if (completed && window.gameState) {
            gameState.gameStats.matching.matchesFound += this.state.matchesFound;
            gameState.gameStats.matching.gamesPlayed++;
            if (!gameState.player.completedSections.includes('matchingGame')) {
                gameState.player.completedSections.push('matchingGame');
            }
            saveGameState();
        }

        // Show completion message
        this.showCompletionMessage(completed);

        // After delay, transition to next game if completed successfully
        if (completed) {
            setTimeout(() => {
                // Navigate to next game or section
                showSection('nextGame'); // Replace 'nextGame' with actual next section
            }, 5000);
        }
    }

    resetCards() {
        const cards = this.gameContainer.querySelectorAll('.benefit-card');
        cards.forEach(card => {
            card.classList.remove('flipped', 'matched');
        });
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
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new BenefitsMatchingGame();
    window.matchingGame = game;
    game.initialize();
});

// Navigation function (implement based on your navigation system)
function navigateToNextGame() {
    // Implement navigation to next game/section
    console.log('Navigating to next game...');
}
