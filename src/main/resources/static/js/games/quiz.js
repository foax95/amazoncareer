class AmazonQuiz {
    constructor() {
        // Quiz state
        this.state = {
            isActive: false,
            currentQuestion: 0,
            score: 0,
            answers: [],
            completed: false,
            initialized: false
        };

        // Quiz configuration
        this.config = {
            timePerQuestion: 30,
            pointsPerQuestion: 100,
            totalQuestions: 10,
            visibilityCheckDuration: 10, // seconds
            checkInterval: 1000 // milliseconds
        };

        // Quiz questions database
        this.questions = [
            {
                question: "Which benefit provides comprehensive medical coverage from day one?",
                options: [
                    "Employee Discount",
                    "Health Insurance",
                    "Career Choice",
                    "401(k) Plan"
                ],
                correctAnswer: 1,
                explanation: "Health Insurance provides comprehensive medical, prescription, and preventive care coverage starting on your first day."
            },
            {
                question: "What percentage of salary does Amazon match in the 401(k) Plan?",
                options: [
                    "2%",
                    "4%",
                    "6%",
                    "8%"
                ],
                correctAnswer: 2,
                explanation: "Amazon matches employee contributions up to 6% of their salary in the 401(k) Plan."
            },
            {
                question: "How much education funding is available through Career Choice annually?",
                options: [
                    "$2,500",
                    "$3,750",
                    "$5,250",
                    "$7,500"
                ],
                correctAnswer: 2,
                explanation: "Career Choice provides up to $5,250 per year for eligible educational programs."
            },
            {
                question: "What is the maximum duration of paid parental leave?",
                options: [
                    "10 weeks",
                    "15 weeks",
                    "20 weeks",
                    "25 weeks"
                ],
                correctAnswer: 2,
                explanation: "Amazon offers up to 20 weeks of paid parental leave for eligible employees."
            },
            {
                question: "What percentage discount do employees receive on Amazon purchases?",
                options: [
                    "5%",
                    "10%",
                    "15%",
                    "20%"
                ],
                correctAnswer: 1,
                explanation: "Employees receive a 10% discount on eligible Amazon.com purchases."
            }
        ];

        // Timer and interval references
        this.timer = null;
        this.visibilityCheckInterval = null;

        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.startQuiz = this.startQuiz.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.showNextQuestion = this.showNextQuestion.bind(this);
        this.endQuiz = this.endQuiz.bind(this);
        this.ensureVisibility = this.ensureVisibility.bind(this);
        this.cleanup = this.cleanup.bind(this);
    }

    initialize() {
        console.log('Initializing Amazon Benefits Quiz');
        this.quizContainer = document.getElementById('quizSection');
        if (!this.quizContainer) {
            console.error('Quiz container not found');
            return;
        }

        // Prevent multiple initializations
        if (this.state.initialized) {
            console.log('Quiz already initialized');
            this.ensureVisibility();
            return;
        }

        this.ensureVisibility();
        this.resetQuiz();
        this.showInstructions();
        this.setupEventListeners();
        this.startVisibilityCheck();

        this.state.initialized = true;
        console.log('Quiz initialization complete');
    }

    ensureVisibility() {
        console.log('Ensuring quiz visibility');
        if (this.quizContainer) {
            this.quizContainer.style.display = 'block';
            this.quizContainer.style.opacity = '1';
            this.quizContainer.classList.add('active');
            console.log('Quiz container styles set:', {
                display: this.quizContainer.style.display,
                opacity: this.quizContainer.style.opacity,
                classList: this.quizContainer.classList
            });
        }
    }

    startVisibilityCheck() {
        console.log('Starting visibility check');
        let checks = 0;

        // Clear any existing interval
        if (this.visibilityCheckInterval) {
            clearInterval(this.visibilityCheckInterval);
        }

        this.visibilityCheckInterval = setInterval(() => {
            this.ensureVisibility();
            checks++;
            if (checks >= this.config.visibilityCheckDuration) {
                console.log('Visibility check complete');
                clearInterval(this.visibilityCheckInterval);
            }
        }, this.config.checkInterval);
    }

    resetQuiz() {
        console.log('Resetting quiz state');
        this.state = {
            isActive: false,
            currentQuestion: 0,
            score: 0,
            answers: [],
            completed: false,
            initialized: true
        };

        this.questions = this.shuffleArray([...this.questions]);
        this.cleanup();
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        const startButton = this.quizContainer.querySelector('.start-quiz-btn');
        if (startButton) {
            startButton.addEventListener('click', this.startQuiz);
        }
    }

    showInstructions() {
        console.log('Showing instructions');
        const instructionsHtml = `
            <div class="quiz-instructions" style="opacity: 1;">
                <h2><i class="fas fa-question-circle"></i> Benefits Knowledge Check</h2>
                <p>Test your understanding of Amazon's benefits package!</p>
                
                <div class="instruction-details">
                    <div class="instruction-item">
                        <i class="fas fa-info-circle"></i>
                        <p>Answer questions about Amazon benefits</p>
                    </div>
                    <div class="instruction-item">
                        <i class="fas fa-clock"></i>
                        <p>${this.config.timePerQuestion} seconds per question</p>
                    </div>
                    <div class="instruction-item">
                        <i class="fas fa-star"></i>
                        <p>Earn points for correct answers</p>
                    </div>
                </div>

                <button class="start-quiz-btn button-primary">
                    <i class="fas fa-play"></i> Start Quiz
                </button>
            </div>
        `;

        this.quizContainer.innerHTML = instructionsHtml;
    }

    startQuiz() {
        console.log('Starting quiz');
        if (this.state.isActive) {
            console.log('Quiz already active');
            return;
        }

        this.state.isActive = true;
        this.showNextQuestion();
        this.ensureVisibility();
    }

    showNextQuestion() {
        console.log('Showing next question');
        if (this.state.currentQuestion >= this.questions.length) {
            this.endQuiz();
            return;
        }

        const question = this.questions[this.state.currentQuestion];
        const questionElement = document.createElement('div');
        questionElement.className = 'quiz-question';
        questionElement.innerHTML = `
            <div class="question-header">
                <h3>Question ${this.state.currentQuestion + 1} of ${this.questions.length}</h3>
                <div class="timer" id="questionTimer">${this.config.timePerQuestion}</div>
            </div>
            
            <div class="question-content">
                <p class="question-text">${question.question}</p>
                <div class="options-grid">
                    ${question.options.map((option, index) => `
                        <button class="option-btn" data-index="${index}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.quizContainer.innerHTML = '';
        this.quizContainer.appendChild(questionElement);

        const optionButtons = this.quizContainer.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.state.isActive) return;
                this.submitAnswer(parseInt(button.dataset.index));
            });
        });

        this.startQuestionTimer();
        this.ensureVisibility();
    }

    startQuestionTimer() {
        console.log('Starting question timer');
        if (this.timer) {
            clearInterval(this.timer);
        }

        let timeLeft = this.config.timePerQuestion;
        const timerDisplay = this.quizContainer.querySelector('#questionTimer');

        this.timer = setInterval(() => {
            timeLeft--;
            if (timerDisplay) {
                timerDisplay.textContent = timeLeft;
                if (timeLeft <= 5) {
                    timerDisplay.classList.add('warning');
                }
            }

            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.submitAnswer(-1);
            }
        }, 1000);
    }

    submitAnswer(answerIndex) {
        console.log('Submitting answer:', answerIndex);
        const currentQuestion = this.questions[this.state.currentQuestion];
        const isCorrect = answerIndex === currentQuestion.correctAnswer;

        this.state.answers.push({
            questionIndex: this.state.currentQuestion,
            answerIndex: answerIndex,
            correct: isCorrect
        });

        if (isCorrect) {
            this.state.score += this.config.pointsPerQuestion;
        }

        this.showAnswerFeedback(isCorrect, currentQuestion.explanation);
    }

    showAnswerFeedback(isCorrect, explanation) {
        console.log('Showing answer feedback');
        const feedbackHtml = `
            <div class="answer-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-header">
                    <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <h3>${isCorrect ? 'Correct!' : 'Incorrect'}</h3>
                </div>
                <p class="explanation">${explanation}</p>
                <button class="continue-btn button-primary">Continue</button>
            </div>
        `;

        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-overlay';
        feedbackElement.innerHTML = feedbackHtml;

        this.quizContainer.appendChild(feedbackElement);

        feedbackElement.querySelector('.continue-btn').addEventListener('click', () => {
            feedbackElement.remove();
            this.state.currentQuestion++;
            this.showNextQuestion();
        });
    }

    endQuiz() {
        console.log('Ending quiz');
        this.state.completed = true;
        this.cleanup();

        const correctAnswers = this.state.answers.filter(answer => answer.correct).length;
        const summaryHtml = `
            <div class="quiz-summary">
                <div class="summary-header">
                    <i class="fas fa-trophy"></i>
                    <h2>Quiz Complete!</h2>
                </div>
                
                <div class="score-summary">
                    <div class="score-item">
                        <span class="label">Correct Answers:</span>
                        <span class="value">${correctAnswers}/${this.questions.length}</span>
                    </div>
                    <div class="score-item">
                        <span class="label">Final Score:</span>
                        <span class="value">${this.state.score}</span>
                    </div>
                </div>

                <div class="summary-buttons">
                    <button class="review-btn button-secondary">
                        <i class="fas fa-search"></i> Review Answers
                    </button>
                    <button class="complete-btn button-primary">
                        <i class="fas fa-check"></i> Complete Training
                    </button>
                </div>
            </div>
        `;

        this.quizContainer.innerHTML = summaryHtml;

        // Add event listeners for summary buttons
        this.quizContainer.querySelector('.review-btn').addEventListener('click', () => {
            this.showAnswerReview();
        });

        this.quizContainer.querySelector('.complete-btn').addEventListener('click', () => {
            this.completeTraining();
        });
    }

    cleanup() {
        console.log('Cleaning up quiz resources');
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.visibilityCheckInterval) {
            clearInterval(this.visibilityCheckInterval);
            this.visibilityCheckInterval = null;
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    showAnswerReview() {
        // Implementation for answer review
        console.log("Answer review to be implemented");
    }

    completeTraining() {
        console.log("Completing training");
        if (window.gameState) {
            gameState.gameStats.quiz.completed = true;
            gameState.gameStats.quiz.score = this.state.score;
            gameState.player.completedSections.push('quiz');
            saveGameState();
        }
    }
}

// Initialize function for external use
function initializeQuiz() {
    if (!window.amazonQuiz) {
        window.amazonQuiz = new AmazonQuiz();
    }
    window.amazonQuiz.initialize();
}

// Export the quiz initialization function
window.initializeQuiz = initializeQuiz;

// Add global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global error caught:", message, "Source:", source, "Line:", lineno);
    if (window.amazonQuiz) {
        window.amazonQuiz.ensureVisibility();
    }
    return false;
};
