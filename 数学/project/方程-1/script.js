// ===== 星空背景 =====
(function createStars() {
  const bg = document.getElementById('starsBg');
  const count = 30;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = star.style.height = (Math.random() * 4 + 2) + 'px';
    star.style.setProperty('--dur', (Math.random() * 3 + 2) + 's');
    star.style.setProperty('--delay', (Math.random() * 4) + 's');
    bg.appendChild(star);
  }
})();

// ===== 标签页切换 =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panelId = tab.dataset.tab;
    document.getElementById(panelId + 'Panel').classList.add('active');

    if (panelId === 'challenge') {
      startChallenge();
    }
  });
});

// ===== 撒花效果 =====
function spawnConfetti() {
  const colors = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = confetti.style.height = (Math.random() * 8 + 6) + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confetti.style.setProperty('--fall-dur', (Math.random() * 2 + 2) + 's');
    confetti.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

// ===== 音效替代：视觉闪烁 =====
function flashElement(el, className, duration) {
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), duration);
}

// ==============================
//  学习模式
// ==============================
const learnEquations = [
  { left: 'x + 3', right: '7', answer: 4, hint: '两边同时减3，x = 7 − 3 = 4', type: 'add' },
  { left: 'x − 5', right: '9', answer: 14, hint: '两边同时加5，x = 9 + 5 = 14', type: 'sub' },
  { left: '4 × x', right: '20', answer: 5, hint: '两边同时除以4，x = 20 ÷ 4 = 5', type: 'mul' },
  { left: 'x ÷ 3', right: '6', answer: 18, hint: '两边同时乘3，x = 6 × 3 = 18', type: 'div' },
  { left: '2x + 1', right: '11', answer: 5, hint: '先减1，再除以2：2x=10，x=5', type: 'add_mul' },
];

let currentEqIdx = 0;
let currentEquation = { ...learnEquations[0] };

function getCurrentEquation() {
  return { ...learnEquations[currentEqIdx] };
}

function updateEquationDisplay() {
  document.getElementById('eqLeft').textContent = currentEquation.left;
  document.getElementById('eqRight').textContent = currentEquation.right;
  updateBalance();
  updateLearnMessage();
}

function updateLearnMessage() {
  const messages = {
    add: '💡 等式两边同时加上或减去同一个数，等式仍然成立！',
    sub: '💡 等号就像天平，两边必须相等！想想怎么让左边只剩 x？',
    mul: '💡 等式两边同时乘以或除以同一个非零数，等式仍然成立！',
    div: '💡 把 x 单独留在一边，就能找到它的值！',
    add_mul: '💡 一步一步来：先消掉常数，再消掉系数！',
  };
  document.getElementById('learnMessage').textContent =
    messages[currentEquation.type] || messages.add;
}

function updateBalance() {
  const beam = document.getElementById('beam');
  const panLeft = document.getElementById('panLeft');
  const panRight = document.getElementById('panRight');

  const leftLabels = {
    'x + 3': 'x + 3',
    'x − 5': 'x − 5',
    '4 × x': '4x',
    'x ÷ 3': 'x ÷ 3',
    '2x + 1': '2x + 1',
  };
  const rightLabels = {
    '7': '7',
    '9': '9',
    '20': '20',
    '6': '6',
    '11': '11',
  };

  document.querySelector('#panLeft .pan-label').textContent =
    leftLabels[currentEquation.left] || currentEquation.left;
  document.querySelector('#panRight .pan-label').textContent =
    rightLabels[currentEquation.right] || currentEquation.right;

  beam.className = 'beam';
  panLeft.className = 'pan pan-left';
  panRight.className = 'pan pan-right';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const leftVal = estimateValue(currentEquation.left);
      const rightVal = estimateValue(currentEquation.right);
      if (leftVal > rightVal) {
        beam.classList.add('left-heavy');
        panLeft.classList.add('left-heavy');
      } else if (rightVal > leftVal) {
        beam.classList.add('right-heavy');
        panRight.classList.add('right-heavy');
      } else {
        beam.classList.add('balanced');
      }
    });
  });
}

