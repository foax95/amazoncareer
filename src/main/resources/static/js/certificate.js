class GameCompletion {
    constructor() {
        // Cache DOM elements
        this.section = document.getElementById('gameComplete');
        this.floatingElements = this.section.querySelectorAll('.floating-element');
        this.surveyFrame = this.section.querySelector('iframe');
        this.notificationTemplate = `
            <div class="notification success" style="display: none;">
                <i class="fas fa-check-circle"></i>
                <span>Survey submitted successfully!</span>
            </div>
        `;
    }

    /**
     * Initialize the completion section
     */
    init() {
        this.initializeFloatingElements();
        this.setupSurveyListener();
        this.appendNotification();
    }

    /**
     * Initialize floating elements with random movements
     */
    initializeFloatingElements() {
        this.floatingElements.forEach(element => {
            // Generate random positions for floating animation
            const xRange = Math.random() * 200 - 100; // -100 to 100
            const yRange = Math.random() * 200 - 100; // -100 to 100

            // Set custom properties for animation
            element.style.setProperty('--x', `${xRange}px`);
            element.style.setProperty('--y', `${yRange}px`);

            // Add random delays to create natural movement
            element.style.animationDelay = `${Math.random() * 2}s`;
        });
    }

    /**
     * Setup survey iframe listener
     */
    setupSurveyListener() {
        if (this.surveyFrame) {
            this.surveyFrame.addEventListener('load', () => this.handleSurveyLoad());

            // Listen for messages from the survey
            window.addEventListener('message', (event) => this.handleSurveyMessage(event));
        }
    }

    /**
     * Handle survey iframe load
     */
    handleSurveyLoad() {
        console.log('Survey loaded successfully');
    }

    /**
     * Handle messages from survey iframe
     * @param {MessageEvent} event
     */
    handleSurveyMessage(event) {
        // Verify origin for security
        if (event.origin !== "https://amazonexteu.qualtrics.com") return;

        try {
            const data = JSON.parse(event.data);
            if (data.event === 'surveyComplete') {
                this.showNotification();
            }
        } catch (error) {
            console.error('Error processing survey message:', error);
        }
    }

    /**
     * Append notification element to DOM
     */
    appendNotification() {
        if (!document.querySelector('.notification')) {
            this.section.insertAdjacentHTML('beforeend', this.notificationTemplate);
        }
    }

    /**
     * Show success notification
     */
    showNotification() {
        const notification = this.section.querySelector('.notification');
        if (!notification) return;

        // Show notification
        notification.style.display = 'flex';
        notification.style.opacity = '1';

        // Hide after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }

    /**
     * Clean up resources
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('message', this.handleSurveyMessage);
        this.floatingElements.forEach(element => {
            element.style.animation = 'none';
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const gameCompletion = new GameCompletion();
    gameCompletion.init();

    // Store instance for potential cleanup
    window.gameCompletion = gameCompletion;
});
