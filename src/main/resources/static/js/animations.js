// Core Animation Definitions
const animations = {
    fadeIn: (element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    },

    slideIn: (element) => {
        element.style.transform = 'translateX(-100%)';
        element.style.transition = 'transform 0.5s ease';

        setTimeout(() => {
            element.style.transform = 'translateX(0)';
        }, 100);
    },

    pulseEffect: (element) => {
        element.style.transform = 'scale(1)';
        element.style.transition = 'transform 0.3s ease';

        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
};

// Progress Bar Animation
function animateProgress(element, targetWidth) {
    const currentWidth = parseInt(element.style.width) || 0;
    const increment = (targetWidth - currentWidth) / 30;
    let progress = currentWidth;

    function step() {
        progress += increment;
        element.style.width = `${Math.min(progress, targetWidth)}%`;

        if (progress < targetWidth) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// Floating Boxes Animation
function initializeFloatingBoxes() {
    const boxes = document.querySelector('.floating-boxes');
    for (let i = 0; i < 15; i++) {
        const box = document.createElement('div');
        box.className = 'floating-box';
        box.style.left = `${Math.random() * 100}%`;
        box.style.width = `${Math.random() * 50 + 20}px`;
        box.style.height = box.style.width;
        box.style.animationDelay = `${Math.random() * 5}s`;
        box.style.animationDuration = `${Math.random() * 10 + 10}s`;
        boxes.appendChild(box);
    }
}

// Card Hover Animations
function initializeCardAnimations() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            animations.pulseEffect(card);
        });
    });
}

// Achievement Popup Animation
function animateAchievementPopup(popup) {
    popup.style.transform = 'translateX(120%)';
    popup.style.transition = 'transform 0.3s ease';

    setTimeout(() => {
        popup.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        popup.style.transform = 'translateX(120%)';
    }, 3000);
}

// Assistant (Peccy) Animation
function animateAssistant() {
    const assistant = document.querySelector('.assistant');
    if (assistant) {
        assistant.style.animation = 'float 3s infinite';
    }
}

// Speech Bubble Animation
function animateSpeechBubble(bubble, show = true) {
    if (show) {
        bubble.style.display = 'block';
        animations.fadeIn(bubble);
    } else {
        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(20px)';
        setTimeout(() => {
            bubble.style.display = 'none';
        }, 300);
    }
}

// Menu Item Hover Effect
function initializeMenuAnimations() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
            item.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
}

// Button Click Animation
function addButtonClickAnimation() {
    document.querySelectorAll('.button-primary').forEach(button => {
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// Section Transition Animation
function animateSectionTransition(currentSection, nextSection) {
    currentSection.style.opacity = '0';
    currentSection.style.transform = 'translateY(20px)';

    setTimeout(() => {
        currentSection.style.display = 'none';
        nextSection.style.display = 'block';
        animations.fadeIn(nextSection);
    }, 300);
}

// Confetti Animation
function createConfetti() {
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

// Score Update Animation
function animateScoreUpdate(scoreElement, newScore, oldScore) {
    const duration = 1000;
    const frames = 60;
    const increment = (newScore - oldScore) / frames;
    let current = oldScore;
    let frame = 0;

    function updateScore() {
        current += increment;
        scoreElement.textContent = Math.round(current);
        frame++;

        if (frame < frames) {
            requestAnimationFrame(updateScore);
        } else {
            scoreElement.textContent = newScore;
        }
    }

    requestAnimationFrame(updateScore);
}

// Initialize All Animations
function initializeAnimations() {
    initializeFloatingBoxes();
    initializeCardAnimations();
    initializeMenuAnimations();
    addButtonClickAnimation();
    animateAssistant();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
});

// Export for other modules
window.animations = animations;
window.animateProgress = animateProgress;
window.initializeFloatingBoxes = initializeFloatingBoxes;
window.animateAchievementPopup = animateAchievementPopup;
window.animateSpeechBubble = animateSpeechBubble;
window.createConfetti = createConfetti;
window.animateScoreUpdate = animateScoreUpdate;
