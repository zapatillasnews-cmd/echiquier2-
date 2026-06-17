// Mini-jeux d'echecs (sans moteur) : entrainement aux coordonnees et vision du cavalier.

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8]

function isDarkSquare(sq) {
  const f = sq.charCodeAt(0) - 97
  const r = +sq[1] - 1
  return (f + r) % 2 === 0 // a1 est sombre
}

// Construit la grille 8x8 cliquable selon l'orientation.
function buildGrid(el, orientation, onClick) {
  const files = orientation === 'white' ? FILES : [...FILES].reverse()
  const ranks = orientation === 'white' ? [...RANKS].reverse() : RANKS
  let html = ''
  for (const r of ranks) {
    for (const f of files) {
      const sq = f + r
      html += `<button class="gsq ${isDarkSquare(sq) ? 'd' : 'l'}" data-sq="${sq}"></button>`
    }
  }
  el.innerHTML = html
  el.querySelectorAll('.gsq').forEach((b) => { b.onclick = () => onClick(b.dataset.sq, b) })
}

function bestKey(game) { return 'mg_best_' + game }
function getBest(game) { return Number(localStorage.getItem(bestKey(game)) || 0) }
function setBest(game, v) {
  if (v > getBest(game)) { localStorage.setItem(bestKey(game), String(v)); return true }
  return false
}

// ---------------- Hub ----------------
export function renderMinigamesHub(container, navigate) {
  container.innerHTML = `
    <h1>Mini-jeux</h1>
    <div class="game-grid">
      <div class="card game-item" data-go="#/minijeux/coordonnees">
        <div class="players">🎯 Coordonnees</div>
        <div class="meta">Trouve la case nommee le plus vite possible (30 s).</div>
        <div class="meta">Record : ${getBest('coord')}</div>
      </div>
      <div class="card game-item" data-go="#/minijeux/cavalier">
        <div class="players">♞ Vision du cavalier</div>
        <div class="meta">Clique toutes les cases attaquees par le cavalier.</div>
        <div class="meta">Record : ${getBest('knight')}</div>
      </div>
      <div class="card game-item" data-go="#/minijeux/meilleurcoup">
        <div class="players">🧠 Trouve le meilleur coup</div>
        <div class="meta">Une position, a toi de trouver le coup que jouerait Stockfish.</div>
      </div>
    </div>`
  container.querySelectorAll('[data-go]').forEach((el) => { el.onclick = () => navigate(el.dataset.go) })
}

