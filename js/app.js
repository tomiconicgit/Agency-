(() => {
  const STORAGE_KEY = 'agency-state-final';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // DOM Elements
  const loginScreen = $('#login-screen'), dashboard = $('#dashboard');
  const authenticateBtn = $('#authenticateBtn'), passwordDisplay = $('#passwordDisplay'), progressBar = $('#progressBar'), authMessage = $('#authMessage');
  const paneEls = $$('.pane'), toolBtns = $$('.tool-btn');
  const displayNameEl = $('#displayName'), xpText = $('#xpText'), rankText = $('#rankText');
  const ipDisplay = $('#ipDisplay'), vpnToggle = $('#vpnToggle');
  const notifPanel = $('#notifications'), notifCountEl = $('#notif-count');
  const aliasInput = $('#aliasInput'), resetProgressBtn = $('#resetProgress');
  const soundToggle = $('#soundToggle'), vibToggle = $('#vibToggle');
  const tasksList = $('#tasksList'), mailList = $('#mailList'), contactsList = $('#contactsList'), dbList = $('#dbList');
  const overlay = $('#overlay'), overlayContent = $('#overlayContent'), missionBanner = $('#missionBanner');
  const assetSelect = $('#assetSelect'), deployAssetBtn = $('#deployAssetBtn');
  const useToolBtns = $$('.use-tool');

  // Audio (Expanded)
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = AudioCtx ? new AudioCtx() : null;
  function sfx(freq=880, dur=0.08, vol=0.04, type='sine'){ 
    if(!audioCtx || !soundToggle.checked) return; 
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=vol; o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + dur); 
  }
  function playSuccess(){ sfx(1200,0.08,0.06,'triangle'); sfx(1800,0.06,0.03,'square'); if(vibToggle.checked && 'vibrate' in navigator) navigator.vibrate(100); }
  function playFail(){ sfx(240,0.12,0.06,'sawtooth'); if(vibToggle.checked && 'vibrate' in navigator) navigator.vibrate([50,50,50]); }
  function playAlert(){ sfx(600,0.1,0.05,'square'); sfx(900,0.1,0.05,'square'); }
  function playTyping(){ sfx(440,0.02,0.02,'square'); }
  const audioFiles = {
    click: $('#click-sound'),
    loginSuccess: $('#login-success-sound'),
    loginFail: $('#login-fail-sound'),
    notification: $('#notification-sound'),
    alertCritical: $('#alert-critical-sound'),
    typing: $('#typing-sound'),
    deploySuccess: $('#deploy-success'),
    missionComplete: $('#mission-complete')
  };
  function playAudio(id) {
    if (soundToggle.checked && audioFiles[id]) audioFiles[id].play();
  }

  // Initial State (Enhanced)
  let state = {
    name:'Agent', xp:0, rank:'Recruit', level:1, vpnOn:false, ip:'192.0.2.1', notifications:[], tasks:[], mail:[], contacts:[], db:[], influence:50, toolCooldowns:{recon:0,decrypt:0,cyberattack:0,social:0,phonehack:0}, soundsOn: true, vibOn: false
  };

  // Utils
  const now = ()=>Date.now();
  const randInt = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const cap = s=> s.charAt(0).toUpperCase()+s.slice(1);

  // Fake Data (Expanded and structured for new elements)
  const fakeNames = ['A. Mercer','R. Hale','J. Park','L. Dorsey','K. Ivanov','M. Chen','S. Okoro','T. Ramirez','H. Singh','V. Putin','K. Jong-un','X. Jinping'];
  const fakePlaces = [
    {name:'Seoul',lat:37.5665,lon:126.9780, country:'South Korea'},
    {name:'Kyiv',lat:50.45,lon:30.5234, country:'Ukraine'},
    {name:'London',lat:51.5074,lon:-0.1278, country:'UK'},
    {name:'New York',lat:40.7128,lon:-74.006, country:'USA'},
    {name:'Tokyo',lat:35.6895,lon:139.6917, country:'Japan'},
    {name:'Riyadh',lat:24.7136,lon:46.6753, country:'Saudi Arabia'},
    {name:'Beijing',lat:39.9042,lon:116.4074, country:'China'},
    {name:'Moscow',lat:55.7558,lon:37.6176, country:'Russia'},
    {name:'San Francisco',lat:37.7749,lon:-122.4194, country:'USA'},
    {name:'Pyongyang',lat:39.0392,lon:125.7625, country:'North Korea'},
    {name:'Washington DC',lat:38.9072,lon:-77.0369, country:'USA'},
    {name:'Paris',lat:48.8566,lon:2.3522, country:'France'},
    {name:'Berlin',lat:52.52,lon:13.405, country:'Germany'},
    {name:'Rio de Janeiro',lat:-22.9068,lon:-43.1729, country:'Brazil'},
    {name:'Lagos',lat:6.5244,lon:3.3792, country:'Nigeria'},
    {name:'Sydney',lat:-33.8688,lon:151.2093, country:'Australia'}
  ];

  function genTasks(n=100){
    const tasks = [];
    const chains = [
      'Russia Invasion Chain', 'North Korea Missile Chain', 'China Espionage Chain',
      'Cybercrime Syndicate Chain', 'Global Financial Crisis Chain', 'Rogue AI Threat Chain'
    ];
    for(let i=0;i<n;i++){
      const p = fakePlaces[randInt(0,fakePlaces.length-1)];
      const sev = ['low','medium','high','critical'][randInt(0,3)];
      const difficulty = sev==='low'?20:sev==='medium'?45:sev==='high'?70:92;
      const chainId = i < 50 ? chains[randInt(0,chains.length-1)] : null;
      const step = chainId ? randInt(1,3) : 1;
      tasks.push({
        id:`T-${now()}-${i}`,
        title:`${cap(sev)}: Incident in ${p.name}`,
        description:`Simulated global event in ${p.name}. Deploy assets and tools to resolve.${chainId ? ` (Chain: ${chainId}, Step ${step}/3)` : ''}`,
        place:p, severity:sev, difficulty, rewardXP: Math.floor(difficulty/2 + randInt(10,50)),
        accepted:false, completed:false, deadline: now() + randInt(10*60*1000, 120*60*1000),
        chainId, step, nextTaskId: chainId && step < 3 ? `T-${now()}-${i+1}` : null,
        toolsNeeded: ['recon','decrypt','cyberattack','social','phonehack'][randInt(0,4)]
      });
    }
    // Final boss chain
    tasks.push({
      id: 'T-FINAL',
      title: 'CRITICAL: Capture Global Terror Suspect',
      description: 'The final mission to track a global terror suspect. This requires a multi-step approach and all available tools.',
      place: fakePlaces[randInt(0,fakePlaces.length-1)], severity: 'critical', difficulty: 150, rewardXP: 1000,
      accepted:false, completed:false, deadline: now() + 14400*1000, // 4 hours sim
      chainId: 'Final Global Threat Chain', step: 1, nextTaskId: 'T-FINAL-2'
    });
    return tasks;
  }

  // Persistence
  function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function loadState(){ try{ const s = localStorage.getItem(STORAGE_KEY); if(s) state = Object.assign(state, JSON.parse(s)); }catch(e){console.warn(e);} soundToggle.checked = state.soundsOn; vibToggle.checked = state.vibOn; }
  
  // Bootstrap
  function bootstrap(){
    loadState();
    if(!state.tasks || state.tasks.length < 100) state.tasks = genTasks(100);
    // ... (generate other data here if needed)
    saveState();
  }

  // UI Render
  function renderAll(){
    displayNameEl.textContent = state.name;
    // ... (render other UI elements from state)
    renderTasks();
  }

  function renderTasks() {
    tasksList.innerHTML = '';
    const activeTask = state.tasks.find(t => t.accepted && !t.completed);
    state.tasks.filter(t => !t.completed).forEach(t => {
      const el = document.createElement('div');
      el.classList.add('item');
      if(activeTask && activeTask.id === t.id) el.classList.add('active');
      el.innerHTML = `
        <h4>${t.title}</h4>
        <p>${t.description}</p>
        <p class="small">Severity: ${t.severity.toUpperCase()} | Reward: ${t.rewardXP} XP</p>
      `;
      el.addEventListener('click', () => {
        state.tasks.forEach(task => task.accepted = false);
        t.accepted = true;
        saveState();
        renderTasks();
      });
      tasksList.appendChild(el);
    });
  }

  // Login Simulation
  authenticateBtn.addEventListener('click', () => {
    loginSequence();
  });

  function loginSequence() {
    authenticateBtn.disabled = true;
    authenticateBtn.textContent = 'AUTHENTICATING...';
    
    const correctPassword = 'AGENCY';
    let typedPassword = '';
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex < correctPassword.length) {
        playAudio('typing');
        typedPassword += '*';
        passwordDisplay.textContent = typedPassword;
        passwordDisplay.classList.add('active');
        authMessage.textContent = 'VERIFYING CREDENTIALS...';
        charIndex++;
      } else {
        clearInterval(typingInterval);
        progressBar.style.width = '100%';
        
        setTimeout(() => {
          playAudio('loginSuccess');
          loginScreen.classList.add('hidden');
          dashboard.classList.remove('hidden');
          document.body.classList.remove('locked');
          startDashboard();
        }, 1500);
      }
    }, 250);
  }

  // Dashboard Logic
  let mapInstance;
  function startDashboard() {
    renderAll();
    
    // Initialize the Leaflet map
    mapInstance = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CartoDB',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstance);
    refreshMapMarkers();

    // Toggle panes
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playAudio('click');
        const tool = btn.dataset.tool;
        paneEls.forEach(pane => { pane.classList.add('hidden'); });
        $(`#pane-${tool}`).classList.remove('hidden');
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Tool usage
    useToolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        const activeTask = state.tasks.find(t => t.accepted);
        if (!activeTask) {
          pushNotification("Select a mission to use this tool.");
          return;
        }
        
        if (state.toolCooldowns[tool] > now()) {
          pushNotification(`Cooldown for ${tool} is active.`);
          return;
        }

        switch(tool) {
          case 'recon':
            // Logic for Recon Scan
            pushNotification(`Recon scan on ${activeTask.place.name} complete. New intel acquired.`);
            state.toolCooldowns.recon = now() + 10000;
            break;
          case 'cyberattack':
            launchCyberattackMinigame(activeTask);
            break;
          case 'phonehack':
            launchPhoneHackSimulation(activeTask);
            break;
          case 'social':
            if (activeTask.severity === 'low') {
              pushNotification('Social Engineering successful. Mission complete.');
              completeTask(activeTask);
              state.toolCooldowns.social = now() + 20000;
            } else {
              pushNotification('Social Engineering failed. Target too secure.');
              playAudio('loginFail');
            }
            break;
        }
        saveState();
        renderAll();
      });
    });
  }

  function pushNotification(message) {
    const el = document.createElement('div');
    el.classList.add('notification-item');
    el.textContent = message;
    notifPanel.prepend(el);
    setTimeout(() => el.remove(), 5000);
    playAudio('notification');
  }

  function completeTask(task) {
    task.completed = true;
    state.xp += task.rewardXP;
    pushNotification(`Mission "${task.title}" complete. +${task.rewardXP} XP.`);
    playAudio('missionComplete');
    saveState();
    renderTasks();
  }

  function refreshMapMarkers() {
    // Clear existing markers (if any)
    mapInstance.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });
    // Add markers for all active tasks
    state.tasks.filter(t => !t.completed).forEach(t => {
      const marker = L.marker([t.place.lat, t.place.lon]).addTo(mapInstance);
      marker.bindPopup(`<b>${t.title}</b><br>${t.place.country}`);
    });
  }

  // --- New Minigames and Simulations ---

  function launchCyberattackMinigame(task) {
    showOverlay('Cyberattack in progress...', () => {
      const minigame = document.createElement('div');
      minigame.classList.add('cyber-minigame');
      
      const nodes = Array.from({length: 100}, (_, i) => {
        const node = document.createElement('div');
        node.classList.add('cyber-node');
        minigame.appendChild(node);
        return node;
      });

      const targetCount = task.severity === 'low' ? 5 : 10;
      const targets = [];
      while(targets.length < targetCount) {
        const randomIndex = randInt(0, 99);
        if (!targets.includes(nodes[randomIndex])) {
          nodes[randomIndex].classList.add('target');
          targets.push(nodes[randomIndex]);
        }
      }

      let clicks = 0;
      minigame.addEventListener('click', e => {
        if (e.target.classList.contains('target')) {
          e.target.classList.remove('target');
          e.target.classList.add('active');
          clicks++;
          if (clicks === targetCount) {
            pushNotification('Cyberattack successful. Mission complete.');
            completeTask(task);
            hideOverlay();
          }
        } else if (e.target.classList.contains('cyber-node')) {
          pushNotification('Incorrect node. Intrusion detected.');
          playAudio('loginFail');
          setTimeout(hideOverlay, 1500);
        }
      });
      overlayContent.appendChild(minigame);
    });
  }

  function launchPhoneHackSimulation(task) {
    showOverlay('Hacking phone...', () => {
      const phoneScreen = document.createElement('div');
      phoneScreen.classList.add('phone-screen');
      phoneScreen.innerHTML = `
        <h4>PHONE HACK SUCCESS</h4>
        <div class="phone-content">
          <div class="phone-message"><b>From: Unknown</b><br>Target's next location is: ${task.place.name}. Hurry!</div>
          <div class="phone-message"><b>From: Mom</b><br>Dinner tonight?</div>
          <div class="phone-message"><b>From: Work</b><br>Project status update due EOD.</div>
        </div>
        <button onclick="hideOverlay(); pushNotification('Phone hack complete. Intel acquired.'); playAudio('deploySuccess');">Exit</button>
      `;
      overlayContent.appendChild(phoneScreen);
    });
  }

  function showOverlay(title, contentFunction) {
    overlay.classList.remove('hidden');
    overlayContent.innerHTML = `<h3 style="color:var(--accent-blue);">${title}</h3>`;
    contentFunction();
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
    overlayContent.innerHTML = '';
  }

  // Initialize
  bootstrap();
  renderAll();
})();
