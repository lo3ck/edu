// ===== XP & 全局状态 =====
let totalXP = 0;
const MAX_XP = 500;

function addXP(amount) {
  totalXP = Math.min(totalXP + amount, MAX_XP);
  const pct = (totalXP / MAX_XP) * 100;
  document.getElementById('xpBar').style.width = pct + '%';
  document.getElementById('xpLabel').textContent = totalXP + ' XP';
}

// ===== 气泡背景 =====
(function createBubbles() {
  const wrap = document.getElementById('bgBubbles');
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.random() * 60 + 20;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      --dur:${Math.random() * 10 + 8}s;
      --delay:${Math.random() * 10}s;
    `;
    wrap.appendChild(b);
  }
})();

// ===== 标签页切换 =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const id = tab.dataset.tab + 'Panel';
    document.getElementById(id).classList.add('active');
  });
});

// ===== 撒花特效 =====
function spawnConfetti(count = 60) {
  const colors = ['#7c3aed','#a855f7','#f59e0b','#10b981','#0ea5e9','#ef4444','#ec4899'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = Math.random() * 100 + '%';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = el.style.height = (Math.random() * 9 + 5) + 'px';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
    el.style.setProperty('--fall-dur', (Math.random() * 2.5 + 1.5) + 's');
    el.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    el.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ============================================================
//  模块一：认识方程（故事导览）
// ============================================================
const storySlides = [
  {
    char: '🧙‍♂️',
    text: '你好！我是方程向导！<strong>方程</strong>就像一个谜题——里面有一个未知数 <strong>x</strong>，我们的任务就是找到它！',
    cards: []
  },
  {
    char: '🤔',
    text: '什么是<strong>未知数</strong>？就是我们还不知道的数，用字母 <strong>x</strong> 表示。比如：盒子里有 x 个苹果。',
    cards: [
      { icon: '📦', title: '未知数 x', desc: '用字母代替不知道的数，x 是最常用的符号' },
      { icon: '🍎', title: '举个例子', desc: '盒子里有 x 个苹果，加上 3 个共 7 个' },
    ]
  },
  {
    char: '⚖️',
    text: '<strong>等号</strong>就像一架天平，两边必须<strong>完全相等</strong>！写成算式就是：x + 3 = 7',
    cards: [
      { icon: '=', title: '等号', desc: '左边的值永远等于右边的值' },
      { icon: '⚖️', title: '天平比喻', desc: '天平两边放同样重的东西才会平衡' },
    ]
  },
  {
    char: '🔑',
    text: '解方程的<strong>秘诀</strong>：对等号两边做<strong>同样的操作</strong>，天平就不会倾斜，最终让 x 单独在一边！',
    cards: [
      { icon: '➕', title: '两边加同数', desc: '两边同时 +3，等式仍然成立' },
      { icon: '➖', title: '两边减同数', desc: '两边同时 −5，等式仍然成立' },
      { icon: '✖️', title: '两边乘同数', desc: '两边同时 ×2，等式仍然成立' },
      { icon: '➗', title: '两边除同数', desc: '两边同时 ÷4，等式仍然成立' },
    ]
  },
  {
    char: '🎯',
    text: '你已经掌握了方程的基本概念！现在去<strong>天平实验室</strong>亲手体验，或者去<strong>解方程练习</strong>区大展身手吧！',
    cards: [
      { icon: '⚖️', title: '天平实验室', desc: '通过操作天平，感受解方程的过程' },
      { icon: '🔍', title: '解方程练习', desc: '三个难度级别，逐步挑战自己' },
      { icon: '🏆', title: '闯关挑战', desc: '限时答题，看看你能得多少分' },
    ]
  }
];

let storyIdx = 0;

function renderStory(idx) {
  const slide = storySlides[idx];
  document.getElementById('storyChar').textContent = slide.char;
  document.getElementById('speechText').innerHTML = slide.text;

  // 概念卡片
  const cardsEl = document.getElementById('conceptCards');
  cardsEl.innerHTML = '';
  slide.cards.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'concept-card';
    div.style.animationDelay = (i * 0.08) + 's';
    div.innerHTML = `<div class="card-icon">${c.icon}</div><div class="card-title">${c.title}</div><div class="card-desc">${c.desc}</div>`;
    cardsEl.appendChild(div);
  });

  // 导航点
  const dotsEl = document.getElementById('storyDots');
  dotsEl.innerHTML = '';
  storySlides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'story-dot' + (i === idx ? ' active' : '');
    dotsEl.appendChild(dot);
  });

  document.getElementById('prevStoryBtn').disabled = idx === 0;
  const nextBtn = document.getElementById('nextStoryBtn');
  if (idx === storySlides.length - 1) {
    nextBtn.textContent = '去天平实验室 ⚖️';
    nextBtn.onclick = () => {
      document.querySelector('[data-tab="balance"]').click();
    };
  } else {
    nextBtn.textContent = '下一步 ▶';
    nextBtn.onclick = () => nextStory();
  }
}

function nextStory() {
  if (storyIdx < storySlides.length - 1) {
    storyIdx++;
    renderStory(storyIdx);
    addXP(5);
  }
}

document.getElementById('prevStoryBtn').addEventListener('click', () => {
  if (storyIdx > 0) { storyIdx--; renderStory(storyIdx); }
});
document.getElementById('nextStoryBtn').addEventListener('click', () => nextStory());

renderStory(0);

// ============================================================
//  模块二：天平实验室
// ============================================================
const labEquations = [
  { left: 'x + 2', right: '5', answer: 3, hint: '两边同时 −2：x + 2 − 2 = 5 − 2，所以 x = 3', leftVal: null, rightVal: null, xCoeff: 1, xAdd: 2, rhs: 5 },
  { left: 'x + 6', right: '10', answer: 4, hint: '两边同时 −6：x = 10 − 6 = 4', leftVal: null, rightVal: null, xCoeff: 1, xAdd: 6, rhs: 10 },
  { left: 'x − 3', right: '7', answer: 10, hint: '两边同时 +3：x = 7 + 3 = 10', leftVal: null, rightVal: null, xCoeff: 1, xAdd: -3, rhs: 7 },
  { left: 'x + 4', right: '11', answer: 7, hint: '两边同时 −4：x = 11 − 4 = 7', leftVal: null, rightVal: null, xCoeff: 1, xAdd: 4, rhs: 11 },
  { left: 'x − 5', right: '8', answer: 13, hint: '两边同时 +5：x = 8 + 5 = 13', leftVal: null, rightVal: null, xCoeff: 1, xAdd: -5, rhs: 8 },
];

let labIdx = 0;
let labLeftAdd = 0;  // 对两边施加的增量
let labSolved = false;

function getLabEq() { return labEquations[labIdx]; }

function renderLabEquation() {
  labLeftAdd = 0;
  labSolved = false;
  document.getElementById('labHintBox').style.display = 'none';
  document.getElementById('labFeedback').textContent = '';
  document.getElementById('labFeedback').className = 'check-feedback';
  document.getElementById('labAnswerInput').value = '';
  document.getElementById('labAnswerInput').disabled = false;
  renderBalancePans(0);
}

function renderBalancePans(extra) {
  const eq = getLabEq();
  const newLeftConst = eq.xAdd + extra;  // constant remaining with x on left
  const newRhs = eq.rhs + extra;         // right side value

  const leftEl = document.getElementById('leftItems');
  const rightEl = document.getElementById('rightItems');
  leftEl.innerHTML = '';
  rightEl.innerHTML = '';

  // Left pan: always has x block
  const xBlock = document.createElement('span');
  xBlock.className = 'pan-item x-block';
  xBlock.textContent = 'x';
  leftEl.appendChild(xBlock);

  // Positive constant blocks on left
  if (newLeftConst > 0) {
    for (let i = 0; i < Math.min(newLeftConst, 8); i++) {
      const n = document.createElement('span');
      n.className = 'pan-item num';
      n.textContent = '+1';
      n.style.animationDelay = (i * 0.05) + 's';
      leftEl.appendChild(n);
    }
  } else if (newLeftConst < 0) {
    // Negative constant blocks on left (e.g. x − 3)
    for (let i = 0; i < Math.min(Math.abs(newLeftConst), 8); i++) {
      const n = document.createElement('span');
      n.className = 'pan-item neg';
      n.textContent = '−1';
      n.style.animationDelay = (i * 0.05) + 's';
      leftEl.appendChild(n);
    }
  }

  // Right pan: number blocks
  if (newRhs > 0) {
    for (let i = 0; i < Math.min(newRhs, 12); i++) {
      const n = document.createElement('span');
      n.className = 'pan-item num';
      n.textContent = '1';
      n.style.animationDelay = (i * 0.04) + 's';
      rightEl.appendChild(n);
    }
  } else {
    // Show numeric label when rhs is 0 or negative
    const n = document.createElement('span');
    n.className = 'pan-item neg';
    n.textContent = String(newRhs);
    rightEl.appendChild(n);
  }

  // Update equation text
  const leftStr = newLeftConst === 0
    ? 'x'
    : newLeftConst > 0
      ? `x + ${newLeftConst}`
      : `x − ${Math.abs(newLeftConst)}`;
  document.getElementById('labEqLeft').textContent = leftStr;
  document.getElementById('labEqRight').textContent = newRhs;

  // We always apply the same operation to both sides, so the equation stays
  // balanced — the beam is always horizontal.
  document.getElementById('balanceBeam').style.transform = 'translateX(-50%) rotate(0deg)';

  // Update status based on whether x is isolated
  const el = document.getElementById('balanceStatus');
  if (newLeftConst === 0) {
    el.className = 'balance-status balanced';
    el.textContent = '🎉 x 已经单独在左边了！快输入答案吧！';
  } else {
    el.className = 'balance-status balanced';
    el.textContent = '⚖️ 两边同时操作，天平保持平衡';
  }
}

document.querySelectorAll('.op-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (labSolved) return;  // 已解出后禁止继续操作
    const op = parseInt(btn.dataset.op);
    labLeftAdd += op;
    renderBalancePans(labLeftAdd);
    addXP(2);
  });
});

document.getElementById('labHintBtn').addEventListener('click', () => {
  const hint = getLabEq().hint;
  const hintBox = document.getElementById('labHintBox');
  hintBox.textContent = '💡 ' + hint;
  hintBox.style.display = 'block';
});

document.getElementById('labResetBtn').addEventListener('click', () => {
  renderLabEquation();
});

document.getElementById('labNextBtn').addEventListener('click', () => {
  labIdx = (labIdx + 1) % labEquations.length;
  renderLabEquation();
});

document.getElementById('labCheckBtn').addEventListener('click', () => {
  const input = document.getElementById('labAnswerInput');
  const val = parseInt(input.value);
  const eq = getLabEq();
  const fb = document.getElementById('labFeedback');
  if (isNaN(val)) {
    fb.textContent = '请输入一个数字！';
    fb.className = 'check-feedback fail';
    return;
  }
  if (val === eq.answer) {
    fb.textContent = '🎉 完全正确！x = ' + eq.answer;
    fb.className = 'check-feedback ok';
    input.disabled = true;
    labSolved = true;
    spawnConfetti(40);
    addXP(20);
  } else {
    fb.textContent = '❌ 不对哦，再试试！';
    fb.className = 'check-feedback fail';
    input.value = '';
    input.focus();
  }
});

renderLabEquation();

// ============================================================
//  模块三：解方程练习
// ============================================================
const solveBank = {
  1: [ // 初级：加减法
    { eq: 'x + 4 = 9', ans: 5, steps: ['两边同时 −4', 'x + 4 − 4 = 9 − 4', 'x = 5'] },
    { eq: 'x + 7 = 12', ans: 5, steps: ['两边同时 −7', 'x = 12 − 7', 'x = 5'] },
    { eq: 'x − 3 = 8', ans: 11, steps: ['两边同时 +3', 'x − 3 + 3 = 8 + 3', 'x = 11'] },
    { eq: 'x + 5 = 14', ans: 9, steps: ['两边同时 −5', 'x = 14 − 5', 'x = 9'] },
    { eq: 'x − 6 = 4', ans: 10, steps: ['两边同时 +6', 'x = 4 + 6', 'x = 10'] },
    { eq: 'x + 9 = 20', ans: 11, steps: ['两边同时 −9', 'x = 20 − 9', 'x = 11'] },
    { eq: '15 − x = 6', ans: 9, steps: ['15 − x = 6', '移项：x = 15 − 6', 'x = 9'] },
  ],
  2: [ // 中级：乘除法
    { eq: '3 × x = 15', ans: 5, steps: ['两边同时 ÷3', '3x ÷ 3 = 15 ÷ 3', 'x = 5'] },
    { eq: '4 × x = 28', ans: 7, steps: ['两边同时 ÷4', 'x = 28 ÷ 4', 'x = 7'] },
    { eq: 'x ÷ 2 = 6', ans: 12, steps: ['两边同时 ×2', 'x = 6 × 2', 'x = 12'] },
    { eq: 'x ÷ 3 = 5', ans: 15, steps: ['两边同时 ×3', 'x = 5 × 3', 'x = 15'] },
    { eq: '6 × x = 42', ans: 7, steps: ['两边同时 ÷6', 'x = 42 ÷ 6', 'x = 7'] },
    { eq: 'x ÷ 4 = 8', ans: 32, steps: ['两边同时 ×4', 'x = 8 × 4', 'x = 32'] },
    { eq: '5 × x = 35', ans: 7, steps: ['两边同时 ÷5', 'x = 35 ÷ 5', 'x = 7'] },
  ],
  3: [ // 高级：综合
    { eq: '2x + 1 = 11', ans: 5, steps: ['两边同时 −1 → 2x = 10', '两边同时 ÷2', 'x = 10 ÷ 2 = 5'] },
    { eq: '3x − 2 = 10', ans: 4, steps: ['两边同时 +2 → 3x = 12', '两边同时 ÷3', 'x = 12 ÷ 3 = 4'] },
    { eq: '2x + 6 = 14', ans: 4, steps: ['两边同时 −6 → 2x = 8', '两边同时 ÷2', 'x = 8 ÷ 2 = 4'] },
    { eq: '4x − 4 = 16', ans: 5, steps: ['两边同时 +4 → 4x = 20', '两边同时 ÷4', 'x = 20 ÷ 4 = 5'] },
    { eq: '5x + 3 = 23', ans: 4, steps: ['两边同时 −3 → 5x = 20', '两边同时 ÷5', 'x = 20 ÷ 5 = 4'] },
    { eq: '3x + 9 = 21', ans: 4, steps: ['两边同时 −9 → 3x = 12', '两边同时 ÷3', 'x = 12 ÷ 3 = 4'] },
  ]
};

let solveLevel = 1;
let solveQueue = [];
let solveQIdx = 0;
let solveScore = 0;
let solveCorrect = 0;
let solveWrong = 0;
const SOLVE_PER_ROUND = 5;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startSolveRound() {
  solveQueue = shuffleArray(solveBank[solveLevel]).slice(0, SOLVE_PER_ROUND);
  solveQIdx = 0;
  document.getElementById('solveCard').style.display = 'block';
  document.getElementById('solveComplete').style.display = 'none';
  document.getElementById('solveTotal').textContent = SOLVE_PER_ROUND;
  renderSolveQuestion();
}

function renderSolveQuestion() {
  const q = solveQueue[solveQIdx];
  document.getElementById('solveNum').textContent = solveQIdx + 1;
  document.getElementById('solveEquation').textContent = q.eq;
  document.getElementById('solveSteps').innerHTML = '';
  document.getElementById('solveInput').value = '';
  document.getElementById('solveFeedback').textContent = '';
  document.getElementById('solveFeedback').className = 'solve-feedback';
  document.getElementById('solveNextBtn').style.display = 'none';
  document.getElementById('solveSubmitBtn').style.display = '';
  document.getElementById('solveInput').disabled = false;
  const fill = ((solveQIdx) / SOLVE_PER_ROUND) * 100;
  document.getElementById('solveFill').style.width = fill + '%';
}

function showSolveSteps(steps) {
  const container = document.getElementById('solveSteps');
  container.innerHTML = '';
  steps.forEach((step, i) => {
    const div = document.createElement('div');
    div.className = 'step-line' + (i === steps.length - 1 ? ' result' : '');
    div.style.animationDelay = (i * 0.12) + 's';
    div.innerHTML = `<span class="step-icon">${i === steps.length - 1 ? '✅' : '→'}</span><span>${step}</span>`;
    container.appendChild(div);
  });
}

document.getElementById('solveSubmitBtn').addEventListener('click', () => {
  const val = parseInt(document.getElementById('solveInput').value);
  const q = solveQueue[solveQIdx];
  const fb = document.getElementById('solveFeedback');
  if (isNaN(val)) return;

  document.getElementById('solveInput').disabled = true;
  document.getElementById('solveSubmitBtn').style.display = 'none';
  document.getElementById('solveNextBtn').style.display = '';

  if (val === q.ans) {
    fb.textContent = '🎉 正确！+10分';
    fb.className = 'solve-feedback correct';
    solveScore += 10;
    solveCorrect++;
    addXP(15);
    spawnConfetti(30);
    showSolveSteps(q.steps);
  } else {
    fb.textContent = `❌ 正确答案是 ${q.ans}`;
    fb.className = 'solve-feedback wrong';
    solveWrong++;
    showSolveSteps(q.steps);
  }

  document.getElementById('solveScore').textContent = solveScore;
  document.getElementById('solveCorrect').textContent = solveCorrect;
  document.getElementById('solveWrong').textContent = solveWrong;
});

document.getElementById('solveNextBtn').addEventListener('click', () => {
  solveQIdx++;
  if (solveQIdx >= SOLVE_PER_ROUND) {
    document.getElementById('solveCard').style.display = 'none';
    document.getElementById('solveComplete').style.display = 'block';
    document.getElementById('completeFinalScore').textContent = solveScore;
    if (solveCorrect >= 4) spawnConfetti(60);
  } else {
    renderSolveQuestion();
  }
});

document.getElementById('solveHintBtn').addEventListener('click', () => {
  const q = solveQueue[solveQIdx];
  showSolveSteps(q.steps);
});

document.getElementById('solveRestartBtn').addEventListener('click', () => {
  startSolveRound();
});

document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    solveLevel = parseInt(btn.dataset.level);
    startSolveRound();
  });
});

startSolveRound();

// ============================================================
//  模块四：闯关挑战
// ============================================================
const challengeBank = [
  // 初级
  { eq: 'x + 3 = 7', ans: 4 }, { eq: 'x + 5 = 12', ans: 7 },
  { eq: 'x − 4 = 6', ans: 10 }, { eq: 'x − 2 = 9', ans: 11 },
  { eq: 'x + 8 = 15', ans: 7 }, { eq: '12 − x = 5', ans: 7 },
  // 中级
  { eq: '3 × x = 18', ans: 6 }, { eq: '4 × x = 20', ans: 5 },
  { eq: 'x ÷ 3 = 4', ans: 12 }, { eq: 'x ÷ 5 = 3', ans: 15 },
  { eq: '6 × x = 24', ans: 4 }, { eq: 'x ÷ 2 = 9', ans: 18 },
  // 高级
  { eq: '2x + 3 = 11', ans: 4 }, { eq: '3x − 1 = 8', ans: 3 },
  { eq: '4x + 2 = 18', ans: 4 }, { eq: '5x − 5 = 20', ans: 5 },
];

let cScore = 0, cCorrect = 0, cCombo = 0, cMaxCombo = 0;
let cTimer = null, cTimeLeft = 15;
let cQList = [], cQIdx = 0;
const C_TOTAL = 10;
const C_TIME = 15;

document.getElementById('startChallengeBtn').addEventListener('click', startChallenge);
document.getElementById('retryChallengeBtn').addEventListener('click', () => {
  document.getElementById('challengeResult').style.display = 'none';
  document.getElementById('challengeStart').style.display = 'block';
});

function startChallenge() {
  cScore = 0; cCorrect = 0; cCombo = 0; cMaxCombo = 0;
  cQList = shuffleArray(challengeBank).slice(0, C_TOTAL);
  cQIdx = 0;
  document.getElementById('challengeStart').style.display = 'none';
  document.getElementById('challengeResult').style.display = 'none';
  document.getElementById('challengeGame').style.display = 'block';
  renderCQuestion();
}

function renderCQuestion() {
  if (cQIdx >= cQList.length) { endChallenge(); return; }
  const q = cQList[cQIdx];
  document.getElementById('cEquation').textContent = q.eq;
  document.getElementById('cFeedback').textContent = '';
  document.getElementById('cFeedback').className = 'c-feedback';
  document.getElementById('cScore').textContent = cScore;
  document.getElementById('cCombo').textContent = cCombo + 1;

  // Generate 4 options: 1 correct + 3 distractors
  const options = generateOptions(q.ans);
  const optEl = document.getElementById('cOptions');
  optEl.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'c-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectCOption(btn, opt, q.ans));
    optEl.appendChild(btn);
  });

  startTimer();
}

function generateOptions(correct) {
  const opts = new Set([correct]);
  const deltas = [-3, -2, -1, 1, 2, 3, 4, -4, 5, -5];
  let di = 0;
  while (opts.size < 4) {
    const candidate = correct + deltas[di % deltas.length];
    di++;
    if (candidate > 0) opts.add(candidate);
  }
  return shuffleArray([...opts]);
}

function startTimer() {
  clearInterval(cTimer);
  cTimeLeft = C_TIME;
  updateTimerUI(cTimeLeft);
  cTimer = setInterval(() => {
    cTimeLeft--;
    updateTimerUI(cTimeLeft);
    if (cTimeLeft <= 0) {
      clearInterval(cTimer);
      onTimeUp();
    }
  }, 1000);
}

function updateTimerUI(t) {
  const pct = t / C_TIME;
  const circumference = 113;
  const offset = circumference * (1 - pct);
  document.getElementById('timerCircle').style.strokeDashoffset = offset;
  document.getElementById('timerNum').textContent = t;
  const urgent = t <= 5;
  document.getElementById('timerCircle').classList.toggle('urgent', urgent);
  document.getElementById('timerNum').classList.toggle('urgent', urgent);
}

function onTimeUp() {
  cCombo = 0;
  const fb = document.getElementById('cFeedback');
  fb.textContent = '⏰ 时间到！';
  fb.className = 'c-feedback wrong';
  disableCOptions();
  setTimeout(() => { cQIdx++; renderCQuestion(); }, 1200);
}

function selectCOption(btn, val, correct) {
  clearInterval(cTimer);
  disableCOptions();
  const fb = document.getElementById('cFeedback');
  if (val === correct) {
    btn.classList.add('correct');
    cCombo++;
    cMaxCombo = Math.max(cMaxCombo, cCombo);
    const bonus = cCombo > 1 ? cCombo : 1;
    const gained = 10 * bonus;
    cScore += gained;
    cCorrect++;
    fb.textContent = cCombo > 1 ? `🔥 连击 x${cCombo}！+${gained}分` : `✅ 正确！+${gained}分`;
    fb.className = 'c-feedback correct';
    addXP(10);
    if (cCombo >= 3) spawnConfetti(25);
  } else {
    btn.classList.add('wrong');
    cCombo = 0;
    cScore = Math.max(0, cScore - 3);
    fb.textContent = `❌ 答案是 ${correct}`;
    fb.className = 'c-feedback wrong';
    // highlight correct
    document.querySelectorAll('.c-option').forEach(b => {
      if (parseInt(b.textContent) === correct) b.classList.add('correct');
    });
  }
  document.getElementById('cScore').textContent = cScore;
  document.getElementById('cCombo').textContent = cCombo + 1;
  setTimeout(() => { cQIdx++; renderCQuestion(); }, 1400);
}

function disableCOptions() {
  document.querySelectorAll('.c-option').forEach(b => {
    b.disabled = true;
    b.style.pointerEvents = 'none';
  });
}

function endChallenge() {
  clearInterval(cTimer);
  document.getElementById('challengeGame').style.display = 'none';
  document.getElementById('challengeResult').style.display = 'block';
  document.getElementById('rScore').textContent = cScore;
  document.getElementById('rCorrect').textContent = cCorrect;
  document.getElementById('rMaxCombo').textContent = cMaxCombo;

  const rankEl = document.getElementById('rankDisplay');
  let rank, cls;
  if (cScore >= 90) { rank = '🌟 S 级 - 方程大师！'; cls = 'rank-s'; }
  else if (cScore >= 70) { rank = '🎖️ A 级 - 非常优秀！'; cls = 'rank-a'; }
  else if (cScore >= 50) { rank = '👍 B 级 - 表现不错！'; cls = 'rank-b'; }
  else { rank = '💪 C 级 - 继续加油！'; cls = 'rank-c'; }
  rankEl.textContent = rank;
  rankEl.className = 'rank-display ' + cls;

  if (cScore >= 70) spawnConfetti(80);
  addXP(cScore);
}
