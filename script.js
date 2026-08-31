/* ============================================================
   TAPLARP — game logic
   Idle/tap game. All names below are invented parodies —
   ClawedAI, Cordway, etc. are not real products or companies.
   ============================================================ */

'use strict';

/* ---------- Static data ---------- */

const RANKS = [
  { threshold: 0,       name: 'Bozo',            emoji: '🤡',   line: 'You have $0 and a dream.' },
  { threshold: 25,      name: 'NPC',             emoji: '🚶',   line: 'Still walking to a 9-to-5, unfortunately.' },
  { threshold: 150,     name: 'Wagie',           emoji: '💼',   line: 'Trading time for money like a sucker.' },
  { threshold: 750,     name: 'Grindset Newbie', emoji: '📈',   line: '5am cold showers. Mandatory.' },
  { threshold: 3000,    name: 'Son',             emoji: '👦',   line: 'Ay, you already up? Get in, son.' },
  { threshold: 12000,   name: 'Sigma Bro',       emoji: '🗿',   line: 'Mewing, maxxing, and slightly unhinged.' },
  { threshold: 60000,   name: 'Certified Guru',  emoji: '🧘',   line: "You've never had a real job, but you teach business now." },
  { threshold: 250000,  name: 'Sensei',          emoji: '🥋',   line: 'Disciples. You have disciples now.' },
  { threshold: 1000000, name: 'Larper',          emoji: '🎭',   line: 'The lifestyle is 90% rented and 10% real.' },
  { threshold: 5000000, name: 'MAXLARPER',       emoji: '😎💯', line: "You have ascended. Nothing about this is real, and it doesn't matter." }
];

const GENERATORS = [
  {
    id: 'claudeai', name: 'ClawedAI Pro', emoji: '🤖',
    desc: 'Auto-writes make-money courses',
    unlockAt: 25, baseCost: 50, costMult: 1.15, rate: 0.5
  },
  {
    id: 'cordway', name: 'Cordway VIP Server', emoji: '💬',
    desc: 'Paid access to your courses',
    unlockAt: 300, baseCost: 500, costMult: 1.16, rate: 5
  },
  {
    id: 'rentalflex', name: 'Rental Flex Content', emoji: '🏎️',
    desc: 'Fake it for the reels',
    unlockAt: 5000, baseCost: 8000, costMult: 1.17, rate: 70
  },
  {
    id: 'coaching', name: 'Coaching-the-Coaches', emoji: '🎓',
    desc: 'Teach other larpers to sell courses',
    unlockAt: 100000, baseCost: 150000, costMult: 1.18, rate: 1200
  }
];

const TAP_BASE = 1;
const TAP_UPGRADE_BASE_COST = 25;
const TAP_UPGRADE_MULT = 1.6;
const OFFLINE_CAP_SECONDS = 8 * 3600; // 8 hours
const SAVE_KEY = 'taplarp_save_v1';
const TICK_MS = 100;

/* ---------- State ---------- */

let state = {
  stacks: 0,
  lifetime: 0,
  tapLevel: 0,
  owned: {},
  rankIndex: 0,
  lastSaved: Date.now()
};
GENERATORS.forEach(g => { state.owned[g.id] = 0; });

/* ---------- Derived getters ---------- */

function tapValue() {
  return TAP_BASE + state.tapLevel;
}

function tapUpgradeCost() {
  return Math.ceil(TAP_UPGRADE_BASE_COST * Math.pow(TAP_UPGRADE_MULT, state.tapLevel));
}

function generatorCost(gen) {
  const owned = state.owned[gen.id];
  return Math.ceil(gen.baseCost * Math.pow(gen.costMult, owned));
}

function ratePerSecond() {
  return GENERATORS.reduce((sum, g) => sum + state.owned[g.id] * g.rate, 0);
}

function currentRank() {
  return RANKS[state.rankIndex];
}

function nextRank() {
  return RANKS[Math.min(state.rankIndex + 1, RANKS.length - 1)];
}

/* ---------- Formatting ---------- */

function formatMoney(n, decimals) {
  decimals = decimals === undefined ? 0 : decimals;
  const sign = n < 0 ? '-' : '';
  n = Math.abs(n);
  if (n < 1000) return sign + '$' + n.toFixed(decimals);
  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi'];
  let unitIndex = -1;
  let val = n;
  while (val >= 1000 && unitIndex < units.length - 1) {
    val /= 1000;
    unitIndex++;
  }
  return sign + '$' + val.toFixed(2) + units[unitIndex];
}

/* ---------- DOM refs ---------- */

