// ===== NAV =====
const navbar=document.getElementById('navbar');
const navToggle=document.getElementById('nav-toggle');
const navLinks=document.getElementById('nav-links');
window.addEventListener('scroll',()=>{navbar.classList.toggle('scrolled',window.scrollY>50)});
navToggle.addEventListener('click',()=>{navLinks.classList.toggle('open')});
document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{
  document.querySelectorAll('.nav-link').forEach(n=>n.classList.remove('active'));
  l.classList.add('active');navLinks.classList.remove('open');
}));

// ===== ROADMAP =====
function renderRoadmap(){
  const c=document.getElementById('roadmap-timeline');
  const saved=JSON.parse(localStorage.getItem('roadmap_progress')||'[]');
  c.innerHTML=ROADMAP_DATA.map((r,i)=>{
    const done=saved.includes(i);
    return `<div class="roadmap-item ${done?'completed':''}">
      <div class="roadmap-card ${done?'completed':''}" onclick="toggleWeek(${i})">
        <span class="roadmap-week">${r.week}</span>
        <h3>${r.title}</h3><p>${r.desc}</p>
        <div class="roadmap-topics">${r.topics.map(t=>`<span>${t}</span>`).join('')}</div>
        <button class="btn btn-sm ${done?'btn-success':'btn-outline'}" style="margin-top:14px" onclick="event.stopPropagation();markWeek(${i})">${done?'✓ Đã hoàn thành':'Đánh dấu hoàn thành'}</button>
      </div>
      <div class="roadmap-dot"></div>
    </div>`;
  }).join('');
  updateProgress();
}
function markWeek(i){
  let s=JSON.parse(localStorage.getItem('roadmap_progress')||'[]');
  if(s.includes(i))s=s.filter(x=>x!==i);else s.push(i);
  localStorage.setItem('roadmap_progress',JSON.stringify(s));
  renderRoadmap();
}
function toggleWeek(i){}

// ===== STUDY =====
function renderStudy(tab='round1'){
  const c=document.getElementById('study-content');
  const data=STUDY_DATA[tab]||[];
  c.innerHTML=`<div class="study-grid">${data.map((s,i)=>`
    <div class="study-card">
      <div class="study-card-header">
        <div class="study-icon" style="background:${s.color}22;color:${s.color}">${s.icon}</div>
        <div><h3>${s.title}</h3></div>
      </div>
      <div class="study-card-body"><ul>${s.items.map(it=>`<li>${it}</li>`).join('')}</ul></div>
    </div>`).join('')}</div>`;
}
document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');renderStudy(b.dataset.tab);
}));

// ===== QUIZ =====
let currentQuiz=null,currentQ=0,score=0,answers=[],timerInterval=null,timeLeft=0;

function renderQuizCategories(){
  const c=document.getElementById('quiz-categories');
  const history=JSON.parse(localStorage.getItem('quiz_history')||'{}');
  c.innerHTML=QUIZ_DATA.map(cat=>{
    const h=history[cat.id];
    const info=h?`Điểm gần nhất: ${h.score}/${h.total}`:`${cat.questions.length} câu hỏi`;
    return `<div class="quiz-cat-card" onclick="startQuiz('${cat.id}')">
      <div class="quiz-cat-icon">${cat.icon}</div>
      <h3>${cat.name}</h3><p>${info}</p>
      <div class="quiz-cat-info"><span>📝 ${cat.questions.length} câu</span><span>⏱ ${cat.questions.length*2} phút</span></div>
    </div>`;
  }).join('');
}
function startQuiz(id){
  const cat=QUIZ_DATA.find(c=>c.id===id);if(!cat)return;
  currentQuiz=cat;currentQ=0;score=0;answers=[];
  timeLeft=cat.questions.length*120;
  document.getElementById('quiz-categories').style.display='none';
  document.getElementById('quiz-result').style.display='none';
  document.getElementById('quiz-area').style.display='block';
  startTimer();renderQuestion();
}
function renderQuestion(){
  const q=currentQuiz.questions[currentQ];
  const total=currentQuiz.questions.length;
  const pct=((currentQ)/total*100).toFixed(0);
  document.getElementById('quiz-header').innerHTML=`
    <h3>${currentQuiz.name}</h3>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
    <span class="quiz-timer" id="quiz-timer">${formatTime(timeLeft)}</span>`;
  document.getElementById('quiz-body').innerHTML=`
    <div class="quiz-question"><span class="q-num">Câu ${currentQ+1}/${total}:</span> ${q.q}</div>
    <div class="quiz-options">${q.opts.map((o,i)=>`
      <div class="quiz-option" onclick="selectAnswer(${i})" id="opt-${i}">
        <span class="option-letter">${String.fromCharCode(65+i)}</span><span>${o}</span>
      </div>`).join('')}</div>
    <div class="quiz-explain" id="quiz-explain"><strong>Giải thích:</strong> ${q.explain}</div>`;
  document.getElementById('quiz-footer').innerHTML=`
    <span>Câu ${currentQ+1} / ${total}</span>
    <div><button class="btn btn-sm btn-outline" onclick="backToCategories()">Thoát</button>
    <button class="btn btn-sm btn-primary" id="btn-next" onclick="nextQuestion()" style="display:none;margin-left:8px">Câu tiếp →</button></div>`;
}
function selectAnswer(i){
  if(answers[currentQ]!==undefined)return;
  answers[currentQ]=i;
  const q=currentQuiz.questions[currentQ];
  document.getElementById(`opt-${i}`).classList.add(i===q.ans?'correct':'wrong');
  if(i===q.ans)score++;else document.getElementById(`opt-${q.ans}`).classList.add('correct');
  document.getElementById('quiz-explain').classList.add('show');
  document.getElementById('btn-next').style.display='inline-flex';
}
function nextQuestion(){
  if(currentQ<currentQuiz.questions.length-1){currentQ++;renderQuestion();}
  else finishQuiz();
}
function finishQuiz(){
  clearInterval(timerInterval);
  const total=currentQuiz.questions.length;
  const pct=Math.round(score/total*100);
  const pass=pct>=50;
  let h=JSON.parse(localStorage.getItem('quiz_history')||'{}');
  h[currentQuiz.id]={score,total,pct,date:new Date().toLocaleDateString('vi-VN')};
  localStorage.setItem('quiz_history',JSON.stringify(h));
  document.getElementById('quiz-area').style.display='none';
  document.getElementById('quiz-result').style.display='block';
  document.getElementById('quiz-result').innerHTML=`
    <h2>${pass?'🎉 Chúc mừng!':'😥 Cần cố gắng thêm!'}</h2>
    <div class="result-score">${pct}%</div>
    <div class="result-details">
      <div class="result-detail"><div class="num" style="color:var(--success)">${score}</div><div class="label">Đúng</div></div>
      <div class="result-detail"><div class="num" style="color:var(--danger)">${total-score}</div><div class="label">Sai</div></div>
      <div class="result-detail"><div class="num">${total}</div><div class="label">Tổng câu</div></div>
    </div>
    <p>${pass?'Bạn đã đạt yêu cầu (≥50%). Tiếp tục ôn tập để cải thiện!':'Bạn chưa đạt yêu cầu (< 50%). Hãy ôn lại kiến thức và thử lại!'}</p>
    <div class="result-actions">
      <button class="btn btn-sm btn-primary" onclick="startQuiz('${currentQuiz.id}')">Làm lại</button>
      <button class="btn btn-sm btn-outline" onclick="backToCategories()">Chọn đề khác</button>
    </div>`;
  updateProgress();
}
function backToCategories(){
  clearInterval(timerInterval);
  document.getElementById('quiz-area').style.display='none';
  document.getElementById('quiz-result').style.display='none';
  document.getElementById('quiz-categories').style.display='grid';
  renderQuizCategories();
}
function startTimer(){
  clearInterval(timerInterval);
  timerInterval=setInterval(()=>{
    timeLeft--;if(timeLeft<=0){finishQuiz();return;}
    const el=document.getElementById('quiz-timer');if(el)el.textContent=formatTime(timeLeft);
  },1000);
}
function formatTime(s){return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;}

