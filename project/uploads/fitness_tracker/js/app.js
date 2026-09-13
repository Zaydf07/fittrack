// =============================================================================
// FITTRACK PRO — Fitness Tracker PWA
// =============================================================================
// A single-page progressive web app for tracking speed training workouts,
// logging weights, and monitoring progress over time.
// =============================================================================

// ---------------------------------------------------------------------------
// 1. WORKOUT DATA — Day 1 & Day 2 Speed Programs
// ---------------------------------------------------------------------------
const WORKOUT_DATA = [
  {
    id: 'day1',
    day: 1,
    title: 'Speed',
    icon: '⚡',
    sections: [
      {
        title: 'Sled Work',
        icon: '🛷',
        exercises: [
          { id: 'd1e1', name: 'Single Switch on Sled', sets: null, reps: '10', distance: null, weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'single+leg+switch+sled+push+sprint+drill' },
          { id: 'd1e2', name: 'Double Switch on Sled', sets: null, reps: '6ES', distance: null, weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'double+switch+sled+push+drill' },
          { id: 'd1e3', name: 'Triple Switch on Sled', sets: null, reps: '6ES', distance: null, weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'triple+switch+sled+push+drill' },
          { id: 'd1e4', name: 'Knee Drive March on Sled', sets: '4', reps: null, distance: '10m', weight: '50-70', defaultWeight: 60, isWeighted: true, youtubeQuery: 'knee+drive+march+sled+push' }
        ]
      },
      {
        title: 'OH Plate Hold Series',
        icon: '🏋️',
        exercises: [
          { id: 'd1e5', name: 'A March with OH Plate Hold', sets: '2', reps: null, distance: '10m', weight: null, defaultWeight: null, isWeighted: true, youtubeQuery: 'A+march+overhead+plate+hold+sprint+drill' },
          { id: 'd1e6', name: 'A Switch with OH Plate Hold', sets: '2', reps: null, distance: '10m', weight: null, defaultWeight: null, isWeighted: true, youtubeQuery: 'A+skip+switch+overhead+plate+hold' },
          { id: 'd1e7', name: 'A Switch with Double Skip OH Plate Hold', sets: '2', reps: null, distance: '10m', weight: null, defaultWeight: null, isWeighted: true, youtubeQuery: 'double+skip+overhead+plate+hold+drill' },
          { id: 'd1e8', name: 'Straight Leg Runs with OH Plate Hold', sets: '2', reps: null, distance: '10m', weight: null, defaultWeight: null, isWeighted: true, youtubeQuery: 'straight+leg+run+overhead+plate+hold' }
        ]
      },
      {
        title: 'Jumps',
        icon: '🦘',
        exercises: [
          { id: 'd1e9', name: 'Broad Jumps', sets: '3', reps: '3', distance: null, weight: 'BW', defaultWeight: null, isWeighted: false, youtubeQuery: 'broad+jump+technique+standing' },
          { id: 'd1e10', name: 'Single Leg Step Up Jumps (Alternating)', sets: '3', reps: '10ES', distance: null, weight: 'BW', defaultWeight: null, isWeighted: false, youtubeQuery: 'single+leg+step+up+jump+alternating+plyometric' }
        ]
      }
    ]
  },
  {
    id: 'day2',
    day: 2,
    title: 'Speed',
    icon: '🏃',
    sections: [
      {
        title: 'Stretch',
        icon: '🧘',
        exercises: [
          { id: 'd2e0', name: 'Dynamic Stretching Routine', sets: '1', reps: null, distance: null, weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'dynamic+stretching+routine+before+sprinting' }
        ]
      },
      {
        title: 'Drills',
        icon: '🔄',
        exercises: [
          { id: 'd2e1', name: 'High Knees', sets: '2', reps: null, distance: '20m', weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'high+knees+sprint+drill+technique' },
          { id: 'd2e2', name: 'Butt Kicks', sets: '2', reps: null, distance: '20m', weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'butt+kicks+sprint+drill+technique' },
          { id: 'd2e3', name: 'A Skip', sets: '3', reps: null, distance: '20m', weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'A+skip+drill+sprinting+technique' },
          { id: 'd2e4', name: 'B Skip', sets: '3', reps: null, distance: '20m', weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'B+skip+drill+sprinting+technique' },
          { id: 'd2e5', name: 'Power Skip', sets: '3', reps: null, distance: '20m', weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'power+skip+drill+sprint+training' }
        ]
      },
      {
        title: 'Sprints (Band Resisted)',
        icon: '🔗',
        exercises: [
          { id: 'd2e6', name: 'Band Resisted Sprint 5m', sets: '3', reps: '3', distance: '5m', weight: null, defaultWeight: null, isWeighted: false, rest: '2-3 min', youtubeQuery: 'band+resisted+sprint+training' },
          { id: 'd2e7', name: 'Band Resisted Sprint 10m', sets: '3', reps: '2', distance: '10m', weight: null, defaultWeight: null, isWeighted: false, rest: '2-3 min', youtubeQuery: 'band+resisted+sprint+10m+acceleration' }
        ]
      },
      {
        title: 'Sprints (Straight Line)',
        icon: '💨',
        exercises: [
          { id: 'd2e8', name: 'Sprint 15m Max Effort', sets: null, reps: '3', distance: '15m', weight: null, defaultWeight: null, isWeighted: false, rest: '2 min per rep', youtubeQuery: '15m+sprint+max+effort+acceleration' },
          { id: 'd2e9', name: 'Sprint 25m Max Effort', sets: null, reps: '2', distance: '25m', weight: null, defaultWeight: null, isWeighted: false, rest: '2-3 min per rep', youtubeQuery: '25m+sprint+max+effort+technique' }
        ]
      },
      {
        title: 'Conditioning',
        icon: '🔥',
        exercises: [
          { id: 'd2e10', name: 'Air Bike — 250 cals @ 16-18 km/h', sets: '1', reps: null, distance: null, weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'air+bike+conditioning+workout+calories' },
          { id: 'd2e11', name: 'Air Bike — 40s @ 12-14 km/h / 20s @ 20-24 km/h', sets: null, reps: '8-10 repeats', distance: null, weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'air+bike+interval+training+conditioning' },
          { id: 'd2e12', name: 'Battle Rope — 30s Hard / 30s Rest', sets: null, reps: '8-10 repeats', distance: null, weight: null, defaultWeight: null, isWeighted: false, youtubeQuery: 'battle+rope+interval+conditioning+workout' }
        ]
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// 2. STORAGE SERVICE — LocalStorage persistence
// ---------------------------------------------------------------------------
class StorageService {
  static KEY = 'fittrack_weight_entries';

  static getEntries() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('StorageService: read error', e);
      return [];
    }
  }

  static _save(entries) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('StorageService: write error', e);
    }
  }

  static saveWeight(exerciseId, weight) {
    const entries = this.getEntries();
    entries.push({
      id: Date.now().toString(),
      exerciseId,
      weight: Number(weight),
      date: new Date().toISOString()
    });
    this._save(entries);
  }

  static getLatestWeight(exerciseId) {
    const history = this.getWeightHistory(exerciseId);
    return history.length > 0 ? history[0] : null;
  }

  static getWeightHistory(exerciseId) {
    return this.getEntries()
      .filter(e => e.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  static getAllLatestWeights() {
    const map = new Map();
    // Sort oldest-first so newest overwrites
    this.getEntries()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(e => map.set(e.exerciseId, e));
    return map;
  }

  static deleteEntry(entryId) {
    this._save(this.getEntries().filter(e => e.id !== entryId));
  }

  static clearHistory(exerciseId) {
    this._save(this.getEntries().filter(e => e.exerciseId !== exerciseId));
  }
}

// ---------------------------------------------------------------------------
// 3. HELPERS
// ---------------------------------------------------------------------------
const appContainer = document.getElementById('app');

function getExerciseById(id) {
  for (const day of WORKOUT_DATA) {
    for (const section of day.sections) {
      for (const ex of section.exercises) {
        if (ex.id === id) return { ...ex, dayId: day.id };
      }
    }
  }
  return null;
}

function getDayById(id) {
  return WORKOUT_DATA.find(d => d.id === id);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function formatPrescription(ex) {
  const parts = [];
  if (ex.sets) parts.push(ex.sets);
  if (ex.reps) parts.push((parts.length ? '× ' : '') + ex.reps);
  if (ex.distance) parts.push((parts.length ? '× ' : '') + ex.distance);
  if (ex.weight) parts.push('@ ' + ex.weight + (ex.weight === 'BW' ? '' : ' kgs'));
  return parts.join(' ');
}

function openYouTube(query, e) {
  if (e) e.stopPropagation();
  window.open('https://www.youtube.com/results?search_query=' + query, '_blank');
}

// SVG icons as functions for reuse
const icons = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>',
  play: '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81a.49.49 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z"/></svg>',
  delete: '×'
};

// ---------------------------------------------------------------------------
// 4. NAVIGATION
// ---------------------------------------------------------------------------
function navigateTo(screen, params = {}, pushState = true) {
  if (pushState) {
    const url = new URL(window.location);
    url.searchParams.set('screen', screen);
    if (params.id) url.searchParams.set('id', params.id);
    else url.searchParams.delete('id');
    history.pushState({ screen, params }, '', url);
  }

  appContainer.innerHTML = '';

  switch (screen) {
    case 'workoutDetail': renderWorkoutDetail(params.id); break;
    case 'exerciseDetail': renderExerciseDetail(params.id); break;
    case 'progress': renderProgressScreen(); break;
    default: renderHomeScreen(); break;
  }
}

window.addEventListener('popstate', (e) => {
  if (e.state) navigateTo(e.state.screen, e.state.params, false);
  else navigateTo('home', {}, false);
});

// ---------------------------------------------------------------------------
// 5. TOAST NOTIFICATIONS
// ---------------------------------------------------------------------------
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---------------------------------------------------------------------------
// 6. SHARED UI COMPONENTS
// ---------------------------------------------------------------------------
function bottomNavHTML(activeTab) {
  const tabs = [
    { id: 'home', label: 'Home', icon: icons.home, action: "navigateTo('home')" },
    { id: 'progress', label: 'Progress', icon: icons.chart, action: "navigateTo('progress')" },
    { id: 'settings', label: 'Settings', icon: icons.settings, action: "showToast('Settings coming soon!')" }
  ];
  return `
    <nav class="bottom-nav">
      ${tabs.map(t => `
        <div class="nav-tab ${activeTab === t.id ? 'active' : ''}" onclick="${t.action}">
          <span class="tab-icon">${t.icon}</span>
          <span class="tab-label">${t.label}</span>
        </div>
      `).join('')}
    </nav>`;
}

function headerHTML(title, backAction) {
  const backBtn = backAction
    ? `<button class="back-btn" onclick="${backAction}">${icons.back}</button>`
    : '';
  return `
    <div class="header">
      <div class="header-inner">
        ${backBtn}
        <h1 class="app-title">${title}</h1>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// 7. SCREEN: HOME
// ---------------------------------------------------------------------------
function renderHomeScreen() {
  let cardsHTML = '';
  WORKOUT_DATA.forEach(day => {
    let exerciseCount = 0;
    const sectionNames = [];
    day.sections.forEach(s => {
      exerciseCount += s.exercises.length;
      if (sectionNames.length < 3) sectionNames.push(s.title);
    });

    cardsHTML += `
      <div class="day-card" onclick="navigateTo('workoutDetail', {id: '${day.id}'})">
        <div class="day-card-header">
          <div class="day-card-meta">
            <div class="day-icon">${day.icon}</div>
            <div class="day-title-group">
              <span class="day-card-subtitle">Day ${day.day}</span>
              <span class="day-card-title">${day.title}</span>
            </div>
          </div>
          <span class="exercise-count-badge">${exerciseCount} exercises</span>
        </div>
        <p class="day-card-desc">${sectionNames.join(' • ')}</p>
      </div>`;
  });

  appContainer.innerHTML = `
    ${headerHTML('FitTrack Pro 🏋️')}
    <div class="content" style="flex:1;overflow-y:auto;padding:1.25rem 1rem calc(var(--nav-height) + 1.5rem);">
      ${cardsHTML}
    </div>
    ${bottomNavHTML('home')}`;
}

// ---------------------------------------------------------------------------
// 8. SCREEN: WORKOUT DETAIL
// ---------------------------------------------------------------------------
function renderWorkoutDetail(dayId) {
  const day = getDayById(dayId);
  if (!day) return navigateTo('home');

  let sectionsHTML = '';
  day.sections.forEach(section => {
    sectionsHTML += `
      <div class="section-header">
        <span class="section-header-title">${section.icon || '🔥'} ${section.title}</span>
        <span class="section-header-count">${section.exercises.length}</span>
      </div>`;

    section.exercises.forEach(ex => {
      const prescription = formatPrescription(ex);
      const latestWeight = ex.isWeighted ? StorageService.getLatestWeight(ex.id) : null;

      let weightBadge = '';
      let motiveLine = '';
      if (latestWeight) {
        weightBadge = `<span class="weight-badge">${latestWeight.weight} kg</span>`;
        motiveLine = `
          <div class="exercise-prescription" style="margin-top:2px;font-size:0.78rem;color:var(--success-green);">
            Last: ${latestWeight.weight} kg on ${formatDate(latestWeight.date)} — push harder! 💪
          </div>`;
      }

      const restLine = ex.rest
        ? `<div class="exercise-prescription" style="margin-top:2px;"><span style="color:var(--text-dim);">Rest: ${ex.rest}</span></div>`
        : '';

      sectionsHTML += `
        <div class="exercise-card" onclick="navigateTo('exerciseDetail', {id: '${ex.id}'})">
          <div class="exercise-info">
            <div class="exercise-name">${ex.name}</div>
            <div class="exercise-prescription">
              <span>${prescription}</span>
              ${weightBadge}
            </div>
            ${restLine}
            ${motiveLine}
          </div>
          <div class="exercise-actions">
            <button class="youtube-btn" onclick="openYouTube('${ex.youtubeQuery}', event)" title="Watch on YouTube">
              ${icons.play}
            </button>
          </div>
        </div>`;
    });
  });

  appContainer.innerHTML = `
    ${headerHTML(`Day ${day.day} — ${day.title} ${day.icon}`, "navigateTo('home')")}
    <div class="content" style="flex:1;overflow-y:auto;padding:1.25rem 1rem calc(var(--nav-height) + 1.5rem);">
      ${sectionsHTML}
    </div>
    ${bottomNavHTML('home')}`;
}

// ---------------------------------------------------------------------------
// 9. SCREEN: EXERCISE DETAIL
// ---------------------------------------------------------------------------
function renderExerciseDetail(exerciseId) {
  const ex = getExerciseById(exerciseId);
  if (!ex) return navigateTo('home');

  const latestWeight = StorageService.getLatestWeight(ex.id);
  const history = StorageService.getWeightHistory(ex.id);

  // Progress Banner
  let bannerHTML = '';
  if (latestWeight) {
    bannerHTML = `
      <div class="progress-banner">
        <div class="progress-banner-content">
          <span class="progress-banner-badge">📈 Progress</span>
          <span class="progress-banner-title">You lifted ${latestWeight.weight} kg on ${formatDate(latestWeight.date)}</span>
          <span class="progress-banner-subtitle">Time to push harder and beat your record!</span>
        </div>
        <span class="progress-banner-emoji">💪</span>
      </div>`;
  } else if (ex.isWeighted) {
    bannerHTML = `
      <div class="progress-banner">
        <div class="progress-banner-content">
          <span class="progress-banner-badge">🎯 Get Started</span>
          <span class="progress-banner-title">First time? Set your starting weight below!</span>
          <span class="progress-banner-subtitle">Track your progress from day one.</span>
        </div>
        <span class="progress-banner-emoji">🚀</span>
      </div>`;
  }

  // Exercise Info
  const infoParts = [];
  if (ex.sets) infoParts.push(`<li><strong>Sets:</strong> ${ex.sets}</li>`);
  if (ex.reps) infoParts.push(`<li><strong>Reps:</strong> ${ex.reps}</li>`);
  if (ex.distance) infoParts.push(`<li><strong>Distance:</strong> ${ex.distance}</li>`);
  if (ex.weight) infoParts.push(`<li><strong>Recommended:</strong> ${ex.weight}${ex.weight === 'BW' ? '' : ' kgs'}</li>`);
  if (ex.rest) infoParts.push(`<li><strong>Rest:</strong> ${ex.rest}</li>`);

  const infoCardHTML = `
    <div class="exercise-card" style="flex-direction:column;align-items:stretch;cursor:default;">
      <div class="exercise-name" style="margin-bottom:0.5rem;">📋 Exercise Details</div>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.4rem;">
        ${infoParts.map(p => `<li style="color:var(--text-muted);font-size:var(--font-size-sm);">${p}</li>`).join('')}
      </ul>
    </div>`;

  // YouTube Button
  const youtubeHTML = `
    <button class="btn-primary btn-block" onclick="openYouTube('${ex.youtubeQuery}')" style="padding:1rem;font-size:var(--font-size-base);background:var(--youtube-red);box-shadow:0 4px 14px rgba(239,68,68,0.35);">
      ▶️ Watch Demo on YouTube
    </button>`;

  // Weight Input Section (only for weighted exercises)
  let weightSectionHTML = '';
  if (ex.isWeighted) {
    // History items
    let historyHTML = '';
    if (history.length > 0) {
      historyHTML = history.map((h, i) => {
        let deltaHTML = '';
        if (i < history.length - 1) {
          const prev = history[i + 1];
          const diff = h.weight - prev.weight;
          if (diff > 0) deltaHTML = `<span class="weight-history-delta positive">↑ +${diff}</span>`;
          else if (diff < 0) deltaHTML = `<span class="weight-history-delta negative">↓ ${diff}</span>`;
          else deltaHTML = `<span class="weight-history-delta neutral">→ 0</span>`;
        }
        return `
          <div class="weight-history-item">
            <div class="weight-history-date">
              <span class="date-main">${formatDate(h.date)}</span>
            </div>
            <div class="weight-history-value-group">
              ${deltaHTML}
              <span class="weight-history-val">${h.weight} kg</span>
              <button class="modal-close-btn delete-weight-btn" data-id="${h.id}" title="Delete">${icons.delete}</button>
            </div>
          </div>`;
      }).join('');
    } else {
      historyHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <span class="empty-state-text">No weights logged yet</span>
        </div>`;
    }

    weightSectionHTML = `
      <div class="section-header" style="margin-top:1.5rem;">
        <span class="section-header-title">Log Today's Weight</span>
      </div>
      <div class="exercise-card" style="flex-direction:column;align-items:stretch;cursor:default;">
        <div class="modal-input-group">
          <div class="input-with-unit">
            <input type="number" id="weight-input" placeholder="0" step="0.5" min="0"
              ${latestWeight ? `value="${latestWeight.weight}"` : ''}>
            <span class="unit-label">kg</span>
          </div>
          <div class="quick-adjust-group">
            <button class="quick-adjust-btn" onclick="adjustWeight(-5)">-5</button>
            <button class="quick-adjust-btn" onclick="adjustWeight(-2.5)">-2.5</button>
            <button class="quick-adjust-btn" onclick="adjustWeight(-1)">-1</button>
            <button class="quick-adjust-btn" onclick="adjustWeight(1)">+1</button>
            <button class="quick-adjust-btn" onclick="adjustWeight(2.5)">+2.5</button>
            <button class="quick-adjust-btn" onclick="adjustWeight(5)">+5</button>
          </div>
        </div>
        <button class="btn-primary btn-block" id="save-weight-btn" style="margin-top:1rem;">
          Save Weight
        </button>
      </div>

      <div class="section-header" style="margin-top:1.5rem;">
        <span class="section-header-title">📊 Your History</span>
        <span class="section-header-count">${history.length}</span>
      </div>
      <div class="weight-history">
        ${historyHTML}
      </div>`;
  }

  // Render
  appContainer.innerHTML = `
    ${headerHTML(ex.name, `navigateTo('workoutDetail', {id: '${ex.dayId}'})`)}
    <div class="content" style="flex:1;overflow-y:auto;padding:1.25rem 1rem calc(var(--nav-height) + 1.5rem);">
      ${bannerHTML}
      ${infoCardHTML}
      ${youtubeHTML}
      ${weightSectionHTML}
    </div>
    ${bottomNavHTML('home')}`;

  // Attach event listeners
  if (ex.isWeighted) {
    const saveBtn = document.getElementById('save-weight-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const input = document.getElementById('weight-input');
        const val = parseFloat(input.value);
        if (!isNaN(val) && val > 0) {
          StorageService.saveWeight(ex.id, val);
          showToast('Weight saved! 🎉');
          // Re-render to update banner and history
          setTimeout(() => navigateTo('exerciseDetail', { id: ex.id }, false), 200);
        } else {
          showToast('Please enter a valid weight');
        }
      });
    }

    document.querySelectorAll('.delete-weight-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const entryId = e.currentTarget.getAttribute('data-id');
        StorageService.deleteEntry(entryId);
        showToast('Entry deleted');
        navigateTo('exerciseDetail', { id: ex.id }, false);
      });
    });
  }
}

