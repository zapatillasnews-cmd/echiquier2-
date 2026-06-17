import { Chessground } from 'chessground'
import { Chess } from 'chess.js'
import { COURSES } from '../data/courses.js'
import { isSupabaseConfigured } from '../supabase.js'

/* ---------- Notation française ---------- */
const FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' }
function frSan(san) { return san.replace(/[KQRBN]/g, (c) => FR[c]) }

/* ---------- Progression (localStorage) ---------- */
const PKEY = 'course_progress_v1'
function loadProgress() { try { return JSON.parse(localStorage.getItem(PKEY) || '{}') } catch { return {} } }
function saveProgress(p) { localStorage.setItem(PKEY, JSON.stringify(p)) }
function doneSteps(courseId) { return loadProgress()[courseId] || [] }
function isStepDone(courseId, i) { return doneSteps(courseId).includes(i) }
function isStepUnlocked(courseId, i) { return i === 0 || isStepDone(courseId, i - 1) }
function markStepDone(courseId, i) {
  const p = loadProgress(); const arr = p[courseId] || []
  if (!arr.includes(i)) { arr.push(i); p[courseId] = arr; saveProgress(p) }
}
export function totalStepsDone() {
  const p = loadProgress(); return Object.values(p).reduce((n, a) => n + a.length, 0)
}
export function coursesXp() { return totalStepsDone() * 25 }

function getCourse(id) { return COURSES.find((c) => c.id === id) }

/* ---------- Niveaux ---------- */
const LEVELS = [
  { min: 0,   name: 'Pion curieux',       icon: '♟️' },
  { min: 75,  name: 'Cavalier agile',     icon: '♞' },
  { min: 175, name: 'Fou rusé',           icon: '♝' },
  { min: 300, name: 'Tour solide',        icon: '♜' },
  { min: 475, name: 'Dame stratège',      icon: '♛' },
  { min: 700, name: 'Roi des ouvertures', icon: '♚' }
]
function levelInfo(xp) {
  let cur = LEVELS[0], next = null
  for (let i = 0; i < LEVELS.length; i++) { if (xp >= LEVELS[i].min) { cur = LEVELS[i]; next = LEVELS[i + 1] || null } }
  const progress = next ? (xp - cur.min) / (next.min - cur.min) : 1
  return { cur, next, progress: Math.max(0, Math.min(1, progress)) }
}

/* =====================================================
   ACCUEIL : les cours d'ouvertures
   ===================================================== */
export function renderCoursesHome(container, navigate) {
  const done = totalStepsDone()
  const xp = coursesXp()
  const lvl = levelInfo(xp)
  const nextTxt = lvl.next ? `${lvl.next.min - xp} XP avant « ${lvl.next.name} »` : 'Niveau maximum atteint !'

  const covers = COURSES.map((c) => {
    const d = doneSteps(c.id).length, t = c.steps.length
    const pct = Math.round((d / t) * 100)
    return `
      <button class="course-cover" data-id="${c.id}" style="--cover:${c.cover};--cover-dark:${c.dark}">
        <span class="course-icon">${c.icon}</span>
        <span class="course-name script">${c.name}</span>
        <span class="course-tagline">${c.tagline}</span>
        <span class="course-progress">
          <span class="course-bar"><span style="width:${pct}%"></span></span>
          <span class="course-pct">${d}/${t}</span>
        </span>
        ${d === t ? '<span class="course-done">✅ Maîtrisée</span>' : ''}
      </button>`
  }).join('')

  const quick = []
  if (isSupabaseConfigured) {
    quick.push('<button class="btn secondary btn-sm" data-go="#/parties">📚 Mes parties</button>')
    quick.push('<button class="btn secondary btn-sm" data-go="#/etudes">🌳 Études</button>')
    quick.push('<button class="btn secondary btn-sm" data-go="#/revision">🔁 Révision</button>')
  }

  container.innerHTML = `
    <header class="head-stats" style="margin-bottom:16px">
      <div class="stat-chip" title="Étapes apprises"><span>📖</span><b>${done}</b></div>
      <div class="stat-chip" title="Expérience"><span>⭐</span><b>${xp}</b></div>
    </header>

    <section class="level-banner card">
      <span class="level-icon">${lvl.cur.icon}</span>
      <div class="level-info">
        <b class="level-name">${lvl.cur.name}</b>
        <div class="xp-bar"><div class="xp-fill" style="width:${Math.round(lvl.progress * 100)}%"></div></div>
        <small>${nextTxt}</small>
      </div>
    </section>

    <p class="daily-note">📌 Apprends une étape par jour : tes ouvertures rentreront tout seul.</p>

    <h2 class="section-title script">Tes cours d'ouvertures</h2>
    <div class="course-grid">${covers}</div>

    ${quick.length ? `<h2 class="section-title script">Aussi disponible</h2><div class="row">${quick.join('')}</div>` : ''}
  `

  container.querySelectorAll('.course-cover').forEach((b) => b.addEventListener('click', () => navigate('#/cours/' + b.dataset.id)))
  container.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => navigate(b.dataset.go)))
}

/* =====================================================
   ITINÉRAIRE d'un cours (les étapes)
   ===================================================== */
