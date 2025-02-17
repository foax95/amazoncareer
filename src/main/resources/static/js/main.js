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
    try {
        localStorage.setItem('amazonGameState', JSON.stringify(gameState));
    } catch (error) {
        console.error('Error saving game state:', error);
    }
}

function loadGameState() {
    try {
        const savedState = localStorage.getItem('amazonGameState');
        if (savedState) {
            Object.assign(gameState, JSON.parse(savedState));
            updateUI();
        }
    } catch (error) {
        console.error('Error loading game state:', error);
    }
}

function resetGameState() {
    try {
        localStorage.removeItem('amazonGameState');
        location.reload();
    } catch (error) {
        console.error('Error resetting game state:', error);
    }
}

// UI Management
function updateUI() {
    try {
        const scoreDisplay = document.getElementById('scoreDisplay');
        const levelDisplay = document.getElementById('levelDisplay');

        if (scoreDisplay) scoreDisplay.textContent = gameState.player.score;
        if (levelDisplay) levelDisplay.textContent = gameState.player.level;

        updateProgress();
        updateGameStats();
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

function updateProgress() {
    try {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = (gameState.player.completedSections.length / 4) * 100;
            progressBar.style.width = `${progress}%`;
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

function updateGameStats() {
    try {
        const elements = {
            weightSortingHighScore: gameState.gameStats.weightSorting.highScore,
            weightSortingPerfectRounds: gameState.gameStats.weightSorting.perfectRounds,
            pathFindingBestTime: gameState.gameStats.pathFinding.bestTime || '--:--',
            pathFindingCompleted: gameState.gameStats.pathFinding.pathsCompleted,
            matchingHighScore: gameState.gameStats.matching.highScore,
            matchingPerfect: gameState.gameStats.matching.perfectMatches
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    } catch (error) {
        console.error('Error updating game stats:', error);
    }
}
// Section and Navigation Management
function showSection(sectionId) {
    try {
        // Hide all pages first
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Show selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
            selectedSection.style.display = 'block';

            // Track progress
            if (!gameState.player.visitedSections.includes(sectionId)) {
                gameState.player.visitedSections.push(sectionId);
                saveGameState();
            }

            // Special handling for each section
            switch(sectionId) {
                case 'weightSortingGame':
                    const wsInstructions = selectedSection.querySelector('.game-instructions-panel');
                    const wsContent = selectedSection.querySelector('.game-content');
                    if (wsInstructions) wsInstructions.style.display = 'block';
                    if (wsContent) wsContent.style.display = 'none';
                    break;

                case 'gameComplete':
                    updateFinalStats();
                    break;
            }
        }
    } catch (error) {
        console.error('Error showing section:', error);
    }
}

function updateFinalStats() {
    // Update completion stats
    const stats = {
        totalScore: gameState.player.score,
        gamesCompleted: `${gameState.player.completedSections.length}/4`,
        weightSortingScore: gameState.gameStats.weightSorting.lastScore,
        pathFindingScore: gameState.gameStats.pathFinding.lastScore,
        matchingScore: gameState.gameStats.matching.lastScore,
        quizScore: gameState.quizProgress.lastScore
    };

    // Update UI elements
    Object.entries(stats).forEach(([key, value]) => {
        const element = document.getElementById(`${key}FinalScore`);
        if (element) element.textContent = value;
    });
}
//Loading Tips
const loadingTips = [
    "Did you know? Amazon's leadership principles help guide decision-making every day.",
    "Safety First! Always follow proper lifting techniques.",
    "Team lifting is required for packages over 49 lbs.",
    "Take regular breaks during repetitive tasks.",
    "Remember to maintain good posture while working.",
    "Communication is key for team success.",
    "Stay hydrated throughout your shift.",
    "Report any safety concerns immediately.",
    "Your well-being is our top priority."
];

// Update loading tip randomly
function updateLoadingTip() {
    const tipElement = document.getElementById('loadingTip');
    if (tipElement) {
        const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
        tipElement.textContent = randomTip;
    }
}

// Call this during loading
setInterval(updateLoadingTip, 1000); // Change tip every 3 seconds



// Registration Form Handler
function handleRegistration(event) {
    try {
        event.preventDefault();

        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;

        if (name && email) {
            gameState.player.name = name;
            gameState.player.email = email;
            saveGameState();

            // Open the weight sorting game
            showSection('weightSortingGame');
            if (typeof initializeWeightSortingGame === 'function') {
                initializeWeightSortingGame();
            }
        }
    } catch (error) {
        console.error('Error handling registration:', error);
        alert('Failed to register. Please try again.');
    }
}


//What happens after a game is done
function completeGame(currentGame) {
    const gameSequence = {
        weightSortingGame: 'pathFindingGame',
        pathFindingGame: 'matchingGame',
        matchingGame: 'quiz',
        quiz: 'gameComplete'
    };

    const nextGame = gameSequence[currentGame];
    if (nextGame) {
        // Transition directly to the next game without showing loading screen
        showSection(nextGame);
        // Initialize next game if needed
        switch(nextGame) {
            case 'pathFindingGame':
                if (window.pathFindingGame?.initialize) {
                    window.pathFindingGame.initialize();
                }
                break;
            case 'matchingGame':
                if (window.matchingGame?.initialize) {
                    window.matchingGame.initialize();
                }
                break;
            case 'quiz':
                if (window.quizGame?.initialize) {
                    window.quizGame.initialize();
                }
                break;
        }
    }
}



// Game Management
function startGame(gameType) {
    try {
        // First, ensure we're in the games section
        showSection('games');

        // Hide games menu
        const gamesMenu = document.getElementById('gamesMenu');
        if (gamesMenu) gamesMenu.style.display = 'none';

        // Hide all game containers
        document.querySelectorAll('.game-container').forEach(container => {
            container.style.display = 'none';
        });

        // Show selected game container
        const gameContainer = document.getElementById(`${gameType}Game`);
        if (gameContainer) {
            gameContainer.style.display = 'block';

            // Show instructions panel, hide game content
            const instructionsPanel = gameContainer.querySelector('.game-instructions-panel');
            const gameContent = gameContainer.querySelector('.game-content');

            if (instructionsPanel) instructionsPanel.style.display = 'block';
            if (gameContent) gameContent.style.display = 'none';
        }

        // Initialize the specific game
        switch(gameType) {
            case 'weightSorting':
                if (typeof initializeWeightSortingGame === 'function') {
                    initializeWeightSortingGame();
                }
                break;
            case 'pathFinding':
                if (typeof initializePathFindingGame === 'function') {
                    initializePathFindingGame();
                }
                break;
            case 'matching':
                if (typeof initializeMatchingGame === 'function') {
                    initializeMatchingGame();
                }
                break;
        }
    } catch (error) {
        console.error('Error starting game:', error);
    }
}

function returnToGamesMenu() {
    try {
        // Hide all game containers
        document.querySelectorAll('.game-container').forEach(container => {
            container.style.display = 'none';
        });

        // Reset game states
        if (window.weightSortingGame?.resetGame) {
            window.weightSortingGame.resetGame();
        }
        // Add reset calls for other games as needed

        // Show games menu
        const gamesMenu = document.getElementById('gamesMenu');
        if (gamesMenu) gamesMenu.style.display = 'block';

        updateUI();
    } catch (error) {
        console.error('Error returning to games menu:', error);
    }
}

// Game Initialization Functions
function initializeWeightSortingGame() {
    try {
        console.log("Initializing Weight Sorting Game");
        if (window.weightSortingGame?.initialize) {
            window.weightSortingGame.initialize();
        }
    } catch (error) {
        console.error('Error initializing Weight Sorting Game:', error);
    }
}

function initializePathFindingGame() {
    try {
        console.log("Initializing Path Finding Game");
        if (window.pathFindingGame?.initialize) {
            window.pathFindingGame.initialize();
        }
    } catch (error) {
        console.error('Error initializing Path Finding Game:', error);
    }
}

function initializeMatchingGame() {
    try {
        console.log("Initializing Matching Game");
        if (window.matchingGame?.initialize) {
            window.matchingGame.initialize();
        }
    } catch (error) {
        console.error('Error initializing Matching Game:', error);
    }
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
            explanation: "Career Choice is an education assistance program that provides funding for employees to learn new skills."
        },
        {
            question: "How much does Amazon match for 401(k) contributions?",
            options: ["50% up to 2%", "100% up to 4%", "50% up to 4%", "100% up to 6%"],
            correct: 1,
            explanation: "Amazon matches 50% of employee contributions up to 4% of their eligible pay."
        }
    ],
    // Add other quiz categories as needed
};

let currentQuiz = {
    category: null,
    questions: [],
    currentQuestion: 0,
    score: 0,
    userAnswers: []
};

let questionTimer = null;
const QUESTION_TIME = 30; // 30 seconds per question

function startQuiz(category) {
    try {
        currentQuiz = {
            category: category,
            questions: [...quizData[category]],
            currentQuestion: 0,
            score: 0,
            userAnswers: []
        };

        // Randomize questions
        currentQuiz.questions.sort(() => Math.random() - 0.5);

        // Update UI
        const quizCategories = document.getElementById('quizCategories');
        const questionContainer = document.getElementById('questionContainer');

        if (quizCategories) quizCategories.style.display = 'none';
        if (questionContainer) questionContainer.style.display = 'block';

        showQuestion();
    } catch (error) {
        console.error('Error starting quiz:', error);
    }
}

function startQuestionTimer() {
    try {
        clearInterval(questionTimer);
        let timeLeft = QUESTION_TIME;
        const timerDisplay = document.getElementById('questionTimer');

        if (timerDisplay) timerDisplay.textContent = timeLeft;

        questionTimer = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(questionTimer);
                timeOut();
            }
        }, 1000);
    } catch (error) {
        console.error('Error starting question timer:', error);
    }
}