// Quick-adjust weight helper
function adjustWeight(delta) {
  const input = document.getElementById('weight-input');
  if (!input) return;
  let current = parseFloat(input.value) || 0;
  current = Math.max(0, current + delta);
  input.value = current;
}

// ---------------------------------------------------------------------------
// 10. SCREEN: PROGRESS
// ---------------------------------------------------------------------------
function renderProgressScreen() {
  const allLatest = StorageService.getAllLatestWeights();

  let contentHTML = '';
  if (allLatest.size === 0) {
    contentHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <span class="empty-state-title">No Progress Yet</span>
        <span class="empty-state-text">Start logging weights in your workouts to track your progress here!</span>
      </div>`;
  } else {
    let cardsHTML = '';
    allLatest.forEach((latestEntry, exId) => {
      const ex = getExerciseById(exId);
      if (!ex) return;

      const history = StorageService.getWeightHistory(exId);
      let trendClass = '';
      let trendText = '';
      if (history.length > 1) {
        const prev = history[1];
        const diff = latestEntry.weight - prev.weight;
        if (diff > 0) { trendClass = 'up'; trendText = `↑ +${diff} kg`; }
        else if (diff < 0) { trendClass = 'down'; trendText = `↓ ${diff} kg`; }
        else { trendClass = 'same'; trendText = '→ Same'; }
      }

      cardsHTML += `
        <div class="progress-card" onclick="navigateTo('exerciseDetail', {id: '${ex.id}'})">
          <span class="progress-card-title">${ex.name}</span>
          <span class="progress-card-value">${latestEntry.weight}<span class="unit"> kg</span></span>
          <span class="progress-card-trend ${trendClass}">${trendText || formatDate(latestEntry.date)}</span>
        </div>`;
    });

    contentHTML = `<div class="progress-summary">${cardsHTML}</div>`;
  }

  appContainer.innerHTML = `
    ${headerHTML('📊 Progress')}
    <div class="content" style="flex:1;overflow-y:auto;padding:1.25rem 1rem calc(var(--nav-height) + 1.5rem);">
      ${contentHTML}
    </div>
    ${bottomNavHTML('progress')}`;
}

// ---------------------------------------------------------------------------
// 11. INITIALIZATION
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err =>
      console.log('SW registration failed:', err)
    );
  }

  // Route based on URL params (supports deep linking & back button)
  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen') || 'home';
  const id = params.get('id');
  navigateTo(screen, id ? { id } : {}, false);
});
