// app.js - front-end only Study Leveling app
// State, sample quests, rendering, and localStorage persistence

const STORAGE_KEY = 'study_leveling_v1';

const defaultState = {
    profile: {
        name: 'Player',
        trophies: 5,
        badges: [],
    },
    user: {
        level: 10,
        xp: 50,
        xpThreshold: 300,
    },
    subjects: {
        Math: { level: 6, xp: 40, threshold: 150 },
        Physics: { level: 8, xp: 80, threshold: 250 },
        Biology: { level: 5, xp: 10, threshold: 120 },
    },
    achievements: {
        hardQuestsCompleted: 4,
        mediumQuestsCompleted: 3,
        easyQuestsCompleted: 5,
    },
    quests: [], // populated below
};

const sampleQuests = [
    {
        id: 'q1',
        title: 'Math: Algebra Basics',
        subject: 'Math',
        description: 'Solve 5 basic algebraic equations.',
        xp: 50,
        difficulty: 'easy',
        color: 'green',
        status: 'available',
        quiz: [
            { q: "What is x if 2x = 10?", options: ["2", "5", "8", "20"], a: 1 },
            { q: "Solve for y: y + 7 = 15", options: ["7", "8", "15", "22"], a: 1 },
            { q: "What is 3 * (4 + 2)?", options: ["12", "14", "18", "20"], a: 2 },
            { q: "If x - 5 = 10, x is?", options: ["5", "15", "10", "0"], a: 1 },
            { q: "What is 10 / 2 + 3?", options: ["5", "8", "2", "13"], a: 1 }
        ]
    },
    {
        id: 'q2',
        title: 'Physics: Velocity',
        subject: 'Physics',
        description: 'Calculate velocity in these scenarios.',
        xp: 100,
        difficulty: 'medium',
        color: 'yellow',
        status: 'available',
        quiz: [
            { q: "Velocity is displacement divided by...?", options: ["Mass", "Time", "Acceleration", "Gravity"], a: 1 },
            { q: "If a car travels 100m in 5s, what is its velocity?", options: ["20m/s", "500m/s", "5m/s", "10m/s"], a: 0 },
            { q: "Which of these is a vector quantity?", options: ["Speed", "Distance", "Velocity", "Time"], a: 2 }
        ]
    },
    {
        id: 'q3',
        title: 'History: WW2',
        subject: 'History',
        description: 'Critical dates of World War 2.',
        xp: 200,
        difficulty: 'hard',
        color: 'red',
        status: 'available',
        quiz: [
            { q: "When did WW2 start?", options: ["1914", "1939", "1945", "1941"], a: 1 },
            { q: "Which event led the US to join WW2?", options: ["D-Day", "Battle of Midway", "Pearl Harbor", "Hiroshima"], a: 2 },
            { q: "When did WW2 end?", options: ["1939", "1941", "1944", "1945"], a: 3 }
        ]
    },
    {
        id: 'q4',
        title: 'Biology: Cell Structure',
        subject: 'Biology',
        description: 'Label parts of a cell and their functions.',
        xp: 40,
        difficulty: 'easy',
        color: 'green',
        status: 'available',
        quiz: [
            { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Cell Wall"], a: 2 },
            { q: "Which part contains genetic material?", options: ["Cytoplasm", "Nucleus", "Membrane", "Vacuole"], a: 1 }
        ]
    },
    { id: 'fb1', title: 'Feedback: Report a Bug / Suggestion', subject: 'Feedback', description: 'Report a bug, question error, or suggest a feature to help improve the app.', xp: 50, difficulty: 'special', color: 'orange', status: 'available', feedback: true },
];

function saveState(s){
    try{localStorage.setItem(STORAGE_KEY, JSON.stringify(s));}catch(e){console.warn('save failed',e)}
}

function loadState(){
    try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw) {
            const loaded = JSON.parse(raw);
            // Ensure achievements object exists for backward compatibility
            if(!loaded.achievements){
                loaded.achievements = {
                    hardQuestsCompleted: 0,
                    mediumQuestsCompleted: 0,
                    easyQuestsCompleted: 0,
                };
            }
            return loaded;
        }
    }catch(e){console.warn('failed to load state',e)}
    const s = JSON.parse(JSON.stringify(defaultState));
    s.quests = sampleQuests;
    saveState(s);
    return s;
}

