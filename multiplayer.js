// multiplayer.js - Multiplayer game logic
// Handles subject selection, quiz gameplay, and ranking system

let multiplayerState = {
    selectedSubject: null,
    currentQuestion: 0,
    players: [
        { name: 'You', correct: 0, wrong: 0, streak: 0, isHuman: true },
        { name: 'Opponent 1', correct: 0, wrong: 0, streak: 0, isHuman: false },
        { name: 'Opponent 2', correct: 0, wrong: 0, streak: 0, isHuman: false }
    ],
    quizQuestions: [],
    gameInProgress: false,
    selectedAnswer: null
};

// Subject name mapping for multiplayer
const MULTIPLAYER_SUBJECTS = ['Math', 'Physics', 'Biology', 'History'];

// Get quiz questions for a subject from the state
function getSubjectQuestions(subject) {
    const quests = window.state.quests;
    const subjectQuests = quests.filter(q => q.subject === subject && q.quiz);

    if (subjectQuests.length === 0) return [];

    // Flatten all questions from quests
    const allQuestions = [];
    subjectQuests.forEach(quest => {
        if (quest.quiz && Array.isArray(quest.quiz)) {
            quest.quiz.forEach(q => {
                allQuestions.push({
                    q: q.q,
                    options: q.options,
                    a: q.a
                });
            });
        }
    });

    // Shuffle and return 10 questions
    return allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
}

// Initialize multiplayer game selection view
function initGameSelection() {
    const container = window.qs('#subjectSelectContainer');
    if (!container) return;

    container.innerHTML = '';
    MULTIPLAYER_SUBJECTS.forEach(subject => {
        const btn = document.createElement('button');
        btn.className = 'subject-select-btn';
        btn.textContent = subject;
        btn.onclick = () => selectSubject(subject);
        container.appendChild(btn);
    });

    showView('gameSelectionView');
}

// Select a subject for the game
function selectSubject(subject) {
    multiplayerState.selectedSubject = subject;

    // Highlight selected subject
    window.qsa('.subject-select-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === subject) btn.classList.add('active');
    });

    // Enable start button
    const startBtn = window.qs('#startGameBtn');
    if (startBtn) startBtn.disabled = false;
}

// Start the multiplayer game
function startMultiplayerGame() {
    if (!multiplayerState.selectedSubject) return;

    // Get quiz questions
    multiplayerState.quizQuestions = getSubjectQuestions(multiplayerState.selectedSubject);

    if (multiplayerState.quizQuestions.length === 0) {
        alert('No questions available for this subject. Please try another.');
        return;
    }

    // Reset players
    multiplayerState.players.forEach(p => {
        p.correct = 0;
        p.wrong = 0;
        p.streak = 0;
    });

    multiplayerState.currentQuestion = 0;
    multiplayerState.gameInProgress = true;
    multiplayerState.selectedAnswer = null;

    showView('gameplayView');
    displayQuestion();
}

// Display current question
function displayQuestion() {
    if (multiplayerState.currentQuestion >= 10) {
        endGame();
        return;
    }

    const question = multiplayerState.quizQuestions[multiplayerState.currentQuestion];
    const qNum = multiplayerState.currentQuestion + 1;

    // Update question counter
    const qNumEl = window.qs('#questionNumber');
    if (qNumEl) qNumEl.textContent = qNum;

    // Update progress
    const progress = window.qs('#questionProgress');
    if (progress) progress.style.width = ((qNum / 10) * 100) + '%';

    // Display question
    const qText = window.qs('#questionText');
    if (qText) qText.textContent = question.q;

    // Display options
    const optionsContainer = window.qs('#optionsContainer');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.onclick = () => selectAnswer(index);
            optionsContainer.appendChild(btn);
        });
    }

    multiplayerState.selectedAnswer = null;
}