const el = {
  rankEmoji: document.getElementById('rank-emoji'),
  rankName: document.getElementById('rank-name'),
  stacksValue: document.getElementById('stacks-value'),
  rateValue: document.getElementById('rate-value'),
  tapBtn: document.getElementById('tap-btn'),
  tapValueLabel: document.getElementById('tap-value-label'),
  tapUpgradeBtn: document.getElementById('tap-upgrade-btn'),
  tapUpgradeCost: document.getElementById('tap-upgrade-cost'),
  generatorList: document.getElementById('generator-list'),
  nextRankName: document.getElementById('next-rank-name'),
  progressFill: document.getElementById('progress-bar-fill'),
  resetBtn: document.getElementById('reset-btn'),
  rankupModal: document.getElementById('rankup-modal'),
  rankupEmoji: document.getElementById('rankup-emoji'),
  rankupName: document.getElementById('rankup-name'),
  rankupLine: document.getElementById('rankup-line'),
  rankupClose: document.getElementById('rankup-close'),
  offlineModal: document.getElementById('offline-modal'),
  offlineAmount: document.getElementById('offline-amount'),
  offlineClose: document.getElementById('offline-close'),
  ascendModal: document.getElementById('ascend-modal'),
  ascendClose: document.getElementById('ascend-close'),
  tapSection: document.getElementById('tap-section')
};

/* ---------- Build generator rows once ---------- */

const generatorRowRefs = {};

function buildGeneratorRows() {
  GENERATORS.forEach(gen => {
    const row = document.createElement('button');
    row.className = 'shop-item locked';
    row.innerHTML =
      '<div class="shop-item-left">' +
        '<span class="shop-emoji">' + gen.emoji + '</span>' +
        '<div class="shop-text">' +
          '<div class="shop-name">' + gen.name + '</div>' +
          '<div class="shop-desc">' + gen.desc + '</div>' +
          '<div class="shop-owned" data-role="owned">Owned: 0 · +$0.0/sec</div>' +
        '</div>' +
      '</div>' +
      '<div class="shop-cost" data-role="cost">$' + gen.baseCost + '</div>';

    row.addEventListener('click', () => buyGenerator(gen));
    el.generatorList.appendChild(row);

    generatorRowRefs[gen.id] = {
      row: row,
      costEl: row.querySelector('[data-role="cost"]'),
      ownedEl: row.querySelector('[data-role="owned"]')
    };
  });
}

/* ---------- Actions ---------- */

function onTap(clientX, clientY) {
  const value = tapValue();
  state.stacks += value;
  state.lifetime += value;
  spawnFloatingNumber(value);
  checkRankUp();
  render();
}

function buyTapUpgrade() {
  const cost = tapUpgradeCost();
  if (state.stacks < cost) return;
  state.stacks -= cost;
  state.tapLevel += 1;
  render();
  save();
}

function buyGenerator(gen) {
  if (state.lifetime < gen.unlockAt) return;
  const cost = generatorCost(gen);
  if (state.stacks < cost) return;
  state.stacks -= cost;
  state.owned[gen.id] += 1;
  render();
  save();
}

function checkRankUp() {
  let newIndex = state.rankIndex;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (state.lifetime >= RANKS[i].threshold) { newIndex = i; break; }
  }
  if (newIndex > state.rankIndex) {
    const reachedMax = newIndex === RANKS.length - 1;
    state.rankIndex = newIndex;
    save();
    if (reachedMax) {
      showAscendModal();
    } else {
      showRankUpModal(RANKS[newIndex]);
    }
  }
}

function resetGame() {
  const ok = window.confirm('Start a brand new larp from $0? This wipes your current progress.');
  if (!ok) return;
  localStorage.removeItem(SAVE_KEY);
  state = { stacks: 0, lifetime: 0, tapLevel: 0, owned: {}, rankIndex: 0, lastSaved: Date.now() };
  GENERATORS.forEach(g => { state.owned[g.id] = 0; });
  render();
}

/* ---------- Floating tap feedback ---------- */

function spawnFloatingNumber(value) {
  const num = document.createElement('div');
  num.className = 'float-num';
  num.textContent = '+' + formatMoney(value, value < 10 ? 0 : 0);
  const offsetX = (Math.random() - 0.5) * 40;
  num.style.left = 'calc(50% + ' + offsetX + 'px)';
  el.tapSection.appendChild(num);
  setTimeout(() => num.remove(), 850);
}

/* ---------- Modals ---------- */

function showRankUpModal(rank) {
  el.rankupEmoji.textContent = rank.emoji;
  el.rankupName.textContent = rank.name;
  el.rankupLine.textContent = rank.line;
  el.rankupModal.classList.remove('hidden');
}

function showAscendModal() {
  el.ascendModal.classList.remove('hidden');
}

