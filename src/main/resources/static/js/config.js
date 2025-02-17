const CONFIG = {
    // Game Settings
    GAME_LEVELS: {
        1: { pointsNeeded: 0, title: "Newcomer" },
        2: { pointsNeeded: 100, title: "Learner" },
        3: { pointsNeeded: 250, title: "Explorer" },
        4: { pointsNeeded: 500, title: "Professional" },
        5: { pointsNeeded: 1000, title: "Expert" }
    },

    // Points Settings
    POINTS: {
        WEIGHT_SORTING: {
            baseScore: 10,
            penaltyScore: 5,
            streakMultiplier: 1
        },
        QUIZ: {
            correct: 25,
            timeBonus: 5
        }
    },

    // Weight Sorting Game Settings
    WEIGHT_RANGES: {
        individual: { min: 1, max: 49 },
        team: { min: 50, max: 75 },
        mechanical: { min: 76, max: 100 } // Adjusted to match current implementation
    },

    // Game Timers
    TIMERS: {
        weightSorting: 60, // Fixed 60-second timer
        pathFinding: 60,
        matching: 60,
        questionTimer: 30
    },

    // Package Generation Settings
    PACKAGE_SETTINGS: {
        interval: 3000,      // Base interval between packages
        speed: 8,           // Seconds to cross belt
        maxPackages: 5      // Maximum packages on belt at once
    },

    // Quiz Settings
    QUIZ: {
        categories: ['safety', 'benefits', 'workplace', 'procedures'],
        questionsPerCategory: 3,
        timePerQuestion: 30,
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

    // Loading Screen Settings
    LOADING: {
        minDuration: 2000,
        progressInterval: 30,
        tips: [
            "Did you know? Amazon's leadership principles help guide decision-making every day.",
            "Safety First! Always follow proper lifting techniques.",
            "Team lifting is required for packages over 49 lbs.",
            "Take regular breaks during repetitive tasks."
        ]
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

    // System Settings
    SYSTEM: {
        version: '1.0.0',
        storageKey: 'amazonGameState',
        debug: false
    }
};

// Freeze the configuration to prevent modifications
Object.freeze(CONFIG);

// Export for other modules
window.CONFIG = CONFIG;

// Helper function to get game settings
window.getGameSettings = (gameType) => {
    switch(gameType) {
        case 'weightSorting':
            return {
                timer: CONFIG.TIMERS.weightSorting,
                points: CONFIG.POINTS.WEIGHT_SORTING,
                packageSettings: CONFIG.PACKAGE_SETTINGS,
                weightRanges: CONFIG.WEIGHT_RANGES
            };
        case 'quiz':
            return {
                timer: CONFIG.TIMERS.questionTimer,
                points: CONFIG.POINTS.QUIZ,
                categories: CONFIG.QUIZ.categories,
                questionsPerCategory: CONFIG.QUIZ.questionsPerCategory
            };
        default:
            return null;
    }
};
