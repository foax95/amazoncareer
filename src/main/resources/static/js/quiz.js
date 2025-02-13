// Quiz Categories and Questions Data
const quizCategories = [
    {
        name: "Facilities",
        icon: "fa-building",
        questions: [
            {
                question: "What does FC stand for in Amazon's facility types?",
                options: ["Fulfillment Center", "Forward Center", "Freight Carrier", "Final Customer"],
                correct: 0,
                explanation: "FC stands for Fulfillment Center, where customer orders are picked, packed, and shipped."
            },
            {
                question: "Which facility type sorts packages by destination?",
                options: ["Fulfillment Center", "Sortation Center", "Delivery Station", "Air Hub"],
                correct: 1,
                explanation: "Sortation Centers sort packages by their final destination for efficient delivery."
            }
        ]
    },
    {
        name: "Benefits",
        icon: "fa-gift",
        questions: [
            {
                question: "When do health benefits typically start for eligible employees?",
                options: ["After 90 days", "After 30 days", "From day one", "After 6 months"],
                correct: 2,
                explanation: "Amazon offers health benefits from day one for eligible employees."
            },
            {
                question: "What is Amazon's Career Choice program?",
                options: [
                    "Internal job board",
                    "Leadership training",
                    "Education assistance program",
                    "Performance review system"
                ],
                correct: 2,
                explanation: "Career Choice is Amazon's education assistance program that helps employees learn new skills."
            }
        ]
    },
    {
        name: "Application Process",
        icon: "fa-clipboard-check",
        questions: [
            {
                question: "What is typically the first step in applying for an Amazon job?",
                options: [
                    "Background check",
                    "Choosing a role and shift",
                    "Drug test",
                    "Creating an account"
                ],
                correct: 1,
                explanation: "The first step is selecting your preferred role and shift from available options."
            },
            {
                question: "What documents are needed for the pre-hire appointment?",
                options: [
                    "Just a resume",
                    "Valid government ID and proof of education",
                    "References only",
                    "No documents needed"
                ],
                correct: 1,
                explanation: "You need valid government ID and any required educational documents for your pre-hire appointment."
            }
        ]
    }
];

// Quiz Initialization
function initializeQuiz() {
    const container = document.getElementById('quizCategories');
    if (!container) return;

    container.innerHTML = quizCategories.map(category => `
        <div class="category-card" onclick="startQuiz('${category.name}')">
            <i class="fas ${category.icon}"></i>
            <h3>${category.name}</h3>
            <p>Test your knowledge</p>
        </div>
    `).join('');

    // Hide question container when showing categories
    document.getElementById('questionContainer').style.display = 'none';
}

// Quiz Functions
function startQuiz(categoryName) {
    const category = quizCategories.find(cat => cat.name === categoryNryName);
    if (!category) return;

    const question = getRandomQuestion(category.questions);
    showQuestion(question);
}

function getRandomQuestion(questions) {
    return questions[Math.floor(Math.random() * questions.length)];
}

function showQuestion(question) {
    const container = document.getElementById('questionContainer');
    container.style.display = 'block';

    container.innerHTML = `
        <div class="question-box">
            <h3>${question.question}</h3>
            <div class="options-grid">
                ${question.options.map((option, index) => `
                    <button class="button-primary" onclick="checkAnswer(${index}, ${question.correct}, '${question.explanation}')">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Hide categories when showing question
    document.getElementById('quizCategories').style.display = 'none';
}

function checkAnswer(selected, correct, explanation) {
    const isCorrect = selected === correct;

    if (isCorrect) {
        gameState.player.score += 10;
        gameState.quizProgress.correctAnswers++;
        showFeedback('Correct! +10 points', 'success', explanation);
        updateProgress('quiz', 25);
    } else {
        showFeedback('Try again!', 'error', explanation);
    }

    gameState.quizProgress.questionsAnswered++;
    saveGameState();

    setTimeout(() => {
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('quizCategories').style.display = 'grid';
    }, 3000);
}

function showFeedback(message, type, explanation) {
    const container = document.getElementById('questionContainer');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback ${type}`;
    feedbackDiv.innerHTML = `
        <p>${message}</p>
        <p class="explanation">${explanation}</p>
        <button class="button-primary" onclick="continuePlaying()">Continue</button>
    `;

    container.appendChild(feedbackDiv);
}

function continuePlaying() {
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('quizCategories').style.display = 'grid';
}

// Interactive Tips for Quiz
const quizTips = {
    correctAnswer: {
        message: "Great job! Keep learning about Amazon's operations!",
        icon: "fa-thumbs-up"
    },
    wrongAnswer: {
        message: "Don't worry! Review the information and try again.",
        icon: "fa-book"
    }
};

function showQuizTip(type) {
    const tip = quizTips[type];
    if (tip) {
        updateAssistantMessage(`<i class="fas ${tip.icon}"></i> ${tip.message}`);
    }
}

// Export for other modules
window.quizCategories = quizCategories;
window.initializeQuiz = initializeQuiz;
window.startQuiz = startQuiz;
window.checkAnswer = checkAnswer;
window.continuePlaying = continuePlaying;
window.showQuizTip = showQuizTip;
