class AmazonQuiz {
    constructor() {
        try {
            this.state = {
                isActive: false,
                currentQuestion: 0,
                score: 0,
                answers: [],
                completed: false,
                initialized: false,
                startTime: null,
                endTime: null,
                feedbackVisible: false
            };

            this.config = {
                timePerQuestion: 30,
                pointsPerQuestion: 100,
                totalQuestions: 5
            };

            this.questions = [
                {
                    question: "Once hired, how many days do you have to wait until you can transfer to a new shift or building?",
                    options: [
                        "7 days",
                        "14 days",
                        "30 days",
                        "90 days"
                    ],
                    correctAnswer: 2,
                    explanation: "You must wait 30 days from your hire date before you're eligible to transfer to a new shift or building."
                },
                {
                    question: "Where do you go if you have questions about shift, pay, directions to site, or need to withdraw your application?",
                    options: [
                        "Contact HR",
                        "Call the Site",
                        "Go to 'My Jobs' on your application",
                        "Email your recruiter"
                    ],
                    correctAnswer: 2,
                    explanation: "The 'My Jobs' section of your application is your go-to resource for questions about shift, pay, directions, and application management."
                },
                {
                    question: "What tasks will you complete prior to Day One?",
                    options: [
                        "Only order safety shoes",
                        "Just set up employee A to Z account",
                        "Start employment paperwork only",
                        "All of the above"
                    ],
                    correctAnswer: 3,
                    explanation: "Prior to Day One, you need to complete ALL tasks: order safety shoes, set up your A to Z account, and start employment paperwork."
                },
                {
                    question: "Where will Amazon contact you with information prior to day one?",
                    options: [
                        "Your home address",
                        "Your phone number",
                        "The email address used on the application",
                        "Through your emergency contact"
                    ],
                    correctAnswer: 2,
                    explanation: "Amazon will contact you with pre-Day One information through the email address you provided on your application."
                },
                {
                    question: "How can you be a 'Day One Hero'?",
                    options: [
                        "Just bring your ID",
                        "Only wear comfortable clothes",
                        "Complete some Day One tasks",
                        "Complete all prior Day One tasks, wear comfortable clothes, bring water and ID, and prepare for exercise soreness"
                    ],
                    correctAnswer: 3,
                    explanation: "To be fully prepared for Day One, complete all tasks, wear comfortable clothes, bring water and ID, and be ready for physical activity."
                }
            ];

            this.initialize();
            console.log('Quiz constructor completed successfully');
        } catch (error) {
            console.error('Constructor Error:', error);
        }
    }

    initialize() {
        try {
            if (this.state.initialized) {
                console.log('Quiz already initialized');
                return;
            }

            this.bindElements();
            this.setupEventListeners();
            this.state.initialized = true;

            // Set initial visibility
            if (this.elements.instructions) {
                this.elements.instructions.style.display = 'block';
            }
            if (this.elements.content) {
                this.elements.content.style.display = 'none';
            }
            if (this.elements.summary) {
                this.elements.summary.style.display = 'none';
            }
            if (this.elements.feedback) {
                this.elements.feedback.style.display = 'none';
            }

            console.log('Quiz initialized successfully');
        } catch (error) {
            console.error('Initialize Error:', error);
        }
    }

    bindElements() {
        try {
            this.elements = {
                instructions: document.querySelector('.quiz-instructions'),
                content: document.querySelector('.quiz-content'),
                feedback: document.querySelector('.feedback-overlay'),
                summary: document.querySelector('.quiz-summary'),
                questionText: document.querySelector('.question-text'),
                optionsGrid: document.querySelector('.options-grid'),
                timer: document.querySelector('#questionTimer'),
                progressBar: document.querySelector('.progress-bar'),
                currentQuestion: document.querySelector('#currentQuestion'),
                currentScore: document.querySelector('#currentScore'),
                totalQuestions: document.querySelector('#totalQuestions'),
                gameComplete: document.getElementById('gameComplete')
            };

            // Verify essential elements
            const requiredElements = ['instructions', 'content', 'feedback', 'questionText', 'optionsGrid'];
            requiredElements.forEach(elementName => {
                if (!this.elements[elementName]) {
                    throw new Error(`Required element not found: ${elementName}`);
                }
            });

            // Set total questions display
            if (this.elements.totalQuestions) {
                this.elements.totalQuestions.textContent = this.config.totalQuestions;
            }

            console.log('Elements bound successfully');
        } catch (error) {
            console.error('BindElements Error:', error);
        }
    }

