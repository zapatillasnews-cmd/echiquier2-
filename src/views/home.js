import { isSupabaseConfigured } from '../supabase.js'

// Petit systeme de niveaux local (pas de back-end requis).
const LEVELS = [
  { min: 0,   name: 'Pion curieux',        icon: '♟️' },
  { min: 40,  name: 'Cavalier agile',      icon: '♞' },
  { min: 100, name: 'Fou rusé',            icon: '♝' },
  { min: 200, name: 'Tour solide',         icon: '♜' },
  { min: 340, name: 'Dame stratège',       icon: '♛' },
  { min: 520, name: 'Roi des ouvertures',  icon: '♚' }
]

function num(key) { return Number(localStorage.getItem(key) || 0) }
function solvedCount() {
  try { return JSON.parse(localStorage.getItem('puzzles_solved') || '[]').length } catch { return 0 }
}

function levelInfo(xp) {
  let cur = LEVELS[0], next = null
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) { cur = LEVELS[i]; next = LEVELS[i + 1] || null }
  }
  const progress = next ? (xp - cur.min) / (next.min - cur.min) : 1
  return { cur, next, progress: Math.max(0, Math.min(1, progress)) }
}

// Cartes "destinations" facon couvertures de carnet.
const MODULES = [
  { hash: '#/parties',  icon: '📚', name: 'Mes parties',     desc: 'Ta base de parties (PGN)',  cover: '#7d9bb8', dark: '#5d7c98', auth: true },
  { hash: '#/etudes',   icon: '🌳', name: 'Études',          desc: 'Ouvertures & variantes',     cover: '#8aab8a', dark: '#6a8c6a', auth: true },
  { hash: '#/revision', icon: '🔁', name: 'Révision',        desc: 'Ouvertures à revoir',        cover: '#e0a83c', dark: '#b9852a', auth: true },
  { hash: '#/puzzles',  icon: '🧩', name: 'Problèmes',       desc: 'Tactiques + explications',   cover: '#d96f4c', dark: '#b5542f', auth: false },
  { hash: '#/jouer',    icon: '♟️', name: 'Échiquier libre', desc: 'Joue et analyse',            cover: '#c2728f', dark: '#9c5070', auth: false },
  { hash: '#/minijeux', icon: '🎯', name: 'Mini-jeux',       desc: 'Coordonnées, cavalier…',     cover: '#7d9bb8', dark: '#5d7c98', auth: false },
  { hash: '#/minijeux/meilleurcoup', icon: '🤖', name: 'Meilleur coup', desc: 'Affronte Stockfish', cover: '#6e7f8d', dark: '#54636f', auth: false }
]

export function renderHome(container, navigate) {
  const solved = solvedCount()
  const xp = solved * 20 + num('mg_best_coord') + num('mg_best_knight')
  const lvl = levelInfo(xp)
  const nextTxt = lvl.next ? `${lvl.next.min - xp} XP avant « ${lvl.next.name} »` : 'Niveau maximum atteint !'

  const cards = MODULES
    .filter((m) => !m.auth || isSupabaseConfigured)
    .map((m) => `
      <button class="module-card" data-hash="${m.hash}" style="--cover:${m.cover};--cover-dark:${m.dark}">
        <span class="module-icon">${m.icon}</span>
        <span class="module-name">${m.name}</span>
        <span class="module-desc">${m.desc}</span>
      </button>`).join('')

  container.innerHTML = `
    <header class="head-stats" style="margin-bottom:16px">
      <div class="stat-chip" title="Problèmes résolus"><span>🧩</span><b>${solved}</b></div>
      <div class="stat-chip" title="Record coordonnées"><span>⚡</span><b>${num('mg_best_coord')}</b></div>
    </header>

    <section class="level-banner card">
      <span class="level-icon">${lvl.cur.icon}</span>
      <div class="level-info">
        <b class="level-name">${lvl.cur.name}</b>
        <div class="xp-bar"><div class="xp-fill" style="width:${Math.round(lvl.progress * 100)}%"></div></div>
        <small>${nextTxt}</small>
      </div>
    </section>

    <p class="daily-note">📌 Une étude ou trois problèmes aujourd'hui = tes ouvertures restent fraîches.</p>

    <h2 class="section-title script">Où veux-tu t'entraîner ?</h2>
    <div class="module-grid">${cards}</div>
  `

  container.querySelectorAll('.module-card').forEach((b) => {
    b.addEventListener('click', () => navigate(b.dataset.hash))
  })
}
