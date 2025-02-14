// Main Application Logic

// Constants
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    createFloatingBoxes();
    setupRegistrationForm();
    initializeAssistant();
    loadUserProgress();
}

// Floating Boxes Animation
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

// Registration Form Handler
function setupRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        // Save user data
        if (typeof gameState !== 'undefined') {
            gameState.state.player.name = name;
            gameState.state.player.email = email;
            gameState.saveState();
        } else {
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
        }

        showSection('mainMenu');
    });
}

// Navigation
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

// Game Management
function startGame(gameType) {
    console.log('Starting game:', gameType);

    // Hide all games and menu
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });
    document.querySelector('.games-menu').style.display = 'none';

    // Show selected game
    const gameContainer = document.getElementById(`${gameType}Game`);
    if (gameContainer) {
        gameContainer.style.display = 'block';

        // Initialize specific game
        switch(gameType) {
            case 'weightSorting':
                if (typeof weightSortingGame !== 'undefined') {
                    weightSortingGame.initialize();
                }
                break;
            case 'pathFinding':
                // Initialize pathFinding game
                break;
            case 'matching':
                // Initialize matching game
                break;
        }

        updateAssistantMessage(gameType);
    }
}

function returnToGamesMenu() {
    // Hide all games
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });

    // Show games menu
    document.querySelector('.games-menu').style.display = 'block';
    updateAssistantMessage('games');
}

// Progress Management
function updateProgress(sectionId) {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    let progress = 0;
    switch(sectionId) {
        case 'mainMenu': progress = 20; break;
        case 'jobTypes': progress = 40; break;
        case 'games': progress = 60; break;
        case 'quiz': progress = 80; break;
        default: progress = 0;
    }

    progressBar.style.width = `${progress}%`;
}

// Notifications
function showAchievement(message) {
    const notification = document.getElementById('achievementNotification');
    const messageElement = document.getElementById('achievementMessage');

    if (notification && messageElement) {
        messageElement.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }
}

function showLevelUp(level) {
    const notification = document.getElementById('levelUpNotification');
    const levelDisplay = document.getElementById('newLevelDisplay');

    if (notification && levelDisplay) {
        levelDisplay.textContent = level;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }
}

// Assistant Management
function initializeAssistant() {
    updateAssistantMessage('welcome');
}

function toggleAssistant() {
    const bubble = document.getElementById('assistantMessage');
    if (bubble) {
        bubble.classList.toggle('active');
    }
}

function updateAssistantMessage(sectionId) {
    const textElement = document.getElementById('assistantText');
    if (!textElement) return;

    const message = ASSISTANT_MESSAGES[sectionId] || ASSISTANT_MESSAGES.default;
    textElement.textContent = message;

    const bubble = document.getElementById('assistantMessage');
    if (bubble) {
        bubble.classList.add('active');
        setTimeout(() => bubble.classList.remove('active'), 5000);
    }
}

// Progress Saving/Loading
function loadUserProgress() {
    const savedProgress = localStorage.getItem('amazonCareerAdventure');
    if (!savedProgress) return null;

    try {
        const progress = JSON.parse(savedProgress);

        // Update score display
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay && progress.score) {
            scoreDisplay.textContent = progress.score;
        }

        // Update level display
        const levelDisplay = document.getElementById('levelDisplay');
        if (levelDisplay && progress.level) {
            levelDisplay.textContent = progress.level;
        }

        // Update completion badges
        if (progress.completedSections) {
            progress.completedSections.forEach(sectionId => {
                const badge = document.getElementById(`${sectionId}Badge`);
                if (badge) {
                    badge.innerHTML = '<i class="fas fa-check"></i>';
                }
            });
        }

        return progress;
    } catch (error) {
        console.error('Error loading progress:', error);
        return null;
    }
}

// Reset Functions
function openResetModal() {
    // Implement reset modal logic
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        resetProgress();
    }
}

