// Game logic: cinematic, UI hooks, words flow, timer, summary, uncover animation
(function(){
  const { shuffle, escapeHtml } = window.GAME_UTILS;
  const { WORDS_BY_LEVEL, TIME_PER_LEVEL } = window.GAME_WORDS;
  const G = window.GAME3D;

  const intro = document.getElementById('intro');
  const levelLabel = document.getElementById('levelLabel');
  const wordEl = document.getElementById('word');
  const timerEl = document.getElementById('timer');
  const answerInput = document.getElementById('answer');
  const startBtn = document.getElementById('startBtn');
  const skipCinematicBtn = document.getElementById('skipCinematic');
  const summaryPanel = document.getElementById('summaryPanel');
  const correctList = document.getElementById('correctList');
  const wrongList = document.getElementById('wrongList');
  const restartBtn = document.getElementById('restartBtn');
  const nameTag = document.getElementById('nameTag');

  let chosenLevel = null;
  let wordsPool = [];
  let timePerWord = 5;
  let currentWordIndex = -1;
  let currentTimer = 0;
  let gameActive = false;
  let correctWords = [];
  let wrongWords = [];
  let cinematicPlaying = false;

  // level buttons
  document.querySelectorAll('#intro .btn[data-level]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const lvl = btn.getAttribute('data-level');
      startCinematicFor(lvl);
    });
  });

  skipCinematicBtn.addEventListener('click', ()=>{
    if (cinematicPlaying) endCinematicImmediately();
    else intro.style.display = 'none';
  });

  startBtn.addEventListener('click', ()=> {
    if (!chosenLevel) { alert('اختار مستوى أولا.'); return; }
    startGame();
  });

  restartBtn.addEventListener('click', ()=> location.reload());

  answerInput.addEventListener('keydown', (e)=>{
    if (!gameActive) return;
    if (e.key === 'Enter') {
      const user = answerInput.value.trim().toLowerCase();
      if (user.length === 0) return;
      checkAnswer(user);
    }
  });

  function startCinematicFor(level) {
    chosenLevel = level;
    levelLabel.textContent = level;
    wordsPool = shuffle(WORDS_BY_LEVEL[level].slice());
    timePerWord = TIME_PER_LEVEL[level] || 4.5;
    cinematicPlaying = true;
    intro.style.display = 'none';

    // camera start positions
    const camFrom = new THREE.Vector3(0,1.6,5.5);
    const camMid = new THREE.Vector3(0,1.5,2.2);
    const camTo = new THREE.Vector3(0,1.4,1.2);
    const dur1 = 2200, dur2 = 3200, dur3 = 2000;
    const t0 = performance.now();

    // sequence using chained timeouts/animations
    // move to mid
    animateCamera(camFrom, camMid, dur1, ()=> {
      document.getElementById('introText').textContent = `الشخص المقنّع: "هتلعب على مستوى ${level} — جهّز نفسك"`;
      // wait then move to table
      setTimeout(()=> {
        animateCamera(camMid, camTo, dur3, ()=>{
          nameTag.style.display = 'block';
          if (G && G.updateNameTagPosition) G.updateNameTagPosition();
          cinematicPlaying = false;
          startBtn.disabled = false;
          answerInput.disabled = false;
          answerInput.focus();
        });
      }, dur2);
    });
  }

  function animateCamera(from, to, duration, onEnd){
    const start = performance.now();
    (function step(now){
      const t = Math.min(1, (now-start)/duration);
      const tt = 1 - Math.pow(1-t, 3);
      G.camera.position.lerpVectors(from, to, tt);
      G.camera.lookAt(0, -0.2, -0.7);
      if (G && G.renderer) G.renderer.render(G.scene, G.camera);
      if (t < 1) requestAnimationFrame(step);
      else if (onEnd) onEnd();
    })();
  }

  function endCinematicImmediately(){
    cinematicPlaying = false;
    intro.style.display = 'none';
    G.camera.position.set(0,1.4,1.2);
    G.camera.lookAt(0,-0.2,-0.7);
    nameTag.style.display = 'block';
    if (G.updateNameTagPosition) G.updateNameTagPosition();
    answerInput.disabled = false;
    answerInput.focus();
    levelLabel.textContent = chosenLevel || '—';
    startBtn.disabled = false;
  }

  function startGame(){
    correctWords = []; wrongWords = []; currentWordIndex = -1;
    gameActive = true;
    summaryPanel.style.display = 'none';
    answerInput.disabled = false; answerInput.focus();
    nextWord();
  }

  function nextWord(){
    currentWordIndex++;
    if (currentWordIndex >= wordsPool.length) return endGame();
    const w = wordsPool[currentWordIndex];
    wordEl.textContent = w.ar;
    currentTimer = timePerWord;
    timerEl.textContent = currentTimer.toFixed(1);
    answerInput.value = '';
    answerInput.focus();
  }

  function checkAnswer(user){
    const w = wordsPool[currentWordIndex];
    if (!w) return;
    if (user.toLowerCase() === w.en.toLowerCase()) correctWords.push(`${w.ar} = ${w.en}`);
    else wrongWords.push({ ar:w.ar, en:w.en, you:user });
    nextWord();
  }

  function endGame(){
    gameActive = false;
    answerInput.disabled = true;
    correctList.innerHTML = "<strong>الكلمات الصحيحة:</strong><br>";
    correctWords.forEach(c => { correctList.innerHTML += c + "<br>"; });
    wrongList.innerHTML = "";
    if (wrongWords.length === 0 && correctWords.length === 0) {
      correctList.innerHTML += "<em>لم تُجب على أي كلمة</em><br>";
    }
    wrongWords.forEach(w => {
      wrongList.innerHTML += `<div class="wrong">${w.ar} = ${w.en} (أنت كتبت: ${escapeHtml(w.you)})</div>`;
    });
    summaryPanel.style.display = 'block';
    playUncoverAnimation();
  }

  function playUncoverAnimation(){
    // if mask exists, animate it upward and reveal eyes
    if (!G || !G.mask) return;
    G.eyeL.visible = true; G.eyeR.visible = true;
    const duration = 2400;
    const start = performance.now();
    const startY = G.mask.position.y;
    (function anim(now){
      const t = Math.min(1,(now-start)/duration);
      const tt = 1 - Math.pow(1-t,3);
      G.mask.position.y = startY + tt*0.45;
      if (G.head) G.head.rotation.x = (1-tt)*0.6;
      if (G.renderer) G.renderer.render(G.scene, G.camera);
      if (t<1) requestAnimationFrame(anim);
      else {
        // slight camera zoom after
        animateCamera(G.camera.position.clone(), new THREE.Vector3(0,1.3,0.9), 1200);
      }
    })();
  }

  // main loop: decrement timer
  (function loop(){
    requestAnimationFrame(loop);
    if (gameActive){
      const now = performance.now();
      // simple decrement using setInterval-like timing:
      if (typeof loop.last === 'undefined') loop.last = now;
      const dt = (now - loop.last)/1000;
      loop.last = now;
      currentTimer -= dt;
      if (currentTimer <= 0){
        const w = wordsPool[currentWordIndex];
        wrongWords.push({ ar:w.ar, en:w.en, you:"(انتهى الوقت)" });
        nextWord();
      }
      timerEl.textContent = Math.max(0, currentTimer).toFixed(1);
    } else {
      loop.last = performance.now();
    }
  })();

  // Accessibility: press Space to auto-select A1 from intro
  document.addEventListener('keydown', (e)=> {
    if (intro.style.display !== 'none' && e.code === 'Space') {
      document.querySelector('#intro .btn[data-level="A1"]').click();
    }
  });

})();