function timeOut() {
    try {
        const optionsContainer = document.getElementById('optionsContainer');
        if (!optionsContainer) return;

        const buttons = optionsContainer.getElementsByClassName('quiz-option');
        Array.from(buttons).forEach(button => button.disabled = true);

        const currentQuestion = currentQuiz.questions[currentQuiz.currentQuestion];
        if (buttons[currentQuestion.correct]) {
            buttons[currentQuestion.correct].classList.add('correct');
        }

        showFeedback(false, "Time's up! " + currentQuestion.explanation);
    } catch (error) {
        console.error('Error handling timeout:', error);
    }
}

function showQuestion() {
    try {
        const question = currentQuiz.questions[currentQuiz.currentQuestion];
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('optionsContainer');
        const currentQuestionDisplay = document.getElementById('currentQuestion');
        const totalQuestionsDisplay = document.getElementById('totalQuestions');
        const progressBar = document.getElementById('quizProgress');

        if (!question || !questionText || !optionsContainer) return;

        if (currentQuestionDisplay) {
            currentQuestionDisplay.textContent = currentQuiz.currentQuestion + 1;
        }
        if (totalQuestionsDisplay) {
            totalQuestionsDisplay.textContent = currentQuiz.questions.length;
        }
        if (progressBar) {
            progressBar.style.width =
                `${((currentQuiz.currentQuestion + 1) / currentQuiz.questions.length) * 100}%`;
        }

        questionText.textContent = question.question;
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <button class="quiz-option" onclick="checkAnswer(${index})">
                ${option}
            </button>
        `).join('');

        startQuestionTimer();
    } catch (error) {
        console.error('Error showing question:', error);
    }
}

function checkAnswer(selectedIndex) {
    try {
        clearInterval(questionTimer);

        const question = currentQuiz.questions[currentQuiz.currentQuestion];
        const optionsContainer = document.getElementById('optionsContainer');
        if (!optionsContainer) return;

        const buttons = optionsContainer.getElementsByClassName('quiz-option');
        currentQuiz.userAnswers[currentQuiz.currentQuestion] = selectedIndex;

        Array.from(buttons).forEach(button => button.disabled = true);

        const isCorrect = selectedIndex === question.correct;
        if (isCorrect) {
            buttons[selectedIndex].classList.add('correct');
            currentQuiz.score++;
        } else {
            buttons[selectedIndex].classList.add('incorrect');
            buttons[question.correct].classList.add('correct');
        }

        showFeedback(isCorrect, question.explanation);
    } catch (error) {
        console.error('Error checking answer:', error);
    }
}

function showFeedback(isCorrect, explanation) {
    try {
        const feedbackContainer = document.getElementById('feedbackContainer');
        const feedbackIcon = document.getElementById('feedbackIcon');
        const feedbackText = document.getElementById('feedbackText');
        const explanationText = document.getElementById('explanationText');

        if (!feedbackContainer || !feedbackIcon || !feedbackText || !explanationText) return;

        feedbackIcon.className = `fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}`;
        feedbackText.textContent = isCorrect ? 'Correct!' : 'Incorrect';
        explanationText.textContent = explanation;

        feedbackContainer.style.display = 'block';
    } catch (error) {
        console.error('Error showing feedback:', error);
    }
}

function nextQuestion() {
    try {
        currentQuiz.currentQuestion++;
        const feedbackContainer = document.getElementById('feedbackContainer');
        if (feedbackContainer) feedbackContainer.style.display = 'none';

        if (currentQuiz.currentQuestion < currentQuiz.questions.length) {
            showQuestion();
        } else {
            showQuizResults();
        }
    } catch (error) {
        console.error('Error moving to next question:', error);
    }
}

function showQuizResults() {
    try {
        const questionContainer = document.getElementById('questionContainer');
        const quizResults = document.getElementById('quizResults');
        const finalScore = document.getElementById('finalScore');
        const resultsBreakdown = document.getElementById('resultsBreakdown');

        if (!questionContainer || !quizResults || !finalScore || !resultsBreakdown) return;

        questionContainer.style.display = 'none';
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
        console.error('Error showing quiz results:', error);
    }
}

function calculateQuizScore(correct, total) {
    return Math.round((correct / total) * 100);
}

function updateQuizProgress(category, score) {
    try {
        if (!gameState.quizProgress[category]) return;

        gameState.quizProgress[category].completed++;
        if (score > gameState.quizProgress[category].bestScore) {
            gameState.quizProgress[category].bestScore = score;
        }
        saveGameState();
        updateQuizCategoryProgress(category);
    } catch (error) {
        console.error('Error updating quiz progress:', error);
    }
}

function updateQuizCategoryProgress(category) {
    try {
        const elements = {
            bestScore: document.querySelector(`#${category}BestScore`),
            completed: document.querySelector(`#${category}Completed`),
            progressRing: document.querySelector(`[data-category="${category}"] .progress-ring`)
        };

        if (elements.bestScore) {
            elements.bestScore.textContent = `${gameState.quizProgress[category].bestScore}%`;
        }
        if (elements.completed) {
            elements.completed.textContent = gameState.quizProgress[category].completed;
        }
        if (elements.progressRing) {
            elements.progressRing.setAttribute('data-progress',
                gameState.quizProgress[category].bestScore);
        }
    } catch (error) {
        console.error('Error updating quiz category progress:', error);
    }
}

