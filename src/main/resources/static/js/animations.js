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
            verySlow: 1000
        };

        // Animation effects
        this.effects = {
            glow: 'glow',
            highlight: 'highlight',
            bounce: 'bounce',
            shake: 'shake',
            slideIn: 'slideIn',
            fadeIn: 'fadeIn',
            float: 'float'
        };

        // Peccy animation states
        this.peccyAnimations = {
            idle: 'peccy-idle',
            greet: 'peccy-wave',
            bounce: 'peccy-bounce',
            dance: 'peccy-dance',
            think: 'peccy-think'
        };

        this.init();
    }

    init() {
        if (this.initialized) return;

        this.setupIntersectionObserver();
        this.setupAnimationTriggers();
        this.initializePeccy();
        this.setupEventListeners();

        this.initialized = true;
        console.log('Animation Controller Initialized');
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
        // Interactive elements
        document.querySelectorAll('.interactive-element').forEach(element => {
            this.addInteractiveEffect(element);
        });

        // Menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            this.addMenuItemEffects(item);
        });

        // Buttons
        document.querySelectorAll('.button-primary, .button-secondary').forEach(button => {
            this.addButtonEffects(button);
        });

        // Cards
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

    // Game-specific animations
    animatePackage(packageElement, type = 'spawn') {
        switch(type) {
            case 'spawn':
                this.animate(packageElement, 'fadeIn', {
                    duration: this.timings.fast,
                    onComplete: () => this.addEmphasis(packageElement, 'float')
                });
                break;
            case 'pickup':
                this.animate(packageElement, 'bounce', {
                    duration: this.timings.fast
                });
                break;
            case 'drop':
                this.animate(packageElement, 'bounce', {
                    duration: this.timings.fast
                });
                break;
        }
    }

    animateZone(zoneElement, type = 'highlight') {
        this.addEmphasis(zoneElement, type);
    }

    // Achievement animations
    showAchievement(achievement) {
        const notification = document.getElementById('achievementNotification');
        if (!notification) return;

        this.animate(notification, 'slideIn', {
            duration: this.timings.normal,
            onComplete: () => {
                setTimeout(() => {
                    this.animate(notification, 'fadeOut', {
                        duration: this.timings.normal
                    });
                }, 3000);
            }
        });

        // Animate Peccy for achievement
        this.animatePeccy('celebrate');
    }

    // Level up animations
    showLevelUp(level) {
        const notification = document.getElementById('levelUpNotification');
        if (!notification) return;

        this.animate(notification, 'slideIn', {
            duration: this.timings.normal
        });

        // Animate level number
        const levelDisplay = notification.querySelector('#newLevelDisplay');
        if (levelDisplay) {
            this.addEmphasis(levelDisplay, 'bounce');
        }

        // Animate Peccy for level up
        this.animatePeccy('dance');
    }

    // Score animations
    animateScore(scoreElement, newScore, oldScore) {
        const duration = this.timings.slow;
        const steps = 20;
        const stepDuration = duration / steps;
        const scoreIncrement = (newScore - oldScore) / steps;
        let currentStep = 0;

        const updateScore = () => {
            currentStep++;
            const currentScore = Math.round(oldScore + (scoreIncrement * currentStep));
            scoreElement.textContent = currentScore;

            if (currentStep < steps) {
                setTimeout(updateScore, stepDuration);
            } else {
                scoreElement.textContent = newScore;
                this.addEmphasis(scoreElement, 'bounce');
            }
        };

        updateScore();
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
