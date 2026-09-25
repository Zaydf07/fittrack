// =============================================================================
// FITTRACK — training log PWA
// Flat red-on-bone, Archivo, zero radius. Vanilla JS, no build step, no
// framework. Everything renders from one state object into #app-shell.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. SEED DATA & CONSTANTS
// -----------------------------------------------------------------------------
const KG_PER_LB = 0.45359237;
const LS = {
  plans: 'ft_plans_v1', log: 'ft_log_v1', unit: 'ft_unit_v1', user: 'ft_user_v1',
  session: 'ft_session_v1', trends: 'ft_trends_v1', events: 'ft_events_v1',
  muted: 'ft_muted_v1', clients: 'ft_clients_v1'
};

const PB_HEADS = ['New best', 'Record broken', 'Past your ceiling', 'Better than ever', 'That is the new number', 'Top of the pile'];
const BASE_HEADS = ['On the board', 'Baseline set', 'First mark down', 'Starting line'];
const BASE_LINES = [
  'Everything from here is progress.',
  'Now there is a number to beat.',
  'This is the floor, not the ceiling.',
  'The comparison starts next session.'
];
const PUSH_NONE = [
  'One set puts you back on the board.',
  'Nothing logged yet. Fix that today.',
  'The log is empty. Give it something.',
  'Start small, but start.'
];
const PUSH_DAY1 = [
  'Day 1. Show up tomorrow and it counts as a streak.',
  'One day down. The second one is the hard one.',
  'You turned up. Do it again tomorrow.'
];
const PUSH_MID = [
  '{n} days running. Two more makes it a habit.',
  '{n} days in. Do not negotiate with yourself now.',
  '{n} straight. Keep the chain going.',
  '{n} days. This is where most people stop.'
];
const PUSH_LONG = [
  '{n} days unbroken. Do not be the one who stops it.',
  '{n} days straight. That is a training block, not a mood.',
  '{n} days. You are the consistent one now.',
  '{n} unbroken. Protect it.'
];
const NUDGE_UP = [
  'You held {last} cleanly. Good day to go for {next}.',
  '{last} looked comfortable. Put {next} on the bar.',
  'Last time {last}. {next} is the honest next step.',
  '{last} is yours now. Take {next}.'
];
const NUDGE_BACK = [
  'Your best is {best}, average {avg}. Match it before adding load.',
  'You have had {best} before. Get back there first.',
  'Average is {avg}, best is {best}. Today is a rebuild day.',
  '{best} is still on the record. Chase it down.'
];

const LEVEL_TITLES = ['Warming up', 'Regular', 'Consistent', 'Sharp', 'Relentless', 'Machine', 'Unreasonable'];
const FINISHERS = [
  { name: '40 kettlebell swings', note: 'Unbroken if you can' },
  { name: '100 m sled push', note: 'Heavy, walk it back' },
  { name: '3 min plank ladder', note: '30s on, 15s off' },
  { name: '50 air squats', note: 'Fast and honest' },
  { name: '500 m row', note: 'Under two minutes' },
  { name: '8 hill sprints', note: '15 seconds each' },
  { name: '2 min battle rope', note: '20s hard, 10s easy' },
  { name: '30 burpees', note: 'Chest to floor' },
  { name: '400 m farmer carry', note: 'Pick a weight you regret' },
  { name: '60 mountain climbers', note: 'Hips down' }
];

// Public, unauthenticated JSON reads — no API key exists for this. If the
// browser's CORS policy or a network block refuses these, loadTrends()
// falls back to the curated library alone and says so honestly.
const TREND_SOURCES = [
  { id: 'r/Fitness', url: 'https://www.reddit.com/r/Fitness/top.json?t=week&limit=15' },
  { id: 'r/running', url: 'https://www.reddit.com/r/running/top.json?t=week&limit=10' },
  { id: 'r/bodyweightfitness', url: 'https://www.reddit.com/r/bodyweightfitness/top.json?t=week&limit=10' },
  { id: 'r/crossfit', url: 'https://www.reddit.com/r/crossfit/top.json?t=week&limit=10' }
];

const GOALS = [
  { id: 'speed', label: 'Speed', note: 'Sprints, sled and plyometrics' },
  { id: 'strength', label: 'Strength', note: 'Heavy loads, low reps' },
  { id: 'general', label: 'General fitness', note: 'A bit of everything' }
];

const SEED = [
  { id: 'day1', day: 1, title: 'Speed', sections: [
    { title: 'Sled Work', exercises: [
      { id: 'd1e1', name: 'Single Switch on Sled', reps: '10' },
      { id: 'd1e2', name: 'Double Switch on Sled', reps: '6ES' },
      { id: 'd1e3', name: 'Triple Switch on Sled', reps: '6ES' },
      { id: 'd1e4', name: 'Knee Drive March on Sled', sets: '4', distance: '10m', weight: '50-70', isWeighted: true }
    ]},
    { title: 'OH Plate Hold Series', exercises: [
      { id: 'd1e5', name: 'A March with OH Plate Hold', sets: '2', distance: '10m', isWeighted: true },
      { id: 'd1e6', name: 'A Switch with OH Plate Hold', sets: '2', distance: '10m', isWeighted: true },
      { id: 'd1e7', name: 'A Switch with Double Skip OH Plate Hold', sets: '2', distance: '10m', isWeighted: true },
      { id: 'd1e8', name: 'Straight Leg Runs with OH Plate Hold', sets: '2', distance: '10m', isWeighted: true }
    ]},
    { title: 'Jumps', exercises: [
      { id: 'd1e9', name: 'Broad Jumps', sets: '3', reps: '3', weight: 'BW' },
      { id: 'd1e10', name: 'Single Leg Step Up Jumps (Alternating)', sets: '3', reps: '10ES', weight: 'BW' }
    ]}
  ]},
  { id: 'day2', day: 2, title: 'Speed', sections: [
    { title: 'Stretch', exercises: [{ id: 'd2e0', name: 'Dynamic Stretching Routine', sets: '1' }] },
    { title: 'Drills', exercises: [
      { id: 'd2e1', name: 'High Knees', sets: '2', distance: '20m' },
      { id: 'd2e2', name: 'Butt Kicks', sets: '2', distance: '20m' },
      { id: 'd2e3', name: 'A Skip', sets: '3', distance: '20m' },
      { id: 'd2e4', name: 'B Skip', sets: '3', distance: '20m' },
      { id: 'd2e5', name: 'Power Skip', sets: '3', distance: '20m' }
    ]},
    { title: 'Sprints (Band Resisted)', exercises: [
      { id: 'd2e6', name: 'Band Resisted Sprint 5m', sets: '3', reps: '3', distance: '5m', rest: '2-3 min' },
      { id: 'd2e7', name: 'Band Resisted Sprint 10m', sets: '3', reps: '2', distance: '10m', rest: '2-3 min' }
    ]},
    { title: 'Sprints (Straight Line)', exercises: [
      { id: 'd2e8', name: 'Sprint 15m Max Effort', reps: '3', distance: '15m', rest: '2 min per rep' },
      { id: 'd2e9', name: 'Sprint 25m Max Effort', reps: '2', distance: '25m', rest: '2-3 min per rep' }
    ]},
    { title: 'Conditioning', exercises: [
      { id: 'd2e10', name: 'Air Bike — 250 cals @ 16-18 km/h', sets: '1' },
      { id: 'd2e11', name: 'Air Bike — 40s @ 12-14 km/h / 20s @ 20-24 km/h', reps: '8-10 repeats' },
      { id: 'd2e12', name: 'Battle Rope — 30s Hard / 30s Rest', reps: '8-10 repeats' }
    ]}
  ]}
];

const CLIENT_SEED = [
  { id: 'c1', name: 'Nadia Okafor', focus: 'Sprint speed', plan: 'Day 2 — Speed', sets: [
    ['Sprint 25m Max Effort', 'time', 3.62, 1], ['Sprint 25m Max Effort', 'time', 3.71, 5], ['Sprint 15m Max Effort', 'time', 2.31, 1],
    ['Knee Drive March on Sled', 'load', 70, 2], ['Knee Drive March on Sled', 'load', 65, 9]] },
  { id: 'c2', name: 'Tom Brennan', focus: 'Return from injury', plan: 'Day 1 — Speed', sets: [
    ['Knee Drive March on Sled', 'load', 45, 3], ['Knee Drive March on Sled', 'load', 50, 10], ['Broad Jumps', 'load', 0, 12]] },
  { id: 'c3', name: 'Priya Raman', focus: 'General strength', plan: 'Push / Pull', sets: [
    ['Bench Press', 'load', 52.5, 1], ['Bench Press', 'load', 50, 8], ['Bench Press', 'load', 47.5, 15],
    ['Back Squat', 'load', 80, 2]] },
  { id: 'c4', name: 'Marcus Vale', focus: 'Fight camp', plan: 'Rounds & conditioning', sets: [
    ['Battle Rope 30s', 'time', 30, 11], ['Air Bike Intervals', 'time', 40, 12]] },
  { id: 'c5', name: 'Elena Fischer', focus: 'Marathon build', plan: 'Base miles', sets: [
    ['Sprint 15m Max Effort', 'time', 2.55, 2], ['Sprint 15m Max Effort', 'time', 2.49, 6], ['Broad Jumps', 'load', 0, 4]] },
  { id: 'c6', name: 'Dio Hartley', focus: 'First barbell block', plan: 'Day 1 — Speed', sets: [
    ['Back Squat', 'load', 60, 0], ['Back Squat', 'load', 57.5, 4], ['Back Squat', 'load', 55, 11], ['Bench Press', 'load', 40, 0]] }
];

// Curated, on-device workout library. Trending rotates a slice of this by
// week — it is not a live feed and never claims to be one.
const TRENDING_LIBRARY = [
  { title: 'Hero WOD Week', tag: 'CrossFit', blurb: 'A named benchmark workout, high rep and against the clock.', minutes: 28, level: 'Advanced', exercises: [
    { name: 'Thrusters', sets: '3', reps: '21-15-9', isWeighted: true },
    { name: 'Pull-ups', sets: '3', reps: '21-15-9' },
    { name: 'Box Jumps', sets: '3', reps: '15' },
    { name: 'Wall Balls', sets: '3', reps: '20', isWeighted: true }
  ]},
  { title: 'Zone 2 Base Build', tag: 'Running', blurb: 'Easy aerobic mileage — conversational pace, nothing heroic.', minutes: 45, level: 'Beginner', exercises: [
    { name: 'Easy Run', reps: '35 min', isTimed: true },
    { name: 'Strides', sets: '4', reps: '20s', isTimed: true },
    { name: 'Walking Cooldown', reps: '10 min', isTimed: true }
  ]},
  { title: 'Push Pull Legs', tag: 'Strength', blurb: 'A classic three-way split, still the most repeated plan in every gym.', minutes: 55, level: 'Intermediate', exercises: [
    { name: 'Bench Press', sets: '4', reps: '6', isWeighted: true },
    { name: 'Overhead Press', sets: '3', reps: '8', isWeighted: true },
    { name: 'Barbell Row', sets: '4', reps: '8', isWeighted: true },
    { name: 'Back Squat', sets: '4', reps: '5', isWeighted: true },
    { name: 'Romanian Deadlift', sets: '3', reps: '8', isWeighted: true }
  ]},
  { title: 'Ring Skills Primer', tag: 'Bodyweight', blurb: 'Rings are everywhere on training feeds right now — this is the entry point.', minutes: 30, level: 'Intermediate', exercises: [
    { name: 'Ring Support Hold', sets: '4', reps: '20s', isTimed: true },
    { name: 'Ring Rows', sets: '4', reps: '10' },
    { name: 'Ring Push-ups', sets: '3', reps: '8' },
    { name: 'Dead Hang', sets: '3', reps: '30s', isTimed: true }
  ]},
  { title: 'Sled Finisher', tag: 'Conditioning', blurb: 'Short, loaded and unpleasant — the current favourite last-exercise-of-the-day.', minutes: 15, level: 'Advanced', exercises: [
    { name: 'Heavy Sled Push', sets: '5', distance: '20m', isWeighted: true },
    { name: 'Sled Drag Backwards', sets: '5', distance: '20m', isWeighted: true }
  ]},
  { title: '5K Speed Session', tag: 'Running', blurb: 'Interval work aimed squarely at a faster 5K time.', minutes: 40, level: 'Intermediate', exercises: [
    { name: '1K Repeats', sets: '4', reps: '1000m', isTimed: true },
    { name: 'Recovery Jog', sets: '4', reps: '2 min', isTimed: true },
    { name: 'Strides', sets: '4', reps: '15s', isTimed: true }
  ]},
  { title: 'Kettlebell Complex', tag: 'Hybrid', blurb: 'One bell, no rest between moves — a format that keeps resurfacing online.', minutes: 20, level: 'Intermediate', exercises: [
    { name: 'KB Swing', sets: '5', reps: '10', isWeighted: true },
    { name: 'KB Clean', sets: '5', reps: '5', isWeighted: true },
    { name: 'KB Front Squat', sets: '5', reps: '5', isWeighted: true },
    { name: 'KB Press', sets: '5', reps: '5', isWeighted: true }
  ]},
  { title: 'Deadlift Focus Block', tag: 'Strength', blurb: 'Single-lift specialisation weeks keep trending among lifters chasing a number.', minutes: 50, level: 'Advanced', exercises: [
    { name: 'Deadlift', sets: '5', reps: '3', isWeighted: true },
    { name: 'Deficit Deadlift', sets: '3', reps: '5', isWeighted: true },
    { name: 'Barbell Row', sets: '4', reps: '8', isWeighted: true },
    { name: 'Back Extension', sets: '3', reps: '12' }
  ]},
  { title: 'Bag Round Conditioning', tag: 'Boxing', blurb: 'Round-based bag work — pairs with the app\'s round timer.', minutes: 24, level: 'Intermediate', exercises: [
    { name: 'Bag Rounds — Combos', sets: '6', reps: '3 min', isTimed: true },
    { name: 'Shadow Boxing', sets: '2', reps: '3 min', isTimed: true },
    { name: 'Jump Rope', sets: '3', reps: '2 min', isTimed: true }
  ]},
  { title: 'Hyrox Prep Circuit', tag: 'Hybrid', blurb: 'Running paired with functional stations, the format behind the race that keeps growing.', minutes: 42, level: 'Advanced', exercises: [
    { name: '1K Run', reps: '1000m', isTimed: true },
    { name: 'Sled Push', distance: '50m', isWeighted: true },
    { name: 'Sled Pull', distance: '50m', isWeighted: true },
    { name: 'Burpee Broad Jumps', sets: '1', reps: '80' },
    { name: 'Farmers Carry', distance: '200m', isWeighted: true }
  ]},
  { title: 'Mobility Reset', tag: 'Recovery', blurb: 'A slower session between hard training blocks — increasingly common in weekly splits.', minutes: 25, level: 'Beginner', exercises: [
    { name: '90/90 Hip Stretch', sets: '2', reps: '45s', isTimed: true },
    { name: 'Couch Stretch', sets: '2', reps: '45s', isTimed: true },
    { name: 'Thoracic Rotations', sets: '2', reps: '10' },
    { name: 'Band Pull-Aparts', sets: '3', reps: '15' }
  ]},
  { title: 'Air Bike Ladder', tag: 'Conditioning', blurb: 'A rising-then-falling calorie ladder — short, brutal, and easy to post.', minutes: 18, level: 'Advanced', exercises: [
    { name: 'Air Bike Ladder 2-4-6-8-6-4-2', reps: 'cals', isTimed: true },
    { name: 'Rest Between Rungs', reps: '1 min', isTimed: true }
  ]},
  { title: 'Single Leg Strength', tag: 'Strength', blurb: 'Unilateral work for durability — a steady favourite among coaches right now.', minutes: 35, level: 'Intermediate', exercises: [
    { name: 'Bulgarian Split Squat', sets: '4', reps: '8', isWeighted: true },
    { name: 'Single Leg RDL', sets: '3', reps: '8', isWeighted: true },
    { name: 'Step Ups', sets: '3', reps: '10', isWeighted: true },
    { name: 'Lateral Lunge', sets: '3', reps: '10', isWeighted: true }
  ]},
  { title: 'Sprint Mechanics Drill Set', tag: 'Speed', blurb: 'Pure technical drill work, no load — the kind of session that circulates in sprint coaching feeds.', minutes: 22, level: 'Beginner', exercises: [
    { name: 'A Skip', sets: '3', distance: '20m' },
    { name: 'B Skip', sets: '3', distance: '20m' },
    { name: 'Wall Drills', sets: '3', reps: '10' },
    { name: 'Acceleration Runs', sets: '4', distance: '15m', isTimed: true }
  ]},
  { title: 'Full Body EMOM', tag: 'Hybrid', blurb: 'Every-minute format, easy to scale and easy to share — a steady online staple.', minutes: 20, level: 'Intermediate', exercises: [
    { name: 'EMOM: Kettlebell Swings', sets: '10', reps: '15', isWeighted: true },
    { name: 'EMOM: Push-ups', sets: '10', reps: '10' },
    { name: 'EMOM: Air Squats', sets: '10', reps: '15' }
  ]},
  { title: 'HIIT Circuit', tag: 'HIIT', blurb: '30 seconds on, 15 off, four rounds — the go-to short-and-brutal format on every fitness feed.', minutes: 20, level: 'Intermediate', exercises: [
    { name: 'Burpees', sets: '4', reps: '30s', isTimed: true },
    { name: 'Jump Squats', sets: '4', reps: '30s', isTimed: true },
    { name: 'Mountain Climbers', sets: '4', reps: '30s', isTimed: true },
    { name: 'Plank Shoulder Taps', sets: '4', reps: '30s', isTimed: true },
    { name: 'High Knees', sets: '4', reps: '30s', isTimed: true }
  ]},
  { title: 'Incline Treadmill Walk', tag: 'Cardio', blurb: 'Low-impact, high-incline steady walk — one of the most repeated cardio formats on social fitness feeds right now.', minutes: 30, level: 'Beginner', exercises: [
    { name: 'Incline Treadmill Walk (12% grade)', reps: '30 min', isTimed: true }
  ]},
  { title: '4x4 Interval Protocol', tag: 'Conditioning', blurb: 'Four hard four-minute efforts with active recovery — a sports-science interval format having a viral moment.', minutes: 32, level: 'Advanced', exercises: [
    { name: 'Hard Interval (90% effort)', sets: '4', reps: '4 min', isTimed: true },
    { name: 'Active Recovery Jog', sets: '4', reps: '3 min', isTimed: true }
  ]}
];