// Global state initialization
window.state = loadState();

// Utility for getting elements
window.qs = (sel) => document.querySelector(sel);
window.qsa = (sel) => Array.from(document.querySelectorAll(sel));

// Main rendering engine
window.render = function(){
    renderHeader();
    if(window.qs('#home')) renderHome();
    if(window.qs('#quests')) renderQuests();
    if(window.qs('#profile')) renderProfile();
}

function renderHeader(){
    const nameEl = window.qs('#profileName');
    if(nameEl) nameEl.textContent = window.state.profile.name || 'Player';
    const trophyEl = window.qs('#trophyCount');
    if(trophyEl) trophyEl.textContent = window.state.profile.trophies || 0;

    // Make trophy display clickable
    const trophyDisplay = window.qs('.trophy');
    if(trophyDisplay){
        trophyDisplay.style.cursor = 'pointer';
        trophyDisplay.onclick = showTrophyPopup;
    }
}

function showTrophyPopup(){
    const modal = window.qs('#modal');
    const body = window.qs('#modalBody');
    if(!modal || !body) return;

    const hardCompleted = window.state.achievements.hardQuestsCompleted;
    const trophies = [];

    // Define all trophy tiers
    const trophyTiers = [
        { threshold: 3, name: 'Bronze Champion', emoji: '🥉', description: 'Complete 3 hard quests' },
        { threshold: 5, name: 'Silver Warrior', emoji: '🥈', description: 'Complete 5 hard quests' },
        { threshold: 10, name: 'Gold Master', emoji: '🥇', description: 'Complete 10 hard quests' },
        { threshold: 15, name: 'Platinum Elite', emoji: '💎', description: 'Complete 15 hard quests' },
        { threshold: 25, name: 'Diamond Legend', emoji: '🏆', description: 'Complete 25 hard quests' },
    ];

    let trophyHTML = '<h2 style="margin-bottom:20px">🏆 Trophy Collection</h2>';
    trophyHTML += `<p style="margin-bottom:15px;color:var(--text-muted)">Hard Quests Completed: <strong>${hardCompleted}</strong></p>`;
    trophyHTML += '<div style="display:flex;flex-direction:column;gap:12px">';

    trophyTiers.forEach(trophy => {
        const earned = hardCompleted >= trophy.threshold;
        const style = earned
            ? 'background:linear-gradient(135deg,var(--accent),#a285ff);padding:12px;border-radius:8px;border:2px solid var(--accent)'
            : 'background:var(--bg-darker);padding:12px;border-radius:8px;border:2px solid var(--border);opacity:0.5';

        trophyHTML += `
            <div style="${style}">
                <div style="display:flex;align-items:center;gap:12px">
                    <div style="font-size:28px">${trophy.emoji}</div>
                    <div style="flex:1">
                        <div style="font-weight:700;font-size:14px">${trophy.name}</div>
                        <div style="font-size:12px;color:var(--text-muted)">${trophy.description}</div>
                    </div>
                    ${earned ? '<div style="color:var(--success);font-size:20px">✓</div>' : '<div style="color:var(--text-muted);font-size:16px">🔒</div>'}
                </div>
            </div>
        `;
    });

    trophyHTML += '</div>';
    trophyHTML += '<div style="margin-top:20px;display:flex;justify-content:flex-end">';
    trophyHTML += '<button class="btn" onclick="window.qs(\'#modal\').classList.add(\'hidden\')">Close</button>';
    trophyHTML += '</div>';

    body.innerHTML = trophyHTML;
    modal.classList.remove('hidden');
}

