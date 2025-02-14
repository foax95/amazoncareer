// config.js
const CONFIG = {
    // Game Settings
    GAME_LEVELS: {
        1: { pointsNeeded: 0, title: "Newcomer", unlocks: ["weightSorting"] },
        2: { pointsNeeded: 100, title: "Learner", unlocks: ["pathFinding"] },
        3: { pointsNeeded: 250, title: "Explorer", unlocks: ["matching"] },
        4: { pointsNeeded: 500, title: "Professional", unlocks: ["quiz"] },
        5: { pointsNeeded: 1000, title: "Expert", unlocks: ["all"] }
    },

    // Section Settings
    SECTION_COMPLETION_POINTS: 100,

    // Timer Settings
    GAME_DURATION: {
        weightSorting: 60,
        pathFinding: 45,
        matching: 120
    },

    // Points Settings
    POINTS: {
        CORRECT_SORT: 10,
        CORRECT_PATH: 15,
        CARD_MATCH: 20,
        QUIZ_CORRECT: 25,
        SECTION_COMPLETE: 50,
        PERFECT_GAME: 100
    },

    // Weight Sorting Game Settings
    WEIGHT_RANGES: {
        individual: { min: 1, max: 49 },
        team: { min: 50, max: 75 },
        mechanical: { min: 76, max: 150 }
    },

    // Path Finding Game Settings
    PATH_FINDING: {
        gridSize: { width: 8, height: 8 },
        moveTimeout: 500,
        locations: ['pace', 'hr', 'learning', 'manager']
    },

    // Matching Game Settings
    MATCHING: {
        difficulty: {
            easy: { pairs: 6, timeLimit: 120 },
            medium: { pairs: 8, timeLimit: 180 },
            hard: { pairs: 12, timeLimit: 240 }
        }
    },

    // Quiz Settings
    QUIZ: {
        questionsPerRound: 10,
        timePerQuestion: 30,
        categories: ['safety', 'benefits', 'workplace', 'procedures'],
        passingScore: 70
    },

    // Animation Settings
    ANIMATION: {
        duration: {
            short: 300,
            medium: 500,
            long: 1000
        },
        effects: {
            fadeIn: 'fade-in',
            fadeOut: 'fade-out',
            slideIn: 'slide-in',
            slideOut: 'slide-out'
        }
    },

    // Assistant Settings
    ASSISTANT: {
        messages: {
            welcome: "Hi! I'm Peccy, your guide to Amazon. Let's get started!",
            levelUp: "Great job! You've reached a new level!",
            gameComplete: "Well done! You've completed the game!",
            sections: {
                games: "Choose a game to practice important Amazon skills!",
                quiz: "Test your knowledge about Amazon!",
                facilities: "Learn about different Amazon facilities!"
            },
            achievements: {
                unlock: "Congratulations! You've unlocked a new achievement!",
                progress: "Keep going! You're making great progress!"
            }
        },
        displayDuration: 5000, // How long assistant messages show
        animations: ['wave', 'jump', 'spin']
    },

    // Progress Settings
    PROGRESS: {
        saveInterval: 30000, // Auto-save interval in milliseconds
        minimumRequired: {
            quizScore: 70,
            gameScore: 500,
            achievements: 5
        }
    },

    // UI Settings
    UI: {
        themes: {
            light: {
                primary: '#232F3E',
                secondary: '#FF9900',
                background: '#FFFFFF'
            },
            dark: {
                primary: '#131921',
                secondary: '#FF9900',
                background: '#232F3E'
            }
        },
        responsive: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        }
    },

    // Debug Settings
    DEBUG: {
        enabled: false,
        logLevel: 'warning', // 'debug', 'info', 'warning', 'error'
        showConsole: false
    },

    // System Settings
    SYSTEM: {
        version: '1.0.0',
        requireLogin: false,
        maxAttempts: 3,
        timeoutDuration: 300000, // 5 minutes in milliseconds
        supportedLanguages: ['en'],
        defaultLanguage: 'en'
    }
};

// Freeze the configuration to prevent modifications
Object.freeze(CONFIG);

// Export for other modules
window.CONFIG = CONFIG;