// -----------------------------------------------------------------------------
// 2. HELPERS
// -----------------------------------------------------------------------------
function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function js(v) {
  return JSON.stringify(v == null ? '' : v).replace(/"/g, '&quot;');
}
function uid(prefix) { return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function pad2(n) { return String(n).padStart(2, '0'); }
function svg(inner, attrs) { return '<svg ' + (attrs || '') + '>' + inner + '</svg>'; }

const ICONS = {
  back: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"></path></svg>',
  close: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
  play: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21"></polygon></svg>',
  playSm: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21"></polygon></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>',
  plusSm: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>',
  up: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m18 15-6-6-6 6"></path></svg>',
  down: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"></path></svg>',
  x: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
  edit: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>',
  photo: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#ec3013" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>',
  file: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#ec3013" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
  hand: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#ec3013" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>',
  dup: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#605d5d" stroke-width="2"><rect x="9" y="9" width="13" height="13"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
  home: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  coach: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path></svg>',
  clock: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3.5 2"></path></svg>',
  trend: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
  chartUp: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>'
};

// -----------------------------------------------------------------------------
// 2.5 ON-DEVICE CLIP STORAGE (IndexedDB — video blobs don't fit localStorage)
// -----------------------------------------------------------------------------
const MEDIA_DB = 'fittrack_media_v1', MEDIA_STORE = 'clips';
function idbOpen() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error('no-indexeddb'));
    const req = indexedDB.open(MEDIA_DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(MEDIA_STORE)) req.result.createObjectStore(MEDIA_STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbPutClip(record) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, 'readwrite');
    tx.objectStore(MEDIA_STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function idbGetClip(id) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, 'readonly');
    const req = tx.objectStore(MEDIA_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}
async function idbDeleteClip(id) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, 'readwrite');
    tx.objectStore(MEDIA_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function idbAllClips() {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, 'readonly');
    const req = tx.objectStore(MEDIA_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

// -----------------------------------------------------------------------------
// 3. APP STATE
// -----------------------------------------------------------------------------
const App = {
  state: {
    screen: 'welcome', planId: null, exId: null,
    unit: 'kg', plans: SEED, log: [],
    input: '', sheet: false, busy: false, busyFile: '', error: '',
    toast: '', draft: null,
    user: null, account: null, mode: 'register', authError: '',
    trends: [], trendsAt: null, openTrend: null, trendsBusy: false, trendSources: [], trendPosts: 0,
    events: [], overlay: null, ghost: null, wheel: null, session: null,
    editName: null, confirmPlan: false, rest: null, note: '', bwInput: '', query: '',
    report: null, reportText: '', watch: null, rounds: null,
    clients: CLIENT_SEED, clientId: null, assignFor: null, pb: null, muted: false,
    clips: [], record: null,
    step: 0,
    form: { name: '', email: '', password: '', confirm: '', bodyweight: '', goal: 'speed', role: 'solo', days: 3 },
    resetEmail: '', resetPassword: '', resetConfirm: ''
  },
  _timers: {},
  _pushKey: null, _push: null,
  _ac: null,

  init() {
    let plans = SEED, log = [], unit = 'kg', account = null, session = false;
    try {
      const p = localStorage.getItem(LS.plans); if (p) plans = JSON.parse(p);
      const l = localStorage.getItem(LS.log); if (l) log = JSON.parse(l);
      const u = localStorage.getItem(LS.unit); if (u === 'kg' || u === 'lb') unit = u;
      const a = localStorage.getItem(LS.user); if (a) account = JSON.parse(a);
      session = localStorage.getItem(LS.session) === '1';
    } catch (e) {}
    let trends = [], trendsAt = null, events = [], clients = CLIENT_SEED, muted = false, trendSources = [], trendPosts = 0;
    try {
      const ev = localStorage.getItem(LS.events); if (ev) events = JSON.parse(ev);
      const cl = localStorage.getItem(LS.clients); if (cl) clients = JSON.parse(cl);
      muted = localStorage.getItem(LS.muted) === '1';
      const t = localStorage.getItem(LS.trends);
      if (t) { const parsed = JSON.parse(t); trends = parsed.list || []; trendsAt = parsed.at || null; trendSources = parsed.sources || []; trendPosts = parsed.posts || 0; }
    } catch (e) {}
    const user = session && account ? account : null;
    Object.assign(this.state, {
      plans, log, unit, account, user, trends, trendsAt, events, clients, muted, trendSources, trendPosts,
      screen: user ? 'today' : account ? 'auth' : 'welcome',
      mode: account ? 'signin' : 'register',
      form: Object.assign({}, this.state.form, { email: account ? account.email : '' })
    });
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
    document.getElementById('photo-input').addEventListener('change', (e) => {
      const f = e.target.files[0]; e.target.value = ''; this.handleFile(f);
    });
    document.getElementById('file-input').addEventListener('change', (e) => {
      const f = e.target.files[0]; e.target.value = ''; this.handleFile(f);
    });
    if (this.state.user && !this.state.trends.length) this.loadTrends(false);
    this.loadClips();
    this.render();
  },

  set(patch) { Object.assign(this.state, patch); this.render(); },
  persist(patch) {
    Object.assign(this.state, patch);
    try {
      localStorage.setItem(LS.plans, JSON.stringify(this.state.plans));
      localStorage.setItem(LS.log, JSON.stringify(this.state.log));
      localStorage.setItem(LS.unit, this.state.unit);
    } catch (e) {}
    this.render();
  },
  persistAccount(account, session) {
    try {
      localStorage.setItem(LS.user, JSON.stringify(account));
      localStorage.setItem(LS.session, session ? '1' : '0');
    } catch (e) {}
  },
  toast(msg) {
    clearTimeout(this._timers.toast);
    this.set({ toast: msg });
    this._timers.toast = setTimeout(() => this.set({ toast: '' }), 2600);
  },
  go(screen, patch) { this.set(Object.assign({ screen: screen, sheet: false }, patch || {})); },
  goForgotPassword() { this.set({ mode: 'reset', authError: '' }); },

  // ---------------------------------------------------------------------------
  // 4. METRICS, UNITS, STATS
  // ---------------------------------------------------------------------------
  metricOf(ex) {
    if (!ex) return null;
    if (ex.metric) return ex.metric === 'none' ? null : ex.metric;
    if (ex.isWeighted) return 'load';
    if (ex.isTimed || ex.distance) return 'time';
    return null;
  },
  setMetric(exId, kind) {
    const plans = this.state.plans.map(p => ({
      id: p.id, day: p.day, title: p.title,
      sections: p.sections.map(sec => ({
        title: sec.title,
        exercises: sec.exercises.map(e => e.id === exId ? Object.assign({}, e, { metric: kind }) : e)
      }))
    }));
    this.persist({ plans: plans, input: '' });
  },
  toDisplay(kg) { return this.state.unit === 'kg' ? kg : kg / KG_PER_LB; },
  toKg(v) { return this.state.unit === 'kg' ? v : v * KG_PER_LB; },
  round(v) { return Math.round(v * 2) / 2; },
  fmt(kg) { return this.round(this.toDisplay(kg)) + ' ' + this.state.unit.toUpperCase(); },
  fmtVal(kind, v) {
    if (kind === 'time') return (Math.round(v * 100) / 100).toFixed(2) + 's';
    if (kind === 'reps') return (Math.round(v * 10) / 10) + ' reps';
    return this.fmt(v);
  },
  betterIsHigher(kind) { return kind !== 'time'; },
  statsFor(id) {
    const h = this.entriesFor(id);
    if (!h.length) return null;
    const kind = h[0].kind || 'load';
    const vals = h.map(e => e.value);
    const max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return {
      kind: kind, count: vals.length, latest: vals[0], first: vals[vals.length - 1],
      max: max, min: min, avg: avg,
      best: this.betterIsHigher(kind) ? max : min,
      worst: this.betterIsHigher(kind) ? min : max
    };
  },

  allExercises() {
    const out = [];
    this.state.plans.forEach(p => p.sections.forEach(s => s.exercises.forEach(e =>
      out.push(Object.assign({}, e, { planId: p.id, planTitle: p.title, planDay: p.day })))));
    return out;
  },
  findEx(id) { return this.allExercises().find(e => e.id === id) || null; },
  entriesFor(id) {
    return this.state.log.filter(e => e.exerciseId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  suggestTime(sec) { return Math.max(0.5, Math.round((sec - Math.max(0.05, sec * 0.02)) * 100) / 100); },
  suggest(kg) { const step = kg >= 60 ? 5 : kg >= 20 ? 2.5 : 1; return kg + step; },
  prescription(ex) {
    const parts = [];
    if (ex.sets) parts.push(ex.sets + ' sets');
    if (ex.reps) parts.push(ex.reps + ' reps');
    if (ex.distance) parts.push(ex.distance);
    if (ex.weight) parts.push(ex.weight === 'BW' ? 'bodyweight' : ex.weight + ' kg prescribed');
    return parts.join(' · ') || 'As prescribed';
  },
  daysAgo(iso) {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (d <= 0) return 'today';
    if (d === 1) return 'yesterday';
    if (d < 7) return d + ' days ago';
    if (d < 14) return 'last week';
    return Math.floor(d / 7) + ' weeks ago';
  },
  dateLabel(iso) { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); },
  pick(list, vars) {
    let t = list[Math.floor(Math.random() * list.length)];
    if (vars) Object.keys(vars).forEach(k => { t = t.split('{' + k + '}').join(vars[k]); });
    return t;
  },
  nudgeFor(ex) {
    const kind = this.metricOf(ex);
    const st = this.statsFor(ex.id);
    if (!st) return kind ? (kind === 'time' ? 'No time recorded yet — set a baseline' : 'Not logged yet — set a baseline') : '';
    const h = this.entriesFor(ex.id);
    const last = h[0];
    const f = (v) => this.fmtVal(st.kind, v);
    if (st.kind === 'time') {
      if (last.value > st.best) return 'Last ' + f(last.value) + ' — best is ' + f(st.best) + ', go get it';
      return 'Last ' + f(last.value) + ' ' + this.daysAgo(last.date) + ' → chase ' + f(this.suggestTime(last.value));
    }
    if (last.value < st.best) return 'Last ' + f(last.value) + ' — best is ' + f(st.best) + ', match it';
    return 'Last ' + f(last.value) + ' ' + this.daysAgo(last.date) + ' → try ' + f(this.suggest(last.value));
  },

  chart(raw, kind) {
    if (raw.length < 2) return '<div class="empty-note" style="padding:2px 6px 8px">One entry so far — log again to draw the line.</div>';
    const vals = kind === 'time' ? raw.map(v => Math.round(v * 100) / 100) : raw.map(k => this.round(this.toDisplay(k)));
    const W = 300, H = 74, n = vals.length;
    const min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), rng = (max - min) || 1;
    const pts = vals.map((v, i) => [8 + i * (W - 16) / (n - 1), H - 10 - ((v - min) / rng) * (H - 26)]);
    let kids = '<line x1="0" y1="' + (H - 1) + '" x2="' + W + '" y2="' + (H - 1) + '" stroke="rgba(32,30,29,.18)" stroke-width="2"></line>';
    kids += '<polyline points="' + pts.map(p => p.join(',')).join(' ') + '" fill="none" stroke="#ec3013" stroke-width="2"></polyline>';
    pts.forEach((p, i) => {
      kids += '<rect x="' + (p[0] - 3) + '" y="' + (p[1] - 3) + '" width="6" height="6" fill="' + (i === n - 1 ? '#ec3013' : '#201e1d') + '"></rect>';
    });
    return '<svg class="linechart" viewBox="0 0 ' + W + ' ' + H + '">' + kids + '</svg>';
  },

  // ---------------------------------------------------------------------------
  // 5. AUTH & ONBOARDING
  // ---------------------------------------------------------------------------
  setForm(key, value) { Object.assign(this.state.form, { [key]: value }); this.set({ authError: '' }); },
  // On-device only — this hash keeps a plaintext password out of localStorage,
  // but it is not a real security boundary: anyone with access to this
  // device's storage already has everything. It exists so "reset password"
  // actually changes what sign-in checks, not to protect against attackers.
  async hashPassword(pwd) {
    if (!window.crypto || !crypto.subtle) return 'plain:' + pwd; // very old browser fallback
    const bytes = new TextEncoder().encode(pwd);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  },
  async submitAuth() {
    const f = this.state.form;
    const email = f.email.trim().toLowerCase();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (this.state.mode === 'register') {
      if (!f.name.trim()) return this.set({ authError: 'Add your name so the app knows who is lifting.' });
      if (!emailOk) return this.set({ authError: 'That email address does not look right.' });
      if (f.password.length < 8) return this.set({ authError: 'Passwords need at least 8 characters.' });
      if (f.password !== f.confirm) return this.set({ authError: 'The two passwords do not match.' });
      const passwordHash = await this.hashPassword(f.password);
      const account = { name: f.name.trim(), email: email, passwordHash: passwordHash, goal: 'speed', role: 'solo', days: 3, bodyweight: null, joined: new Date().toISOString() };
      this.persistAccount(account, true);
      this.set({ account: account, user: account, screen: 'onboard', step: 0, authError: '' });
      return;
    }
    if (!emailOk) return this.set({ authError: 'That email address does not look right.' });
    if (!f.password) return this.set({ authError: 'Enter your password.' });
    const acc = this.state.account;
    if (!acc || acc.email !== email) return this.set({ authError: 'No account on this device with that email. Create one instead.' });
    if (acc.passwordHash) {
      const hash = await this.hashPassword(f.password);
      if (hash !== acc.passwordHash) return this.set({ authError: 'That password doesn\'t match. Try again or reset it.' });
    }
    this.persistAccount(acc, true);
    this.set({ user: acc, screen: 'today', authError: '' });
    this.toast('Welcome back, ' + acc.name.split(' ')[0]);
  },
  async submitPasswordReset() {
    const email = this.state.resetEmail.trim().toLowerCase();
    const pwd = this.state.resetPassword;
    const confirm = this.state.resetConfirm;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return this.set({ authError: 'That email address does not look right.' });
    if (pwd.length < 8) return this.set({ authError: 'Passwords need at least 8 characters.' });
    if (pwd !== confirm) return this.set({ authError: 'The two passwords do not match.' });
    const acc = this.state.account;
    if (!acc || acc.email !== email) return this.set({ authError: 'No account on this device with that email.' });
    const passwordHash = await this.hashPassword(pwd);
    const updated = Object.assign({}, acc, { passwordHash: passwordHash });
    this.persistAccount(updated, true);
    this.set({ account: updated, user: updated, screen: 'today', mode: 'signin', authError: '', resetEmail: '', resetPassword: '', resetConfirm: '' });
    this.toast('Password reset. You are now signed in.');
  },
  finishOnboard() {
    const f = this.state.form;
    const bw = parseFloat(f.bodyweight);
    const account = Object.assign({}, this.state.account, {
      goal: f.goal, role: f.role, days: f.days,
      bodyweight: isNaN(bw) || bw <= 0 ? null : this.toKg(bw)
    });
    this.persistAccount(account, true);
    this.set({ account: account, user: account, screen: 'today', step: 0 });
    this.toast('You are set up, ' + account.name.split(' ')[0]);
  },
  signOut() {
    try { localStorage.setItem(LS.session, '0'); } catch (e) {}
    this.set({
      user: null, screen: 'welcome', mode: 'signin', sheet: false, authError: '',
      form: Object.assign({}, this.state.form, { password: '', confirm: '', email: this.state.account ? this.state.account.email : '' })
    });
  },

  // ---------------------------------------------------------------------------
  // 6. LOGGING
  // ---------------------------------------------------------------------------
  openExercise(id) {
    const h = this.entriesFor(id);
    this.set({
      screen: 'exercise', exId: id, sheet: false,
      input: h.length ? String(this.round(this.toDisplay(h[0].value))) : ''
    });
  },
  watch(ex) {
    const q = encodeURIComponent(ex.name.replace(/[—–]/g, ' ') + ' exercise technique');
    window.open('https://www.youtube.com/results?search_query=' + q, '_blank', 'noopener');
  },
  // Shared by the exercise screen's "Save this set" and the record-yourself
  // flow, so a clip can link to the exact entry it was taken alongside.
  // rawInput left blank (after trim) returns null silently — caller decides
  // what that means; invalid non-empty input toasts and returns null too.
  commitLog(exId, rawInput, rawNote) {
    const ex = this.findEx(exId);
    const kind = this.metricOf(ex);
    if (!ex || !kind) return null;
    const raw = (rawInput || '').toString().trim();
    if (!raw) return null;
    const v = parseFloat(raw);
    if (isNaN(v) || v <= 0) { this.toast(kind === 'time' ? 'Enter a time first' : 'Enter a weight first'); return null; }
    const value = kind === 'time' ? Math.round(v * 100) / 100 : kind === 'reps' ? Math.round(v * 10) / 10 : this.toKg(v);
    const st = this.statsFor(ex.id);
    const prev = this.entriesFor(ex.id)[0];
    const entry = { id: uid('e'), exerciseId: ex.id, kind: kind, value: value, date: new Date().toISOString(), note: (rawNote || '').trim().slice(0, 120) || null };
    const log = this.state.log.concat([entry]);
    this.persist({ log: log });
    const f = (x) => this.fmtVal(kind, x);
    const improved = st && (kind === 'time' ? value < st.best : value > st.best);
    if (improved) {
      clearTimeout(this._timers.pb);
      const gain = kind === 'time' ? (st.best - value).toFixed(2) + 's faster than your best' : this.fmt(value - st.best) + ' more than you have ever held';
      this.set({ pb: { name: ex.name, value: f(value), gain: gain, prev: f(st.best), head: this.pick(PB_HEADS) } });
      this._timers.pb = setTimeout(() => this.set({ pb: null }), 3400);
    } else if (!st) {
      clearTimeout(this._timers.pb);
      this.set({ pb: { name: ex.name, value: f(value), gain: this.pick(BASE_LINES), prev: null, head: this.pick(BASE_HEADS) } });
      this._timers.pb = setTimeout(() => this.set({ pb: null }), 3000);
    }
    const vals = log.filter(e => e.exerciseId === ex.id).map(e => e.value);
    const now = { best: kind === 'time' ? Math.min.apply(null, vals) : Math.max.apply(null, vals), avg: vals.reduce((a, b) => a + b, 0) / vals.length };
    if (improved) this.toast('Logged ' + f(value) + ' — new personal best');
    else if (prev && value === prev.value) this.toast('Logged ' + f(value) + ' — matched last session');
    else if (prev) this.toast('Logged ' + f(value) + ' · best ' + f(now.best) + ' · average ' + f(now.avg));
    else this.toast('Logged ' + f(value) + ' — baseline set');
    return entry;
  },
  saveWeight() {
    const entry = this.commitLog(this.state.exId, this.state.input, this.state.note);
    if (entry) this.set({ input: '', note: '' });
  },
  removeEntry(id) { this.persist({ log: this.state.log.filter(e => e.id !== id) }); this.toast('Entry deleted'); },
  duplicateById(id) { const p = this.state.plans.find(x => x.id === id); if (p) this.duplicate(p); },
  openExById(id) { this.openExercise(id); },
  watchById(id) { const ex = this.findEx(id); if (ex) this.watch(ex); },
  watchName(name) { this.watch({ name: name }); },
  toggleTrend(id) { this.set({ openTrend: this.state.openTrend === id ? null : id }); },
  addTrendById(id) { const t = this.state.trends.find(x => x.id === id); if (t) this.addTrend(t); },
  followTrendById(id) { const t = this.state.trends.find(x => x.id === id); if (t) this.followTrend(t); },
  openClientById(id) { this.set({ screen: 'client', clientId: id }); },
  acceptChallenge() { if (this.state.trends.length) this.addTrend(this.state.trends[0]); },

  // ---------------------------------------------------------------------------
  // 7. IMPORT — real CSV/TXT parsing, honest fallback for photo/PDF
  // ---------------------------------------------------------------------------
  parsePlanText(text, filename) {
    const lines = text.replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean).slice(0, 400);
    const sections = [];
    let current = { title: 'Workout', exercises: [] };
    const pushSection = () => { if (current.exercises.length) sections.push(current); };
    const headerRe = /^[A-Z][A-Z0-9 &/'-]{2,28}:?$|:$/;
    const wxrRe = /(\d+)\s*[x×]\s*([\w.-]+)/i;
    const weightRe = /(\d+(?:\.\d+)?)\s*(kg|kgs|lb|lbs)\b/i;
    const distRe = /(\d+(?:\.\d+)?)\s*m\b/i;
    const timeRe = /(\d+(?:\.\d+)?)\s*(s|sec|secs|seconds|min|mins|minutes)\b/i;
    lines.forEach((raw) => {
      const cells = raw.split(',').map(c => c.trim()).filter(Boolean);
      if (cells.length === 1 && headerRe.test(cells[0]) && !wxrRe.test(cells[0]) && !weightRe.test(cells[0])) {
        pushSection();
        current = { title: cells[0].replace(/:$/, '').slice(0, 40), exercises: [] };
        return;
      }
      if (cells.length >= 2) {
        const [name, a, b, c] = cells;
        const ex = { id: uid('i'), name: name.slice(0, 90), sets: null, reps: null, distance: null, weight: null, isWeighted: false, isTimed: false };
        [a, b, c].filter(Boolean).forEach((field) => {
          const w = field.match(weightRe); const d = field.match(distRe); const t = field.match(timeRe); const x = field.match(wxrRe);
          if (w) { ex.weight = field; ex.isWeighted = true; }
          else if (d) { ex.distance = field; }
          else if (t) { ex.isTimed = true; if (!ex.reps) ex.reps = field; }
          else if (x) { ex.sets = x[1]; ex.reps = x[2]; }
          else if (!ex.reps) ex.reps = field;
        });
        current.exercises.push(ex);
        return;
      }
      const line = cells[0] || raw;
      const w = line.match(weightRe); const d = line.match(distRe); const t = line.match(timeRe); const x = line.match(wxrRe);
      const ex = { id: uid('i'), name: line.slice(0, 90), sets: null, reps: null, distance: null, weight: null, isWeighted: false, isTimed: false };
      if (x) { ex.sets = x[1]; ex.reps = x[2]; }
      if (w) { ex.weight = w[1] + w[2].slice(0, 2); ex.isWeighted = true; }
      if (d) ex.distance = d[0];
      if (t && !w) ex.isTimed = true;
      current.exercises.push(ex);
    });
    pushSection();
    return {
      id: uid('p'), day: this.state.plans.length + 1,
      title: (filename || 'Imported').replace(/\.[a-z0-9]+$/i, '').slice(0, 24) || 'Imported',
      sections: sections.filter(s => s.exercises.length)
    };
  },
  handleFile(file) {
    if (!file) return;
    this.set({ busy: true, busyFile: file.name, error: '', sheet: false });
    const isText = file.type.indexOf('image/') !== 0 && file.type !== 'application/pdf' &&
      !/\.pdf$/i.test(file.name);
    if (!isText) {
      setTimeout(() => {
        this.set({
          busy: false, sheet: true,
          error: "Photos and PDFs need OCR this build doesn't have wired up. Try a CSV or plain-text export of the plan instead, or build it by hand."
        });
      }, 500);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        try {
          const plan = this.parsePlanText(String(reader.result), file.name);
          if (!plan.sections.length) throw new Error('empty');
          const plans = this.state.plans.concat([plan]);
          this.persist({ plans: plans, busy: false, screen: 'plan', planId: plan.id });
          this.toast('Added ' + plan.sections.reduce((a, s) => a + s.exercises.length, 0) + ' exercises from ' + file.name);
        } catch (e) {
          this.set({ busy: false, sheet: true, error: "Couldn't find any exercise lines in that file. Try one line per exercise, or build it by hand." });
        }
      }, 500);
    };
    reader.onerror = () => this.set({ busy: false, sheet: true, error: "Couldn't read that file. Try again, or build the plan by hand." });
    reader.readAsText(file);
  },
  normaliseTrend(w, stamp, i) {
    return {
      name: w.name.slice(0, 70), sets: w.sets || null, reps: w.reps || null, distance: null, weight: null,
      isWeighted: !!w.isWeighted, isTimed: !!w.isTimed && !w.isWeighted
    };
  },
  duplicate(plan) {
    const stamp = Date.now();
    const copy = {
      id: 'p' + stamp, day: this.state.plans.length + 1, title: plan.title + ' copy',
      sections: plan.sections.map((s, si) => ({
        title: s.title,
        exercises: s.exercises.map((e, ei) => Object.assign({}, e, { id: 'c' + stamp + '_' + si + '_' + ei }))
      }))
    };
    this.persist({ plans: this.state.plans.concat([copy]), screen: 'plan', planId: copy.id, sheet: false });
    this.toast('Duplicated — edit as you go');
  },
  saveDraft() {
    const d = this.state.draft || { title: '', rows: [] };
    const rows = d.rows.filter(r => r.name.trim());
    if (!rows.length) { this.toast('Add at least one exercise'); return; }
    const stamp = Date.now();
    const plan = {
      id: 'p' + stamp, day: this.state.plans.length + 1,
      title: (d.title.trim() || 'New plan').slice(0, 24),
      sections: [{ title: 'Workout', exercises: rows.map((r, i) => ({
        id: 'm' + stamp + '_' + i, name: r.name.trim(),
        sets: r.sets || null, reps: r.reps || null, distance: null,
        weight: null, isWeighted: !!r.weighted
      })) }]
    };
    this.persist({ plans: this.state.plans.concat([plan]), screen: 'plan', planId: plan.id, draft: null });
    this.toast('Plan saved');
  },
  setDraft(i, key, value) {
    const rows = this.state.draft.rows.map((r, ri) => ri === i ? Object.assign({}, r, { [key]: value }) : r);
    this.set({ draft: Object.assign({}, this.state.draft, { rows: rows }) });
  },
  addDraftRow() { this.set({ draft: Object.assign({}, this.state.draft, { rows: this.state.draft.rows.concat([{ name: '', sets: '', reps: '', weighted: true }]) }) }); },
  removeDraftRow(i) { this.set({ draft: Object.assign({}, this.state.draft, { rows: this.state.draft.rows.filter((_, ri) => ri !== i) }) }); },

  // ---------------------------------------------------------------------------
  // 8. TRENDING — curated on-device library, rotated weekly
  // ---------------------------------------------------------------------------
  weekOfYear(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  },
  async fetchSignals() {
    const results = await Promise.all(TREND_SOURCES.map(async (src) => {
      try {
        const res = await fetch(src.url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('status ' + res.status);
        const json = await res.json();
        const posts = ((json.data && json.data.children) || [])
          .map(c => c.data)
          .filter(d => d && d.title && !d.stickied)
          .slice(0, 12)
          .map(d => ({ source: src.id, title: String(d.title).slice(0, 140) }));
        return posts.length ? { id: src.id, posts: posts } : null;
      } catch (e) { return null; }
    }));
    const live = results.filter(Boolean);
    return { sources: live.map(l => l.id), posts: live.reduce((a, l) => a.concat(l.posts), []) };
  },
  async loadTrends(force) {
    if (!force && this.state.trends.length) return;
    if (this.state.trendsBusy) return;
    this.set({ trendsBusy: true });
    const seed = force ? Date.now() : this.weekOfYear(new Date()) + new Date().getFullYear() * 100;
    const pool = TRENDING_LIBRARY.slice();
    let s = seed;
    const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const picked = pool.slice(0, 5);
    let signals = { sources: [], posts: [] };
    try { signals = await this.fetchSignals(); } catch (e) {}
    const stamp = Date.now();
    const list = picked.map((w, i) => {
      const post = signals.posts[i] || null;
      return {
        id: 't' + stamp + '_' + i, title: w.title, blurb: w.blurb, tag: w.tag, level: w.level,
        minutes: w.minutes + ' min', source: post ? post.source : null, signal: post ? post.title : null,
        exercises: w.exercises.map(e => this.normaliseTrend(e))
      };
    });
    const at = new Date().toISOString();
    try { localStorage.setItem(LS.trends, JSON.stringify({ at: at, list: list, sources: signals.sources, posts: signals.posts.length })); } catch (e) {}
    this.set({ trends: list, trendsAt: at, trendsBusy: false, trendSources: signals.sources, trendPosts: signals.posts.length });
  },
  addTrend(t) {
    const stamp = Date.now();
    const plan = {
      id: 'p' + stamp, day: this.state.plans.length + 1, title: t.title.slice(0, 24),
      sections: [{ title: t.tag, exercises: t.exercises.map((e, i) => Object.assign({}, e, { id: 'tr' + stamp + '_' + i })) }]
    };
    this.persist({ plans: this.state.plans.concat([plan]), screen: 'plan', planId: plan.id, openTrend: null });
    this.toast('Added to your plans');
  },
  followTrend(t) {
    const stamp = Date.now();
    const plan = {
      id: 'p' + stamp, day: this.state.plans.length + 1, title: t.title.slice(0, 24),
      sections: [{ title: t.tag, exercises: t.exercises.map((e, i) => Object.assign({}, e, { id: 'tr' + stamp + '_' + i })) }]
    };
    this.persist({ plans: this.state.plans.concat([plan]), openTrend: null });
    this.startSession(plan.id);
  },

  // ---------------------------------------------------------------------------
  // 9. PLAY — points, weeks, badges
  // ---------------------------------------------------------------------------
  weekKey(d) {
    const dt = new Date(d);
    const day = (dt.getDay() + 6) % 7;
    dt.setHours(0, 0, 0, 0); dt.setDate(dt.getDate() - day);
    return dt.toISOString().slice(0, 10);
  },
  weekLabel(key) {
    const a = new Date(key), b = new Date(key);
    b.setDate(b.getDate() + 6);
    const f = (x) => x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return f(a) + ' – ' + f(b);
  },
  isPR(entry) {
    const before = this.state.log.filter(x => x.exerciseId === entry.exerciseId && new Date(x.date) < new Date(entry.date));
    if (!before.length) return true;
    const vals = before.map(x => x.value);
    return entry.kind === 'time' ? entry.value < Math.min.apply(null, vals) : entry.value > Math.max.apply(null, vals);
  },
  weekStats(key) {
    const sets = this.state.log.filter(e => this.weekKey(e.date) === key);
    const events = this.state.events.filter(e => this.weekKey(e.date) === key);
    const prs = sets.filter(e => this.isPR(e)).length;
    const ghosts = events.filter(e => e.type === 'ghost');
    const spins = events.filter(e => e.type === 'spin');
    const done = events.filter(e => e.type === 'session');
    const allDays = new Set(sets.map(e => new Date(e.date).toDateString()));
    done.forEach(e => allDays.add(new Date(e.date).toDateString()));
    const tasks = [
      { label: 'Log five sets', done: sets.length >= 5, progress: Math.min(sets.length, 5) + '/5' },
      { label: 'Set a personal best', done: prs >= 1, progress: prs + '/1' },
      { label: 'Train on three days', done: allDays.size >= 3, progress: Math.min(allDays.size, 3) + '/3' },
      { label: 'Race your ghost', done: ghosts.length >= 1, progress: Math.min(ghosts.length, 1) + '/1' },
      { label: 'Spin a finisher', done: spins.length >= 1, progress: Math.min(spins.length, 1) + '/1' }
    ];
    const points = sets.length * 10 + prs * 25 + tasks.filter(t => t.done).length * 20 +
      ghosts.length * 10 + ghosts.filter(g => g.win).length * 30 + spins.length * 5 + done.length * 15;
    return { key: key, sets: sets.length, prs: prs, days: allDays.size, tasks: tasks, points: points, ghostWins: ghosts.filter(g => g.win).length };
  },
  allWeeks() {
    const keys = {};
    this.state.log.forEach(e => { keys[this.weekKey(e.date)] = 1; });
    this.state.events.forEach(e => { keys[this.weekKey(e.date)] = 1; });
    keys[this.weekKey(new Date())] = 1;
    return Object.keys(keys).sort().reverse().map(k => this.weekStats(k));
  },
  totalPoints() { return this.allWeeks().reduce((a, w) => a + w.points, 0); },
  sessionDates() {
    const set = new Set(this.state.log.map(e => new Date(e.date).toDateString()));
    this.state.events.filter(e => e.type === 'session').forEach(e => set.add(new Date(e.date).toDateString()));
    return set;
  },
  streakDays() {
    const days = this.sessionDates();
    let n = 0;
    const d = new Date();
    if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
    while (days.has(d.toDateString())) { n++; d.setDate(d.getDate() - 1); }
    return n;
  },
  badges() {
    const total = this.totalPoints();
    const prs = this.state.log.filter(e => this.isPR(e)).length;
    const streak = this.streakDays();
    const ghostWins = this.state.events.filter(e => e.type === 'ghost' && e.win).length;
    const spins = this.state.events.filter(e => e.type === 'spin').length;
    return [
      { label: 'First log', earned: this.state.log.length >= 1 },
      { label: 'Five PBs', earned: prs >= 5 },
      { label: 'Three-day streak', earned: streak >= 3 },
      { label: 'Ghost hunter', earned: ghostWins >= 1 },
      { label: 'Wheel spinner', earned: spins >= 3 },
      { label: 'Thousand club', earned: total >= 1000 }
    ];
  },
  addEvent(ev) {
    const events = this.state.events.concat([Object.assign({ id: uid('v'), date: new Date().toISOString() }, ev)]);
    this.set({ events: events });
    try { localStorage.setItem(LS.events, JSON.stringify(this.state.events)); } catch (e) {}
  },

  // — ghost race —
  ghostTargets() {
    return this.allExercises().map(e => ({ ex: e, st: this.statsFor(e.id) })).filter(x => x.st && x.st.kind === 'time');
  },
  openGhost() {
    const t = this.ghostTargets();
    this.set({ overlay: 'ghost', ghost: t.length ? { exId: t[0].ex.id, target: t[0].st.best, elapsed: 0, running: false, result: null } : null });
  },
  pickGhost(exId, target) { this.set({ ghost: { exId: exId, target: target, elapsed: 0, running: false, result: null } }); },
  startGhost() {
    clearInterval(this._timers.ghost);
    const t0 = Date.now();
    this.set({ ghost: Object.assign({}, this.state.ghost, { running: true, elapsed: 0, result: null }) });
    this._timers.ghost = setInterval(() => {
      if (!this.state.ghost || !this.state.ghost.running) return;
      this.set({ ghost: Object.assign({}, this.state.ghost, { elapsed: (Date.now() - t0) / 1000 }) });
    }, 60);
  },
  stopGhost() {
    clearInterval(this._timers.ghost);
    const g = this.state.ghost;
    if (!g || !g.running) return;
    const value = Math.round(g.elapsed * 100) / 100;
    const win = value < g.target;
    const log = this.state.log.concat([{ id: uid('e'), exerciseId: g.exId, kind: 'time', value: value, date: new Date().toISOString() }]);
    this.persist({ log: log });
    this.addEvent({ type: 'ghost', win: win, exId: g.exId, value: value });
    this.set({ ghost: Object.assign({}, g, { running: false, result: { value: value, win: win, gap: Math.round(Math.abs(value - g.target) * 100) / 100 } }) });
  },
  closeOverlay() { clearInterval(this._timers.ghost); clearTimeout(this._timers.wheel); this.set({ overlay: null, ghost: null, wheel: null }); },

  // — wheel —
  openWheel() { this.set({ overlay: 'wheel', wheel: { index: 0, spinning: false, landed: null } }); },
  spinWheel() {
    clearTimeout(this._timers.wheel);
    const n = FINISHERS.length;
    const total = n * 3 + Math.floor(Math.random() * n);
    this.set({ wheel: { index: 0, spinning: true, landed: null } });
    let i = 0;
    const tick = () => {
      i++;
      const idx = i % n;
      if (i >= total) {
        this.set({ wheel: { index: idx, spinning: false, landed: FINISHERS[idx] } });
        this.addEvent({ type: 'spin', finisher: FINISHERS[idx].name });
        return;
      }
      this.set({ wheel: { index: idx, spinning: true, landed: null } });
      const left = total - i;
      this._timers.wheel = setTimeout(tick, left > 6 ? 55 : 55 + (7 - left) * 65);
    };
    this._timers.wheel = setTimeout(tick, 55);
  },

  // — editing —
  mapPlans(fn) { this.persist({ plans: this.state.plans.map(fn).filter(Boolean) }); },
  renameExercise(exId, name) {
    if (!name.trim()) return;
    this.mapPlans(p => ({ id: p.id, day: p.day, title: p.title, sections: p.sections.map(sec => ({
      title: sec.title, exercises: sec.exercises.map(e => e.id === exId ? Object.assign({}, e, { name: name.trim().slice(0, 90) }) : e)
    })) }));
    this.set({ editName: null });
    this.toast('Renamed');
  },
  deleteExercise(exId) {
    const planId = (this.findEx(exId) || {}).planId;
    this.mapPlans(p => ({ id: p.id, day: p.day, title: p.title, sections: p.sections
      .map(sec => ({ title: sec.title, exercises: sec.exercises.filter(e => e.id !== exId) }))
      .filter(sec => sec.exercises.length) }));
    this.persist({ log: this.state.log.filter(e => e.exerciseId !== exId), screen: 'plan', planId: planId });
    this.toast('Exercise removed');
  },
  deletePlan(planId) {
    const ids = [];
    const p = this.state.plans.find(x => x.id === planId);
    if (p) p.sections.forEach(sec => sec.exercises.forEach(e => ids.push(e.id)));
    this.persist({
      plans: this.state.plans.filter(x => x.id !== planId),
      log: this.state.log.filter(e => ids.indexOf(e.exerciseId) === -1),
      screen: 'today', planId: null, confirmPlan: false
    });
    this.toast('Plan deleted');
  },
  moveExercise(exId, dir) {
    this.mapPlans(p => ({ id: p.id, day: p.day, title: p.title, sections: p.sections.map(sec => {
      const i = sec.exercises.findIndex(e => e.id === exId);
      if (i < 0) return sec;
      const j = i + dir;
      if (j < 0 || j >= sec.exercises.length) return sec;
      const list = sec.exercises.slice();
      const tmp = list[i]; list[i] = list[j]; list[j] = tmp;
      return { title: sec.title, exercises: list };
    }) }));
  },

  // — stopwatch —
  startWatch() {
    clearInterval(this._timers.sw);
    const base = this.state.watch && this.state.watch.paused ? this.state.watch.elapsed : 0;
    const t0 = Date.now() - base * 1000;
    this.set({ watch: { elapsed: base, running: true, paused: false } });
    this._timers.sw = setInterval(() => { this.set({ watch: { elapsed: (Date.now() - t0) / 1000, running: true, paused: false } }); }, 60);
  },
  stopWatch() {
    clearInterval(this._timers.sw);
    const w = this.state.watch;
    if (!w || !w.running) return;
    const v = Math.round(w.elapsed * 100) / 100;
    this.set({ watch: { elapsed: v, running: false, paused: true }, input: String(v) });
  },
  resetWatch() { clearInterval(this._timers.sw); this.set({ watch: null }); },
  saveWatch() {
    const ex = this.findEx(this.state.exId);
    const w = this.state.watch;
    if (!ex || !w || !w.elapsed) return;
    clearInterval(this._timers.sw);
    this.state.input = String(Math.round(w.elapsed * 100) / 100);
    this.saveWeight();
    this.set({ watch: null });
  },

  // — sound —
  audio() {
    if (this.state.muted) return null;
    if (!this._ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this._ac = new AC();
    }
    if (this._ac.state === 'suspended') this._ac.resume();
    return this._ac;
  },
  tone(freq, dur, delay, type, gain) {
    const ac = this.audio();
    if (!ac) return;
    const t = ac.currentTime + (delay || 0);
    const osc = ac.createOscillator(); const g = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain || 0.3, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(ac.destination);
    osc.start(t); osc.stop(t + dur + 0.05);
  },
  bell(kind) {
    if (kind === 'start') { this.tone(880, 0.7, 0, 'triangle', 0.34); this.tone(1320, 0.7, 0.02, 'sine', 0.16); }
    else if (kind === 'rest') { this.tone(520, 0.28, 0); this.tone(390, 0.36, 0.22); }
    else if (kind === 'done') { [0, 0.32, 0.64].forEach(d => this.tone(880, 0.6, d, 'triangle', 0.32)); }
    else if (kind === 'warn') { this.tone(700, 0.12, 0, 'square', 0.18); }
    else this.tone(660, 0.25, 0);
  },
  toggleMute() {
    const muted = !this.state.muted;
    this.set({ muted: muted });
    try { localStorage.setItem(LS.muted, muted ? '1' : '0'); } catch (e) {}
    if (!muted) this.bell('tick');
  },

  // — round timer —
  openRounds() { this.set({ overlay: 'rounds', rounds: { total: 5, work: 180, rest: 60, idx: 0, phase: 'ready', left: 180, running: false } }); },
  tickRounds() {
    const r = this.state.rounds;
    if (!r || !r.running) return;
    if (r.left > 1) {
      if (r.left <= 4) this.bell('warn');
      this.set({ rounds: Object.assign({}, r, { left: r.left - 1 }) });
      return;
    }
    if (r.phase === 'work') {
      if (r.idx + 1 >= r.total) {
        clearInterval(this._timers.rounds);
        this.bell('done');
        this.addEvent({ type: 'rounds', total: r.total, work: r.work, rest: r.rest });
        this.set({ rounds: Object.assign({}, r, { phase: 'done', running: false, left: 0, idx: r.total }) });
        this.toast(r.total + ' rounds done · +15 pts');
        return;
      }
      this.bell('rest');
      this.set({ rounds: Object.assign({}, r, { phase: 'rest', left: r.rest }) });
      return;
    }
    this.bell('start');
    this.set({ rounds: Object.assign({}, r, { phase: 'work', left: r.work, idx: r.idx + 1 }) });
  },
  startRounds() {
    clearInterval(this._timers.rounds);
    const r = this.state.rounds;
    this.bell('start');
    this.set({ rounds: Object.assign({}, r, { running: true, phase: r.phase === 'ready' || r.phase === 'done' ? 'work' : r.phase, idx: r.phase === 'done' ? 0 : r.idx, left: r.phase === 'ready' || r.phase === 'done' ? r.work : r.left }) });
    this._timers.rounds = setInterval(() => this.tickRounds(), 1000);
  },
  pauseRounds() { clearInterval(this._timers.rounds); this.set({ rounds: Object.assign({}, this.state.rounds, { running: false }) }); },
  closeRounds() { clearInterval(this._timers.rounds); this.set({ overlay: null, rounds: null }); },
  setRounds(key, value) {
    clearInterval(this._timers.rounds);
    const r = Object.assign({}, this.state.rounds, { [key]: value, running: false, phase: 'ready', idx: 0 });
    r.left = r.work;
    this.set({ rounds: r });
  },

  // — rest timer —
  startRest(seconds) {
    clearInterval(this._timers.rest);
    this.bell('tick');
    const end = Date.now() + seconds * 1000;
    this.set({ rest: { left: seconds, total: seconds } });
    this._timers.rest = setInterval(() => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      if (left <= 0) { clearInterval(this._timers.rest); this.bell('start'); this.set({ rest: { left: 0, total: seconds } }); return; }
      if (left <= 3 && left !== (this.state.rest || {}).left) this.bell('warn');
      this.set({ rest: { left: left, total: seconds } });
    }, 250);
  },
  stopRest() { clearInterval(this._timers.rest); this.set({ rest: null }); },

  // — session completion —
  completeSession(planId) {
    const p = this.state.plans.find(x => x.id === planId);
    this.addEvent({ type: 'session', planId: planId, title: p ? p.title : '' });
    this.toast('Session marked done · +15 pts');
  },

  // — bodyweight —
  logBodyweight() {
    const v = parseFloat(this.state.bwInput);
    if (isNaN(v) || v <= 0) { this.toast('Enter a weight first'); return; }
    this.addEvent({ type: 'bodyweight', value: this.toKg(v) });
    const account = Object.assign({}, this.state.account, { bodyweight: this.toKg(v) });
    this.persistAccount(account, true);
    this.set({ account: account, user: account, bwInput: '' });
    this.toast('Bodyweight logged');
  },
  bodyweightEntries() { return this.state.events.filter(e => e.type === 'bodyweight').sort((a, b) => new Date(b.date) - new Date(a.date)); },

  // ---------------------------------------------------------------------------
  // 10. REPORTS — derived from real data, with a templated read-out
  // ---------------------------------------------------------------------------
  buildReport(scope) {
    const cutoff = scope === 'day' ? 1 : 7;
    const since = Date.now() - cutoff * 86400000;
    const win = this.state.log.filter(e => new Date(e.date).getTime() >= since);
    const byEx = {};
    win.forEach(e => { (byEx[e.exerciseId] = byEx[e.exerciseId] || []).push(e); });
    const strong = [], weak = [];
    Object.keys(byEx).forEach(id => {
      const ex = this.findEx(id);
      if (!ex) return;
      const all = this.entriesFor(id);
      const st = this.statsFor(id);
      const latest = all[0];
      const prior = all.filter(e => new Date(e.date).getTime() < since);
      const kind = st.kind;
      const f = (v) => this.fmtVal(kind, v);
      if (!prior.length) { strong.push({ name: ex.name, line: 'Baseline set at ' + f(latest.value) }); return; }
      const priorBest = kind === 'time' ? Math.min.apply(null, prior.map(e => e.value)) : Math.max.apply(null, prior.map(e => e.value));
      const beat = kind === 'time' ? latest.value < priorBest : latest.value > priorBest;
      const gap = Math.abs(latest.value - priorBest);
      if (beat) strong.push({ name: ex.name, line: f(latest.value) + ' — past your previous best of ' + f(priorBest) });
      else if (latest.value === priorBest) strong.push({ name: ex.name, line: 'Held ' + f(latest.value) + ', matching your best' });
      else weak.push({ name: ex.name, line: f(latest.value) + ' — ' + f(gap) + ' off your best of ' + f(priorBest) });
    });
    const stale = [];
    this.allExercises().forEach(e => {
      const h = this.entriesFor(e.id);
      if (!h.length || !this.metricOf(e)) return;
      const days = Math.floor((Date.now() - new Date(h[0].date).getTime()) / 86400000);
      if (days >= 14) stale.push({ name: e.name, line: 'Not touched in ' + days + ' days' });
    });
    const days = new Set(win.map(e => new Date(e.date).toDateString())).size;
    return { scope: scope, sets: win.length, days: days, strong: strong.slice(0, 6), weak: weak.slice(0, 6), stale: stale.slice(0, 4) };
  },
  reportParagraph(data) {
    if (!data.sets) return '';
    const scope = data.scope === 'day' ? 'today' : 'this week';
    const parts = [];
    parts.push('You put in ' + data.sets + ' set' + (data.sets === 1 ? '' : 's') + ' across ' + data.days + ' day' + (data.days === 1 ? '' : 's') + ' ' + scope + '.');
    const beaten = data.strong.filter(x => !/^Baseline/.test(x.line));
    const baseline = data.strong.filter(x => /^Baseline/.test(x.line));
    if (beaten.length) parts.push(beaten.length === 1 ? beaten[0].name + ' moved forward — ' + beaten[0].line.toLowerCase() + '.' : beaten.length + ' lifts moved forward, ' + beaten.slice(0, 2).map(s => s.name).join(' and ') + ' among them.');
    if (baseline.length) parts.push(baseline.length === 1 ? baseline[0].name + ' got its first entry, at ' + baseline[0].line.replace('Baseline set at ', '') + '.' : baseline.length + ' exercises got a first entry, ' + baseline.slice(0, 2).map(s => s.name).join(' and ') + ' among them.');
    if (data.weak.length) parts.push(data.weak.length === 1 ? data.weak[0].name + ' came in under your best — ' + data.weak[0].line.toLowerCase() + '.' : data.weak.slice(0, 2).map(s => s.name).join(' and ') + ' came in under your best this time.');
    if (data.stale.length) parts.push(data.stale.slice(0, 2).map(s => s.name).join(' and ') + (data.stale.length > 1 ? ' have' : ' has') + ' gone quiet — worth a session soon.');
    if (!data.strong.length && !data.weak.length) parts.push('Log another set on any of these and the comparison starts.');
    return parts.join(' ');
  },
  openReport(scope) {
    const data = this.buildReport(scope);
    this.set({ overlay: 'report', report: data, reportText: this.reportParagraph(data) });
  },
  closeReport() { this.set({ overlay: null, report: null, reportText: '' }); },

  // ---------------------------------------------------------------------------
  // 11. COACH ROSTER
  // ---------------------------------------------------------------------------
  clientEntries(c) {
    return c.sets.map((s, i) => ({ id: c.id + '_' + i, name: s[0], kind: s[1], value: s[2], date: new Date(Date.now() - s[3] * 86400000).toISOString(), days: s[3] }))
      .sort((a, b) => a.days - b.days);
  },
  clientStats(c) {
    const all = this.clientEntries(c);
    const last = all[0];
    const quiet = last ? last.days : 99;
    const days = new Set(all.filter(e => e.days <= 7).map(e => e.days)).size;
    const byName = {};
    all.forEach(e => { (byName[e.name] = byName[e.name] || []).push(e); });
    const bests = Object.keys(byName).map(name => {
      const list = byName[name];
      const kind = list[0].kind;
      const vals = list.map(e => e.value);
      const best = kind === 'time' ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
      const latest = list[0].value;
      const prior = list.slice(1);
      const priorBest = prior.length ? (kind === 'time' ? Math.min.apply(null, prior.map(e => e.value)) : Math.max.apply(null, prior.map(e => e.value))) : null;
      const dir = priorBest === null ? 0 : (kind === 'time' ? (latest < priorBest ? 1 : latest > priorBest ? -1 : 0) : (latest > priorBest ? 1 : latest < priorBest ? -1 : 0));
      return { name: name, kind: kind, best: best, latest: latest, dir: dir, count: list.length };
    });
    const prs = bests.filter(b => b.dir > 0).length;
    const backwards = bests.filter(b => b.dir < 0);
    const flags = [];
    if (quiet >= 7) flags.push('No session in ' + quiet + ' days');
    else if (quiet >= 5) flags.push('Quiet for ' + quiet + ' days');
    if (backwards.length) flags.push(backwards[0].name + ' going backwards');
    return { all: all, last: last, quiet: quiet, days: days, bests: bests, prs: prs, flags: flags, needsAttention: flags.length > 0 };
  },
  assignPlan(clientId, planId) {
    const p = this.state.plans.find(x => x.id === planId);
    const clients = this.state.clients.map(c => c.id === clientId ? Object.assign({}, c, { plan: p ? 'Day ' + p.day + ' — ' + p.title : c.plan, assigned: true }) : c);
    this.set({ clients: clients, assignFor: null });
    try { localStorage.setItem(LS.clients, JSON.stringify(this.state.clients)); } catch (e) {}
    this.toast('Plan assigned');
  },

  // ---------------------------------------------------------------------------
  // 12. EXPORT
  // ---------------------------------------------------------------------------
  exportData() {
    const blob = new Blob([JSON.stringify({
      exported: new Date().toISOString(), account: this.state.account,
      plans: this.state.plans, log: this.state.log, events: this.state.events
    }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fittrack-history.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    this.toast('History exported');
  },

  // ---------------------------------------------------------------------------
  // 13. FOLLOW-ALONG SESSION
  // ---------------------------------------------------------------------------
  sessionList(planId) {
    const p = this.state.plans.find(x => x.id === planId);
    if (!p) return [];
    const out = [];
    p.sections.forEach(sec => sec.exercises.forEach(e => out.push(Object.assign({}, e, { section: sec.title }))));
    return out;
  },
  startSession(planId) { this.set({ overlay: 'session', session: { planId: planId, idx: 0, logged: 0, skipped: 0, done: false }, input: '' }); },
  closeSession() { this.set({ overlay: null, session: null, input: '' }); },
  sessionAdvance(logged) {
    const s = this.state.session;
    const list = this.sessionList(s.planId);
    const next = s.idx + 1;
    this.set({
      input: '',
      session: Object.assign({}, s, { idx: next, done: next >= list.length, logged: s.logged + (logged ? 1 : 0), skipped: s.skipped + (logged ? 0 : 1) })
    });
  },
  sessionLog() {
    const s = this.state.session;
    const ex = this.sessionList(s.planId)[s.idx];
    const kind = this.metricOf(ex);
    const v = parseFloat(this.state.input);
    if (!kind || isNaN(v) || v <= 0) { this.sessionAdvance(false); return; }
    const value = kind === 'time' ? Math.round(v * 100) / 100 : kind === 'reps' ? Math.round(v * 10) / 10 : this.toKg(v);
    this.state.log = this.state.log.concat([{ id: uid('e'), exerciseId: ex.id, kind: kind, value: value, date: new Date().toISOString() }]);
    try { localStorage.setItem(LS.log, JSON.stringify(this.state.log)); } catch (e) {}
    this.sessionAdvance(true);
  },

  recap() {
    const week = this.state.log.filter(e => Date.now() - new Date(e.date).getTime() < 7 * 86400000);
    const days = new Set(week.map(e => new Date(e.date).toDateString()));
    let prs = 0;
    week.forEach(e => { if (this.isPR(e)) prs++; });
    const loads = week.filter(e => e.kind === 'load').map(e => e.value);
    const vol = loads.length ? Math.max.apply(null, loads) : 0;
    const prNames = [];
    week.forEach(e => {
      if (!this.isPR(e)) return;
      const ex = this.findEx(e.exerciseId);
      if (ex && prNames.indexOf(ex.name) === -1) prNames.push(ex.name);
    });
    return { sessions: days.size, prs: prs, sets: week.length, volume: vol, prNames: prNames };
  }
};

// -----------------------------------------------------------------------------
// 14. RENDER ENGINE
// -----------------------------------------------------------------------------
Object.assign(App, {
  render() {
    const mount = document.getElementById('app');
    const active = document.activeElement;
    let focusInfo = null;
    if (active && active.id && mount.contains(active)) {
      focusInfo = { id: active.id, start: active.selectionStart, end: active.selectionEnd };
    }
    mount.innerHTML = '<div id="app-shell">' + this.renderScreen() + this.renderTabbar() + this.renderSheet() + this.renderOverlays() + '</div>';
    if (this.state.overlay === 'record' && this.state.record && !this.state.record.done) this.attachPreview();
    if (focusInfo) {
      const el = document.getElementById(focusInfo.id);
      if (el) {
        el.focus();
        if (typeof focusInfo.start === 'number' && el.setSelectionRange) {
          try { el.setSelectionRange(focusInfo.start, focusInfo.end); } catch (e) {}
        }
      }
    }
  },
  renderScreen() {
    const s = this.state;
    switch (s.screen) {
      case 'welcome': return this.renderWelcome();
      case 'auth': return this.renderAuth();
      case 'onboard': return this.renderOnboard();
      case 'plan': return this.state.plans.find(p => p.id === s.planId) ? this.renderPlan() : this.renderToday();
      case 'exercise': return this.findEx(s.exId) ? this.renderExercise() : this.renderToday();
      case 'builder': return s.draft ? this.renderBuilder() : this.renderToday();
      case 'play': return this.renderPlay();
      case 'trending': return this.renderTrending();
      case 'progress': return this.renderProgress();
      case 'clients': return this.renderClients();
      case 'client': return this.state.clients.find(c => c.id === s.clientId) ? this.renderClient() : this.renderClients();
      default: return this.renderToday();
    }
  },
  renderTabbar() {
    const s = this.state;
    if (!s.user || s.screen === 'onboard') return '';
    const coach = s.user.role === 'coach';
    const tab = (id, on, icon, label, action) => '<button class="tab' + (on ? ' on' : '') + '" onclick="' + (action || ('App.go(' + js(id) + ')')) + '">' + icon + '<span>' + esc(label) + '</span></button>';
    return '<div class="tabbar">' +
      tab('today', s.screen === 'today', ICONS.home, 'Today') +
      tab(coach ? 'clients' : 'play', s.screen === 'play' || s.screen === 'clients' || s.screen === 'client', coach ? ICONS.coach : ICONS.clock, coach ? 'Clients' : 'Play') +
      tab('trending', s.screen === 'trending', ICONS.trend, 'Trending', 'App.goTrending()') +
      tab('progress', s.screen === 'progress', ICONS.chartUp, 'Progress') +
      '</div>';
  },
  renderSheet() {
    const s = this.state;
    if (!s.sheet) return '';
    const dupOptions = s.plans.slice(0, 4).map(p =>
      '<button class="sheet-opt-dup" onclick="App.duplicateById(' + js(p.id) + ')">' + ICONS.dup +
      '<span>Duplicate “Day ' + esc(p.day) + ' — ' + esc(p.title) + '”</span></button>').join('');
    return '<div class="sheet-backdrop">' +
      '<div class="sheet-scrim" onclick="App.set({sheet:false,error:\'\'})"></div>' +
      '<div class="sheet">' +
      '<div class="sheet-head"><div class="t">Add a plan</div><button class="close-btn" onclick="App.set({sheet:false,error:\'\'})">' + ICONS.x + '</button></div>' +
      '<button class="sheet-opt" onclick="document.getElementById(\'photo-input\').click()">' + ICONS.photo + '<span><span class="t">Photo of a plan</span><span class="s">Handwritten or printed — read into exercises</span></span></button>' +
      '<button class="sheet-opt" onclick="document.getElementById(\'file-input\').click()">' + ICONS.file + '<span><span class="t">PDF or spreadsheet</span><span class="s">PDF, CSV or text export from your coach</span></span></button>' +
      '<button class="sheet-opt" onclick="App.set({screen:\'builder\',sheet:false,draft:{title:\'\',rows:[{name:\'\',sets:\'\',reps:\'\',weighted:true}]}})">' + ICONS.hand + '<span><span class="t">Build by hand</span><span class="s">Add exercises one at a time</span></span></button>' +
      dupOptions +
      (s.error ? '<div class="sheet-error">' + esc(s.error) + '</div>' : '') +
      '</div></div>';
  },
  renderOverlays() {
    const s = this.state;
    let out = '';
    if (s.overlay === 'session' && s.session) out += this.renderSession();
    if (s.overlay === 'rounds' && s.rounds) out += this.renderRounds();
    if (s.overlay === 'ghost') out += this.renderGhost();
    if (s.overlay === 'wheel') out += this.renderWheel();
    if (s.overlay === 'report' && s.report) out += this.renderReport();
    if (s.overlay === 'record' && s.record) out += this.renderRecord();
    if (s.busy) out += this.renderBusy();
    if (s.rest) out += this.renderRest();
    if (s.pb) out += this.renderPb();
    if (s.toast) out += '<div class="toast">' + esc(s.toast) + '</div>';
    return out;
  }
});

// -----------------------------------------------------------------------------
// 15. SCREENS — welcome, auth, onboarding
// -----------------------------------------------------------------------------
Object.assign(App, {
  renderWelcome() {
    const points = [
      { n: '01', label: 'Bring your plan', note: 'Photograph a written sheet and it becomes a workout you can log' },
      { n: '02', label: 'Log the number', note: 'Weight, time or reps — one tap and the history builds itself' },
      { n: '03', label: 'Get told what to beat', note: 'Every exercise shows your last, your best and the next target' }
    ];
    return '<div class="welcome">' +
      '<div class="welcome-top"><div style="font:800 11px/1 Archivo;letter-spacing:.24em;text-transform:uppercase">Fittrack</div><div style="font:600 9px/1 Archivo;letter-spacing:.16em;text-transform:uppercase;opacity:.8">Strength &amp; speed</div></div>' +
      '<div class="welcome-hero">' +
      '<img src="images/sled.jpg" alt="">' +
      '<img src="images/rack.jpg" alt="">' +
      '<img src="images/lunge.jpg" alt="">' +
      '<img src="images/run.jpg" alt="">' +
      '<div class="tint"></div><div class="copy"><div class="welcome-title">Log the load.<br>Beat it next<br>week.</div><div class="welcome-sub">A training log that remembers what you lifted and tells you what to beat.</div></div></div>' +
      '<div class="photo-band"><img src="images/dumbbell.jpg" alt=""><div class="tint"></div><div class="cap">Every session, on the record</div></div>' +
      '<div class="welcome-points">' + points.map(p => '<div class="welcome-point"><div class="n">' + p.n + '</div><div><div class="label">' + esc(p.label) + '</div><div class="note">' + esc(p.note) + '</div></div></div>').join('') + '</div>' +
      '<div class="welcome-actions">' +
      '<button class="btn btn-dark" onclick="App.set({screen:\'auth\',mode:\'register\',authError:\'\'})">Get started</button>' +
      '<button class="btn btn-outline-light btn-block" onclick="App.set({screen:\'auth\',mode:\'signin\',authError:\'\'})">I have an account</button>' +
      '</div></div>';
  },

  renderAuth() {
    const s = this.state;
    const isReg = s.mode === 'register';
    const isReset = s.mode === 'reset';
    if (isReset) {
      return '<div class="screen">' +
        '<div class="auth-hero"><div class="brand">Fittrack</div><div class="headline">Reset password</div><div class="sub">Enter your email and create a new password.</div></div>' +
        '<button class="back-btn" style="padding:12px 16px 0" onclick="App.set({mode:\'signin\',authError:\'\',resetEmail:\'\',resetPassword:\'\',resetConfirm:\'\'})">' + ICONS.back + ' Back</button>' +
        '<div class="auth-body">' +
        '<div class="field-block"><div class="field-label">Email</div><input id="f-reset-email" class="input" type="email" placeholder="you@email.com" value="' + esc(s.resetEmail) + '" oninput="App.set({resetEmail:this.value})"></div>' +
        '<div class="field-block"><div class="field-label">New password</div><input id="f-reset-password" class="input" type="password" placeholder="At least 8 characters" value="' + esc(s.resetPassword) + '" oninput="App.set({resetPassword:this.value})"></div>' +
        '<div class="field-block"><div class="field-label">Confirm password</div><input id="f-reset-confirm" class="input" type="password" placeholder="Type it again" value="' + esc(s.resetConfirm) + '" oninput="App.set({resetConfirm:this.value})"></div>' +
        (s.authError ? '<div class="auth-error">' + esc(s.authError) + '</div>' : '') +
        '<button class="btn" onclick="App.submitPasswordReset()">Reset password</button>' +
        '</div></div>';
    }
    return '<div class="screen">' +
      '<div class="auth-hero"><div class="brand">Fittrack</div><div class="headline">Log the load. Beat it next week.</div><div class="sub">Your plans, your weights and every personal best, kept on this phone.</div></div>' +
      '<div class="auth-tabs">' +
      '<button class="auth-tab' + (isReg ? ' on' : '') + '" onclick="App.set({mode:\'register\',authError:\'\'})">Create account</button>' +
      '<button class="auth-tab' + (!isReg ? ' on' : '') + '" onclick="App.set({mode:\'signin\',authError:\'\'})">Sign in</button>' +
      '</div>' +
      '<button class="back-btn" style="padding:12px 16px 0" onclick="App.set({screen:\'welcome\',authError:\'\'})">' + ICONS.back + ' Back</button>' +
      '<div class="auth-body">' +
      (isReg ? '<div class="field-block"><div class="field-label">Name</div><input id="f-name" class="input" type="text" autocomplete="name" placeholder="Alex Mercer" value="' + esc(s.form.name) + '" oninput="App.setForm(\'name\',this.value)"></div>' : '') +
      '<div class="field-block"><div class="field-label">Email</div><input id="f-email" class="input" type="email" autocomplete="email" placeholder="you@email.com" value="' + esc(s.form.email) + '" oninput="App.setForm(\'email\',this.value)"></div>' +
      '<div class="field-block"><div class="field-label">Password</div><input id="f-password" class="input" type="password" placeholder="At least 8 characters" value="' + esc(s.form.password) + '" oninput="App.setForm(\'password\',this.value)"></div>' +
      (isReg ? '<div class="field-block"><div class="field-label">Confirm password</div><input id="f-confirm" class="input" type="password" placeholder="Type it again" value="' + esc(s.form.confirm) + '" oninput="App.setForm(\'confirm\',this.value)"></div>' : '') +
      (!isReg ? '<div style="text-align:right;margin-bottom:12px"><button class="btn-ghost" onclick="App.goForgotPassword()" style="font-size:11px">Forgot password?</button></div>' : '') +
      (s.authError ? '<div class="auth-error">' + esc(s.authError) + '</div>' : '') +
      '<button class="btn" onclick="App.submitAuth()">' + (isReg ? 'Create account' : 'Sign in') + '</button>' +
      '<div class="auth-footnote">' + (isReg ? 'Prototype: the account lives on this device only — nothing is sent anywhere.' : 'Signing in restores the plans and weights saved on this device.') + '</div>' +
      '</div></div>';
  },

  renderOnboard() {
    const s = this.state;
    const step = s.step;
    const headings = ['Who are you training?', 'How do you measure?', 'What are you chasing?'];
    const notes = ['This sets what the app puts first.', 'Loads and reminders read in your units.', 'Used to pick the plans and challenges you see.'];
    let body = '';
    if (step === 0) {
      const roles = [
        { id: 'solo', label: 'Just me', note: 'Training on my own, tracking my own numbers' },
        { id: 'client', label: 'I have a coach', note: 'Someone else writes my plans, I log the work' },
        { id: 'coach', label: 'I coach others', note: 'I train clients and want to watch their progress' }
      ];
      body = roles.map(r => '<button class="pick-card' + (s.form.role === r.id ? ' on' : '') + '" onclick="App.setForm(\'role\',' + js(r.id) + ')"><span class="t">' + esc(r.label) + '</span><span class="n">' + esc(r.note) + '</span></button>').join('');
    } else if (step === 1) {
      body = '<div class="field-label">Units</div>' +
        '<div class="unit-grid"><button class="unit-cell' + (s.unit === 'kg' ? ' on' : '') + '" onclick="App.persist({unit:\'kg\'})">Kilograms</button><button class="unit-cell' + (s.unit === 'lb' ? ' on' : '') + '" onclick="App.persist({unit:\'lb\'})">Pounds</button></div>' +
        '<div class="field-label" style="margin-top:20px">Bodyweight</div>' +
        '<div class="input-row"><input id="f-bw" class="input-big" type="number" inputmode="decimal" placeholder="0" value="' + esc(s.form.bodyweight) + '" oninput="App.setForm(\'bodyweight\',this.value)"><div class="unit">' + s.unit.toUpperCase() + '</div></div>' +
        '<div class="auth-footnote">Optional — it gives bodyweight exercises something to measure against.</div>';
    } else {
      body = '<div class="field-label">Focus</div>' +
        GOALS.map(g => '<button class="pick-card' + (s.form.goal === g.id ? ' on' : '') + '" style="padding:13px 14px" onclick="App.setForm(\'goal\',' + js(g.id) + ')"><span class="t">' + esc(g.label) + '</span><span class="n">' + esc(g.note) + '</span></button>').join('') +
        '<div class="field-label" style="margin-top:20px">Days a week</div>' +
        '<div class="day-row">' + [2, 3, 4, 5, 6].map(n => '<button class="day-cell' + (s.form.days === n ? ' on' : '') + '" onclick="App.setForm(\'days\',' + n + ')">' + n + '</button>').join('') + '</div>';
    }
    return '<div class="screen">' +
      '<div class="onboard-hero"><div class="kicker">Step ' + (step + 1) + ' of 3</div><div class="headline">' + esc(headings[step]) + '</div><div class="note">' + esc(notes[step]) + '</div></div>' +
      '<div class="rail"><div style="width:' + Math.round(((step + 1) / 3) * 100) + '%"></div></div>' +
      '<div class="onboard-body">' + body + '</div>' +
      '<div class="onboard-actions">' +
      '<button class="btn" onclick="App.nextOnboardStep()">' + (step === 2 ? 'Start training' : 'Continue') + '</button>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px">' +
      (step > 0 ? '<button class="btn-ghost" onclick="App.set({step:' + (step - 1) + '})">Back</button>' : '<span></span>') +
      '<button class="btn-ghost" style="margin-left:auto" onclick="App.finishOnboard()">Skip setup</button>' +
      '</div></div></div>';
  },
  nextOnboardStep() { this.state.step < 2 ? this.set({ step: this.state.step + 1 }) : this.finishOnboard(); }
});

// -----------------------------------------------------------------------------
// 16. SCREEN — Today
// -----------------------------------------------------------------------------
Object.assign(App, {
  renderToday() {
    const s = this.state;
    const r = this.recap();
    const total = this.totalPoints();
    const streak = this.streakDays();
    const todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const bucket = !streak ? 'none' : streak >= 7 ? 'long' : streak >= 3 ? 'mid' : 'day1';
    if (this._pushKey !== bucket + streak) {
      this._pushKey = bucket + streak;
      this._push = bucket === 'none' ? this.pick(PUSH_NONE) : bucket === 'long' ? this.pick(PUSH_LONG, { n: streak }) : bucket === 'mid' ? this.pick(PUSH_MID, { n: streak }) : this.pick(PUSH_DAY1);
    }
    const coach = s.user.role === 'coach';
    const query = s.query.trim();
    const results = query ? this.allExercises().filter(e => e.name.toLowerCase().indexOf(query.toLowerCase()) > -1).slice(0, 12).map(e => {
      const est = this.statsFor(e.id);
      return '<button class="search-row" onclick="App.openExById(' + js(e.id) + ')"><span class="n">' + esc(e.name) + '</span><span class="d">Day ' + e.planDay + ' — ' + esc(e.planTitle) + (est ? ' · best ' + esc(this.fmtVal(est.kind, est.best)) : ' · no record') + '</span></button>';
    }).join('') : '';
    const planCards = s.plans.map(p => {
      const count = p.sections.reduce((a, x) => a + x.exercises.length, 0);
      const ids = []; p.sections.forEach(x => x.exercises.forEach(e => ids.push(e.id)));
      const last = s.log.filter(e => ids.indexOf(e.exerciseId) > -1).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      return '<div class="plan-card" onclick="App.set({screen:\'plan\',planId:' + js(p.id) + '})">' +
        '<div class="plan-card-top"><div class="plan-card-day"><div class="k">Day</div><div class="v">' + p.day + '</div></div>' +
        '<div class="plan-card-body"><div class="t">' + esc(p.title) + '</div><div class="s">' + esc(p.sections.slice(0, 3).map(x => x.title).join(' · ')) + '</div></div></div>' +
        '<div class="plan-card-foot"><div class="count">' + count + ' exercises</div><div class="status">' + esc(last ? 'Last done ' + this.daysAgo(last.date) : 'Not started') + '</div></div></div>';
    }).join('');
    return '<div class="screen">' +
      '<div class="topbar"><div><div class="h1">Fittrack</div><div style="font:600 11px/1.4 Archivo;letter-spacing:.12em;text-transform:uppercase;color:#605d5d;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(todayLabel) + '</div></div>' +
      '<div class="seg"><button class="seg-btn' + (s.unit === 'kg' ? ' on' : '') + '" onclick="App.persist({unit:\'kg\'})">KG</button><button class="seg-btn' + (s.unit === 'lb' ? ' on' : '') + '" onclick="App.persist({unit:\'lb\'})">LB</button></div></div>' +
      '<div class="scroll">' +
      '<div class="band band-lg"><img src="images/row.jpg" alt="" style="object-position:50% 58%"><div class="tint"></div></div>' +
      '<button class="push-strip" onclick="App.go(' + js(coach ? 'clients' : 'play') + ')"><span><span class="title">' + total + ' pts · ' + (streak ? streak + ' day' + (streak > 1 ? 's' : '') : 'No streak') + '</span><span class="line">' + esc(this._push) + '</span></span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ec3013" stroke-width="2.5"><path d="m9 18 6-6-6-6"></path></svg></button>' +
      '<div class="section-pad">' +
      '<div class="section-head"><div class="kicker-lg">Your plans</div><button class="btn-ghost" onclick="App.exportData()">Export history</button></div>' +
      '<input id="search-input" class="search-input" type="text" placeholder="Search every exercise" value="' + esc(s.query) + '" oninput="App.set({query:this.value})">' +
      (query ? '<div class="search-results">' + (results || '<div class="search-row"><span class="d">No matches</span></div>') + '</div>' : '') +
      '</div>' +
      planCards +
      '<div class="section-pad"><button class="btn" onclick="App.set({sheet:true,error:\'\'})">' + ICONS.plus + 'Add a plan</button><div class="auth-footnote">Photograph a written plan, upload a file, or build one by hand.</div></div>' +
      '<div class="user-row"><div><div class="name">' + esc(s.user.name) + '</div><div class="meta">' + esc(s.user.email + (s.user.bodyweight ? ' · ' + this.fmt(s.user.bodyweight) : '')) + '</div></div><button class="signout" onclick="App.signOut()">Sign out</button></div>' +
      '</div></div>';
  }
});

// -----------------------------------------------------------------------------
// 17. SCREEN — Plan detail
// -----------------------------------------------------------------------------
Object.assign(App, {
  renderPlan() {
    const s = this.state;
    const plan = s.plans.find(p => p.id === s.planId);
    const sections = plan.sections.map(sec => {
      const rows = sec.exercises.map(e => {
        const n = this.nudgeFor(e);
        return '<div class="ex-row"><div class="ex-row-main" onclick="App.openExById(' + js(e.id) + ')"><div class="name">' + esc(e.name) + '</div><div class="presc">' + esc(this.prescription(e)) + '</div>' +
          (n ? '<div class="ex-nudge"><span>' + esc(n) + '</span></div>' : '') + '</div>' +
          '<div class="ex-reorder"><button title="Move up" onclick="event.stopPropagation();App.moveExercise(' + js(e.id) + ',-1)">' + ICONS.up + '</button><button title="Move down" onclick="event.stopPropagation();App.moveExercise(' + js(e.id) + ',1)">' + ICONS.down + '</button></div>' +
          '<button class="ex-watch" title="Watch demo" onclick="event.stopPropagation();App.watchById(' + js(e.id) + ')">' + ICONS.play + '</button></div>';
      }).join('');
      return '<div class="sec-head"><div class="t">' + esc(sec.title) + '</div><div class="c">' + sec.exercises.length + '</div></div>' + rows;
    }).join('');
    return '<div class="screen">' +
      '<div class="topbar-simple">' +
      '<button class="back-btn" onclick="App.go(\'today\')">' + ICONS.back + ' All plans</button>' +
      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:10px"><div class="h2">' + esc(plan.title) + '</div><div style="font:600 10px/1 Archivo;letter-spacing:.12em;text-transform:uppercase;color:#605d5d;padding-bottom:4px">Day ' + plan.day + '</div></div>' +
      '<button class="btn" style="margin-top:12px" onclick="App.startSession(' + js(plan.id) + ')">' + ICONS.play + 'Start guided session</button>' +
      '<div class="plan-actions"><button class="btn-outline" onclick="App.completeSession(' + js(plan.id) + ')">Mark done</button><button class="btn-outline" style="color:#605d5d" onclick="App.set({confirmPlan:true})">Delete plan</button></div>' +
      (s.confirmPlan ? '<div class="confirm-box"><div class="msg">Delete this plan and everything logged against it?</div><div class="row"><button class="yes" onclick="App.deletePlan(' + js(plan.id) + ')">Delete</button><button class="no" onclick="App.set({confirmPlan:false})">Keep it</button></div></div>' : '') +
      '</div>' +
      '<div class="scroll">' +
      '<div class="band band-md"><img src="images/kettlebells.jpg" alt="" style="object-position:50% 48%"><div class="tint"></div></div>' +
      sections +
      '</div></div>';
  },

  // ---------------------------------------------------------------------------
  // 18. SCREEN — Exercise detail
  // ---------------------------------------------------------------------------
  renderExercise() {
    const s = this.state;
    const ex = this.findEx(s.exId);
    const kind = this.metricOf(ex);
    const st = this.statsFor(ex.id);
    const hist = this.entriesFor(ex.id);
    const u = s.unit.toUpperCase();
    let head;
    if (s.editName !== null) {
      head = '<input id="edit-name" class="input" type="text" value="' + esc(s.editName) + '" oninput="App.set({editName:this.value})">' +
        '<div style="display:flex;gap:8px;margin-top:8px"><button class="btn-outline" style="width:auto;padding:10px 13px;font-size:10px;background:#ec3013;color:#fff;border:0" onclick="App.renameExercise(' + js(ex.id) + ',App.state.editName)">Save name</button>' +
        '<button class="btn-outline" style="width:auto;padding:10px 13px;font-size:10px" onclick="App.set({editName:null})">Cancel</button>' +
        '<button class="btn-outline" style="width:auto;padding:10px 13px;font-size:10px;margin-left:auto;color:#605d5d" onclick="App.deleteExercise(' + js(ex.id) + ')">Delete</button></div>';
    } else {
      head = '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px"><div style="min-width:0"><div style="font:800 22px/1.1 Archivo;letter-spacing:-.01em">' + esc(ex.name) + '</div><div style="font:400 12px/1.3 Archivo;color:#605d5d;margin-top:5px">' + esc(this.prescription(ex)) + '</div></div>' +
        '<button class="icon-btn" style="width:34px;height:34px" title="Edit" onclick="App.set({editName:' + js(ex.name) + '})">' + ICONS.edit + '</button></div>';
    }
    let body;
    if (!kind) {
      const metrics = [
        { id: 'load', label: 'Weight', note: 'Kilos or pounds moved' },
        { id: 'time', label: 'Time', note: 'Seconds — faster is better' },
        { id: 'reps', label: 'Reps', note: 'Rounds, reps or distance covered' }
      ];
      body = '<div class="start-record"><div class="kicker-lg">Start a record</div><div class="lead">This exercise has no load or clock set yet. Pick what you want to track and the app will keep your best, average and history for it.</div>' +
        '<div style="margin-top:14px">' + metrics.map(m => '<button class="pick-card" onclick="App.setMetric(' + js(ex.id) + ',' + js(m.id) + ')"><span class="t">' + esc(m.label) + '</span><span class="n">' + esc(m.note) + '</span></button>').join('') + '</div></div>';
    } else {
      const facts = [
        { label: 'Sets', value: ex.sets || '—' }, { label: 'Reps', value: ex.reps || '—' },
        { label: 'Distance', value: ex.distance || '—' }, { label: 'Rest', value: ex.rest || '—' }
      ];
      const factGrid = '<div class="fact-grid">' + facts.map(f => '<div class="fact-cell"><div class="k">' + f.label + '</div><div class="v">' + esc(f.value) + '</div></div>').join('') + '</div>';
      const lastBlock = hist.length ? '<div class="last-session"><div class="k">Last session</div><div class="v">' + esc(this.fmtVal(st.kind, st.latest) + ' · ' + this.daysAgo(hist[0].date)) + '</div>' +
        '<div class="n">' + esc(st.latest === st.best ? this.pick(NUDGE_UP, { last: this.fmtVal(st.kind, st.latest), next: this.fmtVal(st.kind, st.kind === 'time' ? this.suggestTime(st.latest) : this.suggest(st.latest)) }) : this.pick(NUDGE_BACK, { best: this.fmtVal(st.kind, st.best), avg: this.fmtVal(st.kind, st.avg) })) + '</div></div>' : '';
      let stopwatch = '';
      if (kind === 'time') {
        const w = s.watch;
        const elapsed = w ? w.elapsed : 0;
        const m = Math.floor(elapsed / 60); const sec = elapsed - m * 60;
        const clock = (m ? m + ':' + (sec < 10 ? '0' : '') : '') + sec.toFixed(2);
        const running = !!(w && w.running);
        const hasTime = !!(w && !w.running && w.elapsed > 0);
        const paceColor = st && w && elapsed > st.best ? '#ff9783' : '#9be8c0';
        const paceLine = st && w ? (elapsed > st.best ? '+' + (elapsed - st.best).toFixed(2) + 's off your best' : 'Under your best') : 'Running clock';
        stopwatch = '<div class="stopwatch-panel"><div class="head"><div class="k">Stopwatch</div><div class="tgt">' + esc(st ? 'Best ' + this.fmtVal(st.kind, st.best) + ' · average ' + this.fmtVal(st.kind, st.avg) : 'No time recorded yet') + '</div></div>' +
          '<div class="stopwatch-clock">' + clock + '</div>' +
          '<div class="stopwatch-pace" style="color:' + paceColor + '">' + esc(paceLine) + '</div>' +
          '<div class="stopwatch-actions">' +
          (!running ? '<button class="btn light" onclick="App.startWatch()">' + (w && w.paused ? 'Resume' : 'Start') + '</button>' : '<button class="btn light" onclick="App.stopWatch()">Stop</button>') +
          (hasTime ? '<button class="btn" onclick="App.saveWatch()">Save time</button>' : '') +
          '<button class="reset" onclick="App.resetWatch()">Reset</button>' +
          '</div></div>';
      }
      const stepsVals = kind === 'time' ? [-0.5, -0.1, 0.1, 0.5] : kind === 'reps' ? [-5, -1, 1, 5] : s.unit === 'kg' ? [-5, -2.5, 2.5, 5] : [-10, -5, 5, 10];
      const steps = '<div class="steps-grid">' + stepsVals.map(d => '<button onclick="App.set({input:String(Math.max(0,Math.round((parseFloat(App.state.input)||0)*100+' + (d * 100) + ')/100))})">' + (d > 0 ? '+' : '') + d + '</button>').join('') + '</div>';
      const canChangeMetric = hist.length === 0;
      const logBlock = '<div class="log-block">' + stopwatch +
        '<div class="section-head"><div class="kicker-lg">' + (kind === 'time' ? 'Log today’s time' : kind === 'reps' ? 'Log today’s reps' : 'Log today’s load') + '</div>' +
        (canChangeMetric ? '<button class="btn-ghost" onclick="App.setMetric(' + js(ex.id) + ',\'none\')">Change</button>' : '') + '</div>' +
        '<div class="input-row" style="margin-top:10px"><input id="log-input" class="input-big" type="number" step="0.5" min="0" inputmode="decimal" placeholder="0" value="' + esc(s.input) + '" oninput="App.set({input:this.value})"><div class="unit">' + (kind === 'time' ? 'SEC' : kind === 'reps' ? 'REPS' : u) + '</div></div>' +
        steps +
        '<button class="btn" style="margin-top:10px" onclick="App.saveWeight()">Save this set</button>' +
        '<button class="btn-outline" style="margin-top:8px" onclick="App.openRecorderForExercise(' + js(ex.id) + ')">' + ICONS.playSm + 'Record yourself</button>' +
        '<input id="note-input" class="search-input" type="text" placeholder="Note — felt heavy, shoulder tight…" value="' + esc(s.note) + '" oninput="App.set({note:this.value})">' +
        '<div class="rest-row"><div class="k">Rest</div>' + [60, 120, 180].map(sec => '<button onclick="App.startRest(' + sec + ')">' + (sec < 60 ? sec + 's' : (sec / 60) + ' min') + '</button>').join('') + '</div>' +
        this.renderClipsFor('exId', ex.id) +
        '</div>';
      const statGrid = st ? '<div class="stat-grid">' +
        '<div class="stat-cell"><div class="k">' + (kind === 'time' ? 'Fastest' : 'Best') + '</div><div class="v" style="color:#ec3013">' + esc(this.fmtVal(st.kind, st.best)) + '</div></div>' +
        '<div class="stat-cell"><div class="k">Average</div><div class="v">' + esc(this.fmtVal(st.kind, st.avg)) + '</div></div>' +
        '<div class="stat-cell"><div class="k">' + (kind === 'time' ? 'Slowest' : 'Lowest') + '</div><div class="v" style="color:#605d5d">' + esc(this.fmtVal(st.kind, st.worst)) + '</div></div>' +
        '</div>' : '';
      const histRows = hist.map((h, i) => {
        const prev = hist[i + 1];
        const d = prev ? h.value - prev.value : 0;
        const good = h.kind === 'time' ? d < 0 : d > 0;
        const show = h.kind === 'time' ? (Math.round(Math.abs(d) * 100) / 100) : this.round(Math.abs(this.toDisplay(d)));
        const delta = prev ? (d === 0 ? 'same' : (good ? '▲ ' : '▼ ') + show) : 'first';
        const deltaColor = prev && d !== 0 ? (good ? '#ae1800' : '#605d5d') : '#605d5d';
        return '<div class="hist-row"><div><div class="date">' + esc(this.dateLabel(h.date)) + '</div><div class="ago">' + esc(this.daysAgo(h.date)) + '</div>' +
          (h.note ? '<div class="note">' + esc(h.note) + '</div>' : '') + '</div>' +
          '<div class="right"><span class="delta" style="color:' + deltaColor + '">' + esc(delta) + '</span><span class="val">' + esc(this.fmtVal(h.kind, h.value)) + '</span>' +
          '<button class="icon-btn" title="Delete entry" onclick="App.removeEntry(' + js(h.id) + ')">' + ICONS.x + '</button></div></div>';
      }).join('');
      body = '<div onclick="App.watchById(' + js(ex.id) + ')" class="video-panel"><div class="play"><span>' + ICONS.play + '</span></div><div class="t">Watch demo on YouTube</div><div class="s">Opens a search for this exercise</div></div>' +
        factGrid + lastBlock + logBlock + statGrid +
        '<div style="padding:22px 16px 0"><div class="history-head"><div class="t">History</div><div class="best">' + esc(st ? (kind === 'time' ? 'Fastest ' + this.fmtVal(kind, st.best) : 'PB ' + this.fmtVal(kind, st.best)) : 'No entries yet') + '</div></div>' +
        (hist.length > 1 ? '<div class="chart-wrap">' + this.chart(hist.slice().reverse().map(e => e.value), kind) + '</div>' : '') +
        (histRows || '<div class="empty-note">Nothing logged yet. Save your first set and the app will remind you of it next time.</div>') +
        '</div>';
    }
    return '<div class="screen">' +
      '<div class="topbar-simple"><button class="back-btn" onclick="App.set({screen:\'plan\',planId:' + js(ex.planId) + '})">' + ICONS.back + ' Day ' + ex.planDay + ' — ' + esc(ex.planTitle) + '</button>' + head + '</div>' +
      '<div class="scroll">' + body + '</div></div>';
  }
});

// -----------------------------------------------------------------------------
// 19. SCREEN — Builder (build a plan by hand)
// -----------------------------------------------------------------------------
Object.assign(App, {
  renderBuilder() {
    const s = this.state;
    const rows = s.draft.rows.map((row, i) => '<div class="builder-row">' +
      '<div class="builder-row-top"><input id="draft-name-' + i + '" type="text" placeholder="Exercise name" value="' + esc(row.name) + '" oninput="App.setDraft(' + i + ',\'name\',this.value)">' +
      '<button onclick="App.removeDraftRow(' + i + ')">' + ICONS.x + '</button></div>' +
      '<div class="builder-row-bottom"><input id="draft-sets-' + i + '" type="text" placeholder="Sets" value="' + esc(row.sets) + '" oninput="App.setDraft(' + i + ',\'sets\',this.value)">' +
      '<input id="draft-reps-' + i + '" type="text" placeholder="Reps" value="' + esc(row.reps) + '" oninput="App.setDraft(' + i + ',\'reps\',this.value)">' +
      '<button class="weighted' + (row.weighted ? ' on' : '') + '" onclick="App.setDraft(' + i + ',\'weighted\',' + (!row.weighted) + ')">Loaded</button></div></div>').join('');
    return '<div class="screen">' +
      '<div class="topbar-simple"><button class="back-btn" onclick="App.set({screen:\'today\',draft:null})">' + ICONS.back + ' Cancel</button><div class="h2">New plan</div></div>' +
      '<div class="scroll" style="padding:16px 16px 28px">' +
      '<div class="field-label">Plan name</div><input id="draft-title" class="input" type="text" placeholder="Lower body" value="' + esc(s.draft.title) + '" oninput="App.set({draft:Object.assign({},App.state.draft,{title:this.value})})">' +
      '<div class="field-label" style="margin-top:20px">Exercises</div>' + rows +
      '<button class="btn-outline btn-block" onclick="App.addDraftRow()">' + ICONS.plusSm + 'Add exercise</button>' +
      '<button class="btn btn-block" onclick="App.saveDraft()">Save plan</button>' +
      '</div></div>';
  }
});

// -----------------------------------------------------------------------------
// 20. SCREEN — Play (points, streak, games)
// -----------------------------------------------------------------------------
Object.assign(App, {
  renderPlay() {
    const s = this.state;
    const r = this.recap();
    const total = this.totalPoints();
    const level = Math.floor(total / 200) + 1;
    const streak = this.streakDays();
    const thisWeek = this.weekStats(this.weekKey(new Date()));
    const weeks = this.allWeeks();
    const lastWeekKey = (() => { const d = new Date(); d.setDate(d.getDate() - 7); return this.weekKey(d); })();
    const lastWeek = weeks.find(w => w.key === lastWeekKey) || null;
    const prNames = r.prNames.length ? (r.prNames.length > 2 ? r.prNames.slice(0, 2).join(', ') + ' and ' + (r.prNames.length - 2) + ' more' : r.prNames.join(' and ')) : '';
    const recap = '<div class="recap-poster"><div class="kicker" style="opacity:.85">This week</div><div class="headline">' + esc(r.sets ? (r.prs ? r.prs + ' personal best' + (r.prs > 1 ? 's' : '') + ' this week.' : r.sets + ' set' + (r.sets > 1 ? 's' : '') + ' logged this week.') : 'Nothing logged yet this week.') + '</div>' +
      (prNames ? '<div class="names">On ' + esc(prNames) + '</div>' : '') +
      '<div class="recap-stat-grid"><div class="cell"><div class="v">' + r.sessions + '/7</div><div class="k">Days</div></div><div class="cell"><div class="v">' + r.sets + '</div><div class="k">Sets</div></div><div class="cell"><div class="v">' + r.prs + '</div><div class="k">New PRs</div></div><div class="cell"><div class="v">' + esc(r.volume ? this.fmt(r.volume) : '—') + '</div><div class="k">Heaviest</div></div></div></div>';
    const maxPts = Math.max(thisWeek.points, lastWeek ? lastWeek.points : 1, 1);
    const weekTasks = thisWeek.tasks.map(t => '<div class="task-row' + (t.done ? ' done' : '') + '"><div class="task-mark' + (t.done ? ' done' : '') + '">' + (t.done ? '✓' : '') + '</div><div class="label">' + esc(t.label) + '</div><div class="progress">' + esc(t.progress) + '</div></div>').join('');
    const rivalVerdict = lastWeek ? (thisWeek.points >= lastWeek.points ? 'You are ahead of yourself by ' + (thisWeek.points - lastWeek.points) + ' pts' : (lastWeek.points - thisWeek.points) + ' pts behind your own pace') : 'Set the bar this week';
    const leaderRows = weeks.slice(0, 5).map((w, i) => '<div class="leader-row' + (w.key === thisWeek.key ? ' now' : '') + '"><div class="rank">' + String(i + 1).padStart(2, '0') + '</div><div class="body"><div class="label">' + esc(this.weekLabel(w.key) + (w.key === thisWeek.key ? ' · this week' : '')) + '</div><div class="detail">' + w.sets + ' sets · ' + w.prs + ' PBs</div></div><div class="pts">' + w.points + ' pts</div></div>').join('');
    const badgeCells = this.badges().map(b => '<div class="badge-cell' + (b.earned ? ' earned' : '') + '">' + esc(b.label) + '</div>').join('');
    const coach = s.user.role === 'coach';
    return '<div class="screen">' +
      '<div class="topbar-simple"><div class="h1">Play</div><div style="font:600 10px/1.4 Archivo;letter-spacing:.12em;text-transform:uppercase;color:#605d5d;margin-top:6px">Level ' + level + ' · ' + esc(LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]) + '</div></div>' +
      '<div class="scroll">' +
      '<div class="band band-md"><img src="images/pulldown.jpg" alt="" style="object-position:50% 24%"><div class="tint"></div></div>' +
      recap +
      '<div class="level-row"><div class="level-box"><div class="kicker">Level ' + level + ' · ' + esc(LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]) + '</div><div class="pts">' + total + ' pts</div><div class="mini-rail"><div style="width:' + Math.round(((total % 200) / 200) * 100) + '%"></div></div><div class="note">' + (200 - (total % 200)) + ' pts to level ' + (level + 1) + '</div></div>' +
      '<div class="streak-box"><div class="kicker">Streak</div><div class="v">' + esc(streak ? streak + ' day' + (streak > 1 ? 's' : '') : 'No streak') + '</div><div class="note">' + (streak ? 'Keep logging to hold it' : 'Log today to start one') + '</div></div></div>' +
      '<div class="section-pad"><div class="section-head"><div class="kicker-lg">This week\'s card</div><div style="font:600 10px/1 Archivo;letter-spacing:.08em;text-transform:uppercase;color:#ae1800">' + thisWeek.tasks.filter(t => t.done).length + ' of 5 done</div></div>' +
      '<div class="task-card">' + weekTasks + '<div class="task-card-foot">' + thisWeek.points + ' pts this week</div></div></div>' +
      '<div class="section-pad"><div class="kicker-lg">Play</div><div class="play-grid">' +
      '<button class="play-tile" onclick="App.openGhost()"><span class="t">Beat your ghost</span><span class="s">Race your best time live</span></button>' +
      '<button class="play-tile" onclick="App.openWheel()"><span class="t">Spin a finisher</span><span class="s">One random gut-punch</span></button>' +
      '<button class="play-tile play-tile-wide" onclick="App.openRounds()"><span class="t">Round timer</span><span class="s">Boxing and MMA rounds — work, rest, automatic bells</span></button>' +
      '<div class="rival-block"><div class="t">You vs last week</div><div class="n">' + esc(lastWeek ? 'Last week you scored ' + lastWeek.points + ' pts' : 'No score last week yet') + '</div>' +
      '<div class="rival-bars"><div style="background:#ec3013;width:' + Math.round(100 * thisWeek.points / maxPts) + '%"></div><div style="background:#201e1d;width:' + Math.round(100 * (lastWeek ? lastWeek.points : 0) / maxPts) + '%"></div></div>' +
      '<div class="rival-verdict">' + esc(rivalVerdict) + '</div></div>' +
      (s.trends.length ? '<div class="challenge-block"><div class="t">Challenge of the week</div><div class="h">' + esc(s.trends[0].title) + '</div><div class="n">' + esc(s.trends[0].blurb) + '</div><button onclick="App.acceptChallenge()">Accept it</button></div>' : '') +
      '</div></div>' +
      '<div class="section-pad"><div class="kicker-lg">Your best weeks</div><div class="leader-card">' + leaderRows + '</div></div>' +
      '<div class="section-pad"><div class="kicker-lg">Badges</div><div class="badge-grid">' + badgeCells + '</div></div>' +
      '</div></div>';
  }
});

// -----------------------------------------------------------------------------
// 21. SCREEN — Trending
// -----------------------------------------------------------------------------
Object.assign(App, {
  goTrending() { this.go('trending'); this.loadTrends(false); },
  renderTrending() {
    const s = this.state;
    const cards = s.trends.map((t, i) => {
      const open = s.openTrend === t.id;
      const exRows = t.exercises.map(e => '<div class="trend-ex"><div class="body"><div class="name">' + esc(e.name) + '</div><div class="detail">' + esc([e.sets ? e.sets + ' sets' : null, e.reps ? e.reps + ' reps' : null].filter(Boolean).join(' · ') || (e.isTimed ? 'For time' : 'As prescribed')) + '</div></div>' +
        '<button title="Watch demo" onclick="event.stopPropagation();App.watchName(' + js(e.name) + ')">' + ICONS.playSm + '</button></div>').join('');
      return '<div class="trend-card">' +
        '<div class="trend-head" onclick="App.toggleTrend(' + js(t.id) + ')"><div class="trend-rank">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="trend-body"><div class="title">' + esc(t.title) + '</div><div class="blurb">' + esc(t.blurb) + '</div>' +
        '<div class="trend-tags"><span class="tag-a">' + esc(t.tag) + '</span><span class="tag-b">' + esc(t.level) + '</span><span class="tag-b">' + esc(t.minutes) + '</span></div>' +
        (t.source ? '<div class="trend-signal"><span>' + esc(t.source) + (t.signal ? ' · ' + t.signal : '') + '</span></div>' : '') +
        '</div></div>' +
        (open ? '<div class="trend-open">' + exRows + '<div class="trend-actions">' +
          '<button class="btn" onclick="App.addTrendById(' + js(t.id) + ')">' + ICONS.plusSm + 'Add to my plans</button>' +
          '<button class="btn btn-dark" onclick="App.followTrendById(' + js(t.id) + ')">' + ICONS.playSm + 'Follow it now</button>' +
          '<button class="btn-outline" onclick="App.watchName(' + js(t.title + ' workout') + ')">' + ICONS.playSm + 'Watch this workout</button>' +
          '<button class="btn-outline record-btn" onclick="App.openRecorderById(' + js(t.id) + ')">' + ICONS.playSm + 'Record yourself trying it</button>' +
          '</div>' + this.renderClipsFor('trendId', t.id) + '</div>' : '') +
        '</div>';
    }).join('');
    const isLive = s.trendSources.length > 0;
    const liveText = s.trendsBusy ? 'Checking live feeds…' : isLive ? 'Live · ' + s.trendSources.join(', ') + ' · ' + s.trendPosts + ' posts read' : 'Composed · connect a feed for live community signal';
    const footnote = isLive
      ? 'Workouts are FitTrack\'s own library, matched against real posts read this week from ' + s.trendSources.join(', ') + '. Check anything unfamiliar before you load it heavy.'
      : 'Curated from FitTrack\'s own workout library — the live feed wasn\'t reachable just now, so nothing here is claimed as live. Check anything unfamiliar before you load it heavy.';
    return '<div class="screen">' +
      '<div class="topbar"><div><div class="h1">Trending</div><div style="font:600 10px/1.4 Archivo;letter-spacing:.12em;text-transform:uppercase;color:#605d5d;margin-top:6px">' + esc(s.trendsAt ? 'Updated ' + this.daysAgo(s.trendsAt) : 'Not loaded yet') + '</div></div>' +
      '<button class="btn-outline" style="width:auto;padding:9px 11px;font-size:10px" onclick="App.loadTrends(true)">Refresh</button></div>' +
      '<div class="scroll">' +
      '<div class="band" style="height:120px"><img src="images/plates.jpg" alt="" style="object-position:50% 28%"><div class="tint"></div></div>' +
      '<div class="live-bar' + (isLive ? ' live' : ' off') + '">' + esc(liveText) + '</div>' +
      cards +
      (!s.trends.length ? '<div class="empty-note-pad">Nothing loaded yet. Hit refresh and the library will put together what is popular in training right now.</div>' : '') +
      '<div class="trend-footnote">' + esc(footnote) + '</div>' +
      '</div></div>';
  }
});

// -----------------------------------------------------------------------------
// 22. SCREEN — Progress
// -----------------------------------------------------------------------------
Object.assign(App, {
  renderProgress() {
    const s = this.state;
    const r = this.recap();
    const prNames = r.prNames.length ? (r.prNames.length > 2 ? r.prNames.slice(0, 2).join(', ') + ' and ' + (r.prNames.length - 2) + ' more' : r.prNames.join(' and ')) : '';
    const recapSentence = r.sets
      ? 'You logged ' + r.sets + ' set' + (r.sets > 1 ? 's' : '') + ' across ' + r.sessions + ' day' + (r.sessions > 1 ? 's' : '') + ' this week' + (prNames ? ', with best-ever numbers on ' + prNames + '.' : '. Same loads as before — pick one lift and add a step.')
      : 'No sets logged in the last seven days. Open a plan and log one to restart the streak.';
    const dates = this.sessionDates();
    const cal = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      cal.push('<div class="calendar-cell' + (dates.has(d.toDateString()) ? ' on' : '') + '">' + d.getDate() + '</div>');
    }
    const bw = this.bodyweightEntries();
    const bwChange = bw.length > 1 ? (bw[0].value > bw[bw.length - 1].value ? '+' : '') + this.round(this.toDisplay(bw[0].value - bw[bw.length - 1].value)) + ' since start' : 'One reading so far';
    const tracked = [];
    this.allExercises().forEach(e => {
      const h = this.entriesFor(e.id);
      if (!h.length) return;
      const asc = h.slice().reverse();
      const est = this.statsFor(e.id);
      const kind = est.kind;
      const d = h.length > 1 ? h[0].value - h[1].value : 0;
      const good = kind === 'time' ? d < 0 : d > 0;
      const show = kind === 'time' ? Math.round(Math.abs(d) * 100) / 100 : this.round(Math.abs(this.toDisplay(d)));
      tracked.push('<div class="progress-card" onclick="App.openExById(' + js(e.id) + ')">' +
        '<div class="progress-card-head"><div class="t">' + esc(e.name) + '</div><div class="s">' + esc((kind === 'time' ? 'Speed' : kind === 'reps' ? 'Reps' : 'Load') + ' · Day ' + e.planDay + ' — ' + e.planTitle + ' · ' + h.length + ' entr' + (h.length > 1 ? 'ies' : 'y') + ' · ' + this.daysAgo(h[0].date)) + '</div></div>' +
        '<div class="progress-card-chart">' + this.chart(asc.map(x => x.value), kind) + '</div>' +
        '<div class="progress-stat-grid"><div class="cell"><div class="k">Latest</div><div class="v">' + esc(this.fmtVal(kind, est.latest)) + '</div></div>' +
        '<div class="cell"><div class="k">' + (kind === 'time' ? 'Fastest' : 'Best') + '</div><div class="v" style="color:#ae1800">' + esc(this.fmtVal(kind, est.best)) + '</div></div>' +
        '<div class="cell"><div class="k">Change</div><div class="v" style="color:' + (h.length > 1 && d !== 0 ? (good ? '#ae1800' : '#605d5d') : '#201e1d') + '">' + esc(h.length > 1 ? (d === 0 ? 'Flat' : (good ? '▲ ' : '▼ ') + show) : 'First') + '</div></div></div>' +
        '<div class="progress-stat-grid two"><div class="cell"><div class="k">Average</div><div class="v">' + esc(this.fmtVal(kind, est.avg)) + '</div></div>' +
        '<div class="cell"><div class="k">' + (kind === 'time' ? 'Slowest' : 'Lowest') + '</div><div class="v">' + esc(this.fmtVal(kind, est.worst)) + '</div></div></div></div>');
    });
    return '<div class="screen">' +
      '<div class="topbar"><div class="h1">Progress</div><div class="seg"><button class="seg-btn' + (s.unit === 'kg' ? ' on' : '') + '" onclick="App.persist({unit:\'kg\'})">KG</button><button class="seg-btn' + (s.unit === 'lb' ? ' on' : '') + '" onclick="App.persist({unit:\'lb\'})">LB</button></div></div>' +
      '<div class="scroll">' +
      '<div class="band band-md"><img src="images/curl.jpg" alt="" style="object-position:50% 14%"><div class="tint"></div></div>' +
      '<div class="recap-box"><div class="kicker">Weekly recap</div><div class="sentence">' + esc(recapSentence) + '</div>' +
      '<div class="row"><button class="btn-dark" onclick="App.openReport(\'day\')">Today\'s report</button><button class="btn" onclick="App.openReport(\'week\')">Week report</button></div></div>' +
      '<div class="section-pad"><div class="kicker-lg">Last four weeks</div><div class="calendar-grid">' + cal.join('') + '</div><div class="auth-footnote">Red days are days you trained.</div></div>' +
      '<div class="section-pad"><div class="section-head"><div class="kicker-lg">Bodyweight</div><div style="font:600 10px/1 Archivo;letter-spacing:.08em;text-transform:uppercase;color:#ae1800">' + esc(bwChange) + '</div></div>' +
      '<div class="bw-card"><div class="bw-row"><input id="bw-input" type="number" step="0.1" min="0" inputmode="decimal" placeholder="' + esc(bw.length ? this.fmt(bw[0].value) : '—') + '" value="' + esc(s.bwInput) + '" oninput="App.set({bwInput:this.value})"><button onclick="App.logBodyweight()">Log</button></div>' +
      (bw.length > 1 ? '<div class="bw-chart">' + this.chart(bw.slice().reverse().map(e => e.value), 'load') + '</div>' : '') + '</div></div>' +
      tracked.join('') +
      (!tracked.length ? '<div class="empty-note-pad">No weights logged yet. Open any loaded exercise, save a set, and its chart appears here.</div>' : '') +
      '</div></div>';
  }
});