function renderHome(){
    const userLevel = window.qs('#userLevel');
    if(userLevel) userLevel.textContent = window.state.user.level;
    const xpCurrent = window.qs('#xpCurrent'); if(xpCurrent) xpCurrent.textContent = window.state.user.xp;
    const xpThreshold = window.qs('#xpThreshold'); if(xpThreshold) xpThreshold.textContent = window.state.user.xpThreshold;
    const xpBar = window.qs('#xpBar'); if(xpBar){
        const pct = Math.min(100, Math.round((window.state.user.xp / window.state.user.xpThreshold) * 100));
        xpBar.style.width = pct + '%';
    }
    const levelLabel = window.qs('#levelLabel'); if(levelLabel) levelLabel.textContent = getTierLabel(window.state.user.level);
    const profileLevel = window.qs('#profileLevel'); if(profileLevel) profileLevel.textContent = window.state.user.level;

    const skills = window.qs('#skillsList');
    if(!skills) return;
    skills.innerHTML = '';
    for(const [subject, info] of Object.entries(window.state.subjects)){
        const div = document.createElement('div');
        div.className = 'skill';
        div.innerHTML = `
      <div class="meta">
        <strong>${subject}</strong>
        <div class="bar"><i></i></div>
      </div>
      <div class="lvl">Lvl ${info.level}</div>
    `;
        skills.appendChild(div);
        const innerBar = div.querySelector('.bar > i');
        if(innerBar){
            const w = Math.min(100, Math.round((info.xp/info.threshold)*100));
            innerBar.style.width = w + '%';
        }
    }
}

function renderQuests(){
    const container = window.qs('#questsContainer');
    if(!container) return;
    container.innerHTML = '';
    const activeTab = window.qs('.quests-top-nav .tab.active')?.dataset?.tab || 'available';

    const filtered = window.state.quests.filter(q => {
        if(activeTab === 'available') return q.status === 'available';
        if(activeTab === 'accepted') return q.status === 'accepted';
        if(activeTab === 'done') return q.status === 'done';
    });

    if(filtered.length === 0){
        container.innerHTML = '<div class="card"><em>No quests in this tab.</em></div>';
        return;
    }

    filtered.forEach(q => {
        const el = document.createElement('div');
        el.className = 'quest';
        if(q.color === 'orange') el.classList.add('accent-orange');
        if(q.color === 'green') el.classList.add('accent-green');
        if(q.color === 'yellow') el.classList.add('accent-yellow');
        if(q.color === 'red') el.classList.add('accent-red');

        el.innerHTML = `
      <div class="meta">
        <strong>${q.title}</strong>
        <div class="small">${q.description}</div>
      </div>
      <div class="actions">
        <div class="xp">+${q.xp} XP</div>
        <div>
          ${renderQuestButtons(q)}
        </div>
      </div>
    `;

        container.appendChild(el);
    });
}

function renderQuestButtons(q){
    if(q.status === 'available'){
        if(q.feedback) return `<button class="btn small-btn" onclick="window.openFeedbackForm('${q.id}')">Open</button> <button class="btn small-btn" onclick="window.acceptQuest('${q.id}')">Accept</button>`;
        return `<button class="btn small-btn" onclick="window.acceptQuest('${q.id}')">Accept</button>`;
    }
    if(q.status === 'accepted'){
        return `<button class="btn small-btn" onclick="window.startQuiz('${q.id}')">Start Quiz</button> <button class="btn small-btn" onclick="window.cancelQuest('${q.id}')">Cancel</button>`;
    }
    if(q.status === 'done'){
        return `<button class="btn small-btn" disabled>Completed</button>`;
    }
    return '';
}

// Global Quest Actions
window.acceptQuest = function(id){
    const q = window.state.quests.find(x=>x.id===id);
    if(!q) return;
    q.status = 'accepted';
    saveState(window.state);
    renderQuests();
}

window.cancelQuest = function(id){
    const q = window.state.quests.find(x=>x.id===id);
    if(!q) return;
    q.status = 'available';
    saveState(window.state);
    renderQuests();
}