// Handle answer selection
function selectAnswer(selectedIndex) {
    // Check if game is still in progress and no answer has been selected
    if (!multiplayerState.gameInProgress || multiplayerState.selectedAnswer !== null) return;

    const question = multiplayerState.quizQuestions[multiplayerState.currentQuestion];
    const isCorrect = selectedIndex === question.a;

    // Update human player
    multiplayerState.players[0].selectedIndex = selectedIndex;
    if (isCorrect) {
        multiplayerState.players[0].correct++;
        multiplayerState.players[0].streak++;
    } else {
        multiplayerState.players[0].wrong++;
        multiplayerState.players[0].streak = 0;
    }

    // Simulate opponent answers (with varying difficulty)
    simulateOpponentAnswers();

    // Mark selected answer (prevents double-clicking)
    multiplayerState.selectedAnswer = selectedIndex;

    // Show correct answer
    const optionBtns = window.qsa('.option-btn');
    optionBtns.forEach((btn, idx) => {
        if (idx === question.a) {
            btn.classList.add('correct');
        } else if (idx === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });

    // Move to next question after delay
    setTimeout(() => {
        // Only proceed if game is still in progress
        if (!multiplayerState.gameInProgress) return;

        multiplayerState.currentQuestion++;
        updatePlayerDisplays();
        displayQuestion();
    }, 1500);
}

// Simulate opponent answers
function simulateOpponentAnswers() {
    const question = multiplayerState.quizQuestions[multiplayerState.currentQuestion];

    // Opponent 1 - Medium difficulty (60% correct)
    if (Math.random() < 0.6) {
        multiplayerState.players[1].correct++;
        multiplayerState.players[1].streak++;
    } else {
        multiplayerState.players[1].wrong++;
        multiplayerState.players[1].streak = 0;
    }

    // Opponent 2 - Easy difficulty (40% correct)
    if (Math.random() < 0.4) {
        multiplayerState.players[2].correct++;
        multiplayerState.players[2].streak++;
    } else {
        multiplayerState.players[2].wrong++;
        multiplayerState.players[2].streak = 0;
    }
}

// Update player display during gameplay
function updatePlayerDisplays() {
    multiplayerState.players.forEach((player, idx) => {
        const infoEl = window.qs(`#player${idx + 1}Info`);
        if (infoEl) {
            const scoreEl = infoEl.querySelector(`#player${idx + 1}Score`);
            const streakEl = infoEl.querySelector(`#player${idx + 1}Streak`);
            if (scoreEl) scoreEl.textContent = player.correct;
            if (streakEl) streakEl.textContent = player.streak;
        }
    });
}

// End game and calculate rankings
function endGame() {
    multiplayerState.gameInProgress = false;

    // Calculate rankings based on:
    // 1. Number of correct answers
    // 2. If tied, use wrong answers (fewer is better)
    const rankings = [...multiplayerState.players].sort((a, b) => {
        // First compare by correct answers (descending)
        if (b.correct !== a.correct) {
            return b.correct - a.correct;
        }
        // Then compare by wrong answers (ascending - fewer wrong is better)
        return a.wrong - b.wrong;
    });

    // Determine positions based on correct answers
    // 1st: 10 correct (0 wrong)
    // 2nd: 8 correct (2 wrong)
    // 3rd: 6 correct or fewer (4+ wrong)

    const playerRank = rankings.findIndex(p => p.isHuman) + 1;
    const humanPlayer = multiplayerState.players[0];

    displayResults(rankings, playerRank, humanPlayer);
}

// Display game results
function displayResults(rankings, playerRank, humanPlayer) {
    showView('resultsView');

    // Update title based on rank
    const titleEl = window.qs('#resultTitle');
    const messageEl = window.qs('#resultMessage');

    if (playerRank === 1) {
        titleEl.textContent = '🏆 Victory!';
        messageEl.textContent = 'You dominated the competition!';
    } else if (playerRank === 2) {
        titleEl.textContent = '🥈 Good Game!';
        messageEl.textContent = 'You placed 2nd. Keep practicing!';
    } else {
        titleEl.textContent = '🥉 Nice Try!';
        messageEl.textContent = 'You placed 3rd. Better luck next time!';
    }

    // Display podium
    rankings.forEach((player, idx) => {
        const place = idx + 1;
        const podiumEl = window.qs(`#podium${place}`);
        const nameEl = window.qs(`#place${place}Name`);
        const scoreEl = window.qs(`#place${place}Score`);

        if (podiumEl) {
            podiumEl.classList.remove('hidden');
            if (nameEl) nameEl.textContent = player.name;
            if (scoreEl) scoreEl.textContent = `${player.correct}/10 Correct`;
        }
    });
}

// Show specific view
function showView(viewId) {
    window.qs('#gameSelectionView')?.classList.add('hidden');
    window.qs('#gameplayView')?.classList.add('hidden');
    window.qs('#resultsView')?.classList.add('hidden');

    const view = window.qs(`#${viewId}`);
    if (view) view.classList.remove('hidden');
}

// Reset and play again
function playAgain() {
    multiplayerState.selectedSubject = null;
    multiplayerState.currentQuestion = 0;
    multiplayerState.selectedAnswer = null;
    multiplayerState.players.forEach(p => {
        p.correct = 0;
        p.wrong = 0;
        p.streak = 0;
    });
    initGameSelection();
}

// Event listeners for multiplayer page
document.addEventListener('DOMContentLoaded', () => {
    if (!window.qs('#multiplayer')) return; // Not on multiplayer page

    // Initialize on page load
    initGameSelection();

    // Button listeners
    const startBtn = window.qs('#startGameBtn');
    if (startBtn) startBtn.addEventListener('click', startMultiplayerGame);

    const playAgainBtn = window.qs('#playAgainBtn');
    if (playAgainBtn) playAgainBtn.addEventListener('click', playAgain);

    const backToMenuBtn = window.qs('#backToMenuBtn');
    if (backToMenuBtn) backToMenuBtn.addEventListener('click', playAgain);
});