// ---------------- Jeu 1 : Coordonnees ----------------
export function renderCoordTrainer(container, navigate) {
  let orientation = 'white'
  let target = null
  let score = 0
  let timeLeft = 30
  let running = false
  let timer = null

  container.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1 style="margin:0">🎯 Coordonnees</h1>
      <button class="btn secondary" id="back">Retour</button>
    </div>
    <div class="board-layout" style="margin-top:14px">
      <div class="board-wrap"><div class="grid-board" id="grid"></div></div>
      <div class="sidebar">
        <div class="card" style="text-align:center">
          <div class="muted">Trouve la case</div>
          <div id="target" class="big-target">—</div>
          <div class="row" style="justify-content:space-around;margin-top:10px">
            <div><div class="muted">Score</div><div id="score" class="stat">0</div></div>
            <div><div class="muted">Temps</div><div id="time" class="stat">30</div></div>
            <div><div class="muted">Record</div><div class="stat">${getBest('coord')}</div></div>
          </div>
        </div>
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <button class="btn" id="start">Demarrer</button>
            <button class="btn secondary" id="flip">Vue : Blancs</button>
          </div>
          <p class="muted" id="msg" style="margin-top:10px"></p>
        </div>
      </div>
    </div>`

  const gridEl = container.querySelector('#grid')
  const targetEl = container.querySelector('#target')
  const scoreEl = container.querySelector('#score')
  const timeEl = container.querySelector('#time')
  const msgEl = container.querySelector('#msg')
  const startBtn = container.querySelector('#start')
  const flipBtn = container.querySelector('#flip')

  function newTarget() {
    target = FILES[Math.floor(Math.random() * 8)] + RANKS[Math.floor(Math.random() * 8)]
    targetEl.textContent = target
  }
  function flash(btn, ok) {
    btn.classList.add(ok ? 'flash-ok' : 'flash-bad')
    setTimeout(() => btn.classList.remove('flash-ok', 'flash-bad'), 250)
  }
  function onSquare(sq, btn) {
    if (!running) return
    if (sq === target) { score++; scoreEl.textContent = score; flash(btn, true); newTarget() }
    else { flash(btn, false) }
  }
  function rebuild() { buildGrid(gridEl, orientation, onSquare) }

  function start() {
    score = 0; timeLeft = 30; running = true
    scoreEl.textContent = '0'; timeEl.textContent = '30'; msgEl.textContent = ''
    startBtn.disabled = true
    newTarget()
    timer = setInterval(() => {
      timeLeft--
      timeEl.textContent = timeLeft
      if (timeLeft <= 0) end()
    }, 1000)
  }
  function end() {
    clearInterval(timer); running = false; startBtn.disabled = false
    targetEl.textContent = '—'
    const record = setBest('coord', score)
    msgEl.textContent = `Termine ! Score : ${score}` + (record ? ' — nouveau record ! 🏆' : '')
  }

  flipBtn.onclick = () => {
    orientation = orientation === 'white' ? 'black' : 'white'
    flipBtn.textContent = 'Vue : ' + (orientation === 'white' ? 'Blancs' : 'Noirs')
    rebuild()
  }
  startBtn.onclick = start
  container.querySelector('#back').onclick = () => navigate('#/minijeux')

  rebuild()
  return () => clearInterval(timer)
}

// ---------------- Jeu 2 : Vision du cavalier ----------------
const KNIGHT_DELTAS = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]

function knightTargets(sq) {
  const f = sq.charCodeAt(0) - 97
  const r = +sq[1] - 1
  const res = []
  for (const [df, dr] of KNIGHT_DELTAS) {
    const nf = f + df, nr = r + dr
    if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) res.push(FILES[nf] + (nr + 1))
  }
  return res
}

export function renderKnightVision(container, navigate) {
  let orientation = 'white'
  let knightSq = null
  let targets = []
  let found = new Set()
  let score = 0
  let running = false

  container.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1 style="margin:0">♞ Vision du cavalier</h1>
      <button class="btn secondary" id="back">Retour</button>
    </div>
    <div class="board-layout" style="margin-top:14px">
      <div class="board-wrap"><div class="grid-board" id="grid"></div></div>
      <div class="sidebar">
        <div class="card" style="text-align:center">
          <div class="muted">Clique toutes les cases ou le cavalier peut aller</div>
          <div class="row" style="justify-content:space-around;margin-top:10px">
            <div><div class="muted">Reussies</div><div id="score" class="stat">0</div></div>
            <div><div class="muted">Record</div><div class="stat">${getBest('knight')}</div></div>
          </div>
        </div>
        <div class="card">
          <button class="btn" id="start">Nouvelle position</button>
          <p class="muted" id="msg" style="margin-top:10px"></p>
        </div>
      </div>
    </div>`

  const gridEl = container.querySelector('#grid')
  const scoreEl = container.querySelector('#score')
  const msgEl = container.querySelector('#msg')

  function placeKnight() {
    gridEl.querySelectorAll('.gsq').forEach((b) => {
      b.classList.remove('knight', 'target-ok')
      b.textContent = ''
      if (b.dataset.sq === knightSq) { b.classList.add('knight'); b.textContent = '♞' }
    })
  }
  function onSquare(sq, btn) {
    if (!running || sq === knightSq) return
    if (targets.includes(sq) && !found.has(sq)) {
      found.add(sq); btn.classList.add('target-ok')
      if (found.size === targets.length) roundWon()
    } else if (!targets.includes(sq)) {
      btn.classList.add('flash-bad')
      setTimeout(() => btn.classList.remove('flash-bad'), 250)
    }
  }
  function roundWon() {
    running = false
    score++
    scoreEl.textContent = score
    const record = setBest('knight', score)
    msgEl.textContent = 'Bravo ! ' + (record ? 'Nouveau record ! 🏆' : 'Position suivante →')
  }
  function rebuild() { buildGrid(gridEl, orientation, onSquare); placeKnight() }

  function start() {
    knightSq = FILES[Math.floor(Math.random() * 8)] + RANKS[Math.floor(Math.random() * 8)]
    targets = knightTargets(knightSq)
    found = new Set()
    running = true
    msgEl.textContent = `${targets.length} cases a trouver.`
    rebuild()
  }

  container.querySelector('#start').onclick = start
  container.querySelector('#back').onclick = () => navigate('#/minijeux')

  start()
  return () => {}
}
