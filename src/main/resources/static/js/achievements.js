// achievements.js

// Achievement Categories
const ACHIEVEMENT_CATEGORIES = {
    GENERAL: 'general',
    GAMES: 'games',
    QUIZ: 'quiz',
    EXPLORATION: 'exploration',
    SAFETY: 'safety',
    TRAINING: 'training',
    FACILITIES: 'facilities',
    CAREER: 'career'
};

// Achievement Definitions
const achievements = [
    // General Achievements Chain
    {
        id: 'welcome_amazon',
        category: ACHIEVEMENT_CATEGORIES.GENERAL,
        name: 'Welcome to Amazon',
        description: 'Begin your Amazon journey',
        icon: 'fa-star',
        points: 50,
        condition: (state) => state.player.started === true,
        chain: 'onboarding',
        chainOrder: 1
    },
    {
        id: 'first_section',
        category: ACHIEVEMENT_CATEGORIES.GENERAL,
        name: 'First Discovery',
        description: 'Complete your first section',
        icon: 'fa-check-circle',
        points: 100,
        condition: (state) => state.player.completedSections.length >= 1,
        chain: 'onboarding',
        chainOrder: 2
    },
    {
        id: 'explorer_bronze',
        category: ACHIEVEMENT_CATEGORIES.EXPLORATION,
        name: 'Bronze Explorer',
        description: 'Visit 3 different sections',
        icon: 'fa-compass',
        points: 150,
        condition: (state) => state.player.visitedSections.length >= 3,
        chain: 'explorer',
        chainOrder: 1
    },
    {
        id: 'explorer_silver',
        category: ACHIEVEMENT_CATEGORIES.EXPLORATION,
        name: 'Silver Explorer',
        description: 'Visit all sections',
        icon: 'fa-compass',
        points: 300,
        condition: (state) => state.player.visitedSections.length >= 6,
        chain: 'explorer',
        chainOrder: 2
    },
    {
        id: 'explorer_gold',
        category: ACHIEVEMENT_CATEGORIES.EXPLORATION,
        name: 'Gold Explorer',
        description: 'Complete all sections',
        icon: 'fa-compass',
        points: 500,
        condition: (state) => state.player.completedSections.length >= 6,
        chain: 'explorer',
        chainOrder: 3
    },

    // Weight Sorting Game Achievements Chain
    {
        id: 'weight_sorting_start',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Safety First',
        description: 'Start the Weight Sorting game',
        icon: 'fa-weight-hanging',
        points: 50,
        condition: (state) => state.gameStats.weightSorting.gamesStarted >= 1,
        chain: 'weight_sorting',
        chainOrder: 1
    },
    {
        id: 'weight_sorting_bronze',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Package Handler',
        description: 'Score 500 points in Weight Sorting',
        icon: 'fa-weight-hanging',
        points: 100,
        condition: (state) => state.gameStats.weightSorting.highScore >= 500,
        chain: 'weight_sorting',
        chainOrder: 2
    },
    {
        id: 'weight_sorting_silver',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Package Expert',
        description: 'Score 1000 points in Weight Sorting',
        icon: 'fa-weight-hanging',
        points: 200,
        condition: (state) => state.gameStats.weightSorting.highScore >= 1000,
        chain: 'weight_sorting',
        chainOrder: 3
    },
    {
        id: 'weight_sorting_gold',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Package Master',
        description: 'Score 2000 points in Weight Sorting',
        icon: 'fa-weight-hanging',
        points: 500,
        condition: (state) => state.gameStats.weightSorting.highScore >= 2000,
        chain: 'weight_sorting',
        chainOrder: 4
    },
    {
        id: 'perfect_sorter',
        category: ACHIEVEMENT_CATEGORIES.SAFETY,
        name: 'Perfect Sorter',
        description: 'Complete a level without mistakes',
        icon: 'fa-shield-alt',
        points: 150,
        condition: (state) => state.gameStats.weightSorting.perfectLevels >= 1,
        chain: 'safety',
        chainOrder: 1
    },
    {
        id: 'safety_expert',
        category: ACHIEVEMENT_CATEGORIES.SAFETY,
        name: 'Safety Expert',
        description: 'Complete 3 levels without mistakes',
        icon: 'fa-shield-alt',
        points: 300,
        condition: (state) => state.gameStats.weightSorting.perfectLevels >= 3,
        chain: 'safety',
        chainOrder: 2
    },
    {
        id: 'safety_master',
        category: ACHIEVEMENT_CATEGORIES.SAFETY,
        name: 'Safety Master',
        description: 'Complete 5 levels without mistakes',
        icon: 'fa-shield-alt',
        points: 500,
        condition: (state) => state.gameStats.weightSorting.perfectLevels >= 5,
        chain: 'safety',
        chainOrder: 3
    },

    // PACE Navigator Achievements
    {
        id: 'navigator_start',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'First Steps',
        description: 'Start the PACE Navigator game',
        icon: 'fa-map-marked-alt',
        points: 50,
        condition: (state) => state.gameStats.paceNavigator.gamesStarted >= 1,
        chain: 'navigation',
        chainOrder: 1
    },
    // More PACE Navigator Achievements
    {
        id: 'quick_learner',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Quick Learner',
        description: 'Complete the PACE Navigator in under 2 minutes',
        icon: 'fa-stopwatch',
        points: 200,
        condition: (state) => state.gameStats.paceNavigator.bestTime <= 120,
        chain: 'navigation',
        chainOrder: 2
    },
    {
        id: 'navigation_expert',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Navigation Expert',
        description: 'Complete the PACE Navigator without any wrong turns',
        icon: 'fa-directions',
        points: 300,
        condition: (state) => state.gameStats.paceNavigator.perfectRuns >= 1,
        chain: 'navigation',
        chainOrder: 3
    },

    // Benefits Matching Game Achievements
    {
        id: 'benefits_novice',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Benefits Novice',
        description: 'Complete the Benefits Matching game',
        icon: 'fa-gift',
        points: 100,
        condition: (state) => state.gameStats.benefitsMatching.gamesCompleted >= 1,
        chain: 'benefits',
        chainOrder: 1
    },
    {
        id: 'benefits_expert',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Benefits Expert',
        description: 'Match all benefits in under 1 minute',
        icon: 'fa-award',
        points: 300,
        condition: (state) => state.gameStats.benefitsMatching.bestTime <= 60,
        chain: 'benefits',
        chainOrder: 2
    },

    // Quiz Achievements
    {
        id: 'quiz_taker',
        category: ACHIEVEMENT_CATEGORIES.QUIZ,
        name: 'Quiz Taker',
        description: 'Complete your first quiz',
        icon: 'fa-question-circle',
        points: 50,
        condition: (state) => state.quizProgress.quizzesCompleted >= 1,
        chain: 'quiz',
        chainOrder: 1
    },
    {
        id: 'quiz_ace',
        category: ACHIEVEMENT_CATEGORIES.QUIZ,
        name: 'Quiz Ace',
        description: 'Score 100% on any quiz',
        icon: 'fa-check-double',
        points: 200,
        condition: (state) => state.quizProgress.perfectScores >= 1,
        chain: 'quiz',
        chainOrder: 2
    },
    {
        id: 'quiz_master',
        category: ACHIEVEMENT_CATEGORIES.QUIZ,
        name: 'Quiz Master',
        description: 'Complete all quizzes with a score of 90% or higher',
        icon: 'fa-crown',
        points: 500,
        condition: (state) => {
            const allQuizzes = state.quizProgress.quizScores;
            return allQuizzes.length >= 4 && allQuizzes.every(score => score >= 90);
        },
        chain: 'quiz',
        chainOrder: 3
    },

    // Facilities Achievements
    {
        id: 'facility_explorer',
        category: ACHIEVEMENT_CATEGORIES.FACILITIES,
        name: 'Facility Explorer',
        description: 'View details of 3 different Amazon facilities',
        icon: 'fa-warehouse',
        points: 100,
        condition: (state) => state.facilitiesExplored.length >= 3,
        chain: 'facilities',
        chainOrder: 1
    },
    {
        id: 'facility_expert',
        category: ACHIEVEMENT_CATEGORIES.FACILITIES,
        name: 'Facility Expert',
        description: 'View details of all Amazon facilities',
        icon: 'fa-industry',
        points: 300,
        condition: (state) => state.facilitiesExplored.length >= 6,
        chain: 'facilities',
        chainOrder: 2
    },

    // Career Achievements
    {
        id: 'career_curious',
        category: ACHIEVEMENT_CATEGORIES.CAREER,
        name: 'Career Curious',
        description: 'Explore 3 different Amazon job roles',
        icon: 'fa-briefcase',
        points: 100,
        condition: (state) => state.careersExplored.length >= 3,
        chain: 'career',
        chainOrder: 1
    },
    {
        id: 'career_planner',
        category: ACHIEVEMENT_CATEGORIES.CAREER,
        name: 'Career Planner',
        description: 'Explore all available Amazon job roles',
        icon: 'fa-sitemap',
        points: 300,
        condition: (state) => state.careersExplored.length >= 6,
        chain: 'career',
        chainOrder: 2
    },

    // Training Achievements
    {
        id: 'eager_learner',
        category: ACHIEVEMENT_CATEGORIES.TRAINING,
        name: 'Eager Learner',
        description: 'Complete your first training module',
        icon: 'fa-book-reader',
        points: 100,
        condition: (state) => state.trainingProgress.modulesCompleted >= 1,
        chain: 'training',
        chainOrder: 1
    },
    {
        id: 'dedicated_student',
        category: ACHIEVEMENT_CATEGORIES.TRAINING,
        name: 'Dedicated Student',
        description: 'Complete 5 training modules',
        icon: 'fa-graduation-cap',
        points: 300,
        condition: (state) => state.trainingProgress.modulesCompleted >= 5,
        chain: 'training',
        chainOrder: 2
    },
    {
        id: 'amazon_scholar',
        category: ACHIEVEMENT_CATEGORIES.TRAINING,
        name: 'Amazon Scholar',
        description: 'Complete all training modules',
        icon: 'fa-user-graduate',
        points: 500,
        condition: (state) => state.trainingProgress.modulesCompleted >= 10,
        chain: 'training',
        chainOrder: 3
    }
];