window.startQuiz = function(id){
    const q = window.state.quests.find(x=>x.id===id);
    if(!q || !q.quiz) {
        console.error('Quest or quiz not found for ID:', id);
        return;
    }
    renderQuiz(q, 0);
}

function renderQuiz(quest, index) {
    const modal = window.qs('#modal');
    const body = window.qs('#modalBody');
    if(!modal || !body) return;

    const question = quest.quiz[index];
    body.innerHTML = `
    <h3>${quest.title}</h3>
    <p>Question ${index + 1}/${quest.quiz.length}</p>
    <div class="quiz-q" style="margin:12px 0; font-weight:500">${question.q}</div>
    <div class="quiz-options" style="display:flex; flex-direction:column; gap:8px">
      ${question.options.map((opt, i) => `
        <button class="btn quiz-opt" onclick="window.checkAnswer('${quest.id}', ${index}, ${i})">${opt}</button>
      `).join('')}
    </div>
  `;
    modal.classList.remove('hidden');
}

window.checkAnswer = function(questId, qIndex, selectedIdx){
    const quest = window.state.quests.find(q => q.id === questId);
    const question = quest.quiz[qIndex];
    if(selectedIdx === question.a) {
        if(qIndex + 1 < quest.quiz.length) {
            renderQuiz(quest, qIndex + 1);
        } else {
            completeQuest(quest.id);
        }
    } else {
        alert('Incorrect! Try again.');
    }
}

function completeQuest(id){
    const q = window.state.quests.find(x=>x.id===id);
    if(!q) return;
    addUserXP(q.xp);
    if(q.subject && window.state.subjects[q.subject]){
        addSubjectXP(q.subject, Math.floor(q.xp/2));
    }

    // Track quest completion by difficulty
    if(q.difficulty === 'hard'){
        window.state.achievements.hardQuestsCompleted++;
    } else if(q.difficulty === 'medium'){
        window.state.achievements.mediumQuestsCompleted++;
    } else if(q.difficulty === 'easy'){
        window.state.achievements.easyQuestsCompleted++;
    }

    q.status = 'done';
    if(q.feedback){
        window.state.profile.badges.push({id:'fb_ack_'+Date.now(), name:'Feedback Contributor'});
    }

    // Check for trophy and badge achievements
    checkAndAwardAchievements();

    saveState(window.state);
    if(window.render) window.render();
    showQuestCompleteModal(q);
}

function showQuestCompleteModal(q){
    const modal = window.qs('#modal');
    const body = window.qs('#modalBody');
    if(!modal || !body) return;
    body.innerHTML = `
    <h2 style="color:var(--success)">Quest Complete!</h2>
    <p>You earned <strong>+${q.xp} XP</strong>.</p>
    <div style="margin-top:10px;display:flex;gap:8px;justify-content:flex-end">
      <button class="btn" onclick="window.qs('#modal').classList.add('hidden')">Close</button>
    </div>
  `;
    modal.classList.remove('hidden');
}

