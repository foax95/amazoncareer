// database.js
class GameDatabase {
    constructor() {
        this.dbName = 'AmazonTrainingDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error("Error opening database");
                reject(request.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("Database opened successfully");
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create scores store
                if (!db.objectStoreNames.contains('scores')) {
                    const scoresStore = db.createObjectStore('scores', { keyPath: 'gameId' });
                    scoresStore.createIndex('score', 'score');
                    scoresStore.createIndex('timestamp', 'timestamp');
                }

                // Create user store
                if (!db.objectStoreNames.contains('user')) {
                    const userStore = db.createObjectStore('user', { keyPath: 'id' });
                    userStore.createIndex('name', 'name');
                }
            };
        });
    }

    async saveScore(gameId, score) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['scores'], 'readwrite');
            const store = transaction.objectStore('scores');

            const scoreData = {
                gameId,
                score: parseInt(score),
                timestamp: new Date().getTime()
            };

            const request = store.put(scoreData);

            request.onsuccess = () => resolve(scoreData);
            request.onerror = () => reject(request.error);
        });
    }

    async getScore(gameId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['scores'], 'readonly');
            const store = transaction.objectStore('scores');
            const request = store.get(gameId);

            request.onsuccess = () => resolve(request.result ? request.result.score : 0);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllScores() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['scores'], 'readonly');
            const store = transaction.objectStore('scores');
            const request = store.getAll();

            request.onsuccess = () => {
                const scores = {};
                request.result.forEach(item => {
                    scores[item.gameId] = item.score;
                });
                resolve(scores);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async saveUser(name) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['user'], 'readwrite');
            const store = transaction.objectStore('user');

            const userData = {
                id: 1, // Single user system
                name: name
            };

            const request = store.put(userData);

            request.onsuccess = () => resolve(userData);
            request.onerror = () => reject(request.error);
        });
    }

    async getUser() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['user'], 'readonly');
            const store = transaction.objectStore('user');
            const request = store.get(1);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearAllData() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['scores', 'user'], 'readwrite');
            const scoresStore = transaction.objectStore('scores');
            const userStore = transaction.objectStore('user');

            scoresStore.clear();
            userStore.clear();

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
}

// Initialize database
const gameDB = new GameDatabase();
window.gameDB = gameDB;
