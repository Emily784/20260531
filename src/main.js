const app = document.getElementById('app');

const methods = [
  { 
    name: '番茄鐘學習法', 
    summary: '透過「專注 25 分鐘、休息 5 分鐘」的循環，建立節奏感並維持高強度注意力。',
    image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=600',
    desc: '<b>【執行細節】</b><br>這是一套旨在對抗分心與疲勞的時間管理系統。其核心在於「高強度集中」與「規律性休息」的循環。' +
          '<ul class="list-disc ml-5 mt-2 space-y-1"><li><b>執行步驟：</b>設定 25 分鐘計時器全神貫注，鈴響後立即休息 5 分鐘。</li>' +
          '<li><b>大休息：</b>每完成 4 個循環後，安排 15-30 分鐘的長休息。</li>' +
          '<li><b>核心價值：</b>利用倒數計時產生的「心理迫切感」提升效率，並透過強制休息防止大腦進入疲勞期。</li></ul>' 
  },
  { 
    name: '費曼學習法', 
    summary: '最強調「以教促學」的內化方法，透過向他人解釋來檢驗自己的理解程度。',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    desc: '<b>【執行細節】</b><br>這被認為是最有效的學習法，強調「以教促學」。如果你無法簡單地解釋一件事，代表你尚未真正理解它。' +
          '<ul class="list-disc ml-5 mt-2 space-y-1"><li><b>教學模擬：</b>選擇一個主題，嘗試解釋給一個不懂該領域的人聽（如小學生）。</li>' +
          '<li><b>查漏補缺：</b>在解釋過程中卡住的地方，就是你的知識盲點，需立即回頭複習原始資料。</li>' +
          '<li><b>簡化比喻：</b>運用具體的比喻來取代生硬的術語，將資訊轉化為長期記憶。</li></ul>' 
  },
  { 
    name: '康乃爾筆記法', 
    summary: '將筆記空間分為三個區塊，強迫大腦在記錄時同時進行歸納與反思。',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
    desc: '<b>【執行細節】</b><br>這不只是記錄工具，更是一套「邊寫邊思考」的複習系統。透過將頁面劃分為三個功能區塊，大幅提升複習效率。' +
          '<ul class="list-disc ml-5 mt-2 space-y-1"><li><b>黃金佈局：</b>右側「筆記區」記細節、左側「線索區」提煉問題、下方「總結區」寫精華。</li>' +
          '<li><b>5R 原則：</b>記錄 (Record)、簡化 (Reduce)、背誦 (Recite)、反思 (Reflect)、複習 (Review)。</li>' +
          '<li><b>核心價值：</b>強迫大腦在課後進行「檢索提取」，將零散筆記轉化為邏輯嚴密的知識網絡。</li></ul>' 
  }
];

const quizQuestions = [
  {
    q: "學習新知識時，你通常？",
    options: [
      { text: "覺得坐不住，需要分段吸收", type: "番茄鐘" },
      { text: "喜歡試著講給別人聽看看", type: "費曼" },
      { text: "喜歡整理成有條理的架構", type: "康乃爾" }
    ]
  },
  {
    q: "你的專注力通常能持續多久？",
    options: [
      { text: "容易分心，15-30 分鐘是極限", type: "番茄鐘" },
      { text: "進入狀況後會想鑽研到底", type: "費曼" },
      { text: "穩定但需要系統化的導引", type: "康乃爾" }
    ]
  },
  {
    q: "你覺得哪種方式讓你記最久？",
    options: [
      { text: "頻繁的短時間重複接觸", type: "番茄鐘" },
      { text: "用自己的話重新描述一遍", type: "費曼" },
      { text: "透過書寫標籤與重點摘要", type: "康乃爾" }
    ]
  },
  {
    q: "遇到看不懂的概念，你會？",
    options: [
      { text: "設定時間限制，逼自己讀完", type: "番茄鐘" },
      { text: "拆解它並找出最白話的解釋", type: "費曼" },
      { text: "翻閱筆記尋找關聯性", type: "康乃爾" }
    ]
  },
  {
    q: "你最喜歡的學習氛圍是？",
    options: [
      { text: "有節奏感、有明確休息時間", type: "番茄鐘" },
      { text: "像在討論或演講的感覺", type: "費曼" },
      { text: "安靜且適合書寫整理", type: "康乃爾" }
    ]
  }
];

