// Debug Mode Configuration
const DEBUG_MODE = true;

// Game State Management
const gameState = {
    currentSection: 'intro',
    isLoading: false,
    player: {
        name: '',
        email: '',
        score: 0,
        level: 1,
        visitedSections: [],
        completedSections: []
    },
    settings: {
        soundEnabled: true,
        musicEnabled: true
    },
    gameStats: {
        weightSorting: {
            highScore: 0,
            perfectRounds: 0,
            gamesPlayed: 0,
            lastScore: 0
        },
        pathFinding: {
            bestTime: null,
            pathsCompleted: 0,
            gamesPlayed: 0
        },
        matching: {
            highScore: 0,
            perfectMatches: 0,
            gamesPlayed: 0
        }, quiz:
        {
            bestScore: 0,
            completed: 0
        }
    },
    debug: {
        enable: DEBUG_MODE
    }
};

// Loading Management
function showLoadingScreen() {
    return new Promise((resolve) => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.opacity = '1';

            let progress = 0;
            const loadingProgress = document.getElementById('loadingProgress');
            const loadingProgressText = document.getElementById('loadingProgressText');

            const loadingInterval = setInterval(() => {
                progress += 1;
                if (loadingProgress) loadingProgress.style.width = `${progress}%`;
                if (loadingProgressText) loadingProgressText.textContent = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => resolve(), 5000);
                }
            }, 30);
        } else {
            resolve();
        }
    });
}

function hideLoadingScreen() {
    return new Promise((resolve) => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                resolve();
            }, 500);
        } else {
            resolve();
        }
    });
}

// Debug Menu Functions
function showDebugMenu() {
    if (!localStorage.getItem('debugMode')) return;

    const existingMenu = document.getElementById('debugMenu');
    if (existingMenu) existingMenu.remove();

    const debugMenu = document.createElement('div');
    debugMenu.id = 'debugMenu';
    debugMenu.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        min-width: 200px;
    `;

    debugMenu.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid white; text-align: center;">
            Debug Menu
        </div>
    `;

    const sections = ['intro', 'weightSortingGame', 'pathFindingGame', 'matchingGame'];
    sections.forEach(section => {
        const button = document.createElement('button');
        button.textContent = `Skip to ${formatSectionName(section)}`;
        button.style.cssText = `
            display: block;
            margin: 5px 0;
            padding: 8px;
            width: 100%;
            background: #4CAF50;
            border: none;
            border-radius: 3px;
            color: white;
            cursor: pointer;
            transition: background 0.3s;
        `;
        button.onmouseover = () => button.style.background = '#45a049';
        button.onmouseout = () => button.style.background = '#4CAF50';
        button.onclick = () => skipToSection(section);
        debugMenu.appendChild(button);
    });

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Progress';
    resetButton.style.cssText = `
        display: block;
        margin: 5px 0;
        padding: 8px;
        width: 100%;
        background: #f44336;
        border: none;
        border-radius: 3px;
        color: white;
        cursor: pointer;
        transition: background 0.3s;
    `;
    resetButton.onmouseover = () => resetButton.style.background = '#da190b';
    resetButton.onmouseout = () => resetButton.style.background = '#f44336';
    resetButton.onclick = resetGameProgress;
    debugMenu.appendChild(resetButton);

    document.body.appendChild(debugMenu);
}
// State Management Functions
function saveGameState() {
    try {
        localStorage.setItem('amazonGameState', JSON.stringify(gameState));
        if (DEBUG_MODE) {
            console.log('Game state saved:', gameState);
        }
    } catch (error) {
        console.error('Error saving game state:', error);
    }
}

function loadGameState() {
    try {
        const savedState = localStorage.getItem('amazonGameState');
        if (savedState) {
            Object.assign(gameState, JSON.parse(savedState));
            updateUI();
            if (DEBUG_MODE) {
                console.log('Game state loaded:', gameState);
            }
        }
    } catch (error) {
        console.error('Error loading game state:', error);
    }
}

// Section Management
function formatSectionName(sectionId) {
    const sectionNames = {
        'intro': 'Introduction',
        'weightSortingGame': 'Weight Sorting',
        // 'pathFindingGame': 'PACE Navigator',
        'matchingGame': 'Benefits Matching',
        "gameComplete": 'Game Complete'
    };
    return sectionNames[sectionId] || sectionId;
}

function skipToSection(sectionId) {
    showLoadingScreen().then(() => {
        const sections = ['intro', 'weightSortingGame', 'pathFindingGame', 'matchingGame'];
        const index = sections.indexOf(sectionId);

        if (index > 0) {
            // Mark previous sections as completed
            for (let i = 0; i < index; i++) {
                if (!gameState.player.completedSections.includes(sections[i])) {
                    gameState.player.completedSections.push(sections[i]);
                }
            }

            // Set demo stats for skipped sections
            if (sectionId !== 'weightSortingGame') {
                gameState.gameStats.weightSorting = {
                    highScore: 1000,
                    perfectRounds: 5,
                    gamesPlayed: 1,
                    lastScore: 1000
                };
            }
            if (sectionId !== 'pathFindingGame') {
                gameState.gameStats.pathFinding = {
                    bestTime: '1:00',
                    pathsCompleted: 5,
                    gamesPlayed: 1
                };
            }
            if (sectionId !== 'matchingGame') {
                gameState.gameStats.matching = {
                    highScore: 800,
                    perfectMatches: 8,
                    gamesPlayed: 1
                };
            }
        }

        saveGameState();
        showSection(sectionId);

        hideLoadingScreen().then(() => {
            if (DEBUG_MODE) {
                console.log(`Skipped to ${formatSectionName(sectionId)}`);
                console.log('Current game state:', gameState);
            }
        });
    });
}