// Check and award achievements for trophies and badges
function checkAndAwardAchievements(){
    const state = window.state;

    // Trophy achievements based on hard quest completions
    const hardCompleted = state.achievements.hardQuestsCompleted;
    let expectedTrophies = 0;

    if(hardCompleted >= 3) expectedTrophies++;
    if(hardCompleted >= 5) expectedTrophies++;
    if(hardCompleted >= 10) expectedTrophies++;
    if(hardCompleted >= 15) expectedTrophies++;
    if(hardCompleted >= 25) expectedTrophies++;

    // Set trophies (they accumulate)
    state.profile.trophies = Math.max(state.profile.trophies, expectedTrophies);

    // Badge achievements - User level milestones
    awardBadgeIfNew('level_5', '⭐ Rising Scholar', state.user.level >= 5);
    awardBadgeIfNew('level_10', '🎓 Knowledge Seeker', state.user.level >= 10);
    awardBadgeIfNew('level_25', '📚 Book Warrior', state.user.level >= 25);
    awardBadgeIfNew('level_50', '🏅 Academic Elite', state.user.level >= 50);
    awardBadgeIfNew('level_100', '👑 Study Legend', state.user.level >= 100);

    // Badge achievements - Subject proficiency milestones
    for(const [subject, info] of Object.entries(state.subjects)){
        awardBadgeIfNew(`${subject}_5`, `📖 ${subject} Novice`, info.level >= 5);
        awardBadgeIfNew(`${subject}_10`, `✏️ ${subject} Student`, info.level >= 10);
        awardBadgeIfNew(`${subject}_15`, `🔬 ${subject} Scholar`, info.level >= 15);
        awardBadgeIfNew(`${subject}_20`, `🎯 ${subject} Master`, info.level >= 20);
        awardBadgeIfNew(`${subject}_30`, `💫 ${subject} Sage`, info.level >= 30);
    }

    // Quest completion badges
    const totalQuestsDone = state.quests.filter(q => q.status === 'done').length;
    awardBadgeIfNew('first_quest', '🌟 First Steps', totalQuestsDone >= 1);
    awardBadgeIfNew('quest_5', '🚀 Quest Explorer', totalQuestsDone >= 5);
    awardBadgeIfNew('quest_10', '🗺️ Adventure Seeker', totalQuestsDone >= 10);
    awardBadgeIfNew('quest_25', '🏆 Quest Champion', totalQuestsDone >= 25);
    awardBadgeIfNew('quest_50', '💎 Quest Legend', totalQuestsDone >= 50);

    // Difficulty-based badges
    awardBadgeIfNew('easy_10', '🌱 Easy Master', state.achievements.easyQuestsCompleted >= 10);
    awardBadgeIfNew('medium_10', '⚡ Medium Crusher', state.achievements.mediumQuestsCompleted >= 10);
    awardBadgeIfNew('hard_5', '🔥 Hard Conqueror', state.achievements.hardQuestsCompleted >= 5);
    awardBadgeIfNew('hard_10', '💪 Challenge Accepted', state.achievements.hardQuestsCompleted >= 10);

    // Special themed badges
    const allSubjectsLevel5 = Object.values(state.subjects).every(s => s.level >= 5);
    awardBadgeIfNew('polymath', '🧠 Polymath', allSubjectsLevel5);

    const anySubjectLevel20 = Object.values(state.subjects).some(s => s.level >= 20);
    awardBadgeIfNew('specialist', '🎖️ Specialist', anySubjectLevel20);
}

function awardBadgeIfNew(badgeId, badgeName, condition){
    if(!condition) return;
    const exists = window.state.profile.badges.some(b => b.id === badgeId);
    if(!exists){
        window.state.profile.badges.push({id: badgeId, name: badgeName});
    }
}

function addUserXP(amount){
    window.state.user.xp += amount;
    while(window.state.user.xp >= window.state.user.xpThreshold){
        window.state.user.xp -= window.state.user.xpThreshold;
        window.state.user.level += 1;
        window.state.user.xpThreshold = Math.round(window.state.user.xpThreshold * 1.25);
        // Check for level-based badges after leveling up
        checkAndAwardAchievements();
    }
}

function addSubjectXP(sub, amount){
    const s = window.state.subjects[sub];
    if(!s) return;
    s.xp += amount;
    while(s.xp >= s.threshold){
        s.xp -= s.threshold;
        s.level += 1;
        s.threshold = Math.round(s.threshold * 1.4);
        // Check for subject-based badges after leveling up
        checkAndAwardAchievements();
    }
}

function getTierLabel(level){
    if(level < 3) return 'BRONZE';
    if(level < 6) return 'SILVER';
    if(level < 10) return 'GOLD';
    return 'MASTER';
}

