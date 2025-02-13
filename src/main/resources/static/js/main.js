// Assistant Messages
const assistantMessages = {
    welcome: "Hi! I'm your guide to Amazon careers. Ready to start your journey?",
    mainMenu: "Choose any section to explore. Need help? Just click on me!",
    applicationGuide: "Let me walk you through the application process step by step.",
    jobTypes: "Discover our various facilities and find your perfect fit!",
    quiz: "Test your knowledge about Amazon. Choose a category to begin!"
};

// Assistant Functionality
function toggleAssistant() {
    const bubble = document.getElementById('assistantMessage');
    bubble.classList.toggle('active');
}

function updateAssistantMessage(message) {
    const bubble = document.getElementById('assistantMessage');
    bubble.textContent = message;
    bubble.classList.add('active');
    setTimeout(() => bubble.classList.remove('active'), 5000);
}

// Interactive Tips System
const interactiveTips = {
    application: [
        {
            trigger: "applicationGuide",
            message: "Pro Tip: Keep your schedule flexible during peak seasons for more opportunities!",
            icon: "fa-lightbulb"
        },
        {
            trigger: "jobTypes",
            message: "Different facilities offer various shift patterns. Consider what works best for you!",
            icon: "fa-clock"
        }
    ],
    quiz: [
        {
            trigger: "correctAnswer",
            message: "Great job! Keep learning about Amazon's operations!",
            icon: "fa-thumbs-up"
        },
        {
            trigger: "wrongAnswer",
            message: "Don't worry! Review the facility information and try again.",
            icon: "fa-book"
        }
    ]
};

function showTip(tipType, trigger) {
    const relevantTips = interactiveTips[tipType].filter(tip => tip.trigger === trigger);
    if (relevantTips.length > 0) {
        const randomTip = relevantTips[Math.floor(Math.random() * relevantTips.length)];
        updateAssistantMessage(`<i class="fas ${randomTip.icon}"></i> ${randomTip.message}`);
    }
}

// Mobile Detection and Optimization
function isMobile() {
    return window.innerWidth <= 768;
}

function optimizeForMobile() {
    if (isMobile()) {
        // Adjust card sizes
        document.querySelectorAll('.card').forEach(card => {
            card.style.padding = '15px';
        });

        // Adjust font sizes
        document.querySelectorAll('h2').forEach(h2 => {
            h2.style.fontSize = '1.5em';
        });

        // Modify grid layouts
        document.querySelectorAll('.menu-grid').forEach(grid => {
            grid.style.gridTemplateColumns = '1fr';
        });
    }
}

// Error Handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    updateAssistantMessage('Oops! Something went wrong. Please try again.');
}

// Core Initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize game state
        loadGameState();

        // Initialize UI components
        initializeFloatingBoxes();
        initializeAnimations();

        // Set up event listeners
        setupEventListeners();

        // Mobile optimization
        optimizeForMobile();

        // Initial assistant message
        updateAssistantMessage(assistantMessages.welcome);

    } catch (error) {
        handleError(error, 'initialization');
    }
});

// Event Listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);

    // Window resize
    window.addEventListener('resize', optimizeForMobile);

    // Navigation buttons
    document.querySelectorAll('.button-primary[onclick^="showSection"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const section = button.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(section);
        });
    });

    // Menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = item.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(section);
        });
    });
}

// Sound Effects (Optional - Uncomment if needed)
/*
const soundEffects = {
    achievement: new Audio('path/to/achievement.mp3'),
    correct: new Audio('path/to/correct.mp3'),
    wrong: new Audio('path/to/wrong.mp3'),
    click: new Audio('path/to/click.mp3')
};

function playSound(soundName) {
    if (soundEffects[soundName]) {
        soundEffects[soundName].play().catch(error => {
            console.log('Audio playback prevented');
        });
    }
}
*/

// Local Storage Management
function clearLocalData() {
    try {
        localStorage.clear();
        window.location.reload();
    } catch (error) {
        handleError(error, 'data clearing');
    }
}

// API Integration (for future use)
const api = {
    baseUrl: '/api',

    async saveProgress(data) {
        try {
            const response = await fetch(`${this.baseUrl}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            handleError(error, 'API saveProgress');
            return null;
        }
    },

    async getProgress(userId) {
        try {
            const response = await fetch(`${this.baseUrl}/progress/${userId}`);
            return await response.json();
        } catch (error) {
            handleError(error, 'API getProgress');
            return null;
        }
    }
};

// Debug Mode (for development)
const DEBUG = false;

function debug(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

// Export global functions
window.updateAssistantMessage = updateAssistantMessage;
window.toggleAssistant = toggleAssistant;
window.showTip = showTip;
window.handleError = handleError;
window.clearLocalData = clearLocalData;