// -----------------------------------------------------------------------------
// 23. SCREENS — Coach roster
// -----------------------------------------------------------------------------
Object.assign(App, {
  renderClients() {
    const s = this.state;
    const n = s.clients.filter(c => this.clientStats(c).needsAttention).length;
    const rows = s.clients.map(c => {
      const st = this.clientStats(c);
      const last = st.last ? (st.last.days === 0 ? 'Trained today' : st.last.days === 1 ? 'Trained yesterday' : 'Last session ' + st.last.days + ' days ago') : 'No sessions';
      return '<div class="client-row" onclick="App.openClientById(' + js(c.id) + ')"><div class="client-mark' + (st.needsAttention ? ' flag' : '') + '">' + esc(c.name.split(' ').map(x => x[0]).join('').slice(0, 2)) + '</div>' +
        '<div class="client-body"><div class="name">' + esc(c.name) + '</div><div class="meta">' + esc(c.focus + ' · ' + c.plan) + '</div><div class="last">' + esc(last) + '</div>' +
        (st.flags.length ? '<div class="client-flag">' + esc(st.flags[0]) + '</div>' : '') + '</div></div>';
    }).join('');
    return '<div class="screen">' +
      '<div class="topbar"><div><div class="h1">Clients</div><div style="font:600 10px/1.4 Archivo;letter-spacing:.12em;text-transform:uppercase;color:#605d5d;margin-top:6px">' + s.clients.length + ' client' + (s.clients.length === 1 ? '' : 's') + '</div></div>' +
      '<div style="font:800 10px/1 Archivo;letter-spacing:.1em;text-transform:uppercase;color:#ae1800;padding-bottom:4px">' + esc(n ? n + ' need' + (n === 1 ? 's' : '') + ' a look' : 'Everyone on track') + '</div></div>' +
      '<div class="scroll">' + rows + '<div class="auth-footnote" style="padding:18px 16px 0">Demo roster held on this device. Real client sync needs a server.</div></div></div>';
  },

  renderClient() {
    const s = this.state;
    const client = s.clients.find(c => c.id === s.clientId);
    const cst = this.clientStats(client);
    const bests = cst.bests.map(b => '<div class="best-row"><div><div class="name">' + esc(b.name) + '</div><div class="latest">Latest ' + esc(this.fmtVal(b.kind, b.latest)) + ' · ' + b.count + ' entr' + (b.count > 1 ? 'ies' : 'y') + '</div></div>' +
      '<div class="right"><div class="val">' + esc(this.fmtVal(b.kind, b.best)) + '</div><div class="dir" style="color:' + (b.dir > 0 ? '#ae1800' : b.dir < 0 ? '#605d5d' : '#9b9797') + '">' + (b.dir > 0 ? '▲ up' : b.dir < 0 ? '▼ down' : 'flat') + '</div></div></div>').join('');
    const sets = cst.all.slice(0, 8).map(e => '<div class="set-row"><span style="font:600 13px/1.25 Archivo">' + esc(e.name) + '</span><span style="font:400 11px/1.2 Archivo;color:#605d5d">' + esc(this.fmtVal(e.kind, e.value)) + ' · ' + (e.days === 0 ? 'today' : e.days === 1 ? 'yesterday' : e.days + ' days ago') + '</span></div>').join('');
    const assignPanel = s.assignFor ? '<div class="assign-panel">' + s.plans.map(p => '<button class="assign-opt" onclick="App.assignPlan(' + js(s.assignFor) + ',' + js(p.id) + ')"><span class="l">Day ' + p.day + ' — ' + esc(p.title) + '</span><span class="d">' + p.sections.reduce((a, x) => a + x.exercises.length, 0) + ' exercises</span></button>').join('') +
      '<button class="assign-cancel" onclick="App.set({assignFor:null})">Cancel</button></div>' : '';
    return '<div class="screen">' +
      '<div class="topbar-simple"><button class="back-btn" onclick="App.set({screen:\'clients\',clientId:null,assignFor:null})">' + ICONS.back + ' All clients</button>' +
      '<div class="h2">' + esc(client.name) + '</div><div style="font:400 12px/1.3 Archivo;color:#605d5d;margin-top:5px">' + esc(client.focus + ' · ' + client.plan) + '</div></div>' +
      '<div class="scroll">' +
      (cst.flags.length ? '<div class="client-alert"><div class="k">Needs a look</div>' + cst.flags.map(fl => '<div class="line">' + esc(fl) + '</div>').join('') + '</div>' : '') +
      '<div class="client-stat-grid"><div class="cell"><div class="k">Last session</div><div class="v">' + esc(cst.last ? (cst.last.days === 0 ? 'Today' : cst.last.days + 'd ago') : '—') + '</div></div>' +
      '<div class="cell"><div class="k">Days this week</div><div class="v">' + cst.days + '</div></div>' +
      '<div class="cell"><div class="k">Improving</div><div class="v">' + cst.prs + '</div></div></div>' +
      '<div class="list-head">Personal bests</div>' + bests +
      '<div class="list-head">Recent sets</div>' + sets +
      '<div class="section-pad"><button class="btn" onclick="App.set({assignFor:' + js(client.id) + '})">' + ICONS.plusSm + 'Assign a plan</button>' + assignPanel + '</div>' +
      '</div></div>';
  }
});