function estimateValue(expr) {
  expr = expr.trim();
  // x + 3  → 估算为 answer + 3
  const eq = currentEquation;
  if (expr === eq.left) {
    return eq.answer + 3; // rough
  }
  if (expr === eq.right) {
    // parse numeric right side
    const num = parseInt(eq.right);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function showSolutionInput() {
  const area = document.getElementById('solutionArea');
  area.style.display = 'block';
  document.getElementById('answerInput').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('answerInput').focus();
  // scroll into view
  area.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 操作按钮
document.querySelectorAll('.op-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const op = btn.dataset.op;
    if (op === 'reset') {
      currentEquation = getCurrentEquation();
      updateEquationDisplay();
      document.getElementById('solutionArea').style.display = 'none';
      document.getElementById('feedback').textContent = '';
      return;
    }
    if (op === 'add' || op === 'sub') {
      const val = parseInt(btn.dataset.val);
      applyOperation(op, val);
    }
  });
});

function applyOperation(op, val) {
  // 修改左边
  if (op === 'add') {
    currentEquation.left = currentEquation.left.replace(/(\+ \d+)?(-\s*\d+)?$/, '') + ' + ' + val;
    // simplify if needed
    currentEquation.left = simplifyExpr(currentEquation.left);
    currentEquation.right = String(parseInt(currentEquation.right) + val);
  } else if (op === 'sub') {
    currentEquation.left = currentEquation.left.replace(/(\+ \d+)?(-\s*\d+)?$/, '') + ' − ' + val;
    currentEquation.left = simplifyExpr(currentEquation.left);
    currentEquation.right = String(parseInt(currentEquation.right) - val);
  }
  updateEquationDisplay();
  showSolutionInput();
}

function simplifyExpr(expr) {
  // very simple simplification
  expr = expr.replace(/\+ −/, '− ');
  expr = expr.replace(/− 0$/, '').trim();
  if (expr.endsWith('+ 0') || expr.endsWith('− 0')) {
    expr = expr.slice(0, -2).trim();
  }
  return expr;
}

// 提示按钮
document.getElementById('hintBtn').addEventListener('click', () => {
  alert('💡 提示：\n' + currentEquation.hint);
});

// 下一题
document.getElementById('nextEqBtn').addEventListener('click', () => {
  currentEqIdx = (currentEqIdx + 1) % learnEquations.length;
  currentEquation = getCurrentEquation();
  updateEquationDisplay();
  document.getElementById('solutionArea').style.display = 'none';
  document.getElementById('feedback').textContent = '';
});

// 检查答案
document.getElementById('checkBtn').addEventListener('click', checkLearnAnswer);
document.getElementById('answerInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkLearnAnswer();
});

function checkLearnAnswer() {
  const input = document.getElementById('answerInput');
  const feedback = document.getElementById('feedback');
  const userAnswer = parseInt(input.value);

  if (isNaN(userAnswer)) {
    feedback.textContent = '请输入一个数字哦~';
    feedback.className = 'feedback wrong';
    return;
  }

  if (userAnswer === currentEquation.answer) {
    feedback.textContent = '🎉 太棒了！答案正确！x = ' + currentEquation.answer;
    feedback.className = 'feedback correct';
    spawnConfetti();
  } else {
    feedback.textContent = '❌ 再想想哦，提示：' + currentEquation.hint;
    feedback.className = 'feedback wrong';
  }
}

// 初始化学习模式
updateEquationDisplay();
document.getElementById('solutionArea').style.display = 'none';

// ==============================
//  练习模式
// ==============================
let practiceQuestions = [];
let practiceIndex = 0;
let practiceScore = 0;
const PRACTICE_TOTAL = 10;

