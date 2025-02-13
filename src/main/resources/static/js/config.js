// config.js
const CONFIG = {
    // Game Settings
    GAME_LEVELS: {
        1: { pointsNeeded: 0, title: "Newcomer" },
        2: { pointsNeeded: 100, title: "Learner" },
        3: { pointsNeeded: 250, title: "Explorer" },
        4: { pointsNeeded: 500, title: "Professional" },
        5: { pointsNeeded: 1000, title: "Expert" }
    },

    // Timer Settings
    GAME_DURATION: 60, // seconds

    // Points Settings
    POINTS: {
        CORRECT_SORT: 10,
        CORRECT_PATH: 15,
        CARD_MATCH: 20,
        QUIZ_CORRECT: 25
    },

    // Weight Sorting Game Settings
    WEIGHT_RANGES: {
        individual: { min: 1, max: 49 },
        team: { min: 50, max: 75 },
        mechanical: { min: 76, max: 150 }
    },

    // Animation Durations
    ANIMATION_DURATION: 300, // milliseconds

    // Assistant Messages
    ASSISTANT_MESSAGES: {
        WELCOME: "Hi! I'm Peccy, your guide to Amazon. Let's get started!",
        LEVEL_UP: "Great job! You've reached a new level!",
        GAME_COMPLETE: "Well done! You've completed the game!"
    }
};