// -----------------------------------------------------------------------------
// 24. OVERLAYS
// -----------------------------------------------------------------------------
Object.assign(App, {
  renderSession() {
    const s = this.state;
    const sess = s.session;
    const list = this.sessionList(sess.planId);
    const bar = Math.round(100 * sess.idx / Math.max(1, list.length));
    if (sess.done) {
      return '<div class="overlay overlay-light">' +
        '<div class="overlay-head b-light"><div><div class="t">Follow along</div></div><button class="close-btn" onclick="App.closeSession()">' + ICONS.x + '</button></div>' +
        '<div class="rail"><div style="width:' + bar + '%"></div></div>' +
        '<div class="overlay-body"><div class="session-summary"><div class="k">Session complete</div><div class="h">That is the whole thing done.</div>' +
        '<div class="s1">' + sess.logged + ' logged · ' + sess.skipped + ' skipped</div><div class="s2">+' + (sess.logged * 10) + ' pts banked</div>' +
        '<div class="n">Everything you logged is in Progress now, with your best, average and the line since your first attempt.</div>' +
        '<button class="btn btn-block" onclick="App.closeSession()">Done</button></div></div></div>';
    }
    const ex = list[sess.idx];
    const kind = this.metricOf(ex);
    const st = this.statsFor(ex.id);
    const u = s.unit.toUpperCase();
    const stepsVals = kind === 'time' ? [-0.5, -0.1, 0.1, 0.5] : kind === 'reps' ? [-5, -1, 1, 5] : s.unit === 'kg' ? [-5, -2.5, 2.5, 5] : [-10, -5, 5, 10];
    const steps = '<div class="steps-grid">' + stepsVals.map(d => '<button onclick="App.set({input:String(Math.max(0,Math.round((parseFloat(App.state.input)||0)*100+' + (d * 100) + ')/100))})">' + (d > 0 ? '+' : '') + d + '</button>').join('') + '</div>';
    return '<div class="overlay overlay-light">' +
      '<div class="overlay-head b-light"><div><div class="t">Follow along</div><div style="font:600 10px/1.4 Archivo;letter-spacing:.12em;text-transform:uppercase;color:#605d5d;margin-top:5px">' + (sess.idx + 1) + ' of ' + list.length + '</div></div>' +
      '<button class="close-btn" onclick="App.closeSession()">' + ICONS.x + '</button></div>' +
      '<div class="rail"><div style="width:' + bar + '%"></div></div>' +
      '<div class="overlay-body">' +
      '<div onclick="App.watchById(' + js(ex.id) + ')" class="video-panel"><div class="play"><span>' + ICONS.play + '</span></div><div class="t">Watch the movement</div></div>' +
      '<div class="session-body"><div class="k">' + esc(ex.section) + '</div><div class="name">' + esc(ex.name) + '</div><div class="detail">' + esc(this.prescription(ex)) + '</div>' +
      '<div class="last">' + esc(st ? 'Last ' + this.fmtVal(st.kind, st.latest) + ' · best ' + this.fmtVal(st.kind, st.best) : 'No record yet — set one') + '</div>' +
      (kind ? '<div class="input-row" style="margin-top:14px"><input id="session-input" class="input-big" type="number" step="0.5" min="0" inputmode="decimal" placeholder="0" value="' + esc(s.input) + '" oninput="App.set({input:this.value})"><div class="unit">' + (kind === 'time' ? 'SEC' : kind === 'reps' ? 'REPS' : u) + '</div></div>' + steps : '') +
      '<button class="btn btn-block" style="margin-top:12px" onclick="App.sessionLog()">Log and continue</button>' +
      '<button class="btn-outline" style="margin:10px 0 24px" onclick="App.sessionAdvance(false)">Skip this one</button>' +
      '</div></div></div>';
  },

  renderGhost() {
    const s = this.state;
    const targets = this.ghostTargets();
    if (!s.ghost) {
      return '<div class="overlay overlay-dark"><div class="overlay-head b-dark"><div class="t">Beat your ghost</div><button class="close-btn on-dark" onclick="App.closeOverlay()">' + ICONS.x + '</button></div>' +
        '<div class="overlay-body"><div style="padding:24px 16px;font:400 13px/1.6 Archivo;color:#d7d3d3">No timed exercise has a recorded time yet. Log one sprint or drill and your ghost will be waiting here.</div></div></div>';
    }
    const g = s.ghost;
    const ex = this.findEx(g.exId);
    const running = g.running;
    const diff = running ? (g.elapsed > g.target ? '+' + (g.elapsed - g.target).toFixed(2) + ' behind ghost' : 'ahead of ghost') : 'Tap start when you go';
    const picker = targets.map(t => '<button class="ghost-pick' + (g.exId === t.ex.id ? ' on' : '') + '" onclick="App.pickGhost(' + js(t.ex.id) + ',' + t.st.best + ')"><span>' + esc(t.ex.name) + '</span><span>Best ' + esc(this.fmtVal('time', t.st.best)) + '</span></button>').join('');
    return '<div class="overlay overlay-dark"><div class="overlay-head b-dark"><div class="t">Beat your ghost</div><button class="close-btn on-dark" onclick="App.closeOverlay()">' + ICONS.x + '</button></div>' +
      '<div class="overlay-body"><div class="ghost-body"><div class="k">Chasing</div><div class="name">' + esc(ex ? ex.name : '') + '</div><div class="target">Ghost time ' + esc(this.fmtVal('time', g.target)) + '</div>' +
      '<div class="ghost-clock">' + (Math.round(g.elapsed * 100) / 100).toFixed(2) + '</div>' +
      '<div class="ghost-diff">' + esc(diff) + '</div>' +
      (!running ? '<button class="btn btn-block" onclick="App.startGhost()">Start</button>' : '<button class="btn light btn-block" onclick="App.stopGhost()">Stop and log</button>') +
      (g.result ? '<div class="ghost-result"><div class="t">' + esc(g.result.win ? 'Ghost beaten by ' + g.result.gap.toFixed(2) + 's' : 'Ghost won by ' + g.result.gap.toFixed(2) + 's') + '</div><div class="n">' + esc(g.result.win ? 'Logged ' + g.result.value.toFixed(2) + 's · +40 pts' : 'Logged ' + g.result.value.toFixed(2) + 's · +10 pts for showing up') + '</div></div>' : '') +
      '</div><div class="ghost-pick-label">Pick another ghost</div>' + picker + '</div></div>';
  },

  renderWheel() {
    const s = this.state;
    const w = s.wheel || { index: 0, spinning: false, landed: null };
    const f = w.landed || FINISHERS[w.index];
    return '<div class="overlay overlay-light"><div class="overlay-head b-light"><div class="t">Spin a finisher</div><button class="close-btn" onclick="App.closeOverlay()">' + ICONS.x + '</button></div>' +
      '<div class="overlay-body"><div class="wheel-body"><div class="wheel-box"><div class="k">Your finisher</div><div class="name">' + esc(f.name) + '</div><div class="note">' + esc(f.note) + '</div></div>' +
      '<button class="btn btn-block" onclick="App.spinWheel()">Spin</button>' +
      (w.landed ? '<div class="wheel-locked">Locked in. +5 pts, and it ticks the spin task on this week\'s card.</div>' : '') +
      '<div class="auth-footnote">Ten finishers in the drum. Whatever lands, you do at the end of today\'s session.</div></div></div></div>';
  },

  renderRounds() {
    const s = this.state;
    const r = s.rounds;
    const phaseLabel = { ready: 'Ready', work: 'Round ' + (r.idx + 1) + ' of ' + r.total, rest: 'Rest', done: 'Finished' }[r.phase];
    const clock = Math.floor(r.left / 60) + ':' + pad2(r.left % 60);
    const barPct = Math.round(100 * (1 - r.left / Math.max(1, r.phase === 'rest' ? r.rest : r.work)));
    const note = { ready: 'Set it up, then hit the bell.', work: 'Work. Rest comes at zero.', rest: 'Breathe. Next round starts automatically.', done: 'All rounds complete — logged to your week.' }[r.phase];
    const opt = (list, key, fmt) => '<div class="rounds-opt-row">' + list.map(v => '<button class="' + (r[key] === v ? 'on' : '') + '" onclick="App.setRounds(' + js(key) + ',' + v + ')">' + fmt(v) + '</button>').join('') + '</div>';
    return '<div class="rounds-shell" style="background:' + (r.phase === 'rest' ? '#201e1d' : '#ec3013') + '">' +
      '<div class="overlay-head b-dark"><div class="t">Round timer</div><div style="display:flex;align-items:center;gap:8px">' +
      '<button class="sound-btn' + (s.muted ? ' off' : '') + '" onclick="App.toggleMute()">' + (s.muted ? 'Sound off' : 'Sound on') + '</button>' +
      '<button class="close-btn on-dark" onclick="App.closeRounds()">' + ICONS.x + '</button></div></div>' +
      '<div class="rail" style="background:rgba(255,255,255,.3)"><div style="background:#fff;opacity:.9;width:' + barPct + '%"></div></div>' +
      '<div class="rounds-body"><div class="rounds-phase">' + esc(phaseLabel) + '</div><div class="rounds-clock">' + clock + '</div><div class="rounds-note">' + esc(note) + '</div>' +
      '<div class="rounds-actions">' + (!r.running ? '<button class="rounds-start" onclick="App.startRounds()">Ring the bell</button>' : '<button class="rounds-pause" onclick="App.pauseRounds()">Pause</button>') + '</div>' +
      (!r.running && r.phase !== 'rest' ? '<div class="rounds-setup"><div class="k">Rounds</div>' + opt([3, 5, 8, 10, 12], 'total', v => v) +
        '<div class="k">Work</div>' + opt([60, 120, 180, 300], 'work', v => v >= 60 ? (v / 60) + ' min' : v + 's') +
        '<div class="k">Rest</div>' + opt([30, 45, 60, 90], 'rest', v => v + 's') + '</div>' : '') +
      '</div></div>';
  },

  renderReport() {
    const s = this.state;
    const d = s.report;
    const title = d.scope === 'day' ? "Today's report" : "This week's report";
    const sub = d.sets + ' set' + (d.sets === 1 ? '' : 's') + ' · ' + d.days + ' day' + (d.days === 1 ? '' : 's');
    const rowGroup = (label, rows, cls) => rows.length ? '<div class="list-head">' + label + '</div>' + rows.map(r => '<div class="report-row"><div class="name">' + esc(r.name) + '</div><div class="line ' + cls + '">' + esc(r.line) + '</div></div>').join('') : '';
    return '<div class="overlay overlay-light"><div class="overlay-head b-light"><div><div style="font:800 22px/1.05 Archivo;letter-spacing:-.02em;text-transform:uppercase">' + esc(title) + '</div><div style="font:600 10px/1.4 Archivo;letter-spacing:.12em;text-transform:uppercase;color:#605d5d;margin-top:6px">' + esc(sub) + '</div></div>' +
      '<button class="close-btn" onclick="App.closeReport()">' + ICONS.x + '</button></div>' +
      '<div class="overlay-body">' +
      (d.sets ? '<div class="coach-readout"><div class="k">Coach read-out</div><div class="body">' + esc(s.reportText) + '</div></div>' : '<div class="empty-note-pad">Nothing logged in this window, so there is nothing to report on yet.</div>') +
      rowGroup('Best results', d.strong, 'pos') + rowGroup('Below your best', d.weak, 'neu') + rowGroup('Going cold', d.stale, 'neu') +
      '</div></div>';
  },

  renderBusy() {
    return '<div class="busy-overlay"><div class="k">Reading your plan</div><div class="h">Pulling exercises, sets and loads out of your file.</div>' +
      '<div class="progress-bar-track"><div class="fill"></div></div><div class="n">' + esc(this.state.busyFile) + '</div></div>';
  },

  renderRest() {
    const r = this.state.rest;
    const clock = Math.floor(r.left / 60) + ':' + pad2(r.left % 60);
    const pct = Math.round(100 * r.left / Math.max(1, r.total));
    return '<div class="rest-sheet"><div class="rest-sheet-top"><div><div class="k">Rest</div><div class="clock">' + clock + '</div></div>' +
      '<button class="done-btn" onclick="App.stopRest()">Done</button></div>' +
      '<div class="rest-track"><div class="fill" style="width:' + pct + '%"></div></div>' +
      (r.left === 0 ? '<div class="rest-done-note">Time — go again</div>' : '') + '</div>';
  },

  renderPb() {
    const pb = this.state.pb;
    return '<div class="pb-overlay" onclick="App.set({pb:null})"><div class="head">' + esc(pb.head) + '</div>' +
      '<div class="value">' + esc(pb.value) + '</div><div class="name">' + esc(pb.name) + '</div><div class="gain">' + esc(pb.gain) + '</div>' +
      (pb.prev ? '<div class="prev">Old best ' + esc(pb.prev) + '</div>' : '') +
      '<div class="tap">Tap to carry on</div></div>';
  }
});

