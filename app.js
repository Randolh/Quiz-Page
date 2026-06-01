document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        allQuestions: [],
        examQuestions: [],
        userAnswers: [], // stores the selected option index for each question
        currentIndex: 0,
        mode: null, // 'practice' or 'exam'
        timeRemaining: 1800, // 30 minutes in seconds
        timerInterval: null,
        timeSpent: 0
    };

    const TOTAL_QUESTIONS = 40;
    const EXAM_TIME_SECONDS = 30 * 60;

    // DOM Elements
    const views = {
        home: document.getElementById('home-view'),
        eval: document.getElementById('evaluation-view'),
        results: document.getElementById('results-view')
    };

    const overlay = document.getElementById('loading-overlay');
    
    // Buttons
    const btnPractice = document.getElementById('btn-practice');
    const btnExam = document.getElementById('btn-exam');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnFinish = document.getElementById('btn-finish');
    const btnRestart = document.getElementById('btn-restart');

    // UI Elements
    const elQuestionText = document.getElementById('question-text');
    const elOptionsContainer = document.getElementById('options-container');
    const elCurrentNum = document.getElementById('current-question-num');
    const elTotalNum = document.getElementById('total-questions-num');
    const elNavGrid = document.getElementById('question-nav-grid');
    const elTimerContainer = document.getElementById('timer-container');
    const elTimerDisplay = document.getElementById('timer-display');
    const elScoreDisplay = document.getElementById('score-display');
    const elTimeSpentDisplay = document.getElementById('time-spent-display');
    const elReviewList = document.getElementById('review-list');

    // Initialization
    async function init() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) throw new Error('Network response was not ok');
            state.allQuestions = await response.json();
            
            // Setup Event Listeners
            btnPractice.addEventListener('click', () => startTest('practice'));
            btnExam.addEventListener('click', () => startTest('exam'));
            btnPrev.addEventListener('click', () => navigateQuestion(-1));
            btnNext.addEventListener('click', () => navigateQuestion(1));
            btnFinish.addEventListener('click', finishTest);
            btnRestart.addEventListener('click', resetApp);
            
            overlay.classList.add('hidden');
        } catch (error) {
            console.error('Error fetching questions:', error);
            overlay.innerHTML = '<p>Error cargando las preguntas. Por favor, recarga la página.</p>';
        }
    }

    // Core Functions
    function startTest(mode) {
        state.mode = mode;
        state.currentIndex = 0;
        state.userAnswers = new Array(TOTAL_QUESTIONS).fill(null);
        state.timeSpent = 0;
        
        // Select random questions
        const shuffled = [...state.allQuestions].sort(() => 0.5 - Math.random());
        state.examQuestions = shuffled.slice(0, Math.min(TOTAL_QUESTIONS, shuffled.length));
        
        elTotalNum.textContent = state.examQuestions.length;

        if (mode === 'exam') {
            state.timeRemaining = EXAM_TIME_SECONDS;
            elTimerContainer.classList.remove('hidden');
            elTimerContainer.classList.remove('warning');
            updateTimerDisplay();
            state.timerInterval = setInterval(timerTick, 1000);
        } else {
            elTimerContainer.classList.add('hidden');
        }

        buildNavigationGrid();
        renderQuestion();
        switchView('eval');
    }

    function switchView(viewName) {
        Object.values(views).forEach(v => v.classList.add('hidden'));
        views[viewName].classList.remove('hidden');
        views[viewName].classList.add('active');
    }

    function renderQuestion() {
        const question = state.examQuestions[state.currentIndex];
        
        elCurrentNum.textContent = state.currentIndex + 1;
        elQuestionText.textContent = question.question;
        
        elOptionsContainer.innerHTML = '';
        
        question.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            if (state.userAnswers[state.currentIndex] === idx) {
                btn.classList.add('selected');
            }
            btn.textContent = opt;
            btn.addEventListener('click', () => selectOption(idx));
            elOptionsContainer.appendChild(btn);
        });

        // Update Controls
        btnPrev.disabled = state.currentIndex === 0;
        
        if (state.currentIndex === state.examQuestions.length - 1) {
            btnNext.classList.add('hidden');
            btnFinish.classList.remove('hidden');
        } else {
            btnNext.classList.remove('hidden');
            btnFinish.classList.add('hidden');
        }

        updateNavigationHighlight();
    }

    function selectOption(optionIndex) {
        state.userAnswers[state.currentIndex] = optionIndex;
        renderQuestion(); // Re-render to show selected state
        
        // Update bubble
        const bubble = document.getElementById(`nav-bubble-${state.currentIndex}`);
        if (bubble) bubble.classList.add('answered');
    }

    function navigateQuestion(dir) {
        const newIndex = state.currentIndex + dir;
        if (newIndex >= 0 && newIndex < state.examQuestions.length) {
            state.currentIndex = newIndex;
            renderQuestion();
        }
    }

    function buildNavigationGrid() {
        elNavGrid.innerHTML = '';
        state.examQuestions.forEach((_, idx) => {
            const btn = document.createElement('button');
            btn.className = 'nav-bubble';
            btn.id = `nav-bubble-${idx}`;
            btn.textContent = idx + 1;
            btn.addEventListener('click', () => {
                state.currentIndex = idx;
                renderQuestion();
            });
            elNavGrid.appendChild(btn);
        });
    }

    function updateNavigationHighlight() {
        document.querySelectorAll('.nav-bubble').forEach((btn, idx) => {
            btn.classList.toggle('current', idx === state.currentIndex);
        });
    }

    // Timer logic
    function timerTick() {
        state.timeRemaining--;
        state.timeSpent++;
        updateTimerDisplay();

        if (state.timeRemaining <= 60) {
            elTimerContainer.classList.add('warning');
        }

        if (state.timeRemaining <= 0) {
            clearInterval(state.timerInterval);
            finishTest();
        }
    }

    function updateTimerDisplay() {
        const m = Math.floor(state.timeRemaining / 60).toString().padStart(2, '0');
        const s = (state.timeRemaining % 60).toString().padStart(2, '0');
        elTimerDisplay.textContent = `${m}:${s}`;
    }

    // Finish & Results
    function finishTest() {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            if (state.mode === 'exam') {
                state.timeSpent = EXAM_TIME_SECONDS - state.timeRemaining;
            }
        }

        let correctCount = 0;
        elReviewList.innerHTML = '';

        state.examQuestions.forEach((q, idx) => {
            const userAnswerIdx = state.userAnswers[idx];
            const isCorrect = userAnswerIdx === q.correct_index;
            
            if (isCorrect) correctCount++;

            // Build Review Item
            const item = document.createElement('div');
            item.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
            
            const userAnswerText = userAnswerIdx !== null ? q.options[userAnswerIdx] : 'No respondida';
            const correctAnswerText = q.options[q.correct_index];

            item.innerHTML = `
                <div class="review-q">${idx + 1}. ${q.question}</div>
                <div class="review-details">
                    <p class="ans-user ${isCorrect ? 'right' : 'wrong'}">Tu respuesta: ${userAnswerText}</p>
                    ${!isCorrect ? `<p class="ans-correct">Respuesta correcta: ${correctAnswerText}</p>` : ''}
                    <p class="explanation">${q.explanation || 'No hay explicación adicional.'}</p>
                </div>
            `;
            elReviewList.appendChild(item);
        });

        elScoreDisplay.textContent = `${correctCount} / ${state.examQuestions.length}`;
        
        const mSpent = Math.floor(state.timeSpent / 60).toString().padStart(2, '0');
        const sSpent = (state.timeSpent % 60).toString().padStart(2, '0');
        elTimeSpentDisplay.textContent = `${mSpent}:${sSpent}`;

        switchView('results');
    }

    function resetApp() {
        state.currentIndex = 0;
        state.mode = null;
        state.userAnswers = [];
        state.examQuestions = [];
        state.timeSpent = 0;
        
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
        }
        
        switchView('home');
    }

    // Start
    init();
});
