// animations.js

class AnimationController {
    constructor() {
        this.animationQueue = new Map();
        this.activeAnimations = new Set();
        this.peccyState = 'idle';
        this.initialized = false;

        // Animation timing configurations
        this.timings = {
            fast: 200,
            normal: 300,
            slow: 500,
            verySlow: 1000,
            achievementShow: 5000,
            chainComplete: 7000,
            notificationSlide: 300
        };

        // Animation effects
        this.effects = {
            glow: 'glow',
            highlight: 'highlight',
            bounce: 'bounce',
            shake: 'shake',
            slideIn: 'slideIn',
            fadeIn: 'fadeIn',
            float: 'float',
            achievementUnlock: 'achievement-unlock',
            chainComplete: 'chain-complete',
            confetti: 'confetti',
            progressFill: 'progress-fill',
            notificationSlide: 'notification-slide'
        };

        // Peccy animation states
        this.peccyAnimations = {
            idle: 'peccy-idle',
            greet: 'peccy-wave',
            bounce: 'peccy-bounce',
            dance: 'peccy-dance',
            think: 'peccy-think',
            celebrate: 'peccy-celebrate'
        };

        // Achievement states
        this.achievementStates = {
            unlocking: 'unlocking',
            showing: 'showing',
            hiding: 'hiding'
        };

        this.init();
    }