function showOfflineModal(amount) {
  el.offlineAmount.textContent = '+' + formatMoney(amount, 2);
  el.offlineModal.classList.remove('hidden');
}

/* ---------- Render ---------- */

function render() {
  const rank = currentRank();
  el.rankEmoji.textContent = rank.emoji;
  el.rankName.textContent = rank.name;

  el.stacksValue.textContent = formatMoney(state.stacks, state.stacks < 1000 ? 0 : 2);
  el.rateValue.textContent = '+' + formatMoney(ratePerSecond(), 1) + '/sec';

  el.tapValueLabel.textContent = '+' + formatMoney(tapValue()) + ' / tap';

  const tCost = tapUpgradeCost();
  el.tapUpgradeCost.textContent = formatMoney(tCost);
  el.tapUpgradeBtn.classList.toggle('affordable', state.stacks >= tCost);

  GENERATORS.forEach(gen => {
    const refs = generatorRowRefs[gen.id];
    const unlocked = state.lifetime >= gen.unlockAt;
    const cost = generatorCost(gen);
    const owned = state.owned[gen.id];

    refs.row.classList.toggle('locked', !unlocked);
    if (!unlocked) {
      refs.costEl.textContent = 'Unlocks at ' + formatMoney(gen.unlockAt);
      refs.ownedEl.textContent = 'Keep hustling to unlock this';
      refs.row.classList.remove('affordable');
    } else {
      refs.costEl.textContent = formatMoney(cost);
      refs.ownedEl.textContent = 'Owned: ' + owned + ' · +' + formatMoney(gen.rate * owned, 1) + '/sec';
      refs.row.classList.toggle('affordable', state.stacks >= cost);
    }
  });

  // Progress bar toward next rank
  const rankNow = RANKS[state.rankIndex];
  const rankNext = nextRank();
  el.nextRankName.textContent = state.rankIndex === RANKS.length - 1 ? 'MAXLARPER (achieved!)' : rankNext.name;
  if (state.rankIndex === RANKS.length - 1) {
    el.progressFill.style.width = '100%';
  } else {
    const span = rankNext.threshold - rankNow.threshold;
    const progressed = state.lifetime - rankNow.threshold;
    const pct = span > 0 ? Math.max(0, Math.min(100, (progressed / span) * 100)) : 100;
    el.progressFill.style.width = pct + '%';
  }
}

/* ---------- Save / Load ---------- */

function save() {
  state.lastSaved = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    // localStorage unavailable (private browsing, etc) — game still works, just won't persist
    console.warn('Taplarp: could not save progress', e);
  }
}

function load() {
  let raw = null;
  try {
    raw = localStorage.getItem(SAVE_KEY);
  } catch (e) {
    console.warn('Taplarp: could not read save', e);
  }
  if (!raw) return;

  try {
    const loaded = JSON.parse(raw);
    state = Object.assign(state, loaded);
    GENERATORS.forEach(g => {
      if (!(g.id in state.owned)) state.owned[g.id] = 0;
    });

    // Grant offline progress
    const elapsedMs = Date.now() - (state.lastSaved || Date.now());
    const elapsedSec = Math.min(elapsedMs / 1000, OFFLINE_CAP_SECONDS);
    const rate = ratePerSecond();
    const earned = rate * elapsedSec;
    if (earned > 1) {
      state.stacks += earned;
      state.lifetime += earned;
      setTimeout(() => showOfflineModal(earned), 300);
    }
  } catch (e) {
    console.warn('Taplarp: corrupt save, starting fresh', e);
  }
}

/* ---------- Wire up events ---------- */

function init() {
  buildGeneratorRows();
  load();
  checkRankUp();
  render();

  el.tapBtn.addEventListener('click', (e) => onTap(e.clientX, e.clientY));
  el.tapUpgradeBtn.addEventListener('click', buyTapUpgrade);
  el.resetBtn.addEventListener('click', resetGame);

  el.rankupClose.addEventListener('click', () => el.rankupModal.classList.add('hidden'));
  el.offlineClose.addEventListener('click', () => el.offlineModal.classList.add('hidden'));
  el.ascendClose.addEventListener('click', () => el.ascendModal.classList.add('hidden'));

  // Idle tick
  setInterval(() => {
    const gain = ratePerSecond() * (TICK_MS / 1000);
    if (gain > 0) {
      state.stacks += gain;
      state.lifetime += gain;
      checkRankUp();
      render();
    }
  }, TICK_MS);

  // Autosave
  setInterval(save, 5000);
  window.addEventListener('beforeunload', save);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') save();
  });
}

document.addEventListener('DOMContentLoaded', init);