// -----------------------------------------------------------------------------
// 25. RECORD YOURSELF — camera capture + on-device clip storage
// -----------------------------------------------------------------------------
Object.assign(App, {
  async loadClips() {
    try {
      const all = await idbAllClips();
      this.set({ clips: all.map(c => ({ id: c.id, trendId: c.trendId || null, exId: c.exId || null, logEntryId: c.logEntryId || null, title: c.title, date: c.date })).sort((a, b) => new Date(b.date) - new Date(a.date)) });
    } catch (e) {}
  },
  pickMimeType() {
    const options = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
    for (const o of options) { if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(o)) return o; }
    return '';
  },
  async openRecorder(opts) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.toast('This browser has no camera access to record with'); return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      this._stream = stream;
      this.set({ overlay: 'record', record: { trendId: opts.trendId || null, exId: opts.exId || null, title: opts.title, recording: false, done: false, elapsed: 0, value: '', note: '' } });
    } catch (e) {
      this.toast('Camera access denied — check your browser permissions');
    }
  },
  openRecorderById(id) {
    const t = this.state.trends.find(x => x.id === id);
    if (t) this.openRecorder({ trendId: t.id, title: t.title });
  },
  openRecorderForExercise(exId) {
    const ex = this.findEx(exId);
    if (ex) this.openRecorder({ exId: exId, title: ex.name });
  },
  attachPreview() {
    const v = document.getElementById('record-video');
    if (v && this._stream && !v.srcObject) v.srcObject = this._stream;
  },
  startRecording() {
    if (!this._stream) return;
    const chunks = [];
    const mimeType = this.pickMimeType();
    const mr = new MediaRecorder(this._stream, mimeType ? { mimeType: mimeType } : undefined);
    mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunks, { type: mr.mimeType || 'video/webm' });
      this._recordedBlob = blob;
      const url = URL.createObjectURL(blob);
      this.set({ record: Object.assign({}, this.state.record, { recording: false, done: true, previewUrl: url }) });
    };
    this._recorder = mr;
    mr.start();
    const t0 = Date.now();
    clearInterval(this._timers.rec);
    this.set({ record: Object.assign({}, this.state.record, { recording: true, elapsed: 0 }) });
    this._timers.rec = setInterval(() => {
      this.set({ record: Object.assign({}, this.state.record, { elapsed: (Date.now() - t0) / 1000 }) });
    }, 250);
  },
  stopRecording() {
    clearInterval(this._timers.rec);
    if (this._recorder && this._recorder.state !== 'inactive') this._recorder.stop();
  },
  retakeRecording() {
    if (this.state.record && this.state.record.previewUrl) URL.revokeObjectURL(this.state.record.previewUrl);
    this._recordedBlob = null;
    this.set({ record: Object.assign({}, this.state.record, { recording: false, done: false, elapsed: 0, previewUrl: null }) });
  },
  async saveRecording() {
    const r = this.state.record;
    if (!r || !this._recordedBlob) return;
    let logEntryId = null;
    if (r.exId) {
      const entry = this.commitLog(r.exId, r.value, r.note);
      if (entry) logEntryId = entry.id;
    }
    const id = uid('clip');
    const record = { id: id, trendId: r.trendId || null, exId: r.exId || null, logEntryId: logEntryId, title: r.title, date: new Date().toISOString(), blob: this._recordedBlob };
    try {
      await idbPutClip(record);
      this.toast(logEntryId ? 'Saved the set and the clip' : 'Saved to this workout');
      this.closeRecorder();
      this.loadClips();
    } catch (e) {
      this.toast("Couldn't save that clip — storage may be full");
    }
  },
  closeRecorder() {
    clearInterval(this._timers.rec);
    if (this._recorder && this._recorder.state !== 'inactive') { try { this._recorder.stop(); } catch (e) {} }
    if (this._stream) { this._stream.getTracks().forEach(t => t.stop()); this._stream = null; }
    if (this.state.record && this.state.record.previewUrl) URL.revokeObjectURL(this.state.record.previewUrl);
    this._recorder = null; this._recordedBlob = null;
    this.set({ overlay: null, record: null });
  },
  async togglePlayClip(id) {
    const openId = this._openClipId === id ? null : id;
    this._openClipId = openId;
    if (openId && !this._clipUrls) this._clipUrls = {};
    if (openId && !this._clipUrls[openId]) {
      const rec = await idbGetClip(openId);
      if (rec) this._clipUrls[openId] = URL.createObjectURL(rec.blob);
    }
    this.render();
  },
  async deleteClip(id) {
    await idbDeleteClip(id);
    if (this._clipUrls && this._clipUrls[id]) { URL.revokeObjectURL(this._clipUrls[id]); delete this._clipUrls[id]; }
    if (this._openClipId === id) this._openClipId = null;
    this.toast('Recording deleted');
    this.loadClips();
  },
  renderRecord() {
    const s = this.state;
    const r = s.record;
    const clock = (Math.floor(r.elapsed / 60)) + ':' + pad2(Math.floor(r.elapsed % 60));
    const ex = r.exId ? this.findEx(r.exId) : null;
    const kind = ex ? this.metricOf(ex) : null;
    let body;
    if (r.done) {
      let logBlock = '';
      if (ex && kind) {
        const u = s.unit.toUpperCase();
        const stepsVals = kind === 'time' ? [-0.5, -0.1, 0.1, 0.5] : kind === 'reps' ? [-5, -1, 1, 5] : s.unit === 'kg' ? [-5, -2.5, 2.5, 5] : [-10, -5, 5, 10];
        const steps = '<div class="steps-grid">' + stepsVals.map(d => '<button onclick="App.set({record:Object.assign({},App.state.record,{value:String(Math.max(0,Math.round((parseFloat(App.state.record.value)||0)*100+' + (d * 100) + ')/100))})})">' + (d > 0 ? '+' : '') + d + '</button>').join('') + '</div>';
        logBlock = '<div class="record-log"><div class="kicker-lg">Log this set — optional</div>' +
          '<div class="input-row" style="margin-top:8px"><input id="record-value" class="input-big" type="number" step="0.5" min="0" inputmode="decimal" placeholder="0" value="' + esc(r.value || '') + '" oninput="App.set({record:Object.assign({},App.state.record,{value:this.value})})"><div class="unit">' + (kind === 'time' ? 'SEC' : kind === 'reps' ? 'REPS' : u) + '</div></div>' +
          steps + '</div>';
      }
      body = '<video id="record-playback" src="' + esc(r.previewUrl) + '" class="record-video" controls playsinline></video>' +
        logBlock +
        '<div class="record-actions">' +
        '<button class="btn" onclick="App.saveRecording()">' + ICONS.plusSm + (ex && kind ? 'Save set &amp; clip' : 'Save clip') + '</button>' +
        '<button class="btn-outline" onclick="App.retakeRecording()">Retake</button>' +
        '</div>';
    } else {
      body = '<video id="record-video" class="record-video" autoplay muted playsinline></video>' +
        (r.recording ? '<div class="record-clock">' + clock + '</div>' : '') +
        '<div class="record-actions">' +
        (!r.recording ? '<button class="btn" onclick="App.startRecording()">' + ICONS.play + 'Start recording</button>' : '<button class="btn light" onclick="App.stopRecording()">Stop</button>') +
        '</div>';
    }
    return '<div class="overlay overlay-dark"><div class="overlay-head b-dark"><div><div class="t">Record yourself</div><div style="font:400 11px/1.3 Archivo;color:#d7d3d3;margin-top:4px">' + esc(r.title) + '</div></div>' +
      '<button class="close-btn on-dark" onclick="App.closeRecorder()">' + ICONS.x + '</button></div>' +
      '<div class="overlay-body"><div class="record-body">' + body + '<div class="auth-footnote" style="color:#9b9797">Stays on this device — nothing is uploaded.</div></div></div></div>';
  },
  renderClipsFor(matchKey, matchId) {
    const list = this.state.clips.filter(c => c[matchKey] === matchId);
    if (!list.length) return '';
    return '<div class="clip-list"><div class="clip-list-label">Your recordings</div>' +
      list.map(c => {
        const open = this._openClipId === c.id;
        const url = this._clipUrls && this._clipUrls[c.id];
        const entry = c.logEntryId ? this.state.log.find(e => e.id === c.logEntryId) : null;
        return '<div class="clip-row"><button class="clip-play" onclick="event.stopPropagation();App.togglePlayClip(' + js(c.id) + ')">' + (open ? ICONS.x : ICONS.playSm) + '<span>' + esc(this.dateLabel(c.date)) + ' · ' + esc(this.daysAgo(c.date)) + (entry ? ' · ' + esc(this.fmtVal(entry.kind, entry.value)) : '') + '</span></button>' +
          '<button class="icon-btn" title="Delete recording" onclick="event.stopPropagation();App.deleteClip(' + js(c.id) + ')">' + ICONS.x + '</button></div>' +
          (open && url ? '<video src="' + esc(url) + '" class="clip-video" controls playsinline></video>' : '');
      }).join('') + '</div>';
  }
});

// -----------------------------------------------------------------------------
// 26. BOOTSTRAP
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => App.init());
