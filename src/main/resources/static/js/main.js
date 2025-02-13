// Main Application Logic
// Assistant messages for different sections
const ASSISTANT_MESSAGES = {
    welcome: "Welcome to Amazon Career Adventure! I'm Peccy, your guide. Let's get started!",
    mainMenu: "Choose a section to explore. Each one will help you learn about Amazon!",
    jobTypes: "Discover the various Amazon facilities and job opportunities available!",
    games: "Ready to test your skills? These games will teach you about Amazon operations!",
    quiz: "Time to check your knowledge! Good luck with the quiz!",
    weightSorting: "Remember, safety first! Sort packages based on their weight.",
    pathFinding: "Navigate through an Amazon facility. Find the right locations quickly!",
    matching: "Match Amazon benefits to learn about what we offer our employees.",
    default: "Need help? Just ask! I'm here to assist you on your Amazon journey."
};
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    createFloatingBoxes();
    setupRegistrationForm();
    initializeAssistant();
    loadUserProgress();
}

function createFloatingBoxes() {
    const container = document.querySelector('.floating-boxes');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const box = document.createElement('div');
        box.className = 'floating-box';
        box.style.left = `${Math.random() * 100}%`;
        box.style.top = `${Math.random() * 100}%`;
        box.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(box);
    }
}

function setupRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        gameState.state.player.name = name;
        gameState.state.player.email = email;
        gameState.saveState();

        showSection('mainMenu');
    });
}

function showSection(sectionId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        updateProgress(sectionId);
        updateAssistantMessage(sectionId);
    }
}

function startGame(gameType) {
    console.log('Starting game:', gameType); // Debug log

    // Hide all games
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });

    // Hide games menu
    const gamesMenu = document.querySelector('.games-menu');
    if (gamesMenu) {
        gamesMenu.style.display = 'none';
    }

    // Show and initialize selected game
    const gameContainer = document.getElementById(`${gameType}Game`);
    if (gameContainer) {
        gameContainer.style.display = 'block';

        switch(gameType) {
            case 'weightSorting':
                if (typeof weightSortingGame !== 'undefined') {
                    weightSortingGame.initialize();
                } else {
                    console.error('Weight Sorting game not loaded');
                }
                break;
            case 'pathFinding':
                // Initialize path finding game
                break;
            case 'matching':
                // Initialize matching game
                break;
        }
    }
}

function returnToGamesMenu() {
    // Hide all games
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });

    // Show games menu
    const gamesMenu = document.querySelector('.games-menu');
    if (gamesMenu) {
        gamesMenu.style.display = 'block';
    }
}

function updateProgress(sectionId) {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    let progress = 0;

    switch(sectionId) {
        case 'mainMenu':
            progress = 20;
            break;
        case 'jobTypes':
            progress = 40;
            break;
        case 'games':
            progress = 60;
            break;
        case 'quiz':
            progress = 80;
            break;
        default:
            progress = 0;
    }

    progressBar.style.width = `${progress}%`;
}