// ===== LAWS =====
function renderLaws(){
  document.getElementById('laws-grid').innerHTML=LAWS_DATA.map(l=>`
    <div class="law-card">
      <div class="law-card-header">
        <div class="law-icon" style="background:${l.color}22;color:${l.color}">${l.icon}</div>
        <div><h3>${l.title}</h3><span class="law-num">${l.num}</span></div>
      </div>
      <p>${l.desc}</p>
      <span class="law-status ${l.status}">${l.status==='active'?'✓ Còn hiệu lực':'⚡ Đã sửa đổi'}</span>
      <a href="${l.link}" target="_blank" rel="noopener" class="law-link">Xem văn bản gốc →</a>
    </div>`).join('');
}

// ===== PROGRESS =====
function updateProgress(){
  const saved=JSON.parse(localStorage.getItem('roadmap_progress')||'[]');
  const history=JSON.parse(localStorage.getItem('quiz_history')||'{}');
  const weekPct=Math.round(saved.length/ROADMAP_DATA.length*100);
  const quizDone=Object.keys(history).length;
  const quizPct=Math.round(quizDone/QUIZ_DATA.length*100);
  let avgScore=0;
  if(quizDone>0){const vals=Object.values(history);avgScore=Math.round(vals.reduce((a,v)=>a+v.pct,0)/vals.length);}
  const overall=Math.round((weekPct+quizPct+avgScore)/3);
  setRing('prog-overall',overall);setRing('prog-quiz',quizPct);setRing('prog-score',avgScore);
}
function setRing(id,pct){
  const el=document.getElementById(id);if(!el)return;
  const circle=el.querySelector('.ring-fill');
  const text=el.querySelector('.ring-text');
  const circumference=2*Math.PI*54;
  if(circle)circle.style.strokeDashoffset=circumference-(pct/100)*circumference;
  if(text)text.textContent=pct+'%';
}

// ===== SVG GRADIENT =====
function addSVGGradient(){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.style.position='absolute';svg.style.width='0';svg.style.height='0';
  svg.innerHTML=`<defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" style="stop-color:#3b82f6"/><stop offset="50%" style="stop-color:#8b5cf6"/>
    <stop offset="100%" style="stop-color:#06b6d4"/></linearGradient></defs>`;
  document.body.prepend(svg);
}

// ===== INIT =====
addSVGGradient();renderRoadmap();renderStudy('round1');renderQuizCategories();renderLaws();updateProgress();

// Smooth scroll for nav
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const t=document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
}));

// Intersection Observer for active nav
const sections=document.querySelectorAll('section[id]');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
    const link=document.querySelector(`.nav-link[data-section="${e.target.id}"]`);
    if(link)link.classList.add('active');
  }});
},{threshold:0.3});
sections.forEach(s=>observer.observe(s));
