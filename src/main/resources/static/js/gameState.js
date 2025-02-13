// Game State Management
let gameState = {
    player: {
        name: '',
        email: '',
        score: 0,
        progress: {
            applicationGuide: 0,
            jobTypes: 0,
            quiz: 0
        },
        completedSections: [],
        achievements: []
    },
    currentSection: 'welcomeScreen',
    quizProgress: {
        correctAnswers: 0,
        questionsAnswered: 0
    }
};

// Save and Load Functions
function saveGameState() {
    localStorage.setItem('amazonGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('amazonGameState');
    if (saved) {
        gameState = JSON.parse(saved);
        if (gameState.currentSection !== 'welcomeScreen') {
            showSection(gameState.currentSection);
        }
        document.getElementById('scoreDisplay').textContent = gameState.player.score;
        updateProgress();
    }
}

// Progress Management
function updateProgress(section, amount) {
    if (section && amount) {
        if (!gameState.player.progress[section]) {
            gameState.player.progress[section] = 0;
        }
        gameState.player.progress[section] = Math.min(gameState.player.progress[section] + amount, 100);
    }

    const totalProgress = Object.values(gameState.player.progress).reduce((a, b) => a + b, 0) / 3;
    document.getElementById('progressBar').style.width = `${totalProgress}%`;
    document.getElementById('scoreDisplay').textContent = gameState.player.score;

    checkSectionCompletion();
    checkAchievements();
    saveGameState();
}

// Section Completion Check
function checkSectionCompletion() {
    Object.entries(gameState.player.progress).forEach(([section, progress]) => {
        if (progress >= 100 && !gameState.player.completedSections.includes(section)) {
            gameState.player.completedSections.push(section);
            updateCompletionBadge(section);
        }
    });

    // Unlock quiz if two sections are completed
    if (gameState.player.completedSections.length >= 2) {
        document.getElementById('quizMenuItem').classList.remove('locked');
        document.getElementById('quizBadge').innerHTML = '<i class="fas fa-unlock"></i>';
    }
}

function updateCompletionBadge(section) {
    const badge = document.getElementById(`${section}Badge`);
    if (badge) {
        badge.innerHTML = '<i class="fas fa-check"></i>';
    }
}

// Registration Handler
function handleRegistration(e) {
    e.preventDefault();
    gameState.player.name = document.getElementById('name').value;
    gameState.player.email = document.getElementById('email').value;
    saveGameState();
    showSection('mainMenu');
    updateAssistantMessage('Welcome aboard! Choose a section to begin your journey.');
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    gameState.currentSection = sectionId;

    // Initialize section content
    switch(sectionId) {
        case 'applicationGuide':
            initializeApplicationGuide();
            updateAssistantMessage(assistantMessages.applicationGuide);
            break;
        case 'jobTypes':
            initializeFacilities();
            updateAssistantMessage(assistantMessages.jobTypes);
            break;
        case 'quiz':
            initializeQuiz();
            updateAssistantMessage(assistantMessages.quiz);
            break;
        case 'mainMenu':
            updateAssistantMessage(assistantMessages.mainMenu);
            break;
    }

    updateProgress();
    saveGameState();
}

// Reset Progress
function confirmReset() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        localStorage.removeItem('amazonGameState');
        window.location.reload();
    }
}

// Error Handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    updateAssistantMessage('Oops! Something went wrong. Please try again.');
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    try {
        loadGameState();
        setupEventListeners();
    } catch (error) {
        handleError(error, 'gameState initialization');
    }
});

function setupEventListeners() {
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);
}

// Export for other modules
window.gameState = gameState;
window.saveGameState = saveGameState;
window.loadGameState = loadGameState;
window.updateProgress = updateProgress;
window.showSection = showSection;
window.confirmReset = confirmReset;