    setupEventListeners() {
        try {
            // Using event delegation for all quiz buttons
            document.addEventListener('click', (e) => {
                // Start button
                if (e.target.closest('.start-quiz-btn')) {
                    console.log('Start button clicked');
                    this.startQuiz();
                }
                // Continue button
                else if (e.target.closest('.continue-btn')) {
                    console.log('Continue button clicked');
                    e.preventDefault();
                    if (this.state.feedbackVisible) {
                        this.handleContinue();
                    }
                }
                // Retry button
                else if (e.target.closest('.retry-btn')) {
                    console.log('Retry button clicked');
                    this.resetQuiz();
                    this.startQuiz();
                }
                // Complete button
                else if (e.target.closest('.complete-btn')) {
                    console.log('Complete button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    this.completeTraining();
                }
            });

            console.log('Event listeners set up successfully');
        } catch (error) {
            console.error('SetupEventListeners Error:', error);
        }
    }

    startQuiz() {
        try {
            console.log('Starting quiz...');
            this.state.currentQuestion = 0;
            this.state.score = 0;
            this.state.answers = [];
            this.state.startTime = new Date();
            this.state.isActive = true;
            this.state.completed = false;
            this.state.feedbackVisible = false;

            this.elements.instructions.style.display = 'none';
            this.elements.content.style.display = 'block';
            this.elements.summary.style.display = 'none';
            this.elements.feedback.style.display = 'none';
            this.elements.currentScore.textContent = '0';

            // Hide game complete section if visible
            if (this.elements.gameComplete) {
                this.elements.gameComplete.style.display = 'none';
                this.elements.gameComplete.classList.remove('active');
            }

            this.showQuestion();
            console.log('Quiz started successfully');
        } catch (error) {
            console.error('StartQuiz Error:', error);
        }
    }

    showQuestion() {
        try {
            console.log(`Showing question ${this.state.currentQuestion + 1} of ${this.questions.length}`);

            if (this.state.currentQuestion >= this.questions.length) {
                console.log('No more questions, ending quiz');
                this.endQuiz();
                return;
            }

            const question = this.questions[this.state.currentQuestion];
            this.elements.questionText.textContent = question.question;
            this.elements.optionsGrid.innerHTML = '';

            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = option;
                button.addEventListener('click', () => this.submitAnswer(index));
                this.elements.optionsGrid.appendChild(button);
            });

            this.elements.currentQuestion.textContent = this.state.currentQuestion + 1;
            this.updateProgress();
            this.startTimer();

            // Ensure proper visibility
            this.elements.content.style.display = 'block';
            this.elements.feedback.style.display = 'none';
            this.state.feedbackVisible = false;

            if (this.elements.gameComplete) {
                this.elements.gameComplete.style.display = 'none';
                this.elements.gameComplete.classList.remove('active');
            }

            console.log('Question displayed successfully');
        } catch (error) {
            console.error('ShowQuestion Error:', error);
        }
    }

    submitAnswer(answerIndex) {
        try {
            console.log(`Answer submitted: ${answerIndex}`);
            clearInterval(this.timer);

            const currentQuestion = this.questions[this.state.currentQuestion];
            const isCorrect = answerIndex === currentQuestion.correctAnswer;

            if (isCorrect) {
                this.state.score += this.config.pointsPerQuestion;
                this.elements.currentScore.textContent = this.state.score;
            }

            this.state.answers.push({
                questionIndex: this.state.currentQuestion,
                answerIndex: answerIndex,
                correct: isCorrect
            });

            // Disable all option buttons
            const optionButtons = this.elements.optionsGrid.querySelectorAll('.option-btn');
            optionButtons.forEach(button => {
                button.disabled = true;
            });

            this.showFeedback(isCorrect, currentQuestion.explanation);
            console.log('Answer processed successfully');
        } catch (error) {
            console.error('SubmitAnswer Error:', error);
        }
    }

    showFeedback(isCorrect, explanation) {
        try {
            console.log('Showing feedback');
            const feedbackIcon = this.elements.feedback.querySelector('.feedback-icon');
            const feedbackTitle = this.elements.feedback.querySelector('.feedback-title');
            const feedbackExplanation = this.elements.feedback.querySelector('.feedback-explanation');
            const continueBtn = this.elements.feedback.querySelector('.continue-btn');

            if (!feedbackIcon || !feedbackTitle || !feedbackExplanation) {
                throw new Error('Feedback elements not found');
            }

            feedbackIcon.className = `feedback-icon fas ${isCorrect ? 'fa-check-circle correct' : 'fa-times-circle incorrect'}`;
            feedbackTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect';
            feedbackExplanation.textContent = explanation;

            this.elements.feedback.style.display = 'block';
            this.elements.feedback.classList.add('show');
            this.state.feedbackVisible = true;

            if (continueBtn) {
                continueBtn.style.display = 'block';
                continueBtn.disabled = false;
            }

            console.log('Feedback displayed successfully');
        } catch (error) {
            console.error('ShowFeedback Error:', error);
        }
    }

    handleContinue() {
        try {
            console.log('Handling continue action');
            this.state.feedbackVisible = false;
            this.elements.feedback.classList.remove('show');
            this.elements.feedback.style.display = 'none';

            if (this.state.currentQuestion < this.questions.length - 1) {
                this.state.currentQuestion++;
                console.log(`Moving to question ${this.state.currentQuestion + 1}`);
                this.showQuestion();
            } else {
                console.log('Quiz complete, showing summary');
                this.endQuiz();
            }
        } catch (error) {
            console.error('HandleContinue Error:', error);
        }
    }

    updateProgress() {
        try {
            const progress = ((this.state.currentQuestion + 1) / this.questions.length) * 100;
            this.elements.progressBar.style.width = `${progress}%`;
            console.log(`Progress updated: ${progress}%`);
        } catch (error) {
            console.error('UpdateProgress Error:', error);
        }
    }

    startTimer() {
        try {
            if (this.timer) clearInterval(this.timer);

            let timeLeft = this.config.timePerQuestion;
            this.elements.timer.textContent = timeLeft;
            this.elements.timer.parentElement.classList.remove('warning');

            this.timer = setInterval(() => {
                timeLeft--;
                this.elements.timer.textContent = timeLeft;

                if (timeLeft <= 5) {
                    this.elements.timer.parentElement.classList.add('warning');
                }

                if (timeLeft <= 0) {
                    clearInterval(this.timer);
                    this.submitAnswer(-1);
                }
            }, 1000);

            console.log('Timer started');
        } catch (error) {
            console.error('StartTimer Error:', error);
        }
    }

    endQuiz() {
        try {
            console.log('Ending quiz');
            this.state.endTime = new Date();
            this.state.completed = true;
            clearInterval(this.timer);

            this.elements.content.style.display = 'none';
            this.elements.summary.style.display = 'block';

            const correctAnswers = this.state.answers.filter(answer => answer.correct).length;
            const timeElapsed = Math.floor((this.state.endTime - this.state.startTime) / 1000);

            document.getElementById('correctAnswers').textContent = `${correctAnswers}/${this.questions.length}`;
            document.getElementById('completionTime').textContent = this.formatTime(timeElapsed);
            document.getElementById('finalScore').textContent = this.state.score;

            // Ensure game complete section is hidden
            if (this.elements.gameComplete) {
                this.elements.gameComplete.style.display = 'none';
                this.elements.gameComplete.classList.remove('active');
            }

            console.log('Quiz ended successfully');
        } catch (error) {
            console.error('EndQuiz Error:', error);
        }
    }

    formatTime(seconds) {
        try {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        } catch (error) {
            console.error('FormatTime Error:', error);
            return '0:00';
        }
    }

    resetQuiz() {
        try {
            console.log('Resetting quiz');
            this.state = {
                isActive: false,
                currentQuestion: 0,
                score: 0,
                answers: [],
                completed: false,
                initialized: true,
                startTime: null,
                endTime: null,
                feedbackVisible: false
            };

            this.elements.instructions.style.display = 'block';
            this.elements.content.style.display = 'none';
            this.elements.summary.style.display = 'none';
            this.elements.feedback.style.display = 'none';
            this.elements.currentScore.textContent = '0';
            this.elements.progressBar.style.width = '0%';

            // Ensure game complete section is hidden
            if (this.elements.gameComplete) {
                this.elements.gameComplete.style.display = 'none';
                this.elements.gameComplete.classList.remove('active');
            }

            console.log('Quiz reset successfully');
        } catch (error) {
            console.error('ResetQuiz Error:', error);
        }
    }

    completeTraining() {
        try {
            console.log('Complete Training triggered');

            // First, hide all other sections
            if (this.elements.instructions) this.elements.instructions.style.display = 'none';
            if (this.elements.content) this.elements.content.style.display = 'none';
            if (this.elements.summary) this.elements.summary.style.display = 'none';
            if (this.elements.feedback) this.elements.feedback.style.display = 'none';

            // Update game state if it exists
            if (typeof window.gameState !== 'undefined' && window.gameState !== null) {
                if (!window.gameState.gameStats) window.gameState.gameStats = {};
                if (!window.gameState.gameStats.quiz) window.gameState.gameStats.quiz = {};

                window.gameState.gameStats.quiz.completed = true;
                window.gameState.gameStats.quiz.score = this.state.score;

                if (!window.gameState.player) window.gameState.player = {};
                if (!Array.isArray(window.gameState.player.completedSections)) {
                    window.gameState.player.completedSections = [];
                }
                if (!window.gameState.player.completedSections.includes('quiz')) {
                    window.gameState.player.completedSections.push('quiz');
                }

                if (typeof saveGameState === 'function') {
                    saveGameState();
                }
            }

            // Store quiz score
            localStorage.setItem('quizScore', this.state.score.toString());

            // Hide all sections first
            const allSections = document.querySelectorAll('.page');
            allSections.forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });

            // Show game complete section
            const gameCompleteSection = document.getElementById('gameComplete');
            if (gameCompleteSection) {
                setTimeout(() => {
                    gameCompleteSection.style.display = 'block';
                    gameCompleteSection.classList.add('active');

                    // Handle animations
                    const animatedElements = gameCompleteSection.querySelectorAll('.animated');
                    animatedElements.forEach((element, index) => {
                        setTimeout(() => {
                            if (element.dataset.animation) {
                                element.classList.add(element.dataset.animation);
                            }
                        }, index * 100);
                    });

                    // Trigger confetti
                    if (window.certificateManager) {
                        window.certificateManager.triggerConfetti();
                    } else {
                        this.confetti({
                            particleCount: 150,
                            spread: 60,
                            origin: { y: 0.7 }
                        });
                    }
                }, 100);
            } else {
                console.error('Game Complete section not found!');
            }

            console.log('Training completed successfully');
        } catch (error) {
            console.error('CompleteTraining Error:', error);
        }
    }

    confetti(params) {
        try {
            const defaults = {
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF9900', '#232F3E', '#146EB4', '#FFFFFF', '#ff9900'],
                scalar: 2
            };

            const options = { ...defaults, ...params };

            if (window.confetti) {
                window.confetti(options);
            } else {
                console.warn('Confetti library not loaded');
            }
        } catch (error) {
            console.error('Confetti Error:', error);
        }
    }

    debugQuizState() {
        console.log({
            currentQuestion: this.state.currentQuestion,
            totalQuestions: this.questions.length,
            feedbackVisible: this.state.feedbackVisible,
            contentVisible: this.elements.content.style.display,
            score: this.state.score,
            isActive: this.state.isActive,
            completed: this.state.completed,
            elements: {
                instructions: !!this.elements.instructions,
                content: !!this.elements.content,
                feedback: !!this.elements.feedback,
                summary: !!this.elements.summary,
                gameComplete: !!this.elements.gameComplete
            }
        });
    }
}

// Initialize quiz when document is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing quiz...');
        window.amazonQuiz = new AmazonQuiz();

        // Add debug helper to window
        window.debugQuiz = () => window.amazonQuiz.debugQuizState();

        console.log('Quiz initialized. Use window.debugQuiz() to check quiz state.');
    } catch (error) {
        console.error('Quiz Initialization Error:', error);
    }
});
