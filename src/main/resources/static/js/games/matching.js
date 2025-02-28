class BenefitsMatchingGame {
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
            canFlip: true
        };

        // Benefits data
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

        this.timer = null;
    }

    initialize() {
        this.gameContainer = document.getElementById('matchingGame');
        this.setupEventListeners();
        this.createCards();
    }

    createCards() {
        const cardsGrid = this.gameContainer.querySelector('.cards-grid');
        cardsGrid.innerHTML = ''; // Clear existing cards

        const benefitPairs = Object.keys(this.benefits).reduce((pairs, benefit) => {
            return [...pairs, benefit, benefit];
        }, []);

        for (let i = benefitPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [benefitPairs[i], benefitPairs[j]] = [benefitPairs[j], benefitPairs[i]];
        }

        benefitPairs.forEach(benefit => {
            const card = document.createElement('div');
            card.className = 'benefit-card';
            card.dataset.benefit = benefit;

            const benefitData = this.benefits[benefit];
            card.innerHTML = `
                        <div class="card-inner">
                            <div class="card-front">
                                <i class="fas ${benefitData.icon}"></i>
                                <span>${benefitData.name}</span>
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
            const card = e.target.closest('.benefit-card');
            if (card) this.handleCardClick(card);
        });

        const modalClose = this.gameContainer.querySelector('.modal-close');
        modalClose.addEventListener('click', () => this.closeBenefitPopup());

        const continueButton = this.gameContainer.querySelector('.continue-button');
        continueButton.addEventListener('click', () => this.navigateToQuiz());
    }

    startGame() {
        this.state.isPlaying = true;
        this.state.timeLeft = 60;
        this.state.score = 0;
        this.state.matchesFound = 0;
        this.state.attempts = 0;
        this.state.firstCard = null;
        this.state.secondCard = null;
        this.state.canFlip = true;

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
        const firstBenefit = this.state.firstCard.dataset.benefit;
        const secondBenefit = this.state.secondCard.dataset.benefit;

        if (firstBenefit === secondBenefit) {
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

        this.state.firstCard.classList.add('matched');
        this.state.secondCard.classList.add('matched');

        this.showBenefitPopup(benefitType, points);

        if (this.state.matchesFound === 8) {
            this.endGame(true);
        } else {
            this.resetTurn();
        }
    }

    handleMismatch() {
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
            }, 600);
        }, 1000);
    }

    calculatePoints() {
        return 100 + Math.floor(this.state.timeLeft / 10) * 10;
    }

    showBenefitPopup(benefitType, points) {
        const benefit = this.benefits[benefitType];
        const modal = this.gameContainer.querySelector('.benefit-info-modal');

        modal.querySelector('.modal-icon').className = `modal-icon fas ${benefit.icon}`;
        modal.querySelector('.modal-title').textContent = benefit.name;
        modal.querySelector('.modal-description').textContent = benefit.description;
        modal.querySelector('.modal-details').textContent = benefit.details;
        modal.querySelector('.points-earned').textContent = `+${points} points`;

        modal.classList.add('show');
    }

    closeBenefitPopup() {
        const modal = this.gameContainer.querySelector('.benefit-info-modal');
        modal.classList.remove('show');
        this.resetTurn();
    }

    resetTurn() {
        this.state.firstCard = null;
        this.state.secondCard = null;
        this.state.canFlip = true;
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            if (this.state.timeLeft > 0) {
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
        }
    }

    endGame(completed) {
        clearInterval(this.timer);
        this.state.isPlaying = false;

        const completionMessage = this.gameContainer.querySelector('.completion-message');

        completionMessage.querySelector('.matches-found').textContent =
            `${this.state.matchesFound}/8`;
        completionMessage.querySelector('.time-bonus').textContent =
            `${this.state.timeLeft}s`;
        completionMessage.querySelector('.total-attempts').textContent =
            this.state.attempts;
        completionMessage.querySelector('.final-score').textContent =
            this.state.score;

        completionMessage.classList.add('show');

        localStorage.setItem('matchingGameScore', this.state.score.toString());
    }

    navigateToQuiz() {
        const quizSection = document.getElementById('quizSection');
        const matchingGame = document.getElementById('matchingGame');

        if (quizSection && matchingGame) {
            matchingGame.style.display = 'none';
            matchingGame.classList.remove('active');

            quizSection.style.display = 'block';
            quizSection.classList.add('active');

            if (window.amazonQuiz) {
                window.amazonQuiz.initialize();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new BenefitsMatchingGame();
    window.matchingGame = game;
    game.initialize();
});