// Animation System
function animateElement(element, animation, duration = 300) {
    try {
        if (!element) return;

        element.style.animation = `${animation} ${duration}ms`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    } catch (error) {
        console.error('Error animating element:', error);
    }
}

// Start of main.js

// Loading Screen Management
function showLoadingScreen() {
    return new Promise((resolve) => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.opacity = '1';

            let progress = 0;
            const loadingProgress = document.getElementById('loadingProgress');
            const loadingProgressText = document.getElementById('loadingProgressText');

            const loadingInterval = setInterval(() => {
                progress += 1;

                if (loadingProgress) {
                    loadingProgress.style.width = `${progress}%`;
                }
                if (loadingProgressText) {
                    loadingProgressText.textContent = `${progress}%`;
                }

                if (progress >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => {
                        resolve();
                    }, 500);
                }
            }, 30);
        } else {
            resolve();
        }
    });
}

function hideLoadingScreen() {
    return new Promise((resolve) => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                resolve();
            }, 500);
        } else {
            resolve();
        }
    });
}


// Modal Management
function openResetModal() {
    try {
        const resetModal = document.getElementById('resetModal');
        if (resetModal) {
            resetModal.style.display = 'flex';
            updateResetModalStats();
        }
    } catch (error) {
        console.error('Error opening reset modal:', error);
    }
}

