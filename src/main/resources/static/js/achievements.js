// achievements.js

// Achievement Categories
const ACHIEVEMENT_CATEGORIES = {
    GENERAL: 'general',
    GAMES: 'games',
    QUIZ: 'quiz',
    EXPLORATION: 'exploration'
};

// Achievement Definitions
const achievements = [
    // General Achievements
    {
        id: 'beginner',
        category: ACHIEVEMENT_CATEGORIES.GENERAL,
        name: 'First Steps',
        description: 'Begin your Amazon journey',
        icon: 'fa-star',
        points: 50,
        condition: (state) => state.player.completedSections.length >= 1
    },
    {
        id: 'explorer',
        category: ACHIEVEMENT_CATEGORIES.EXPLORATION,
        name: 'Amazon Explorer',
        description: 'Visit all sections',
        icon: 'fa-compass',
        points: 100,
        condition: (state) => state.player.completedSections.length >= 3
    },

    // Game Achievements - Weight Sorting
    {
        id: 'weight_sorter',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Package Pro',
        description: 'Score 500 points in Weight Sorting',
        icon: 'fa-weight-hanging',
        points: 100,
        condition: (state) => state.gameStats.weightSorting.highScore >= 500
    },
    {
        id: 'weight_master',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Weight Master',
        description: 'Score 1000 points in Weight Sorting',
        icon: 'fa-weight-hanging',
        points: 150,
        condition: (state) => state.gameStats.weightSorting.highScore >= 1000
    },
    {
        id: 'safety_expert',
        category: ACHIEVEMENT_CATEGORIES.GAMES,
        name: 'Safety Expert',
        description: 'Complete 3 levels without mistakes',
        icon: 'fa-shield-alt',
        points: 200,
        condition: (state) => state.gameStats.weightSorting.perfectLevels >= 3
    },

    // Quiz Achievements
    {
        id: 'quiz_novice',
        category: ACHIEVEMENT_CATEGORIES.QUIZ,
        name: 'Quiz Novice',
        description: 'Answer your first question correctly',
        icon: 'fa-question-circle',
        points: 50,
        condition: (state) => state.quizProgress.correctAnswers >= 1
    },
    {
        id: 'quiz_master',
        category: ACHIEVEMENT_CATEGORIES.QUIZ,
        name: 'Quiz Master',
        description: 'Answer 5 questions correctly',
        icon: 'fa-crown',
        points: 150,
        condition: (state) => state.quizProgress.correctAnswers >= 5
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
        gameState.state.player.achievements.push(achievementId);
        gameState.state.player.score += achievement.points;
        gameState.saveState();

        // Show notification
        this.showAchievementPopup(achievement);
    }

    showAchievementPopup(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-content">
                <i class="fas ${achievement.icon}"></i>
                <div class="achievement-text">
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                    <span class="achievement-points">+${achievement.points} points</span>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        requestAnimationFrame(() => {
            popup.classList.add('show');
            this.showConfetti();
            updateAssistantMessage(`Congratulations! You earned the ${achievement.name} achievement!`);
        });

        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }, 3000);
    }

    showConfetti() {
        const colors = ['#FF9900', '#232F3E', '#1768C9', '#FFFFFF'];
        const confettiCount = 50;

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
        if (!achievement) return 0;

        switch (achievement.id) {
            case 'beginner':
                return (gameState.state.player.completedSections.length / 1) * 100;
            case 'explorer':
                return (gameState.state.player.completedSections.length / 3) * 100;
            case 'weight_sorter':
                return (gameState.state.gameStats.weightSorting.highScore / 500) * 100;
            case 'weight_master':
                return (gameState.state.gameStats.weightSorting.highScore / 1000) * 100;
            case 'safety_expert':
                return (gameState.state.gameStats.weightSorting.perfectLevels / 3) * 100;
            case 'quiz_novice':
                return (gameState.state.quizProgress.correctAnswers / 1) * 100;
            case 'quiz_master':
                return (gameState.state.quizProgress.correctAnswers / 5) * 100;
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
            progress: this.getAchievementProgress(achievement.id),
            unlocked: this.hasAchievement(achievement.id)
        }));
    }
}

// Initialize achievement system
const achievementSystem = new AchievementSystem();

// Export for other modules
window.achievementSystem = achievementSystem;