function resetProgress() {
    localStorage.clear();
    if (typeof gameState !== 'undefined') {
        gameState.resetProgress();
    }
    location.reload();
}
    // Loading Screen Management
    document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mainContent = document.querySelector('.main-content');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingProgressText = document.getElementById('loadingProgressText');
    const loadingTip = document.getElementById('loadingTip');

    // Array of loading tips
    const loadingTips = [
    "Did you know? Amazon's leadership principles help guide decision-making every day.",
    "Amazon's first book order was shipped in 1995.",
    "Amazon operates in over 100 fulfillment centers worldwide.",
    "Safety is Amazon's top priority in all operations.",
    "Amazon's robotics help make fulfillment centers more efficient."
    ];

    // Initially hide main content
    if (mainContent) {
    mainContent.style.visibility = 'hidden';
}

    let progress = 0;
    const loadingDuration = 3000; // 3 seconds total loading time
    const updateInterval = 30; // Update every 30ms

    // Update loading tip periodically
    function updateLoadingTip() {
    const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    if (loadingTip) {
    loadingTip.textContent = randomTip;
}
}

    // Progress animation
    const progressInterval = setInterval(() => {
    progress += 100 / (loadingDuration / updateInterval);

    if (progress >= 100) {
    progress = 100;
    clearInterval(progressInterval);

    // Hide loading overlay and show main content
    setTimeout(() => {
    loadingOverlay.style.opacity = '0';

    setTimeout(() => {
    loadingOverlay.style.display = 'none';
    if (mainContent) {
    mainContent.style.visibility = 'visible';
    document.getElementById('welcomeScreen').classList.add('active');
}
}, 500);
}, 500);
}

    // Update progress bar and text
    if (loadingProgress) {
    loadingProgress.style.width = `${progress}%`;
}
    if (loadingProgressText) {
    loadingProgressText.textContent = `${Math.round(progress)}%`;
}

    // Update loading tip every 25% progress
    if (progress % 25 < 100 / (loadingDuration / updateInterval)) {
    updateLoadingTip();
}
}, updateInterval);
});
// Page Management Functions
function showSection(sectionId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show requested page
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Form submission handler
function handleRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name && email) {
        // Store user data if needed
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);

        // Hide welcome screen and show main menu
        showSection('mainMenu');
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }

    // Section navigation
    document.querySelectorAll('[data-section]').forEach(element => {
        element.addEventListener('click', (e) => {
            const sectionId = e.currentTarget.getAttribute('data-section');
            showSection(sectionId);
        });
    });
});
// Add this to your main.js or in a script tag before closing body
document.addEventListener('DOMContentLoaded', function() {
    // Hide Peccy's speech bubble by default
    const speechBubble = document.getElementById('assistantMessage');
    if (speechBubble) {
        speechBubble.style.display = 'none';
    }

    // Function to toggle Peccy's speech bubble
    window.toggleAssistant = function() {
        const bubble = document.getElementById('assistantMessage');
        if (bubble) {
            bubble.classList.toggle('show');
        }
    }

    // Function to show notifications
    window.showNotification = function(notificationId, duration = 3000) {
        const notification = document.getElementById(notificationId);
        if (notification) {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, duration);
        }
    }

    // Function to close notifications
    window.closeNotification = function(notificationId) {
        const notification = document.getElementById(notificationId);
        if (notification) {
            notification.classList.remove('show');
        }
    }
});

// Use these functions to show notifications
function showAchievement(message) {
    document.getElementById('achievementMessage').textContent = message;
    showNotification('achievementNotification');
}

function showLevelUp(level) {
    document.getElementById('newLevelDisplay').textContent = level;
    showNotification('levelUpNotification');
}


// Export necessary functions to window object
window.startGame = startGame;
window.returnToGamesMenu = returnToGamesMenu;
window.showSection = showSection;
window.openResetModal = openResetModal;
window.resetProgress = resetProgress;

