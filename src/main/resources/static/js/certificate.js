class CertificateManager {
    constructor() {
        this.userName = localStorage.getItem('userName');
        this.completionDate = new Date().toLocaleDateString();
        this.scores = this.getGameScores();
        this.initializeEvents();
        this.displayCertificate(); // Add this to show certificate immediately
        this.loadConfetti().then(() => {
            // Trigger confetti when page loads
            if (window.confetti) {
                this.confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        });
    }

    confetti(param) {
        if (window.confetti) {
            window.confetti(param);
        }
        else {
            console.error('Confetti not loaded');
        }
        console.log('Confetti triggered');
        console.log('Confetti parameters:', param);
        console.log('Confetti loaded:', window.confetti);
        console.log('Confetti function:', window.confetti);

    }

    async loadConfetti() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';
        document.head.appendChild(script);

        return new Promise((resolve) => {
            script.onload = () => resolve();
        });
    }

    initializeEvents() {
        const downloadBtn = document.querySelector('.button-primary');
        if (downloadBtn) {
            downloadBtn.onclick = () => this.downloadCertificate();
        }
    }

    getGameScores() {
        return {
            weightSorting: localStorage.getItem('weightSortingScore') || '0',
            pathFinding: localStorage.getItem('pathFindingScore') || '0',
            matching: localStorage.getItem('matchingGameScore') || '0',
            quiz: localStorage.getItem('quizScore') || '0'
        };
    }

    calculateTotalScore() {
        const scores = this.getGameScores();
        const total = Object.values(scores).reduce((sum, score) => {
            return sum + parseInt(score || 0);
        }, 0);

        // Update the total score display
        const totalScoreElement = document.getElementById('totalFinalScore');
        if (totalScoreElement) {
            totalScoreElement.textContent = this.formatScore(total);
        }

        return total;
    }

    formatScore(score) {
        return parseInt(score || 0).toLocaleString();
    }

    displayCertificate() {
        const scores = this.getGameScores();
        const totalScore = this.calculateTotalScore();

        // Update recipient name and date
        document.querySelector('.recipient-name').textContent = this.userName;
        document.querySelector('.completion-date').textContent = `on ${this.completionDate}`;

        // Update individual scores and progress bars
        this.updateScoreDisplay('weightSorting', scores.weightSorting);
        this.updateScoreDisplay('pathFinding', scores.pathFinding);
        this.updateScoreDisplay('matching', scores.matching);
        this.updateScoreDisplay('quiz', scores.quiz);

        // Update total score
        document.getElementById('totalFinalScore').textContent = this.formatScore(totalScore);

        // Update verification code
        document.getElementById('certificationId').textContent = this.generateVerificationCode();
    }

    updateScoreDisplay(gameType, score) {
        const scoreElement = document.getElementById(`${gameType}FinalScore`);
        const progressBar = document.getElementById(`${gameType}Progress`);

        if (scoreElement) {
            scoreElement.textContent = this.formatScore(score);
        }

        if (progressBar) {
            // Assuming maximum score of 500 for each game
            const percentage = (parseInt(score) / 500) * 100;
            progressBar.style.width = `${Math.min(100, percentage)}%`;
        }
    }

    generateVerificationCode() {
        return btoa(`${this.userName}-${this.completionDate}-${Date.now()}`).substring(0, 8);
    }

    async downloadCertificate() {
        const certificateContent = document.querySelector('.certificate-content');

        try {
            const canvas = await html2canvas(certificateContent, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            });

            const link = document.createElement('a');
            link.download = `Amazon_DayOneHero_Certificate_${this.userName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            this.showNotification('Certificate downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating certificate:', error);
            this.showNotification('Failed to download certificate. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize certificate manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.certificateManager = new CertificateManager();
});