function generatePracticeQuestions() {
  practiceQuestions = [];
  const types = [
    // x + a = b
    () => {
      const a = randInt(1, 20);
      const x = randInt(1, 50);
      return { display: `x + ${a} = ${x + a}`, answer: x, hint: `两边减${a}：x = ${x + a} − ${a} = ${x}` };
    },
    // x − a = b
    () => {
      const a = randInt(1, 20);
      const x = randInt(a + 1, 50);
      return { display: `x − ${a} = ${x - a}`, answer: x, hint: `两边加${a}：x = ${x - a} + ${a} = ${x}` };
    },
    // a × x = b
    () => {
      const a = randInt(2, 9);
      const x = randInt(1, 20);
      return { display: `${a} × x = ${a * x}`, answer: x, hint: `两边除以${a}：x = ${a * x} ÷ ${a} = ${x}` };
    },
    // x ÷ a = b
    () => {
      const a = randInt(2, 9);
      const x = a * randInt(1, 10);
      return { display: `x ÷ ${a} = ${x / a}`, answer: x, hint: `两边乘${a}：x = ${x / a} × ${a} = ${x}` };
    },
  ];

  for (let i = 0; i < PRACTICE_TOTAL; i++) {
    practiceQuestions.push(types[randInt(0, types.length - 1)]());
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderPracticeQuestion() {
  if (practiceIndex >= PRACTICE_TOTAL) {
    showPracticeResults();
    return;
  }
  const q = practiceQuestions[practiceIndex];
  document.getElementById('practiceEq').textContent = q.display + '，x = ?';
  document.getElementById('practiceInput').value = '';
  document.getElementById('practiceFeedback').textContent = '';
  document.getElementById('practiceFeedback').className = 'practice-feedback';
  document.getElementById('practiceHint').textContent = '';
  document.getElementById('qCurrent').textContent = practiceIndex + 1;
  document.getElementById('progressFill').style.width = (practiceIndex / PRACTICE_TOTAL * 100) + '%';
  document.getElementById('practiceInput').focus();
}

function showPracticeResults() {
  document.getElementById('practiceCard').style.display = 'none';
  const resultDiv = document.getElementById('practiceResult');
  resultDiv.style.display = 'block';

  const pct = practiceScore / PRACTICE_TOTAL;
  let emoji, text;
  if (pct === 1) { emoji = '🏆'; text = '满分！你太厉害了！全部答对！'; }
  else if (pct >= 0.8) { emoji = '🌟'; text = '非常棒！答对了 ' + practiceScore + ' / ' + PRACTICE_TOTAL + ' 题！'; }
  else if (pct >= 0.6) { emoji = '👍'; text = '不错哦！答对了 ' + practiceScore + ' / ' + PRACTICE_TOTAL + ' 题，继续加油！'; }
  else { emoji = '💪'; text = '答对了 ' + practiceScore + ' / ' + PRACTICE_TOTAL + ' 题，多练习就会进步的！'; }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultText').textContent = text;
  if (pct >= 0.6) spawnConfetti();
}

document.getElementById('practiceSubmit').addEventListener('click', submitPracticeAnswer);
document.getElementById('practiceInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitPracticeAnswer();
});

function submitPracticeAnswer() {
  const input = document.getElementById('practiceInput');
  const feedback = document.getElementById('practiceFeedback');
  const hintEl = document.getElementById('practiceHint');
  const userAnswer = parseInt(input.value);

  if (isNaN(userAnswer)) {
    feedback.textContent = '请输入答案哦~';
    feedback.className = 'practice-feedback wrong';
    return;
  }

  const q = practiceQuestions[practiceIndex];

  if (userAnswer === q.answer) {
    feedback.textContent = '✅ 正确！x = ' + q.answer;
    feedback.className = 'practice-feedback correct';
    hintEl.textContent = '';
    practiceScore++;
    document.getElementById('practiceScore').textContent = practiceScore;
    document.getElementById('progressFill').style.width = ((practiceIndex + 1) / PRACTICE_TOTAL * 100) + '%';

    setTimeout(() => {
      practiceIndex++;
      renderPracticeQuestion();
    }, 800);
  } else {
    feedback.textContent = '❌ 不对哦，再试试！';
    feedback.className = 'practice-feedback wrong';
    hintEl.textContent = '💡 提示：' + q.hint;
    input.value = '';
    input.focus();
  }
}

document.getElementById('practiceRestart').addEventListener('click', startPractice);

function startPractice() {
  practiceIndex = 0;
  practiceScore = 0;
  document.getElementById('practiceScore').textContent = '0';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('qTotal').textContent = PRACTICE_TOTAL;
  document.getElementById('practiceCard').style.display = 'block';
  document.getElementById('practiceResult').style.display = 'none';
  generatePracticeQuestions();
  renderPracticeQuestion();
}

// 切换到练习标签时初始化
const observer = new MutationObserver(() => {
  if (document.getElementById('practicePanel').classList.contains('active')) {
    startPractice();
  }
});
// 简单处理：在tab切换处触发
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.dataset.tab === 'practice') {
      startPractice();
    }
  });
});

// ==============================
//  挑战模式
// ==============================
let challengeTimer = null;
let challengeSeconds = 60;
let challengeScore = 0;
let challengeStreak = 0;
let currentChallengeQ = null;