window.openFeedbackForm = function(id){
    const quest = window.state.quests.find(q => q.id === id);
    const modal = window.qs('#modal');
    const body = window.qs('#modalBody');
    if(!modal || !body) return;
    body.innerHTML = `
    <h2>${quest.title}</h2>
    <p class="small">${quest.description}</p>
    <form id="feedbackForm">
      <label>Type</label>
      <select name="type">
        <option value="bug">Bug / Glitch</option>
        <option value="error">Question Error</option>
        <option value="feature">Feature Suggestion</option>
      </select>
      <label style="margin-top:8px">Details</label>
      <textarea name="details" rows="4" style="width:100%"></textarea>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
        <button type="button" class="btn" onclick="window.qs('#modal').classList.add('hidden')">Cancel</button>
        <button type="submit" class="btn">Submit</button>
      </div>
    </form>
  `;
    modal.classList.remove('hidden');
    const fForm = window.qs('#feedbackForm');
    if(fForm){
        fForm.onsubmit = (e) => {
            e.preventDefault();
            quest.status = 'done';
            addUserXP(quest.xp);
            window.state.profile.badges.push({id:'fb_'+Date.now(), name:'Feedback Contributor'});
            saveState(window.state);
            modal.classList.add('hidden');
            window.render();
            showQuestCompleteModal(quest);
        };
    }
}

function initNav(){
    const tabs = window.qsa('.quests-top-nav .tab');
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderQuests();
        };
    });
    const editProfileBtn = window.qs('#editProfileBtn');
    if (editProfileBtn) editProfileBtn.onclick = () => openEditProfile();
}

function openEditProfile(){
    const modal = window.qs('#modal');
    const body = window.qs('#modalBody');
    if(!modal || !body) return;
    body.innerHTML = `
    <h3>Edit Profile</h3>
    <form id="editProfileForm">
      <label>Name</label>
      <input name="name" value="${window.state.profile.name}" style="width:100%" />
      <div style="display:flex;gap:8px;margin-top:12px">
        <button type="button" class="btn" onclick="window.qs('#modal').classList.add('hidden')">Cancel</button>
        <button type="submit" class="btn">Save</button>
      </div>
    </form>
  `;
    modal.classList.remove('hidden');
    const eForm = window.qs('#editProfileForm');
    if(eForm) eForm.onsubmit = (e) => {
        e.preventDefault();
        window.state.profile.name = eForm.querySelector('input[name="name"]').value.trim() || 'Player';
        saveState(window.state);
        modal.classList.add('hidden');
        window.render();
    };
}

function renderProfile(){
    const pl = window.qs('#profileLevel'); if(pl) pl.textContent = window.state.user.level;
    const badges = window.qs('#badgesList');
    if(!badges) return;
    badges.innerHTML = '';
    if(window.state.profile.badges.length === 0){
        badges.innerHTML = '<div class="small">No badges yet</div>';
        return;
    }
    window.state.profile.badges.forEach(b=>{
        const d = document.createElement('div');
        d.className = 'badge';
        d.textContent = b.name;
        badges.appendChild(d);
    });
}

function init(){
    console.log('Initializing Study Leveling App on:', location.pathname);
    if(!window.state.quests || window.state.quests.length === 0) window.state.quests = JSON.parse(JSON.stringify(sampleQuests));

    // Check and award achievements on startup (ensures badges are up to date)
    checkAndAwardAchievements();
    saveState(window.state);

    const modal = window.qs('#modal');
    if(modal){
        const mc = window.qs('#modalClose');
        if(mc) mc.onclick = () => modal.classList.add('hidden');
        modal.onclick = (e) => { if(e.target === modal) modal.classList.add('hidden'); };
    }

    // Bind Login Form
    const sForm = window.qs('#signInForm');
    if(sForm){
        sForm.onsubmit = (e) => {
            e.preventDefault();
            const usernameInput = sForm.querySelector('input[name="username"]');
            const passwordInput = sForm.querySelector('input[name="password"]');
            const u = usernameInput ? usernameInput.value.trim() : '';
            const p = passwordInput ? passwordInput.value.trim() : '';

            if(u === 'admin' && p === 'admin'){
                window.location.href = './home.html';
                return;
            }

            alert('Use admin/admin to enter the demo.');
        };
    }

    initNav();
    window.render();
}

// Run init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

setInterval(()=>saveState(window.state), 5000);