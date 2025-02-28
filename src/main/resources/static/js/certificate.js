// certificate.js
class CertificateManager {
    constructor() {
        this.userName = localStorage.getItem('userName');
        this.completionDate = new Date().toLocaleDateString();
        this.initializeEvents();
        this.loadConfetti().then(r => console.log('Confetti loaded'));
    }

    async loadConfetti() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';
        document.head.appendChild(script);
    }

    initializeEvents() {
        const downloadBtn = document.querySelector('[onclick="downloadCertificate()"]');
        if (downloadBtn) {
            downloadBtn.onclick = () => this.showCertificateModal();
        }
    }

    showCertificateModal() {
        // Create modal for certificate preview
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="certificate-container">
                <div class="modal-header">
                    <h3>Your Certificate</h3>
                    <button class="close-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="certificate-preview">
                    <div class="certificate-content">
                        <div class="certificate-header">
                            <img src="amazon-logo.png" alt="Amazon Logo" class="amazon-logo">
                            <h2>Certificate of Completion</h2>
                        </div>
                        <div class="certificate-body">
                            <p class="recipient-name">${this.userName}</p>
                            <p class="completion-text">has successfully completed the</p>
                            <h3>Day One Hero Training Program</h3>
                            <p class="completion-date">on ${this.completionDate}</p>
                            
                            <div class="scores-section">
                                <h4>Achievement Breakdown</h4>
                                <div class="score-grid">
                                    <div class="score-item">
                                        <i class="fas fa-weight-hanging"></i>
                                        <span>Safety First: ${document.getElementById('weightSortingFinalScore').textContent}</span>
                                    </div>
                                    <div class="score-item">
                                        <i class="fas fa-map-marked-alt"></i>
                                        <span>PACE Navigator: ${document.getElementById('pathFindingFinalScore').textContent}</span>
                                    </div>
                                    <div class="score-item">
                                        <i class="fas fa-th"></i>
                                        <span>Benefits Match: ${document.getElementById('matchingFinalScore').textContent}</span>
                                    </div>
                                    <div class="score-item">
                                        <i class="fas fa-question-circle"></i>
                                        <span>Knowledge Quiz: ${document.getElementById('quizFinalScore').textContent}</span>
                                    </div>
                                </div>
                                <div class="total-score">
                                    Total Score: ${document.getElementById('totalFinalScore').textContent}
                                </div>
                            </div>
                        </div>
                        <div class="certificate-footer">
                            <div class="certificate-seal">
                                <i class="fas fa-certificate"></i>
                            </div>
                            <div class="verification-code">
                                ID: ${this.generateVerificationCode()}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="download-btn button-primary">
                        <i class="fas fa-download"></i> Download Certificate
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.close-btn').onclick = () => modal.remove();
        modal.querySelector('.download-btn').onclick = () => this.downloadCertificate();

        // Trigger confetti
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
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

// Add this CSS
const style = document.createElement('style');
style.textContent = `
    .certificate-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
    }

    .certificate-container {
        background: white;
        border-radius: 12px;
        max-width: 900px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
    }

    .certificate-preview {
        padding: 20px;
    }

    .certificate-content {
        border: 10px solid #232F3E;
        padding: 40px;
        text-align: center;
        position: relative;
        background: #fff;
    }

    .amazon-logo {
        max-width: 150px;
        margin-bottom: 20px;
    }

    .recipient-name {
        font-size: 32px;
        color: #232F3E;
        margin: 20px 0;
        font-weight: bold;
    }

    .score-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin: 20px 0;
    }

    .score-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 6px;
    }

    .certificate-seal {
        font-size: 60px;
        color: #FF9900;
        margin: 20px 0;
    }

    .verification-code {
        font-family: monospace;
        color: #666;
    }

    .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid #eee;
        text-align: center;
    }

    @media (max-width: 768px) {
        .score-grid {
            grid-template-columns: 1fr;
        }

        .certificate-content {
            padding: 20px;
        }

        .recipient-name {
            font-size: 24px;
        }
    }
`;

document.head.appendChild(style);

// Initialize certificate manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.certificateManager = new CertificateManager();
});