function resetGameProgress() {
    if (confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
        showLoadingScreen().then(() => {
            localStorage.clear();
            gameState.player = {
                name: '',
                email: '',
                score: 0,
                level: 1,
                visitedSections: [],
                completedSections: []
            };
            gameState.gameStats = {
                weightSorting: {
                    highScore: 0,
                    perfectRounds: 0,
                    gamesPlayed: 0,
                    lastScore: 0
                },
                pathFinding: {
                    bestTime: null,
                    pathsCompleted: 0,
                    gamesPlayed: 0
                },
                matching: {
                    highScore: 0,
                    perfectMatches: 0,
                    gamesPlayed: 0
                }
            };

            saveGameState();

            hideLoadingScreen().then(() => {
                location.reload();
            });
        });
    }
}

// UI Management
function updateUI() {
    try {
        const scoreDisplay = document.getElementById('scoreDisplay');
        const levelDisplay = document.getElementById('levelDisplay');

        if (scoreDisplay) scoreDisplay.textContent = gameState.player.score;
        if (levelDisplay) levelDisplay.textContent = gameState.player.level;

        updateProgress();
        updateGameStats();
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

function updateProgress() {
    try {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const totalSections = 3; // weightSorting, pathFinding, and matching
            const progress = (gameState.player.completedSections.length / totalSections) * 100;
            progressBar.style.width = `${progress}%`;
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

function updateGameStats() {
    try {
        const stats = {
            weightSortingHighScore: gameState.gameStats.weightSorting.highScore,
            weightSortingPerfectRounds: gameState.gameStats.weightSorting.perfectRounds,
            pathFindingBestTime: gameState.gameStats.pathFinding.bestTime || '--:--',
            pathFindingCompleted: gameState.gameStats.pathFinding.pathsCompleted,
            matchingHighScore: gameState.gameStats.matching.highScore,
            matchingPerfect: gameState.gameStats.matching.perfectMatches
        };

        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    } catch (error) {
        console.error('Error updating game stats:', error);
    }
}
// Section Navigation and Game Management
function showSection(sectionId) {
    try {
        document.querySelectorAll('.page').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
            requestAnimationFrame(() => {
                section.classList.add('active');
                gameState.currentSection = sectionId;

                if (!gameState.player.visitedSections.includes(sectionId)) {
                    gameState.player.visitedSections.push(sectionId);
                    saveGameState();
                }

                initializeGame(sectionId);
            });
        }

        if (gameState.debug.enabled) {
            showDebugMenu();
        }

        updateProgress();
    } catch (error) {
        console.error('Error showing section:', error);
        if (DEBUG_MODE) {
            console.log('Failed to show section:', sectionId);
        }
    }
}
function startJourney() {
    // Hide welcome screen
    document.getElementById('welcomeScreen').classList.remove('active');

    // Start the first game in the sequence (Weight Sorting)
    showSection('weightSortingGame');

    // Initialize the game if needed
    if (window.weightSortingGame && typeof window.weightSortingGame.initialize === 'function') {
        window.weightSortingGame.initialize();
    }

    // Update game state
    if (!gameState.player.visitedSections.includes('weightSortingGame')) {
        gameState.player.visitedSections.push('weightSortingGame');
    }
    saveGameState();
}

function initializeGame(sectionId) {
    try {
        switch (sectionId) {
            case 'weightSortingGame':
                if (window.weightSortingGame?.initialize) {
                    window.weightSortingGame.initialize();
                }
                break;
            case 'pathFindingGame':
                if (window.pathFindingGame?.initialize) {
                    window.pathFindingGame.initialize();
                }
                break;
            case 'matchingGame':
                if (window.matchingGame?.initialize) {
                    window.matchingGame.initialize();
                }
                break;
            default:
                if (DEBUG_MODE) {
                    console.log(`No initialization needed for section: ${sectionId}`);
                }
        }
    } catch (error) {
        console.error(`Error initializing game for section ${sectionId}:`, error);
    }
}

function startTraining() {
    const playerNameInput = document.getElementById('playerName');
    const playerEmailInput = document.getElementById('playerEmail');

    let playerName = 'Associate';
    let playerEmail = '';

    if (playerNameInput) {
        playerName = playerNameInput.value.trim() || 'Associate';
    }
    if (playerEmailInput) {
        playerEmail = playerEmailInput.value.trim();
    }

    gameState.player.name = playerName;
    gameState.player.email = playerEmail;
    saveGameState();
    showSection('weightSortingGame');
}

function completeGame(currentGame) {
    const gameSequence = {
        weightSortingGame: 'matchingGame', //replace matchingGame with pathFindingGame to enable the next game
        // pathFindingGame: 'matchingGame',
        matchingGame: 'gameComplete'
    };

    const nextGame = gameSequence[currentGame];
    if (nextGame) {
        if (!gameState.player.completedSections.includes(currentGame)) {
            gameState.player.completedSections.push(currentGame);
            saveGameState();
        }
        showSection(nextGame);
    }
}

// Game Management
function startGame(gameType) {
    try {
        showSection('games');
        const gamesMenu = document.getElementById('gamesMenu');
        if (gamesMenu) gamesMenu.style.display = 'none';

        document.querySelectorAll('.game-container').forEach(container => {
            container.style.display = 'none';
        });

        const gameContainer = document.getElementById(`${gameType}Game`);
        if (gameContainer) {
            gameContainer.style.display = 'block';
            const instructionsPanel = gameContainer.querySelector('.game-instructions-panel');
            const gameContent = gameContainer.querySelector('.game-content');

            if (instructionsPanel) instructionsPanel.style.display = 'block';
            if (gameContent) gameContent.style.display = 'none';
        }


    } catch (error) {
        console.error('Error starting game:', error);
    }
}

// Loading Tips
const loadingTips = [
    "Did you know? Amazon's leadership principles help guide decision-making every day.",
    "Safety First! Always follow proper lifting techniques.",
    "Team lifting is required for packages over 49 lbs.",
    "Take regular breaks during repetitive tasks.",
    "Remember to maintain good posture while working.",
    "Communication is key for team success.",
    "Stay hydrated throughout your shift.",
    "Report any safety concerns immediately.",
    "Your well-being is our top priority."
];

function updateLoadingTip() {
    const tipElement = document.getElementById('loadingTip');
    if (tipElement) {
        tipElement.textContent = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    }
}

// Modal Management
function openResetModal() {
    try {
        const resetModal = document.getElementById('resetModal');
        if (resetModal) {
            resetModal.style.display = 'flex';
            updateResetModalStats();
        }
    } catch (error) {
        console.error('Error opening reset modal:', error);
    }
}

function closeResetModal() {
    try {
        const resetModal = document.getElementById('resetModal');
        if (resetModal) {
            resetModal.style.display = 'none';
        }
    } catch (error) {
        console.error('Error closing reset modal:', error);
    }
}

function updateResetModalStats() {
    try {
        const stats = {
            resetCurrentLevel: gameState.player.level,
            resetTotalScore: gameState.player.score,
            resetGamesCompleted: `${gameState.player.completedSections.length}/3`
        };

        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    } catch (error) {
        console.error('Error updating reset modal stats:', error);
    }
}

// Animation System
function animateElement(element, animation, duration = 300) {
    try {
        if (!element) return;
        element.style.animation = `${animation} ${duration}ms`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    } catch (error) {
        console.error('Error animating element:', error);
    }
}

// Initialization
async function initializeApp() {
    try {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.visibility = 'hidden';
        }

        await showLoadingScreen();
        loadGameState();
        await hideLoadingScreen();

        if (mainContent) {
            mainContent.style.visibility = 'visible';
        }

        showSection('welcomeScreen');

        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', handleRegistration);
        }

        // Remove debug menu initialization
        setInterval(updateLoadingTip, 5000);

    } catch (error) {
        console.error('Error during initialization:', error);
        await hideLoadingScreen();
    }
}



// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();

    // Navigation event listeners
    document.querySelectorAll('[data-navigate]').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetSection = e.target.dataset.navigate;
            showSection(targetSection);
        });
    });

    // Debug keyboard shortcuts
    if (DEBUG_MODE) {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey) {
                switch(e.key) {
                    case 'W':
                        skipToSection('weightSortingGame');
                        break;
                    case 'P':
                        skipToSection('pathFindingGame');
                        break;
                    case 'M':
                        skipToSection('matchingGame');
                        break;
                    case 'R':
                        resetGameProgress();
                        break;
                }
            }
        });
    }
});

// Export necessary functions and objects
window.gameState = gameState;
window.saveGameState = saveGameState;
window.loadGameState = loadGameState;
window.showSection = showSection;
window.startTraining = startTraining;
window.completeGame = completeGame;
window.startGame = startGame;
window.returnToGamesMenu = returnToGamesMenu;
window.openResetModal = openResetModal;
window.closeResetModal = closeResetModal;
window.resetGameState = resetGameState;

// Debug mode console message
if (DEBUG_MODE) {
    console.log(`
    Debug Mode Enabled
    ------------------
    Keyboard Shortcuts:
    Ctrl + Shift + W: Skip to Weight Sorting Game
    Ctrl + Shift + P: Skip to Path Finding Game
    Ctrl + Shift + M: Skip to Matching Game
    Ctrl + Shift + R: Reset Progress
    `);
}