export function renderCourse(container, id, navigate) {
  const c = getCourse(id)
  if (!c) { navigate('#/accueil'); return }
  const d = doneSteps(id).length, t = c.steps.length
  const pct = Math.round((d / t) * 100)

  const stops = c.steps.map((s, i) => {
    const unlocked = isStepUnlocked(id, i)
    const complete = isStepDone(id, i)
    return `
      <li class="stop ${unlocked ? '' : 'locked'} ${complete ? 'complete' : ''}">
        <div class="stop-node">${complete ? '' : unlocked ? c.icon : '🔒'}${complete ? `<span class="stamp stamp-node">${c.icon}</span>` : ''}</div>
        <div class="stop-card card" ${unlocked ? `data-step="${i}"` : ''}>
          <div class="stop-head">
            <div>
              <b class="stop-title">Étape ${i + 1} · ${s.title}</b>
              <small class="stop-place">${s.place}</small>
            </div>
            ${complete ? '<span class="stamp stamp-visited">APPRIS</span>' : ''}
          </div>
          <p class="muted" style="margin:6px 0 0">${s.intro}</p>
          ${unlocked
            ? `<div class="row" style="margin-top:10px"><span class="btn btn-sm">${complete ? 'Revoir' : 'Commencer'} →</span></div>`
            : '<p class="muted" style="margin-top:8px">🔒 Termine l\'étape précédente pour débloquer.</p>'}
        </div>
      </li>`
  }).join('')

  container.innerHTML = `
    <header class="page-head">
      <button class="back-btn" id="back">← Cours</button>
      <div class="head-stats"><div class="stat-chip"><span>📖</span><b>${d}/${t}</b></div></div>
    </header>

    <section class="journal-header card" style="--cover:${c.cover}">
      <span class="journal-header-flag">${c.icon}</span>
      <div>
        <h1 class="script journal-title" style="margin:0">${c.name}</h1>
        <p class="muted">${c.eco} · ${c.tagline} · ${d}/${t} étapes</p>
        <div class="xp-bar small"><div class="xp-fill" style="width:${pct}%"></div></div>
      </div>
    </section>

    <ol class="route">${stops}</ol>
    <p class="route-end">🏁 Fin de l'itinéraire… d'autres lignes arriveront !</p>
  `

  container.querySelector('#back').addEventListener('click', () => navigate('#/accueil'))
  container.querySelectorAll('[data-step]').forEach((el) => el.addEventListener('click', () => navigate('#/cours/' + id + '/' + el.dataset.step)))
}

/* =====================================================
   ÉTAPE : on déroule la ligne théorique sur le plateau
   ===================================================== */
export function renderCourseStep(container, id, stepIdx, navigate) {
  const c = getCourse(id)
  if (!c || !c.steps[stepIdx]) { navigate('#/cours/' + id); return () => {} }
  if (!isStepUnlocked(id, stepIdx)) { navigate('#/cours/' + id); return () => {} }
  const step = c.steps[stepIdx]

  // Pré-calcule chaque position (FEN + dernier coup) à partir des SAN.
  const chess = new Chess()
  const plies = [{ fen: chess.fen(), lastMove: null, san: null, note: step.intro }]
  for (const mv of step.line) {
    const m = chess.move(mv.san)
    plies.push({ fen: chess.fen(), lastMove: [m.from, m.to], san: m.san, note: mv.note || '' })
  }
  let idx = 0

  container.innerHTML = `
    <header class="page-head">
      <button class="back-btn" id="back">← ${c.name}</button>
      <div class="head-stats"><div class="stat-chip"><span>${c.icon}</span><b>Étape ${stepIdx + 1}</b></div></div>
    </header>
    <h1 class="script" style="margin-bottom:4px">${step.title}</h1>
    <p class="muted" style="margin-bottom:14px">${step.place}</p>

    <div class="board-layout">
      <div class="board-wrap"><div class="cg-wrap" id="board"></div></div>
      <div class="sidebar">
        <div class="card">
          <div class="movelist" id="moves"></div>
        </div>
        <div class="card lesson-note" id="note"></div>
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <button class="btn secondary" id="prev">← Précédent</button>
            <button class="btn secondary" id="next">Suivant →</button>
          </div>
          <button class="btn" id="done" style="width:100%;margin-top:10px">✓ J'ai appris cette étape</button>
        </div>
      </div>
    </div>`

  const cg = Chessground(container.querySelector('#board'), {
    fen: plies[0].fen, viewOnly: true, coordinates: true, orientation: c.side === 'black' ? 'black' : 'white'
  })

  const movesEl = container.querySelector('#moves')
  const noteEl = container.querySelector('#note')

  function renderMoves() {
    let html = ''
    for (let p = 1; p < plies.length; p++) {
      if (p % 2 === 1) html += `<span class="num">${(p + 1) / 2 | 0}.</span>`
      const cls = p === idx ? 'mv current' : 'mv'
      html += `<span class="${cls}" data-i="${p}">${frSan(plies[p].san)}</span>`
    }
    movesEl.innerHTML = html
    movesEl.querySelectorAll('[data-i]').forEach((el) => { el.onclick = () => go(+el.dataset.i) })
  }

  function go(i) {
    idx = Math.max(0, Math.min(plies.length - 1, i))
    const pos = plies[idx]
    cg.set({ fen: pos.fen, lastMove: pos.lastMove || undefined })
    noteEl.innerHTML = pos.note
      ? `${idx === 0 ? '' : `<b>${frSan(pos.san)}</b> — `}${pos.note}`
      : '<span class="muted">Continue à dérouler la ligne…</span>'
    renderMoves()
  }

  container.querySelector('#prev').onclick = () => go(idx - 1)
  container.querySelector('#next').onclick = () => go(idx + 1)
  container.querySelector('#back').onclick = () => navigate('#/cours/' + id)
  container.querySelector('#done').onclick = () => {
    markStepDone(id, stepIdx)
    navigate('#/cours/' + id)
  }

  go(0)
  return () => { try { cg.destroy() } catch {} }
}
