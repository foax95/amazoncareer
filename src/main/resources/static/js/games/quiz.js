class AmazonQuiz {
    constructor() {
        this.state = {
            isActive: false,
            currentQuestion: 0,
            score: 0,
            answers: [],
            completed: false,
            initialized: false,
            startTime: null,
            endTime: null
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
    }

    initialize() {
        if (this.state.initialized) return;
        this.bindElements();
        this.setupEventListeners();
        this.state.initialized = true;
    }

    bindElements() {
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
            gameComplete: document.getElementById('gameComplete')
        };
    }

    setupEventListeners() {
        document.querySelector('.start-quiz-btn').addEventListener('click', () => this.startQuiz());
        document.querySelector('.continue-btn').addEventListener('click', () => this.nextQuestion());
        document.querySelector('.retry-btn').addEventListener('click', () => {
            this.resetQuiz();
            this.startQuiz();
        });

        const completeBtn = document.querySelector('.complete-btn');
        if (completeBtn) {
            completeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.completeTraining();
            });
        }
    }

    startQuiz() {
        this.state.startTime = new Date();
        this.state.isActive = true;
        this.elements.instructions.style.display = 'none';
        this.elements.content.style.display = 'block';
        this.showQuestion();
    }

    showQuestion() {
        if (this.state.currentQuestion >= this.questions.length) {
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
        this.elements.feedback.classList.remove('show');
        this.updateProgress();
        this.startTimer();
    }

    startTimer() {
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
    }

    submitAnswer(answerIndex) {
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

        this.showFeedback(isCorrect, currentQuestion.explanation);
    }

    showFeedback(isCorrect, explanation) {
        const feedbackIcon = this.elements.feedback.querySelector('.feedback-icon');
        const feedbackTitle = this.elements.feedback.querySelector('.feedback-title');
        const feedbackExplanation = this.elements.feedback.querySelector('.feedback-explanation');

        feedbackIcon.className = `feedback-icon fas ${isCorrect ? 'fa-check-circle correct' : 'fa-times-circle incorrect'}`;
        feedbackTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect';
        feedbackExplanation.textContent = explanation;

        this.elements.feedback.classList.add('show');
    }

    nextQuestion() {
        this.elements.feedback.classList.remove('show');
        setTimeout(() => {
            this.state.currentQuestion++;
            this.showQuestion();
        }, 300);
    }

    updateProgress() {
        const progress = ((this.state.currentQuestion + 1) / this.questions.length) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
    }

    endQuiz() {
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
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    resetQuiz() {
        this.state = {
            isActive: false,
            currentQuestion: 0,
            score: 0,
            answers: [],
            completed: false,
            initialized: true,
            startTime: null,
            endTime: null
        };

        this.elements.instructions.style.display = 'block';
        this.elements.content.style.display = 'none';
        this.elements.summary.style.display = 'none';
        this.elements.currentScore.textContent = '0';
        this.elements.progressBar.style.width = '0%';
    }

    completeTraining() {
        console.log('Complete Training triggered');

        // Update game state if it exists
        if (typeof window.gameState !== 'undefined' && window.gameState !== null) {
            if (!window.gameState.gameStats) {
                window.gameState.gameStats = {};
            }
            if (!window.gameState.gameStats.quiz) {
                window.gameState.gameStats.quiz = {};
            }
            window.gameState.gameStats.quiz.completed = true;
            window.gameState.gameStats.quiz.score = this.state.score;

            if (!window.gameState.player) {
                window.gameState.player = {};
            }
            if (!Array.isArray(window.gameState.player.completedSections)) {
                window.gameState.player.completedSections = [];
            }
            window.gameState.player.completedSections.push('quiz');

            if (typeof saveGameState === 'function') {
                saveGameState();
            } else {
                console.warn('saveGameState function is not defined');
            }
        } else {
            console.warn('gameState is not defined. Skipping game state update.');
        }

        // Hide all sections
        const allSections = document.querySelectorAll('.page');
        allSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Show game complete section
        const gameCompleteSection = document.getElementById('gameComplete');
        console.log('Game Complete Section:', gameCompleteSection);

        if (gameCompleteSection) {
            gameCompleteSection.style.display = 'block';
            gameCompleteSection.classList.add('active');

            // Update scores
            this.updateFinalScores();

            // Trigger animations
            const animatedElements = gameCompleteSection.querySelectorAll('.animated');
            animatedElements.forEach((element, index) => {
                setTimeout(() => {
                    if (element.dataset.animation) {
                        element.classList.add(element.dataset.animation);
                    }
                }, index * 100);
            });

            // Trigger confetti effect
            this.confetti({
                particleCount: 150,
                spread: 60,
                origin: { y: 0.7 }
            });
        } else {
            console.error('Game Complete section not found!');
        }
    }


    updateFinalScores() {
        try {
            // Update quiz score
            const quizFinalScore = document.getElementById('quizFinalScore');
            if (quizFinalScore) {
                quizFinalScore.textContent = this.state.score;
            }

            // Update quiz progress bar
            const quizProgress = document.getElementById('quizProgress');
            if (quizProgress) {
                const progressPercentage = (this.state.score / (this.config.totalQuestions * this.config.pointsPerQuestion)) * 100;
                quizProgress.style.width = `${progressPercentage}%`;
            }

            // Update total score
            const totalFinalScore = document.getElementById('totalFinalScore');
            if (totalFinalScore) {
                const currentTotal = parseInt(totalFinalScore.textContent) || 0;
                totalFinalScore.textContent = currentTotal + this.state.score;
            }

            // Update games completed
            const gamesCompleted = document.getElementById('gamesCompleted');
            if (gamesCompleted) {
                const [completed, total] = gamesCompleted.textContent.split('/');
                gamesCompleted.textContent = `${parseInt(completed) + 1}/${total}`;
            }

            // Update total time
            if (this.state.startTime && this.state.endTime) {
                const totalTimeTaken = document.getElementById('totalTimeTaken');
                if (totalTimeTaken) {
                    const quizTime = Math.floor((this.state.endTime - this.state.startTime) / 1000);
                    const currentTimeArr = totalTimeTaken.textContent.split(':');
                    const currentSeconds = parseInt(currentTimeArr[0]) * 60 + parseInt(currentTimeArr[1]);
                    const newTotalSeconds = currentSeconds + quizTime;
                    totalTimeTaken.textContent = this.formatTime(newTotalSeconds);
                }
            }
        } catch (error) {
            console.error('Error updating final scores:', error);
        }
    }

    confetti(params) {
        const defaults = {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF9900', '#232F3E', '#146EB4', '#FFFFFF', '#ff9900'],
            scalar: 2
        };

        const options = { ...defaults, ...params };

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        for (let i = 0; i < options.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = (15 + Math.random() * 15) * options.scalar;

            particles.push({
                color: options.colors[Math.floor(Math.random() * options.colors.length)],
                x: options.origin.x ? options.origin.x * canvas.width : canvas.width / 2,
                y: options.origin.y * canvas.height,
                velocity: {
                    x: Math.cos(angle) * velocity * (Math.random() * options.spread - options.spread/2),
                    y: Math.sin(angle) * velocity * (Math.random() * options.spread - options.spread/2)
                },
                size: Math.random() * 10 + 5,
                angle: Math.random() * Math.PI * 2,
                tilt: 0,
                tiltAngleIncrement: Math.random() * 0.1 + 0.05,
                opacity: 1
            });
        }

        let animationFrame;
        let ticks = 0;

        const animate = () => {
            ticks++;
            context.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                particle.velocity.y += 0.5;
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.tilt += particle.tiltAngleIncrement;
                particle.opacity -= 0.005;

                context.save();
                context.translate(particle.x, particle.y);
                context.rotate(particle.angle + particle.tilt);

                context.fillStyle = `rgba(${this.hexToRgb(particle.color)}, ${particle.opacity})`;
                context.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);

                context.restore();

                if (particle.opacity <= 0 ||
                    particle.y > canvas.height ||
                    particle.x < 0 ||
                    particle.x > canvas.width) {
                    particles.splice(index, 1);
                }
            });

            if (particles.length > 0 && ticks < 200) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(animationFrame);
                document.body.removeChild(canvas);
            }
        };

        animate();
    }

    hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    }
}

// Initialize quiz when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.amazonQuiz = new AmazonQuiz();

    // Add CSS for proper visibility
    const style = document.createElement('style');
    style.textContent = `
        .page {
            display: none;
        }

        .page.active {
            display: block !important;
        }

        #gameComplete {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }

        #gameComplete.active {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
