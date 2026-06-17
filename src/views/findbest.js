import { Chess } from 'chess.js'
import { InteractiveBoard } from '../ui/board.js'
import { getEngine, formatEval } from '../engine/engine.js'
import { FIND_BEST_POSITIONS } from '../data/puzzles.js'

function whiteCp(res) {
  if (res.mate !== null && res.mate !== undefined) return res.mate > 0 ? 100000 : -100000
  return res.cp ?? 0
}

export function renderFindBest(container, navigate) {
  let board = null
  let chess = null
  let fen = null
  let best = null
  let busy = false

  container.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1 style="margin:0">🧠 Trouve le meilleur coup</h1>
      <button class="btn secondary" id="back">Retour</button>
    </div>
    <div class="board-layout" style="margin-top:14px">
      <div class="board-wrap"><div class="cg-wrap" id="fboard"></div></div>
      <div class="sidebar">
        <div class="card" style="text-align:center">
          <div class="muted" id="trait">—</div>
          <div id="state" class="stat" style="font-size:18px;min-height:26px;margin-top:8px">Chargement du moteur...</div>
          <div id="detail" class="muted" style="margin-top:6px"></div>
        </div>
        <div class="card">
          <button class="btn" id="next">Nouvelle position</button>
          <p class="muted" style="margin-top:8px">Le moteur Stockfish evalue ton coup et le compare au meilleur.</p>
        </div>
      </div>
    </div>`

  const traitEl = container.querySelector('#trait')
  const stateEl = container.querySelector('#state')
  const detailEl = container.querySelector('#detail')

  async function load() {
    fen = FIND_BEST_POSITIONS[Math.floor(Math.random() * FIND_BEST_POSITIONS.length)]
    chess = new Chess(fen)
    best = null
    busy = true
    detailEl.textContent = ''
    const turn = fen.split(' ')[1]
    traitEl.textContent = turn === 'w' ? 'Les blancs jouent' : 'Les noirs jouent'
    stateEl.style.color = 'var(--text-dim)'
    stateEl.textContent = 'Le moteur analyse...'

    if (board) board.destroy()
    board = new InteractiveBoard(container.querySelector('#fboard'), { orientation: turn === 'w' ? 'white' : 'black', onMove })
    board.setFen(fen)

    try {
      best = await getEngine().analyse(fen, { depth: 15 })
      busy = false
      stateEl.style.color = 'var(--text)'
      stateEl.textContent = 'A toi de jouer le meilleur coup !'
    } catch (e) {
      stateEl.textContent = 'Moteur indisponible : ' + (e.message || e)
    }
  }

  async function onMove(orig, dest) {
    if (busy || !best) { board.setFen(fen); return }
    let m = null
    try { m = chess.move({ from: orig, to: dest, promotion: 'q' }) } catch { m = null }
    if (!m) { board.setFen(fen); return }
    const uci = orig + dest + (m.promotion || '')
    busy = true
    board.setFen(chess.fen(), [orig, dest])
    stateEl.style.color = 'var(--text-dim)'
    stateEl.textContent = 'Verification...'

    // meilleur coup en SAN (depuis la position de depart)
    let bestSan = best.bestmove
    try {
      const c2 = new Chess(fen)
      const bm = c2.move({ from: best.bestmove.slice(0, 2), to: best.bestmove.slice(2, 4), promotion: best.bestmove[4] || undefined })
      if (bm) bestSan = bm.san
    } catch { /* garde l'uci */ }

    const after = await getEngine().analyse(chess.fen(), { depth: 14 })
    const whiteToMove = fen.split(' ')[1] === 'w'
    const loss = Math.max(0, whiteToMove ? whiteCp(best) - whiteCp(after) : whiteCp(after) - whiteCp(best))

    let verdict, color
    if (uci === best.bestmove) { verdict = '★ Meilleur coup !'; color = 'var(--accent-2)' }
    else if (loss <= 20) { verdict = 'Optimal 👍'; color = 'var(--accent-2)' }
    else if (loss <= 60) { verdict = 'Excellent'; color = 'var(--accent-2)' }
    else if (loss <= 130) { verdict = 'Bon coup'; color = 'var(--accent)' }
    else if (loss <= 300) { verdict = 'Imprecis'; color = '#f0c419' }
    else { verdict = 'Erreur'; color = 'var(--danger)' }

    stateEl.style.color = color
    stateEl.textContent = verdict
    detailEl.innerHTML = `Meilleur : <b>${bestSan}</b> (${formatEval(best)}) · perte : ${(loss / 100).toFixed(2)}`
    busy = false
  }

  container.querySelector('#next').onclick = load
  container.querySelector('#back').onclick = () => navigate('#/minijeux')

  load()
  return () => { if (board) board.destroy() }
}