class AchievementSystem {
    constructor() {
        this.achievements = achievements;
        this.unlockedAchievements = new Set();
        this.initializeFromState();
    }

    initializeFromState() {
        if (gameState && gameState.state.player.achievements) {
            gameState.state.player.achievements.forEach(id => {
                this.unlockedAchievements.add(id);
            });
        }
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.unlockedAchievements.has(achievement.id) &&
                achievement.condition(gameState.state)) {
                this.awardAchievement(achievement.id);
            }
        });
    }

    hasAchievement(achievementId) {
        return this.unlockedAchievements.has(achievementId);
    }

    awardAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || this.hasAchievement(achievementId)) return;

        // Add to unlocked achievements
        this.unlockedAchievements.add(achievementId);

        // Update game state
        if (gameState) {
            gameState.state.player.achievements.push(achievementId);
            gameState.state.player.score += achievement.points;
            gameState.saveState();
        }

        // Show achievement animation and notification
        window.showAchievement(achievement);

        // Check for chain completion
        if (achievement.chain) {
            const chainAchievements = this.achievements.filter(a => a.chain === achievement.chain);
            const allCompleted = chainAchievements.every(a => this.hasAchievement(a.id));
            if (allCompleted) {
                // Format chain name for display
                const chainName = achievement.chain
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                window.showChainCompletion(chainName);
            }
        }

    // Show notification
        this.showAchievementNotification(achievement);

        // Check for chain completion
        if (achievement.chain) {
            this.checkAchievementChain(achievement.chain);
        }
    }

    showAchievementNotification(achievement) {
        // Update achievement message content
        const achievementMessage = document.getElementById('achievementMessage');
        if (achievementMessage) {
            achievementMessage.innerHTML = `
                <strong>${achievement.name}</strong><br>
                ${achievement.description}<br>
                <span class="points">+${achievement.points} points</span>
            `;
        }

        // Show the notification
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show('achievementNotification', null, 5000);
        }

        // Trigger confetti effect
        this.triggerConfetti();

        // Update assistant message
        if (typeof updateAssistantMessage === 'function') {
            updateAssistantMessage(`Congratulations! You earned the "${achievement.name}" achievement!`);
        }
    }

    checkAchievementChain(chainName) {
        const chainAchievements = this.achievements.filter(a => a.chain === chainName)
            .sort((a, b) => a.chainOrder - b.chainOrder);

        const lastUnlocked = chainAchievements.findIndex(a => !this.hasAchievement(a.id)) - 1;

        if (lastUnlocked === chainAchievements.length - 1) {
            // Entire chain completed
            this.showChainCompletionNotification(chainName);
        }
    }

    showChainCompletionNotification(chainName) {
        const chainTitle = chainName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Update notification content
        const achievementMessage = document.getElementById('achievementMessage');
        if (achievementMessage) {
            achievementMessage.innerHTML = `
                <strong>${chainTitle} Mastery</strong><br>
                You've completed the entire ${chainTitle} achievement chain!<br>
                <span class="points">+1000 bonus points</span>
            `;
        }

        // Show the notification
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show('achievementNotification', null, 7000);
        }

        // Add bonus points
        if (gameState) {
            gameState.state.player.score += 1000;
            gameState.saveState();
        }

        // Trigger special confetti effect
        this.triggerConfetti(true);

        // Update assistant message
        if (typeof updateAssistantMessage === 'function') {
            updateAssistantMessage(`Amazing job! You've mastered the entire ${chainTitle} achievement chain!`);
        }
    }

    triggerConfetti(isChainCompletion = false) {
        const colors = isChainCompletion
            ? ['#FFD700', '#FFA500', '#FF4500', '#FF6347'] // Gold theme for chain completion
            : ['#FF9900', '#232F3E', '#1768C9', '#FFFFFF']; // Amazon colors
        const confettiCount = isChainCompletion ? 200 : 100;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.opacity = Math.random().toString();

            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    getAchievementProgress(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || !gameState) return 0;

        const state = gameState.state;

        // Implement specific logic for each achievement's progress
        // This is a simplified example, you'll need to expand this based on your game state structure
        switch (achievement.id) {
            case 'explorer_bronze':
                return (state.player.visitedSections.length / 3) * 100;
            case 'explorer_silver':
                return (state.player.visitedSections.length / 6) * 100;
            case 'explorer_gold':
                return (state.player.completedSections.length / 6) * 100;
            case 'weight_sorting_bronze':
                return (state.gameStats.weightSorting.highScore / 500) * 100;
            case 'weight_sorting_silver':
                return (state.gameStats.weightSorting.highScore / 1000) * 100;
            case 'weight_sorting_gold':
                return (state.gameStats.weightSorting.highScore / 2000) * 100;
            // Add cases for other achievements...
            default:
                return this.hasAchievement(achievementId) ? 100 : 0;
        }
    }

    displayAchievementStats() {
        const totalAchievements = this.achievements.length;
        const earnedAchievements = this.unlockedAchievements.size;
        const totalPoints = Array.from(this.unlockedAchievements)
            .reduce((total, id) => {
                const achievement = this.achievements.find(a => a.id === id);
                return total + (achievement ? achievement.points : 0);
            }, 0);

        return `
            <div class="achievement-stats">
                <div class="stat-item">
                    <span class="stat-value">${earnedAchievements}/${totalAchievements}</span>
                    <span class="stat-label">Achievements</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${totalPoints}</span>
                    <span class="stat-label">Points</span>
                </div>
            </div>
        `;
    }

    getAchievementsByCategory(category) {
        return this.achievements.filter(achievement => achievement.category === category);
    }

    getAllProgress() {
        return this.achievements.map(achievement => ({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            category: achievement.category,
            icon: achievement.icon,
            points: achievement.points,
            progress: this.getAchievementProgress(achievement.id),
            unlocked: this.hasAchievement(achievement.id)
        }));
    }
}

// Initialize achievement system
const achievementSystem = new AchievementSystem();

// Export for other modules
window.achievementSystem = achievementSystem;

// Add CSS for confetti animation if not already in your main.css
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    .confetti {
        position: fixed;
        z-index: 9999;
        width: 10px;
        height: 10px;
        top: -10px;
        pointer-events: none;
        animation: confettiFall linear forwards;
    }

    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
        }
    }
`;
document.head.appendChild(confettiStyle);
