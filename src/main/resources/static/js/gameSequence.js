// gameSequence.js

class GameSequenceManager {
    constructor() {
        this.games = [
            {
                id: 'weightSorting',
                name: 'Safety First',
                completed: false,
                icon: 'fas fa-weight-hanging',
                description: 'Learn proper package handling',
                type: 'game'
            },
            // {
            //     id: 'pathFinding',
            //     name: 'PACE Navigator',
            //     completed: false,
            //     icon: 'fas fa-map-marked-alt',
            //     description: 'Find your way around Amazon',
            //     type: 'game'
            // },
            {
                id: 'matching',
                name: 'Benefits Match',
                completed: false,
                icon: 'fas fa-th',
                description: 'Discover Amazon benefits',
                type: 'game'
            },
            {
                id: 'quiz',
                name: 'Knowledge Check',
                completed: false,
                icon: 'fas fa-question-circle',
                description: 'Test your Amazon knowledge',
                type: 'quiz'
            }


        ];
        this.currentGameIndex = 0;
    }

    getCurrentGame() {
        return this.games[this.currentGameIndex];
    }

    markCurrentGameComplete() {
        this.games[this.currentGameIndex].completed = true;
        this.currentGameIndex = Math.min(this.currentGameIndex + 1, this.games.length - 1);
    }

    isLastGame() {
        return this.currentGameIndex === this.games.length - 1;
    }

    reset() {
        this.games.forEach(game => game.completed = false);
        this.currentGameIndex = 0;
    }
}

// Initialize and export to window
const gameSequence = new GameSequenceManager();
window.gameSequence = gameSequence;
