// main.js

// Game State Management
const gameState = {
    player: {
        name: '',
        email: '',
        score: 0,
        level: 1,
        visitedSections: [],
        completedSections: []
    },
    settings: {
        soundEnabled: true,
        musicEnabled: true
    },
    gameStats: {
        weightSorting: {
            highScore: 0,
            perfectRounds: 0,
            gamesPlayed: 0,
            lastScore: 0
        },
        pathFinding: {
            bestTime: null,
            pathsCompleted: 0,
            gamesPlayed: 0
        },
        matching: {
            highScore: 0,
            perfectMatches: 0,
            gamesPlayed: 0
        }
    },
    quizProgress: {
        safety: { bestScore: 0, completed: 0 },
        benefits: { bestScore: 0, completed: 0 },
        workplace: { bestScore: 0, completed: 0 },
        procedures: { bestScore: 0, completed: 0 }
    }
};

// Local Storage Management
function saveGameState() {
    localStorage.setItem('amazonGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('amazonGameState');
    if (savedState) {
        Object.assign(gameState, JSON.parse(savedState));
        updateUI();
    }
}

function resetGameState() {
    localStorage.removeItem('amazonGameState');
    location.reload();
}

// UI Management
function updateUI() {
    document.getElementById('scoreDisplay').textContent = gameState.player.score;
    document.getElementById('levelDisplay').textContent = gameState.player.level;
    updateProgress();
    updateGameStats();
}

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = (gameState.player.completedSections.length / 4) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function updateGameStats() {
    document.getElementById('weightSortingHighScore').textContent =
        gameState.gameStats.weightSorting.highScore;
    document.getElementById('weightSortingPerfectRounds').textContent =
        gameState.gameStats.weightSorting.perfectRounds;

    document.getElementById('pathFindingBestTime').textContent = gameState.gameStats.pathFinding.bestTime || '--:--';
    document.getElementById('pathFindingCompleted').textContent =
        gameState.gameStats.pathFinding.pathsCompleted;

    document.getElementById('matchingHighScore').textContent =
        gameState.gameStats.matching.highScore;
    document.getElementById('matchingPerfect').textContent =
        gameState.gameStats.matching.perfectMatches;
}

// Navigation Management
function showSection(sectionId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        if (!gameState.player.visitedSections.includes(sectionId)) {
            gameState.player.visitedSections.push(sectionId);
            saveGameState();
        }
    }
}

// Registration Form Handler
function handleRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name && email) {
        gameState.player.name = name;
        gameState.player.email = email;
        saveGameState();
        showSection('mainMenu');
    }
}

// Game Management
function startGame(gameType) {
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById('gamesMenu').style.display = 'none';

    const gameContainer = document.getElementById(`${gameType}Game`);
    if (gameContainer) {
        gameContainer.style.display = 'block';
    }

    switch(gameType) {
        case 'weightSorting':
            initializeWeightSortingGame();
            break;
        case 'pathFinding':
            initializePathFindingGame();
            break;
        case 'matching':
            initializeMatchingGame();
            break;
    }
}

function returnToGamesMenu() {
    // Hide all game containers
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });

    // For Weight Sorting Game specifically
    const weightSortingGame = document.getElementById('weightSortingGame');
    if (weightSortingGame) {
        // Show instructions panel and hide game content
        const instructionsPanel = weightSortingGame.querySelector('.game-instructions-panel');
        const gameContent = weightSortingGame.querySelector('.game-content');

        if (instructionsPanel) {
            instructionsPanel.style.display = 'block';
        }
        if (gameContent) {
            gameContent.style.display = 'none';
        }

        // Reset the game state
        if (window.weightSortingGame && typeof window.weightSortingGame.resetGame === 'function') {
            window.weightSortingGame.resetGame();
        }
    }

    // Show games menu
    document.getElementById('gamesMenu').style.display = 'block';
}

