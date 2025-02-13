// Achievement Definitions
const achievements = [
    {
        id: 'beginner',
        name: 'Getting Started',
        description: 'Complete your first section',
        icon: 'fa-star',
        points: 50
    },
    {
        id: 'explorer',
        name: 'Amazon Explorer',
        description: 'Visit all sections',
        icon: 'fa-compass',
        points: 100
    },
    {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Answer 5 questions correctly',
        icon: 'fa-crown',
        points: 150
    }
];

// Achievement System Functions
function checkAchievements() {
    // Getting Started Achievement
    if (gameState.player.completedSections.length === 1 && !hasAchievement('beginner')) {
        awardAchievement('beginner');
    }

    // Explorer Achievement
    if (gameState.player.completedSections.length === 3 && !hasAchievement('explorer')) {
        awardAchievement('explorer');
    }

    // Quiz Master Achievement
    if (gameState.quizProgress.correctAnswers >= 5 && !hasAchievement('quiz_master')) {
        awardAchievement('quiz_master');
    }
}

function hasAchievement(achievementId) {
    return gameState.player.achievements.includes(achievementId);
}

function awardAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !hasAchievement(achievementId)) {
        gameState.player.achievements.push(achievementId);
        gameState.player.score += achievement.points;
        showAchievementPopup(achievement);
        saveGameState();
    }
}

function showAchievementPopup(achievement) {
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
    setTimeout(() => {
        popup.classList.add('show');
        updateAssistantMessage(`Congratulations! You earned the ${achievement.name} achievement!`);
        showConfetti();
    }, 100);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

// Confetti Effect for Achievements
function showConfetti() {
    const colors = ['#FF9900', '#232F3E', '#1768C9', '#FFFFFF'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

// Achievement Progress Tracking
function getAchievementProgress(achievementId) {
    switch (achievementId) {
        case 'beginner':
            return (gameState.player.completedSections.length / 1) * 100;
        case 'explorer':
            return (gameState.player.completedSections.length / 3) * 100;
        case 'quiz_master':
            return (gameState.quizProgress.correctAnswers / 5) * 100;
        default:
            return 0;
    }
}

// Achievement Assistant Messages
const achievementMessages = {
    beginner: "You're off to a great start! Keep exploring to unlock more achievements.",
    explorer: "You've seen it all! Now master each section to become an Amazon expert.",
    quiz_master: "Your knowledge of Amazon is impressive! You're ready for the real thing!"
};

function showAchievementTip(achievementId) {
    if (achievementMessages[achievementId]) {
        updateAssistantMessage(achievementMessages[achievementId]);
    }
}

// Achievement Stats Display
function displayAchievementStats() {
    const stats = {
        total: achievements.length,
        earned: gameState.player.achievements.length,
        points: gameState.player.achievements.reduce((total, id) => {
            const achievement = achievements.find(a => a.id === id);
            return total + (achievement ? achievement.points : 0);
        }, 0)
    };

    return `
        <div class="achievement-stats">
            <div class="stat-item">
                <span class="stat-value">${stats.earned}/${stats.total}</span>
                <span class="stat-label">Achievements</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${stats.points}</span>
                <span class="stat-label">Points</span>
            </div>
        </div>
    `;
}

// Achievement Sound Effects (Optional - Uncomment if needed)
/*
const achievementSound = new Audio('path/to/achievement-sound.mp3');

function playAchievementSound() {
    achievementSound.play().catch(error => console.log('Audio playback prevented'));
}
*/

// Export for other modules
window.achievements = achievements;
window.checkAchievements = checkAchievements;
window.hasAchievement = hasAchievement;
window.awardAchievement = awardAchievement;
window.showAchievementPopup = showAchievementPopup;
window.getAchievementProgress = getAchievementProgress;
window.showAchievementTip = showAchievementTip;
window.displayAchievementStats = displayAchievementStats;