    init() {
        if (this.initialized) return;

        this.setupIntersectionObserver();
        this.setupAnimationTriggers();
        this.initializePeccy();
        this.setupEventListeners();
        this.addAnimationStyles();

        this.initialized = true;
        console.log('Animation Controller Initialized with Achievement Support');
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animation;
                    if (animation) {
                        this.animate(element, animation);
                    }
                }
            });
        }, options);

        document.querySelectorAll('[data-animation]').forEach(element => {
            this.observer.observe(element);
        });
    }

    setupAnimationTriggers() {
        document.querySelectorAll('.interactive-element').forEach(element => {
            this.addInteractiveEffect(element);
        });

        document.querySelectorAll('.menu-item').forEach(item => {
            this.addMenuItemEffects(item);
        });

        document.querySelectorAll('.button-primary, .button-secondary').forEach(button => {
            this.addButtonEffects(button);
        });

        document.querySelectorAll('.card').forEach(card => {
            this.addCardEffects(card);
        });
    }

    addInteractiveEffect(element) {
        element.addEventListener('mouseenter', () => {
            this.addEmphasis(element, 'glow');
        });

        element.addEventListener('mouseleave', () => {
            this.removeEmphasis(element);
        });

        element.addEventListener('click', () => {
            this.addEmphasis(element, 'bounce');
        });
    }
    addMenuItemEffects(item) {
        item.addEventListener('mouseenter', () => {
            this.addEmphasis(item, 'highlight');
            const icon = item.querySelector('i');
            if (icon) this.addEmphasis(icon, 'bounce');
        });

        item.addEventListener('mouseleave', () => {
            this.removeEmphasis(item);
            const icon = item.querySelector('i');
            if (icon) this.removeEmphasis(icon);
        });

        item.addEventListener('click', () => {
            this.addEmphasis(item, 'bounce');
        });
    }

    addButtonEffects(button) {
        button.addEventListener('mouseenter', () => {
            this.addEmphasis(button, 'glow');
        });

        button.addEventListener('mouseleave', () => {
            this.removeEmphasis(button);
        });

        button.addEventListener('click', () => {
            this.addEmphasis(button, 'bounce');
            setTimeout(() => this.removeEmphasis(button), 300);
        });
    }

    addCardEffects(card) {
        card.addEventListener('mouseenter', () => {
            this.animate(card, 'float', { duration: this.timings.slow });
        });

        card.addEventListener('mouseleave', () => {
            this.removeAnimation(card);
        });
    }

    addEmphasis(element, type = 'glow') {
        this.removeEmphasis(element); // Clear any existing emphasis

        switch(type) {
            case 'glow':
                element.style.animation = 'glow 2s infinite';
                break;
            case 'highlight':
                element.style.animation = 'highlight 2s infinite';
                element.style.backgroundImage = 'linear-gradient(45deg, var(--amazon-orange), var(--amazon-blue))';
                element.style.backgroundSize = '200% 200%';
                break;
            case 'bounce':
                element.style.animation = 'bounce 1s ease-in-out';
                break;
            case 'shake':
                element.style.animation = 'shake 0.5s ease-in-out';
                break;
            case 'float':
                element.style.animation = 'float 3s infinite ease-in-out';
                break;
        }
    }

    removeEmphasis(element) {
        element.style.animation = '';
        element.style.backgroundImage = '';
    }

    animate(element, animationType, options = {}) {
        const {
            duration = this.timings.normal,
            delay = 0,
            onComplete = null
        } = options;

        // Remove existing animations
        this.removeAnimation(element);

        // Add new animation
        element.classList.add('animated', animationType);
        element.style.animationDuration = `${duration}ms`;
        element.style.animationDelay = `${delay}ms`;

        // Track active animation
        this.activeAnimations.add(element);

        // Handle animation completion
        const handleAnimationEnd = () => {
            this.removeAnimation(element);
            if (onComplete) onComplete();
        };

        element.addEventListener('animationend', handleAnimationEnd, { once: true });
    }

    removeAnimation(element) {
        element.classList.remove('animated');
        Array.from(element.classList).forEach(className => {
            if (Object.values(this.effects).includes(className)) {
                element.classList.remove(className);
            }
        });
        element.style.animation = '';
        this.activeAnimations.delete(element);
    }

    // Achievement Animations
    animateAchievementUnlock(achievement) {
        const notification = document.getElementById('achievementNotification');
        if (!notification) return;

        // Prepare notification content
        const icon = notification.querySelector('.notification-icon i');
        const title = notification.querySelector('h3');
        const message = notification.querySelector('#achievementMessage');
        const progress = notification.querySelector('.progress-fill');

        // Update content
        if (icon) icon.className = `fas ${achievement.icon}`;
        if (title) title.textContent = 'Achievement Unlocked!';
        if (message) {
            message.innerHTML = `
                <strong>${achievement.name}</strong><br>
                ${achievement.description}<br>
                <span class="points">+${achievement.points} points</span>
            `;
        }
        if (progress) {
            progress.style.width = '100%';
            this.animate(progress, 'progressFill', {
                duration: this.timings.normal
            });
        }

        // Show notification
        notification.style.display = 'flex';
        this.animate(notification, 'notificationSlide', {
            duration: this.timings.notificationSlide,
            onComplete: () => {
                setTimeout(() => {
                    this.hideNotification(notification);
                }, this.timings.achievementShow);
            }
        });

        // Create confetti effect
        this.createConfetti();

        // Animate Peccy
        this.updatePeccyForAchievement(achievement);
    }

    animateChainCompletion(chainName) {
        const notification = document.getElementById('achievementNotification');
        if (!notification) return;

        // Update notification content
        const title = notification.querySelector('h3');
        const message = notification.querySelector('#achievementMessage');
        if (title) title.textContent = 'Achievement Chain Complete!';
        if (message) {
            message.innerHTML = `
                <strong>${chainName} Mastery</strong><br>
                You've completed the entire ${chainName} achievement chain!<br>
                <span class="bonus-points">+1000 bonus points</span>
            `;
        }

        // Show notification with special effects
        notification.style.display = 'flex';
        this.animate(notification, 'chainComplete', {
            duration: this.timings.notificationSlide,
            onComplete: () => {
                setTimeout(() => {
                    this.hideNotification(notification);
                }, this.timings.chainComplete);
            }
        });

        // Create special confetti effect
        this.createConfetti(true);

        // Animate Peccy
        this.animatePeccy('dance');
    }
    createConfetti(isChainCompletion = false) {
        const colors = isChainCompletion
            ? ['#FFD700', '#FFA500', '#FF4500', '#FF6347'] // Gold theme for chain completion
            : ['#FF9900', '#232F3E', '#1768C9', '#FFFFFF']; // Amazon colors

        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const count = isChainCompletion ? 200 : 100;
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.opacity = Math.random().toString();
            container.appendChild(confetti);
        }

        setTimeout(() => {
            container.remove();
        }, 5000);
    }

    hideNotification(notification) {
        this.animate(notification, 'notificationSlideOut', {
            duration: this.timings.notificationSlide,
            onComplete: () => {
                notification.style.display = 'none';
            }
        });
    }

    animateProgress(progressBar, percentage, options = {}) {
        if (!progressBar) return;

        const {
            duration = this.timings.normal,
            easing = 'ease-out',
            onComplete = null
        } = options;

        progressBar.style.width = '0%';
        progressBar.style.transition = `width ${duration}ms ${easing}`;

        // Force reflow
        progressBar.offsetWidth;

        progressBar.style.width = `${percentage}%`;

        if (onComplete) {
            setTimeout(onComplete, duration);
        }
    }

    initializePeccy() {
        const peccy = document.getElementById('peccy');
        if (!peccy) return;

        peccy.addEventListener('click', () => {
            this.animatePeccy('greet');
        });

        this.animatePeccy('idle');
    }

    animatePeccy(state) {
        const peccy = document.getElementById('peccy');
        if (!peccy) return;

        // Remove all animation states
        Object.values(this.peccyAnimations).forEach(animation => {
            peccy.classList.remove(animation);
        });

        // Add new animation state
        peccy.classList.add(this.peccyAnimations[state]);
        this.peccyState = state;

        // Return to idle after animations (except for idle state)
        if (state !== 'idle') {
            setTimeout(() => {
                this.animatePeccy('idle');
            }, this.timings.verySlow);
        }
    }

    updatePeccyForAchievement(achievement) {
        if (achievement.chain) {
            this.animatePeccy('dance');
        } else {
            this.animatePeccy('celebrate');
        }
    }

    addAnimationStyles() {
        const styles = `
            @keyframes glow {
                0% { box-shadow: 0 0 5px rgba(255, 153, 0, 0.5); }
                50% { box-shadow: 0 0 20px rgba(255, 153, 0, 0.8); }
                100% { box-shadow: 0 0 5px rgba(255, 153, 0, 0.5); }
            }

            @keyframes highlight {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }

            @keyframes notificationSlide {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes notificationSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            @keyframes progressFill {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
            }

            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                }
            }

            .confetti-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            }

            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                top: -10px;
                pointer-events: none;
                animation: confettiFall linear forwards;
            }

            .animated {
                animation-duration: 0.3s;
                animation-fill-mode: both;
            }

            .notification {
                transform-origin: right center;
            }

            .progress-fill {
                transform-origin: left center;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Utility methods
    clearAllAnimations() {
        this.activeAnimations.forEach(element => {
            this.removeAnimation(element);
        });
        this.activeAnimations.clear();
    }

    pauseAllAnimations() {
        this.activeAnimations.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    resumeAllAnimations() {
        this.activeAnimations.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
}

// Initialize Animation Controller
const animationController = new AnimationController();

// Export for other modules
window.animationController = animationController;

// Animation Helper Functions
function fadeIn(element, options = {}) {
    animationController.animate(element, 'fadeIn', options);
}

function slideIn(element, options = {}) {
    animationController.animate(element, 'slideIn', options);
}

function bounce(element, options = {}) {
    animationController.animate(element, 'bounce', options);
}

function shake(element, options = {}) {
    animationController.animate(element, 'shake', options);
}

function float(element, options = {}) {
    animationController.animate(element, 'float', options);
}

// Export helper functions
window.fadeIn = fadeIn;
window.slideIn = slideIn;
window.bounce = bounce;
window.shake = shake;
window.float = float;

// Event listener for page load
document.addEventListener('DOMContentLoaded', () => {
    animationController.init();
});

// Export achievement-specific animations
window.showAchievement = (achievement) => {
    animationController.animateAchievementUnlock(achievement);
};

window.showChainCompletion = (chainName) => {
    animationController.animateChainCompletion(chainName);
};

window.animateProgress = (element, percentage, options) => {
    animationController.animateProgress(element, percentage, options);
};