function showLevelUpNotification(level) {
    const notification = document.getElementById('levelUpNotification');
    if (!notification) return;

    const levelDisplay = document.getElementById('newLevel');
    if (levelDisplay) {
        levelDisplay.textContent = level;
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function confirmReset() {
    const modal = document.getElementById('resetModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeResetModal() {
    const modal = document.getElementById('resetModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function resetProgress() {
    if (gameState) {
        gameState.resetProgress();
    }
    closeResetModal();
    showSection('welcomeScreen');
}
function showAchievement(message) {
    const notification = document.getElementById('achievementNotification');
    const messageElement = document.getElementById('achievementMessage');

    if (notification && messageElement) {
        messageElement.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

function showLevelUp(level) {
    const notification = document.getElementById('levelUpNotification');
    const levelDisplay = document.getElementById('newLevelDisplay');

    if (notification && levelDisplay) {
        levelDisplay.textContent = level;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

function toggleAssistant() {
    const bubble = document.getElementById('assistantMessage');
    if (bubble) {
        bubble.classList.toggle('active');
    }
}

function updateAssistantMessage(message) {
    const textElement = document.getElementById('assistantText');
    if (textElement) {
        textElement.textContent = message;
    }
}

// Initialize assistant
function initializeAssistant() {
    const assistantContainer = document.querySelector('.assistant-container');
    if (!assistantContainer) return;

    // Create assistant icon if it doesn't exist
    if (!document.querySelector('.assistant')) {
        const assistantIcon = document.createElement('div');
        assistantIcon.className = 'assistant';
        assistantIcon.innerHTML = '<i class="fas fa-robot"></i>';
        assistantIcon.onclick = toggleAssistant;
        assistantContainer.appendChild(assistantIcon);
    }

    // Create speech bubble if it doesn't exist
    if (!document.getElementById('assistantMessage')) {
        const speechBubble = document.createElement('div');
        speechBubble.id = 'assistantMessage';
        speechBubble.className = 'speech-bubble';
        speechBubble.innerHTML = '<p id="assistantText"></p>';
        assistantContainer.appendChild(speechBubble);
    }

    // Set initial message
    updateAssistantMessage('welcome');
}

// Update assistant message based on current section
function updateAssistantMessage(sectionId) {
    const assistantText = document.getElementById('assistantText');
    if (!assistantText) return;

    const message = ASSISTANT_MESSAGES[sectionId] || ASSISTANT_MESSAGES.default;
    assistantText.textContent = message;

    // Show the message
    const speechBubble = document.getElementById('assistantMessage');
    if (speechBubble) {
        speechBubble.classList.add('active');
        // Hide the message after 5 seconds
        setTimeout(() => {
            speechBubble.classList.remove('active');
        }, 5000);
    }
}

// Toggle assistant speech bubble
function toggleAssistant() {
    const speechBubble = document.getElementById('assistantMessage');
    if (speechBubble) {
        speechBubble.classList.toggle('active');
    }
}

// Load user progress
function loadUserProgress() {
    const savedProgress = localStorage.getItem('amazonCareerAdventure');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);

        // Update score
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay && progress.score) {
            scoreDisplay.textContent = progress.score;
        }

        // Update level
        const levelDisplay = document.getElementById('levelDisplay');
        if (levelDisplay && progress.level) {
            levelDisplay.textContent = progress.level;
        }

        // Unlock completed sections
        if (progress.completedSections) {
            progress.completedSections.forEach(sectionId => {
                const badge = document.getElementById(`${sectionId}Badge`);
                if (badge) {
                    badge.innerHTML = '<i class="fas fa-check"></i>';
                }
            });
        }

        // Update game stats
        if (progress.gameStats) {
            Object.keys(progress.gameStats).forEach(gameId => {
                const statsElement = document.getElementById(`${gameId}Stats`);
                if (statsElement) {
                    statsElement.textContent = `High Score: ${progress.gameStats[gameId].highScore}`;
                }
            });
        }

        return progress;
    }
    return null;
}

// Save user progress
function saveUserProgress(progress) {
    localStorage.setItem('amazonCareerAdventure', JSON.stringify(progress));
}

// Update user progress
function updateProgress(sectionId, score = 0) {
    let progress = loadUserProgress() || {
        score: 0,
        level: 1,
        completedSections: [],
        gameStats: {}
    };

    // Update score
    progress.score += score;
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = progress.score;
    }

    // Check for level up
    const newLevel = Math.floor(progress.score / 100) + 1;
    if (newLevel > progress.level) {
        progress.level = newLevel;
        const levelDisplay = document.getElementById('levelDisplay');
        if (levelDisplay) {
            levelDisplay.textContent = progress.level;
        }
        showLevelUp(progress.level);
    }

    // Mark section as completed
    if (!progress.completedSections.includes(sectionId)) {
        progress.completedSections.push(sectionId);
        const badge = document.getElementById(`${sectionId}Badge`);
        if (badge) {
            badge.innerHTML = '<i class="fas fa-check"></i>';
        }
    }

    // Save progress
    saveUserProgress(progress);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeAssistant();
    const progress = loadUserProgress();
    if (progress) {
        updateAssistantMessage('welcome');
    } else {
        updateAssistantMessage('welcome');
    }
});


// Export necessary functions
window.startGame = startGame;
window.returnToGamesMenu = returnToGamesMenu;
window.showSection = showSection;
window.confirmReset = confirmReset;
window.closeResetModal = closeResetModal;
window.resetProgress = resetProgress;