let currentQuestionIndex = 0;
let scores = { "番茄鐘": 0, "費曼": 0, "康乃爾": 0 };
let editingTaskId = null;

// 初始化提示音效
const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

// 從 localStorage 載入設定，若無則使用預設值
let focusMinutes = parseInt(localStorage.getItem('focusMinutes')) || 25;
let shortBreakMinutes = parseInt(localStorage.getItem('shortBreakMinutes')) || 5;
let longBreakMinutes = parseInt(localStorage.getItem('longBreakMinutes')) || 15;
let timeLeft = focusMinutes * 60;
let timerInterval = null;
let timerMode = 'focus'; // 'focus', 'shortBreak', 'longBreak'
let sessionsCompleted = 0;
let dailyTotal = 0;

const router = {
  navigate(page) {
    app.innerHTML = '';
    editingTaskId = null;
    if (page === 'home') this.renderHome();
    if (page === 'quiz') this.renderQuiz();
    if (page === 'planner') this.renderPlanner();
    this.loadDailyStats();
    if (page === 'timer') this.renderTimer();
    
    // 平滑滾動至頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderHome() {
    const recommended = localStorage.getItem('recommendedMethod');
    app.innerHTML = `
      <section class="text-center mb-10">
        <h2 class="text-3xl font-bold mb-4 dark:text-white">
          ${recommended ? `為你推薦：${recommended}法` : '掌握最適合你的讀書技巧'}
        </h2>
        <p class="text-gray-600 dark:text-slate-400">
          ${recommended ? '根據你的測驗結果，我們為你精選了以下內容。' : '探索各種科學證實有效的學習方法。'}
        </p>
      </section>
      <div class="grid lg:grid-cols-3 gap-8">
        ${methods.map((m, index) => `
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
            <img src="${m.image}" class="w-full h-48 object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" alt="${m.name}">
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-slate-800">${m.name}</h3>
              <p class="text-gray-600 dark:text-slate-400 text-base mb-4 leading-relaxed">${m.summary}</p>
              <button onclick="router.toggleMethod(${index})" class="text-indigo-600 font-semibold text-base hover:text-indigo-800 flex items-center transition-colors">
                <span>查看詳細說明</span>
                <svg id="icon-${index}" class="w-4 h-4 ml-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div id="details-${index}" class="hidden mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-base animate-fade-in">
                ${m.desc}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  toggleMethod(index) {
    const details = document.getElementById(`details-${index}`);
    const icon = document.getElementById(`icon-${index}`);
    if (details) {
      details.classList.toggle('hidden');
      icon?.classList.toggle('rotate-180');
    }
  },

  renderQuiz() {
    currentQuestionIndex = 0;
    scores = { "番茄鐘": 0, "費曼": 0, "康乃爾": 0 };
    this.showQuestion();
  },

  showQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    app.innerHTML = `
      <div class="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-transparent dark:border-slate-700">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold dark:text-white">學習風格測驗</h2>
          <span class="text-base text-gray-500 dark:text-slate-400">問題 ${currentQuestionIndex + 1} / ${quizQuestions.length}</span>
        </div>
        <div id="quiz-content">
          <p class="text-lg mb-6 dark:text-slate-200">${question.q}</p>
          <div class="space-y-4">
            ${question.options.map(opt => `
              <button class="w-full text-left p-4 border dark:border-slate-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors dark:text-slate-300" 
                onclick="router.handleAnswer('${opt.type}')">${opt.text}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  handleAnswer(type) {
    scores[type]++;
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      this.showQuestion();
    } else {
      this.showResult();
    }
  },

  showResult() {
    const recommended = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    localStorage.setItem('recommendedMethod', recommended); // 儲存測驗結果
    app.innerHTML = `
      <div class="text-center p-10">
        <h2 class="text-2xl font-bold mb-4 dark:text-white">測驗結果</h2>
        <p class="text-lg mb-6 dark:text-slate-300">根據你的回答，我們推薦你使用：<span class="text-indigo-600 font-bold">${recommended}學習法</span></p>
        <button onclick="router.navigate('home')" class="bg-indigo-600 text-white px-6 py-2 rounded-lg">了解更多方法</button>
      </div>
    `;
  },

  renderTimer() {
    const modeNames = { focus: '專注時間', shortBreak: '短休息', longBreak: '長休息' };
    app.innerHTML = `
      <div class="max-w-md mx-auto">
        <div class="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl text-center border border-slate-100 dark:border-slate-700">
        <div class="flex justify-between items-center mb-6">
          <span class="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold uppercase tracking-wider">${modeNames[timerMode]}</span>
          <span class="text-slate-400 dark:text-slate-500 text-base font-medium">進度: ${sessionsCompleted % 4}/4</span>
        </div>
        
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div>
            <label class="text-xs text-slate-400 block mb-1 uppercase tracking-widest">專注</label>
            <input type="number" value="${focusMinutes}" 
              ${timerInterval ? 'disabled' : ''}
              class="w-full text-center border-b-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 outline-none font-bold py-1 bg-transparent dark:text-white transition-colors"
              onchange="router.setTime('focus', this.value)">
          </div>
          <div>
            <label class="text-xs text-slate-400 block mb-1 uppercase tracking-widest">短休息</label>
            <input type="number" value="${shortBreakMinutes}" 
              ${timerInterval ? 'disabled' : ''}
              class="w-full text-center border-b-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 outline-none font-bold py-1 bg-transparent dark:text-white transition-colors"
              onchange="router.setTime('shortBreak', this.value)">
          </div>
          <div>
            <label class="text-xs text-slate-400 block mb-1 uppercase tracking-widest">長休息</label>
            <input type="number" value="${longBreakMinutes}" 
              ${timerInterval ? 'disabled' : ''}
              class="w-full text-center border-b-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 outline-none font-bold py-1 bg-transparent dark:text-white transition-colors"
              onchange="router.setTime('longBreak', this.value)">
          </div>
        </div>

        <div class="text-7xl font-mono font-bold text-indigo-600 mb-10 tracking-tighter" id="timer-display">
          25:00
        </div>
        <div class="flex justify-center space-x-4">
          <button id="timer-ctrl" onclick="router.toggleTimer()" class="bg-indigo-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            ${timerInterval ? '暫停' : '開始專注'}
          </button>
          <button onclick="router.resetTimer()" class="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-8 py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
            重設
          </button>
        </div>
        
        <div class="mt-10 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p class="text-slate-500 text-sm uppercase tracking-widest mb-1">今日專注統計</p>
          <p class="text-2xl font-bold text-slate-700 dark:text-slate-200">已完成 <span class="text-indigo-600 dark:text-indigo-400">${dailyTotal}</span> 個番茄鐘</p>
          <p class="text-sm text-slate-400 mt-1">累計專注約 ${dailyTotal * focusMinutes} 分鐘</p>
        </div>

        <p class="mt-8 text-slate-400 text-base" id="timer-status">
          ${timerInterval ? '專注中，加油！' : '準備好開始了嗎？'}
        </p>
      </div>
        ${this.renderHeatmap()}
      </div>
    `;
    this.updateTimerUI();
  },

  renderHeatmap() {
    const history = JSON.parse(localStorage.getItem('pomodoro_history')) || {};
    const days = [];
    const today = new Date();
    
    // 生成過去 30 天的日期陣列
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: dateStr, count: history[dateStr] || 0 });
    }

    return `
      <div class="mt-6 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
            <span class="mr-2">📊</span> 學習熱點圖
          </h4>
          <span class="text-sm text-slate-400">過去 30 天</span>
        </div>
        <div class="grid grid-cols-10 gap-2">
          ${days.map(d => {
            let color = 'bg-slate-100 dark:bg-slate-700'; // 0 次
            if (d.count >= 8) color = 'bg-indigo-600';    // 8 次以上 (深色)
            else if (d.count >= 4) color = 'bg-indigo-400'; // 4-7 次 (中色)
            else if (d.count >= 1) color = 'bg-indigo-200 dark:bg-indigo-500/40'; // 1-3 次 (淺色)
            
            return `<div class="aspect-square rounded-sm ${color} group relative cursor-help transition-colors">
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-sm py-1.5 px-3 rounded whitespace-nowrap z-30 shadow-xl">
                ${d.date}: ${d.count} 次完成
              </div>
            </div>`;
          }).join('')}
        </div>
        <div class="mt-4 flex justify-between items-center text-xs text-slate-400 uppercase tracking-tighter">
          <span>30 天前</span>
          <div class="flex space-x-1 items-center">
            <div class="w-2 h-2 bg-slate-100 dark:bg-slate-700 rounded-sm"></div>
            <div class="w-2 h-2 bg-indigo-200 dark:bg-indigo-500/40 rounded-sm"></div>
            <div class="w-2 h-2 bg-indigo-400 rounded-sm"></div>
            <div class="w-2 h-2 bg-indigo-600 rounded-sm"></div>
          </div>
          <span>今日</span>
        </div>
      </div>
    `;
  },

  toggleTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    } else {
      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          this.updateTimerUI();
        } else {
          this.switchMode();
        }
      }, 1000);
    }
    this.renderTimer();
  },

  loadDailyStats() {
    const today = new Date().toISOString().split('T')[0];
    const history = JSON.parse(localStorage.getItem('pomodoro_history')) || {};
    dailyTotal = history[today] || 0;
  },

  saveDailyStats() {
    const today = new Date().toISOString().split('T')[0];
    let history = JSON.parse(localStorage.getItem('pomodoro_history')) || {};
    history[today] = (history[today] || 0) + 1;
    localStorage.setItem('pomodoro_history', JSON.stringify(history));
    dailyTotal = history[today];
  },

  setTime(type, val) {
    const min = Math.max(1, parseInt(val) || 1);
    if (type === 'focus') focusMinutes = min;
    if (type === 'shortBreak') shortBreakMinutes = min;
    if (type === 'longBreak') longBreakMinutes = min;
    
    // 儲存設定到本地
    localStorage.setItem(`${type}Minutes`, min);
    
    if (!timerInterval && timerMode === type) {
      timeLeft = min * 60;
      this.updateTimerUI();
    }
  },

  switchMode() {
    clearInterval(timerInterval);
    timerInterval = null;
    
    // 播放提示音
    notificationSound.play().catch(err => console.warn("音效播放被瀏覽器阻擋:", err));

    if (timerMode === 'focus') {
      sessionsCompleted++;
      this.saveDailyStats();
      if (sessionsCompleted % 4 === 0) {
        timerMode = 'longBreak';
        timeLeft = longBreakMinutes * 60;
        alert('太棒了！完成 4 個專注循環，進入長休息。');
      } else {
        timerMode = 'shortBreak';
        timeLeft = shortBreakMinutes * 60;
        alert('專注時間結束，休息一下！');
      }
    } else {
      timerMode = 'focus';
      timeLeft = focusMinutes * 60;
      alert('休息結束，開始專注。');
    }
    this.renderTimer();
  },

  resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    if (timerMode === 'focus') timeLeft = focusMinutes * 60;
    else if (timerMode === 'shortBreak') timeLeft = shortBreakMinutes * 60;
    else timeLeft = longBreakMinutes * 60;
    this.renderTimer();
  },

  updateTimerUI() {
    const display = document.getElementById('timer-display');
    if (!display) return;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  renderPlanner() {
    const savedPlan = JSON.parse(localStorage.getItem('studyPlan'));
    app.innerHTML = `
      <div class="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-transparent dark:border-slate-700">
        <h2 class="text-2xl font-bold mb-6 dark:text-white">讀書計畫產生器</h2>
        <div class="space-y-4">
          <div>
            <label class="block mb-1 dark:text-slate-300">考試日期</label>
            <input type="date" id="exam-date" class="w-full p-2 border dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded shadow-sm">
          </div>
          <div>
            <label class="block mb-1 dark:text-slate-300">學習目標</label>
            <input type="text" id="goal" class="w-full p-2 border dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded shadow-sm" placeholder="例如：數學前三單元">
          </div>
          <button onclick="router.generatePlan()" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none">產生計畫</button>
        </div>
        <div id="plan-result" class="mt-8"></div>
      </div>
    `;
    if (savedPlan) this.displayPlan(savedPlan);
  },

  generatePlan() {
    const goal = document.getElementById('goal').value;
    const dateVal = document.getElementById('exam-date').value;
    if (!goal || !dateVal) return alert('請完整輸入目標與日期');

    const daysLeft = Math.ceil((new Date(dateVal) - new Date()) / (1000 * 60 * 60 * 24));
    const method = localStorage.getItem('recommendedMethod') || '番茄鐘';
    
    const plan = {
      goal,
      daysLeft,
      method,
      generatedAt: new Date().toLocaleDateString()
    };
    
    localStorage.setItem('studyPlan', JSON.stringify(plan));
    this.displayPlan(plan);
  },

  displayPlan(plan) {
    const result = document.getElementById('plan-result');
    if (!result) return;
    result.innerHTML = `
      <div id="full-plan-export" class="bg-white dark:bg-slate-800 p-4 rounded-3xl">
        <div class="p-6 bg-indigo-50 dark:bg-slate-900/50 border border-indigo-100 dark:border-slate-700 rounded-2xl animate-fade-in">
          <h4 class="font-bold text-indigo-900 dark:text-indigo-300 mb-2">📅 專屬讀書計畫表</h4>
          <p class="text-base text-slate-600 dark:text-slate-400 mb-4">距離目標還有 <b>${plan.daysLeft}</b> 天</p>
          <div class="space-y-4 text-base">
            <div class="flex items-start"><span class="mr-2">🚀</span><span><b>衝刺期：</b>前 ${Math.floor(plan.daysLeft * 0.7)} 天重點攻略「${plan.goal}」。</span></div>
            <div class="flex items-start"><span class="mr-2">🔍</span><span><b>複習期：</b>最後 ${Math.ceil(plan.daysLeft * 0.3)} 天使用「${plan.method}法」進行弱點補強。</span></div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-lg border border-indigo-100 dark:border-slate-700 mt-4 text-sm italic text-slate-500">
              提示：系統已根據你的風格自動套用「${plan.method}法」。
            </div>
          </div>
        </div>

        <div class="mt-8 border-t dark:border-slate-700 pt-6 animate-fade-in">
          <div class="flex justify-between items-center mb-4">
            <h4 class="font-bold text-slate-800 dark:text-slate-200 flex items-center">
              <span class="mr-2">📝</span> 今日任務拆解
            </h4>
            <button onclick="router.clearCompletedTasks()" class="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors">清除已完成</button>
          </div>
          <div id="tasks-container" class="space-y-2"></div>
        </div>
      </div>

      <div class="mt-6 flex flex-col items-center space-y-4">
        <div class="flex mb-4">
          <input type="text" id="new-task-input" 
            class="flex-1 p-3 border dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-l-lg shadow-sm text-base focus:ring-1 focus:ring-indigo-500 outline-none" 
            placeholder="例如：完成課本 P.10 練習題...">
          <button onclick="router.addTask()" 
            class="bg-indigo-600 text-white px-6 py-2 rounded-r-lg text-base font-bold hover:bg-indigo-700 transition-colors">
            新增
          </button>
        </div>
        <button onclick="router.exportPlan()" class="bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-800 px-8 py-3 rounded-xl text-base font-bold flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>匯出計畫圖片</span>
        </button>
      </div>
    `;
    this.renderTasks();
  },

  addTask() {
    const input = document.getElementById('new-task-input');
    const text = input.value.trim();
    if (!text) return;

    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    tasks.push({ id: Date.now(), text, completed: false });
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
    
    input.value = '';
    this.renderTasks();
  },

  toggleTask(id) {
    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem('studyTasks', JSON.stringify(updatedTasks));
    this.renderTasks();
  },

  startEditing(id) {
    editingTaskId = id;
    this.renderTasks();
    setTimeout(() => {
      const input = document.getElementById(`edit-input-${id}`);
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  },

  finishEditing(id, newText) {
    if (editingTaskId !== id) return;
    const text = newText.trim();
    if (text) {
      const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
      const updatedTasks = tasks.map(t => t.id === id ? { ...t, text } : t);
      localStorage.setItem('studyTasks', JSON.stringify(updatedTasks));
    }
    editingTaskId = null;
    this.renderTasks();
  },

  deleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    const updatedTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('studyTasks', JSON.stringify(updatedTasks));
    this.renderTasks();
  },

  clearCompletedTasks() {
    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    const completedCount = tasks.filter(t => t.completed).length;

    if (completedCount > 0 && confirm(`確定要清除這 ${completedCount} 個已完成的任務嗎？`)) {
      const remainingTasks = tasks.filter(t => !t.completed);
      localStorage.setItem('studyTasks', JSON.stringify(remainingTasks));
      this.renderTasks();
    }
  },

  async exportPlan() {
    const element = document.getElementById('full-plan-export');
    if (!element) return;
    
    if (editingTaskId) {
      editingTaskId = null;
      this.renderTasks();
    }

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
        scale: 2,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `我的讀書計畫-${new Date().toLocaleDateString()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('匯出失敗:', err);
      alert('匯出圖片時發生錯誤。');
    }
  },

  handleDragStart(e, index) {
    e.dataTransfer.setData('text/plain', index);
    e.currentTarget.classList.add('opacity-50');
  },

  handleDragOver(e) {
    e.preventDefault(); // 必須呼叫才能觸發 drop
  },

  handleDrop(e, toIndex) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (fromIndex === toIndex) return;

    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    const [movedItem] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, movedItem);

    localStorage.setItem('studyTasks', JSON.stringify(tasks));
    this.renderTasks();
  },

  renderTasks() {
    const container = document.getElementById('tasks-container');
    if (!container) return;
    
    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    container.innerHTML = tasks.length ? tasks.map((t, index) => `
      <div class="flex items-center justify-between p-3 bg-white dark:bg-slate-800/50 border dark:border-slate-700 rounded-xl group transition-all cursor-move"
           draggable="true" 
           ondragstart="router.handleDragStart(event, ${index})"
           ondragover="router.handleDragOver(event)"
           ondrop="router.handleDrop(event, ${index})"
           ondragend="this.classList.remove('opacity-50')">
        <div class="flex items-center space-x-3 flex-1">
          <svg class="w-4 h-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
          <div class="w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer ${t.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600'}"
               onclick="router.toggleTask(${t.id})">
            ${t.completed ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
          </div>
          ${editingTaskId === t.id ? 
            `<input type="text" id="edit-input-${t.id}" class="flex-1 bg-transparent border-b border-indigo-500 outline-none text-base dark:text-white" 
               value="${t.text}" onblur="router.finishEditing(${t.id}, this.value)" 
               onkeyup="if(event.key === 'Enter') router.finishEditing(${t.id}, this.value)">` :
            `<span class="text-base flex-1 cursor-pointer ${t.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}"
               onclick="router.toggleTask(${t.id})"
               ondblclick="event.stopPropagation(); router.startEditing(${t.id})">${t.text}</span>`
          }
        </div>
        <button onclick="router.deleteTask(${t.id})" class="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 px-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    `).join('') : '<p class="text-center text-xs text-slate-400 py-4 italic">目前尚無子任務，請從上方新增。</p>';
  }
};

window.router = router;
router.navigate('home');