function closeResetModal() {
    try {
        const resetModal = document.getElementById('resetModal');
        if (resetModal) {
            resetModal.style.display = 'none';
        }
    } catch (error) {
        console.error('Error closing reset modal:', error);
    }
}

function updateResetModalStats() {
    try {
        const stats = {
            resetCurrentLevel: gameState.player.level,
            resetTotalScore: gameState.player.score,
            resetGamesCompleted: `${gameState.player.completedSections.length}/4`
        };

        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    } catch (error) {
        console.error('Error updating reset modal stats:', error);
    }
}

// Initialization
async function initializeApp() {
    try {
        // Hide main content initially
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.visibility = 'hidden';
        }

        // Show initial loading screen
        await showLoadingScreen();

        // Load game state
        loadGameState();

        // Hide loading screen and show welcome screen
        await hideLoadingScreen();

        if (mainContent) {
            mainContent.style.visibility = 'visible';
        }

        // Show welcome screen
        showSection('welcomeScreen');

        // Set up event listeners
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', handleRegistration);
        }

    } catch (error) {
        console.error('Error during initialization:', error);
        hideLoadingScreen();
    }
}

// Update the DOM Content Loaded listener
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Export necessary functions
window.startGame = startGame;
window.returnToGamesMenu = returnToGamesMenu;
window.startQuiz = startQuiz;
window.showSection = showSection;
window.openResetModal = openResetModal;
window.closeResetModal = closeResetModal;
window.resetGameState = resetGameState;