// Quiz System
const quizData = {
    safety: [
        {
            question: "What is the maximum weight for individual lifting?",
            options: ["25 lbs", "35 lbs", "49 lbs", "55 lbs"],
            correct: 2,
            explanation: "The maximum weight for individual lifting is 49 lbs. Anything over requires team lift."
        },
        {
            question: "What should you do if you see a safety hazard?",
            options: ["Ignore it", "Report it immediately", "Wait for someone else to report it", "Fix it yourself"],
            correct: 1,
            explanation: "Always report safety hazards immediately to prevent accidents and injuries."
        },
        {
            question: "How often should you take breaks when doing repetitive tasks?",
            options: ["Never", "Every 4 hours", "Every 2 hours", "When you feel tired"],
            correct: 2,
            explanation: "It's recommended to take short breaks every 2 hours to prevent repetitive strain injuries."
        }
    ],
    benefits: [
        {
            question: "When does health insurance coverage begin at Amazon?",
            options: ["After 90 days", "After 30 days", "Day 1", "After 6 months"],
            correct: 2,
            explanation: "Amazon provides health insurance coverage starting from day one of employment."
        },
        {
            question: "What is the Career Choice program?",
            options: ["A job rotation program", "A leadership training program", "An education assistance program", "A mentorship program"],
            correct: 2,
            explanation: "Career Choice is an education assistance program that provides funding for employees to learn new skills for career success at Amazon or elsewhere."
        },
        {
            question: "How much does Amazon match for 401(k) contributions?",
            options: ["50% up to 2%", "100% up to 4%", "50% up to 4%", "100% up to 6%"],
            correct: 1,
            explanation: "Amazon matches 50% of employee contributions up to 4% of their eligible pay."
        }
    ],
    workplace: [
        {
            question: "What is a fulfillment center?",
            options: ["A customer service office", "A place where orders are packed and shipped", "A corporate office", "A data center"],
            correct: 1,
            explanation: "A fulfillment center is where customer orders are received, packed, and shipped."
        },
        {
            question: "What does AMZL stand for?",
            options: ["Amazon Marketplace", "Amazon Logistics", "Amazon Leadership", "Amazon Learning"],
            correct: 1,
            explanation: "AMZL stands for Amazon Logistics, which is Amazon's delivery service."
        },
        {
            question: "What is the purpose of a sort center?",
            options: ["To handle customer returns", "To sort packages by zip code for faster delivery", "To store inventory", "To process payments"],
            correct: 1,
            explanation: "Sort centers organize packages by zip code to streamline the delivery process."
        }
    ],
    procedures: [
        {
            question: "What should you do if you're going to be late for your shift?",
            options: ["Do nothing", "Call your manager", "Use the A to Z app to report it", "Come in when you can"],
            correct: 2,
            explanation: "Always use the A to Z app to report any tardiness or absence as soon as possible."
        },
        {
            question: "How often are performance reviews conducted?",
            options: ["Monthly", "Quarterly", "Bi-annually", "Annually"],
            correct: 1,
            explanation: "Amazon typically conducts performance reviews on a quarterly basis."
        },
        {
            question: "What is the proper procedure for clocking in and out?",
            options: ["Use your badge at the time clock", "Tell your manager when you arrive and leave", "Sign a paper timesheet", "Use the A to Z app"],
            correct: 0,
            explanation: "Employees should use their badge to clock in and out at designated time clocks."
        }
    ]
};

let currentQuiz = {
    category: null,
    questions: [],
    currentQuestion: 0,
    score: 0
};
// Add after the currentQuiz object:

let questionTimer = null;
const QUESTION_TIME = 30; // 30 seconds per question

function startQuestionTimer() {
    clearInterval(questionTimer);
    let timeLeft = QUESTION_TIME;
    const timerDisplay = document.getElementById('questionTimer');

    if (timerDisplay) timerDisplay.textContent = timeLeft;

    questionTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            timeOut();
        }
    }, 1000);
}

function timeOut() {
    const optionsContainer = document.getElementById('optionsContainer');
    const buttons = optionsContainer.getElementsByClassName('quiz-option');
    Array.from(buttons).forEach(button => button.disabled = true);

    const currentQuestion = currentQuiz.questions[currentQuiz.currentQuestion];
    buttons[currentQuestion.correct].classList.add('correct');

    showFeedback(false, "Time's up! " + currentQuestion.explanation);
}

// Update checkAnswer function to track user answers:
function checkAnswer(selectedIndex) {
    clearInterval(questionTimer); // Clear timer when answer is selected

    const question = currentQuiz.questions[currentQuiz.currentQuestion];
    const optionsContainer = document.getElementById('optionsContainer');
    const buttons = optionsContainer.getElementsByClassName('quiz-option');

    // Track user's answer
    if (!currentQuiz.userAnswers) {
        currentQuiz.userAnswers = [];
    }
    currentQuiz.userAnswers[currentQuiz.currentQuestion] = selectedIndex;

    Array.from(buttons).forEach(button => button.disabled = true);

    if (selectedIndex === question.correct) {
        buttons[selectedIndex].classList.add('correct');
        currentQuiz.score++;
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[question.correct].classList.add('correct');
    }

    showFeedback(selectedIndex === question.correct, question.explanation);
}

// Add quiz progress update functions:
function updateQuizCategoryProgress(category) {
    const categoryCard = document.querySelector(`[data-category="${category}"]`);
    if (categoryCard) {
        const bestScore = document.querySelector(`#${category}BestScore`);
        const completed = document.querySelector(`#${category}Completed`);
        const progressRing = categoryCard.querySelector('.progress-ring');

        if (bestScore) {
            bestScore.textContent = `${gameState.quizProgress[category].bestScore}%`;
        }
        if (completed) {
            completed.textContent = gameState.quizProgress[category].completed;
        }
        if (progressRing) {
            progressRing.setAttribute('data-progress', gameState.quizProgress[category].bestScore);
        }
    }
}

function updateAllQuizProgress() {
    Object.keys(gameState.quizProgress).forEach(category => {
        updateQuizCategoryProgress(category);
    });
}

