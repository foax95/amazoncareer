class PreHireChecklistGame {
    constructor() {
        // Game state
        this.state = {
            isPlaying: false,
            timeLeft: 60,
            score: 0,
            matchesFound: 0,
            attempts: 0,
            firstCard: null,
            secondCard: null,
            canFlip: true,
            mismatchCounts: {},
            timerPaused: false,
            openModals: 0,
            gameCompleted: false
        };

        this.checklistItems = {
            applicationStatus: {
                name: "Application Status",
                icon: "fa-laptop",
                description: "Track Your Application Progress",
                details: "Visit hiring.amazon.com and follow these steps:\n" +
                    "• Log in to your account\n" +
                    "• Click on 'My Jobs'\n" +
                    "• Select your active application\n" +
                    "• View application status and pre-employment screening results"
            },
            safetyShoes: {
                name: "Safety Shoes",
                icon: "fa-shoe-prints",
                description: "Order Required Safety Shoes ($110 Credit)",
                details: "Safety shoes are mandatory for all Amazon worksites. Order process:\n" +
                    "• Wait for pre-employment screenings completion\n" +
                    "• Access $110 Zappos credit on hiring.amazon.com\n" +
                    "• Use blue button in pre-hire checklist to visit Zappos\n" +
                    "• Click 'Accept & Shop' for approved shoes\n" +
                    "• Credit applies automatically at checkout\n" +
                    "• Can use remaining credit for insoles\n" +
                    "Note: If shoes don't arrive by Day 1, safety-shoe covers will be provided"
            },
            prehireForms: {
                name: "Pre-hire Forms",
                icon: "fa-file-signature",
                description: "Complete Employment Documentation",
                details: "Log in to hiring.amazon.com and complete:\n" +
                    "• Payroll Direct Deposit setup\n" +
                    "• Terms of Employment\n" +
                    "• Non-Disclosure Agreement\n" +
                    "• Additional employment-related forms\n" +
                    "Complete all forms before Day 1. HR can assist with questions on your first day"
            },
            photoID: {
                name: "Photo ID",
                icon: "fa-id-card",
                description: "Government-Issued Photo ID Required",
                details: "Bring a valid government-issued photo ID on Day 1.\n" +
                    "This is required to receive your Amazon badge and gain facility access.\n" +
                    "Acceptable forms include driver's license, state ID, or passport"
            },
            day1Attire: {
                name: "Day 1 Attire",
                icon: "fa-tshirt",
                description: "Dress Code Requirements",
                details: "Prepare appropriate workwear for your first day:\n" +
                    "• Wear your ordered safety shoes if received\n" +
                    "• If shoes haven't arrived, wear closed-toe/closed-heel shoes\n" +
                    "• Dress comfortably and appropriately\n" +
                    "• No formal interview attire needed\n" +
                    "• Clothing should be workplace-appropriate and allow for movement"
            },
            ouch: {
                name: "Ouch Prevention",
                icon: "fa-heartbeat",
                description: "Prepare for Physical Demands",
                details: "Understanding and managing potential soreness in your first few weeks:\n" +
                    "• Initial Adjustment: Your body may need time to adapt to new physical activities\n" +
                    "• Common Areas: You might experience soreness in feet, legs, back, or arms\n" +
                    "• Stretching: Perform gentle stretches before and after shifts\n" +
                    "• Proper Technique: Learn and use correct lifting and movement techniques\n" +
                    "• Hydration: Drink plenty of water to help prevent muscle cramping\n" +
                    "• Rest: Ensure adequate sleep and rest between shifts\n" +
                    "Remember: Some initial discomfort is normal, but your health and safety are top priorities"
            }
        };

        this.timer = null;
        this.gameContainer = null;

        // Clean up on initialization
        this.cleanup();
    }

    initialize() {
        this.gameContainer = document.getElementById('matchingGame');
        this.setupEventListeners();
        this.createCards();
        this.loadGameStats();
    }

    loadGameStats() {
        if (window.gameState && window.gameState.gameStats && window.gameState.gameStats.matching) {
            const stats = window.gameState.gameStats.matching;
            document.getElementById('matchingHighScore').textContent = stats.highScore || 0;
        }
    }

    createCards() {
        const cardsGrid = this.gameContainer.querySelector('.cards-grid');
        cardsGrid.innerHTML = ''; // Clear existing cards

        const checklistPairs = Object.keys(this.checklistItems).reduce((pairs, item) => {
            return [...pairs, item, item];
        }, []);

        // Shuffle the cards
        for (let i = checklistPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [checklistPairs[i], checklistPairs[j]] = [checklistPairs[j], checklistPairs[i]];
        }

        checklistPairs.forEach(item => {
            const card = document.createElement('div');
            card.className = 'checklist-card';
            card.dataset.item = item;

            const itemData = this.checklistItems[item];
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <i class="fas ${itemData.icon}"></i>
                        <span>${itemData.name}</span>
                    </div>
                    <div class="card-back">
                        <i class="fas fa-question"></i>
                    </div>
                </div>
            `;

            cardsGrid.appendChild(card);
        });
    }

    setupEventListeners() {
        const startButton = this.gameContainer.querySelector('.start-game-btn');
        startButton.addEventListener('click', () => this.startGame());

        const cardsGrid = this.gameContainer.querySelector('.cards-grid');
        cardsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.checklist-card');
            if (card) this.handleCardClick(card);
        });

        const modalClose = this.gameContainer.querySelector('.modal-close');
        modalClose.addEventListener('click', () => this.closeItemPopup());

        const continueButton = this.gameContainer.querySelector('.continue-button');
        continueButton.addEventListener('click', () => this.navigateToQuiz());
    }

    startGame() {
        this.state = {
            isPlaying: true,
            timeLeft: 60,
            score: 0,
            matchesFound: 0,
            attempts: 0,
            firstCard: null,
            secondCard: null,
            canFlip: true,
            mismatchCounts: {},
            timerPaused: false,
            openModals: 0,
            gameCompleted: false
        };

        this.gameContainer.querySelector('.game-instructions-panel').style.display = 'none';
        this.gameContainer.querySelector('.game-content').classList.add('show');

        this.startTimer();
    }

    handleCardClick(card) {
        if (!this.state.isPlaying ||
            !this.state.canFlip ||
            card.classList.contains('matched') ||
            card === this.state.firstCard ||
            card.classList.contains('flipped')) {
            return;
        }

        const cardInner = card.querySelector('.card-inner');
        cardInner.classList.add('flip-in');
        card.classList.add('flipped');

        if (!this.state.firstCard) {
            this.state.firstCard = card;
        } else if (!this.state.secondCard) {
            this.state.secondCard = card;
            this.state.attempts++;
            this.checkMatch();
        }
    }

    checkMatch() {
        this.state.canFlip = false;
        const firstItem = this.state.firstCard.dataset.item;
        const secondItem = this.state.secondCard.dataset.item;

        if (firstItem === secondItem) {
            this.handleMatch(firstItem);
        } else {
            this.handleMismatch();
        }

        this.updateUI();
    }

    handleMatch(itemType) {
        this.state.matchesFound++;
        const points = this.calculatePoints();
        this.state.score += points;

        this.state.firstCard.classList.add('matched');
        this.state.secondCard.classList.add('matched');

        this.state.timerPaused = true;
        this.showItemPopup(itemType, points);

        if (this.state.matchesFound === 6) {
            this.state.gameCompleted = true;
            if (this.state.openModals === 0) {
                this.endGame(true);
            }
        } else {
            this.resetTurn();
        }
    }

    handleMismatch() {
        const firstItem = this.state.firstCard.dataset.item;
        const secondItem = this.state.secondCard.dataset.item;
        const mismatchKey = [firstItem, secondItem].sort().join('-');

        this.state.mismatchCounts[firstItem] = (this.state.mismatchCounts[firstItem] || 0) + 1;

        setTimeout(() => {
            const firstCardInner = this.state.firstCard.querySelector('.card-inner');
            const secondCardInner = this.state.secondCard.querySelector('.card-inner');

            firstCardInner.classList.remove('flip-in');
            secondCardInner.classList.remove('flip-in');
            firstCardInner.classList.add('flip-out');
            secondCardInner.classList.add('flip-out');

            this.state.firstCard.classList.remove('flipped');
            this.state.secondCard.classList.remove('flipped');

            setTimeout(() => {
                firstCardInner.classList.remove('flip-out');
                secondCardInner.classList.remove('flip-out');
                this.resetTurn();

                if (this.state.mismatchCounts[firstItem] >= 2) {
                    this.showMatchingHints(firstItem);
                }
            }, 600);
        }, 1000);
    }

    showMatchingHints(itemType) {
        const allCards = this.gameContainer.querySelectorAll('.checklist-card');
        allCards.forEach(card => card.classList.remove('hint-glow'));

        const matchingCards = this.gameContainer.querySelectorAll(
            `.checklist-card[data-item="${itemType}"]`
        );
        matchingCards.forEach(card => {
            if (!card.classList.contains('matched')) {
                card.classList.add('hint-glow');

                setTimeout(() => {
                    card.classList.remove('hint-glow');
                }, 2000);
            }
        });
    }

    calculatePoints() {
        return 100 + Math.floor(this.state.timeLeft / 10) * 10;
    }

    showItemPopup(itemType, points) {
        const item = this.checklistItems[itemType];
        const modal = this.gameContainer.querySelector('.checklist-info-modal');

        this.state.openModals++;

        modal.querySelector('.modal-icon').className = `modal-icon fas ${item.icon}`;
        modal.querySelector('.modal-title').textContent = item.name;
        modal.querySelector('.modal-description').textContent = item.description;

        const detailsContent = item.details;
        const detailsEl = modal.querySelector('.modal-details');
        const lines = detailsContent.split('\n').filter(line => line.trim());
        const title = lines[0];
        const bullets = lines.slice(1);

        detailsEl.innerHTML = `
            <div class="detail-title">${title.trim()}</div>
            <ul class="detail-bullets">
                ${bullets.map(bullet => `
                    <li>${bullet.trim().replace('•', '')}</li>
                `).join('')}
            </ul>
        `;

        modal.querySelector('.points-earned').textContent = `+${points} points`;
        modal.classList.add('show');
    }

    closeItemPopup() {
        const modal = this.gameContainer.querySelector('.checklist-info-modal');
        modal.classList.remove('show');
        this.state.openModals--;
        this.state.timerPaused = false;
        this.resetTurn();

        if (this.state.gameCompleted && this.state.openModals === 0) {
            this.endGame(true);
        }
    }

    resetTurn() {
        this.state.firstCard = null;
        this.state.secondCard = null;
        this.state.canFlip = true;
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            if (this.state.timeLeft > 0 && !this.state.timerPaused) {
                this.state.timeLeft--;
                this.updateUI();

                if (this.state.timeLeft === 0) {
                    this.endGame(false);
                }
            }
        }, 1000);
    }

    updateUI() {
        const timerDisplay = this.gameContainer.querySelector('#matchingTimer');
        const matchesDisplay = this.gameContainer.querySelector('#matchesFound');
        const attemptsDisplay = this.gameContainer.querySelector('#attemptCounter');

        timerDisplay.textContent = this.state.timeLeft;
        matchesDisplay.textContent = this.state.matchesFound;
        attemptsDisplay.textContent = this.state.attempts;

        if (this.state.timeLeft <= 10) {
            timerDisplay.classList.add('warning');
        } else {
            timerDisplay.classList.remove('warning');
        }
    }

    async endGame(completed) {
        clearInterval(this.timer);
        this.state.isPlaying = false;

        if (completed) {
            const timeBonus = this.state.timeLeft * 10;
            this.state.score += timeBonus;
        }

        // Save score if gameDB is available
        if (typeof gameDB !== 'undefined') {
            await gameDB.saveScore('matching', this.state.score);
        }

        // Update game state if available
        if (window.gameState) {
            if (!window.gameState.gameStats) {
                window.gameState.gameStats = {};
            }
            if (!window.gameState.gameStats.matching) {
                window.gameState.gameStats.matching = {};
            }

            const stats = window.gameState.gameStats.matching;
            stats.lastScore = this.state.score;
            stats.highScore = Math.max(this.state.score, stats.highScore || 0);
            stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
            stats.perfectMatches = (stats.perfectMatches || 0) +
                (this.state.matchesFound === 6 ? 1 : 0);

            if (!window.gameState.player) {
                window.gameState.player = {};
            }
            if (!Array.isArray(window.gameState.player.completedSections)) {
                window.gameState.player.completedSections = [];
            }
            if (completed && !window.gameState.player.completedSections.includes('matchingGame')) {
                window.gameState.player.completedSections.push('matchingGame');
            }

            if (typeof saveGameState ===

                'function') {
                saveGameState();
            }
        }

        // Only show completion message if all modals are closed
        if (this.state.openModals === 0) {
            this.showCompletionMessage(completed);
        }
    }

    showCompletionMessage(completed) {
        const completionMessage = this.gameContainer.querySelector('.completion-message');
        completionMessage.innerHTML = `
            <div class="message-content ${completed ? 'success' : 'timeout'}">
                <div class="message-header">
                    <i class="fas ${completed ? 'fa-trophy' : 'fa-clock'}"></i>
                    <h3>${completed ? 'Congratulations!' : 'Time\'s Up!'}</h3>
                </div>
                <div class="score-breakdown">
                    <div class="score-item">
                        <span class="label">Pre-hire Items Matched:</span>
                        <span class="value matches-found">${this.state.matchesFound}/6</span>
                    </div>
                    <div class="score-item">
                        <span class="label">Total Attempts:</span>
                        <span class="value total-attempts">${this.state.attempts}</span>
                    </div>
                    ${completed ? `
                        <div class="score-item">
                            <span class="label">Time Remaining:</span>
                            <span class="value time-bonus">${this.state.timeLeft}s</span>
                        </div>
                        <div class="score-item">
                            <span class="label">Time Bonus:</span>
                            <span class="value">+${this.state.timeLeft * 10}</span>
                        </div>
                    ` : ''}
                    <div class="score-item total">
                        <span class="label">Final Score:</span>
                        <span class="value final-score">${this.state.score}</span>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="continue-button button-primary" onclick="window.preHireGame.navigateToQuiz()">
                        <i class="fas fa-arrow-right"></i> Continue to Quiz
                    </button>
                    <button class="replay-button button-secondary" onclick="window.preHireGame.restart()">
                        <i class="fas fa-redo"></i> Play Again
                    </button>
                </div>
            </div>
        `;

        completionMessage.classList.add('show');
    }

    navigateToQuiz() {
        const quizSection = document.getElementById('quizSection');
        const matchingGame = document.getElementById('matchingGame');

        if (quizSection && matchingGame) {
            matchingGame.style.display = 'none';
            matchingGame.classList.remove('active');

            const completionMessage = matchingGame.querySelector('.completion-message');
            if (completionMessage) {
                completionMessage.classList.remove('show');
            }

            const modal = matchingGame.querySelector('.checklist-info-modal');
            if (modal) {
                modal.classList.remove('show');
            }

            setTimeout(() => {
                quizSection.style.display = 'block';
                quizSection.classList.add('active');

                if (window.amazonQuiz) {
                    window.amazonQuiz.initialize();
                }
            }, 300);
        }
    }

    cleanup() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.state = {
            isPlaying: false,
            timeLeft: 60,
            score: 0,
            matchesFound: 0,
            attempts: 0,
            firstCard: null,
            secondCard: null,
            canFlip: true,
            mismatchCounts: {},
            timerPaused: false,
            openModals: 0,
            gameCompleted: false
        };

        if (this.gameContainer) {
            const completionMessage = this.gameContainer.querySelector('.completion-message');
            if (completionMessage) {
                completionMessage.classList.remove('show');
            }

            const modal = this.gameContainer.querySelector('.checklist-info-modal');
            if (modal) {
                modal.classList.remove('show');
            }

            const allCards = this.gameContainer.querySelectorAll('.checklist-card');
            allCards.forEach(card => {
                card.classList.remove('hint-glow', 'flipped', 'matched');
                const cardInner = card.querySelector('.card-inner');
                if (cardInner) {
                    cardInner.classList.remove('flip-in', 'flip-out');
                }
            });
        }
    }

    restart() {
        this.cleanup();
        const messageEl = this.gameContainer.querySelector('.completion-message');
        if (messageEl) {
            messageEl.classList.remove('show');
        }
        this.createCards();
        this.startGame();
    }
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new PreHireChecklistGame();
    window.preHireGame = game;
    game.initialize();
});