function generateChallengeQuestion() {
  const types = [
    () => {
      const a = randInt(1, 30);
      const x = randInt(1, 50);
      return { display: `x + ${a} = ${x + a}`, answer: x };
    },
    () => {
      const a = randInt(1, 30);
      const x = randInt(a + 1, 60);
      return { display: `x − ${a} = ${x - a}`, answer: x };
    },
    () => {
      const a = randInt(2, 9);
      const x = randInt(1, 20);
      return { display: `${a} × x = ${a * x}`, answer: x };
    },
    () => {
      const a = randInt(2, 9);
      const x = a * randInt(1, 12);
      return { display: `x ÷ ${a} = ${x / a}`, answer: x };
    },
    // harder: ax + b = c
    () => {
      const a = randInt(2, 5);
      const b = randInt(1, 10);
      const x = randInt(1, 15);
      return { display: `${a}x + ${b} = ${a * x + b}`, answer: x };
    },
  ];
  return types[randInt(0, types.length - 1)]();
}

function renderChallengeQuestion() {
  currentChallengeQ = generateChallengeQuestion();
  document.getElementById('challengeEq').textContent = currentChallengeQ.display + '，x = ?';
  document.getElementById('challengeInput').value = '';
  document.getElementById('challengeFeedback').textContent = '';
  document.getElementById('challengeFeedback').className = 'challenge-feedback';
  document.getElementById('challengeInput').focus();
}

function startChallenge() {
  // 清理之前的计时器
  if (challengeTimer) clearInterval(challengeTimer);

  challengeSeconds = 60;
  challengeScore = 0;
  challengeStreak = 0;
  document.getElementById('timer').textContent = '⏱ 60';
  document.getElementById('timer').classList.remove('urgent');
  document.getElementById('challengeScore').textContent = '0';
  document.getElementById('streak').innerHTML = '🔥 <span>0</span>';
  document.getElementById('challengeCard').style.display = 'block';
  document.getElementById('challengeResult').style.display = 'none';

  renderChallengeQuestion();

  challengeTimer = setInterval(() => {
    challengeSeconds--;
    document.getElementById('timer').textContent = '⏱ ' + challengeSeconds;
    if (challengeSeconds <= 10) {
      document.getElementById('timer').classList.add('urgent');
    }
    if (challengeSeconds <= 0) {
      clearInterval(challengeTimer);
      challengeTimer = null;
      showChallengeResults();
    }
  }, 1000);
}

function showChallengeResults() {
  document.getElementById('challengeCard').style.display = 'none';
  const resultDiv = document.getElementById('challengeResult');
  resultDiv.style.display = 'block';

  let emoji, text;
  if (challengeScore >= 15) { emoji = '🏆'; text = '太厉害了！60秒答对 ' + challengeScore + ' 题！你是方程天才！'; }
  else if (challengeScore >= 10) { emoji = '🌟'; text = '非常棒！60秒答对 ' + challengeScore + ' 题！'; }
  else if (challengeScore >= 5) { emoji = '👍'; text = '不错！60秒答对 ' + challengeScore + ' 题，继续加油！'; }
  else { emoji = '💪'; text = '答对了 ' + challengeScore + ' 题，多加练习哦！'; }

  document.getElementById('challengeResultEmoji').textContent = emoji;
  document.getElementById('challengeResultText').textContent = text;
  if (challengeScore >= 10) spawnConfetti();
}

document.getElementById('challengeSubmit').addEventListener('click', submitChallengeAnswer);
document.getElementById('challengeInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitChallengeAnswer();
});

function submitChallengeAnswer() {
  if (!challengeTimer) return; // 游戏已结束

  const input = document.getElementById('challengeInput');
  const feedback = document.getElementById('challengeFeedback');
  const userAnswer = parseInt(input.value);

  if (isNaN(userAnswer)) {
    feedback.textContent = '请输入答案！';
    feedback.className = 'challenge-feedback wrong';
    return;
  }

  if (userAnswer === currentChallengeQ.answer) {
    feedback.textContent = '✅ 正确！';
    feedback.className = 'challenge-feedback correct';
    challengeScore++;
    challengeStreak++;
    document.getElementById('challengeScore').textContent = challengeScore;
    document.getElementById('streak').innerHTML = '🔥 <span>' + challengeStreak + '</span>';
    setTimeout(() => { renderChallengeQuestion(); }, 300);
  } else {
    feedback.textContent = '❌ 答案是 x = ' + currentChallengeQ.answer;
    feedback.className = 'challenge-feedback wrong';
    challengeStreak = 0;
    document.getElementById('streak').innerHTML = '🔥 <span>0</span>';
    setTimeout(() => { renderChallengeQuestion(); }, 800);
  }
}

document.getElementById('challengeRestart').addEventListener('click', startChallenge);