// Add error handling:
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // You could add user-facing error messages here
}

// Add score calculation function:
function calculateQuizScore(correct, total, timeBonus = 0) {
    const baseScore = (correct / total) * 100;
    const finalScore = Math.round(baseScore + timeBonus);
    return Math.min(100, finalScore); // Cap at 100%
}

// Update showQuizResults function to include more detailed breakdown:
function showQuizResults() {
    try {
        const quizResults = document.getElementById('quizResults');
        const finalScore = document.getElementById('finalScore');
        const resultsBreakdown = document.getElementById('resultsBreakdown');

        document.getElementById('questionContainer').style.display = 'none';
        quizResults.style.display = 'block';

        const scorePercentage = calculateQuizScore(currentQuiz.score, currentQuiz.questions.length);
        finalScore.textContent = scorePercentage;

        resultsBreakdown.innerHTML = currentQuiz.questions.map((question, index) => {
            const userAnswer = currentQuiz.userAnswers[index];
            const isCorrect = userAnswer === question.correct;

            return `
                <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="question-text">${question.question}</div>
                    <div class="answer-details">
                        <div class="user-answer">
                            Your answer: ${question.options[userAnswer]}
                            <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
                        </div>
                        ${!isCorrect ? `
                            <div class="correct-answer">
                                Correct answer: ${question.options[question.correct]}
                            </div>
                        ` : ''}
                        <div class="explanation">${question.explanation}</div>
                    </div>
                </div>
            `;
        }).join('');
        updateQuizProgress(currentQuiz.category, scorePercentage);
    } catch (error) {
        handleError(error, 'showQuizResults');
    }
}

// Update initialization to include quiz progress:
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadGameState();
        showLoadingScreen();

        // Initialize quiz progress
        updateAllQuizProgress();

        setTimeout(() => {
            hideLoadingScreen();
            showSection('welcomeScreen');
        }, 2000);

        // Event listeners
        document.getElementById('registrationForm').addEventListener('submit', handleRegistration);

        // Add quiz-specific event listeners
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    } catch (error) {
        handleError(error, 'initialization');
    }
});

function startQuiz(category) {
    currentQuiz = {
        category: category,
        questions: [...quizData[category]],
        currentQuestion: 0,
        score: 0
    };

    currentQuiz.questions.sort(() => Math.random() - 0.5);

    document.getElementById('quizCategories').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';

    showQuestion();
}

function showQuestion() {
    const question = currentQuiz.questions[currentQuiz.currentQuestion];
    const questionContainer = document.getElementById('questionContainer');
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');

    document.getElementById('currentQuestion').textContent = currentQuiz.currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
    document.getElementById('quizProgress').style.width =
        `${((currentQuiz.currentQuestion + 1) / currentQuiz.questions.length) * 100}%`;

    questionText.textContent = question.question;

    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    startQuestionTimer();
}

function showFeedback(isCorrect, explanation) {
    const feedbackContainer = document.getElementById('feedbackContainer');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackText = document.getElementById('feedbackText');
    const explanationText = document.getElementById('explanationText');

    feedbackIcon.className = `fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}`;
    feedbackText.textContent = isCorrect ? 'Correct!' : 'Incorrect';
    explanationText.textContent = explanation;

    feedbackContainer.style.display = 'block';
}

function nextQuestion() {
    currentQuiz.currentQuestion++;
    if (currentQuiz.currentQuestion < currentQuiz.questions.length) {
        showQuestion();
    } else {
        showQuizResults();
    }
}

function updateQuizProgress(category, score) {
    gameState.quizProgress[category].completed++;
    if (score > gameState.quizProgress[category].bestScore) {
        gameState.quizProgress[category].bestScore = score;
    }
    saveGameState();
    updateUI();
}

function retakeQuiz() {
    startQuiz(currentQuiz.category);
}

function returnToQuizCategories() {
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizCategories').style.display = 'block';
}

// Animation System
function animateElement(element, animation, duration = 300) {
    element.style.animation = `${animation} ${duration}ms`;
    setTimeout(() => {
        element.style.animation = '';
    }, duration);
}

// Modal Management
function openResetModal() {
    document.getElementById('resetModal').style.display = 'flex';
}

function closeResetModal() {
    document.getElementById('resetModal').style.display = 'none';
}

// Loading Screen
function showLoadingScreen() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        loadingOverlay.style.opacity = '1';
    }, 500);
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    showLoadingScreen();

    // Simulate loading time
    setTimeout(() => {
        hideLoadingScreen();
        showSection('welcomeScreen');
    }, 2000);

    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);
});

// Initialize game functions (these will be defined in their respective game files)
function initializeWeightSortingGame() {
    console.log("Weight Sorting Game Initialized");
    // This function will be implemented in weightSorting.js
}

function initializePathFindingGame() {
    console.log("Path Finding Game Initialized");
    // This function will be implemented in pathFinding.js
}

function initializeMatchingGame() {
    console.log("Matching Game Initialized");
    // This function will be implemented in matching.js
}
