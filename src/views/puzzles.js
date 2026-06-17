import { Chess } from 'chess.js'
import { InteractiveBoard } from '../ui/board.js'
import { PUZZLES } from '../data/puzzles.js'

const SOLVED = 'puzzles_solved'
function solvedSet() { try { return new Set(JSON.parse(localStorage.getItem(SOLVED)) || []) } catch { return new Set() } }
function markSolved(id) { const s = solvedSet(); s.add(id); localStorage.setItem(SOLVED, JSON.stringify([...s])) }

function esc(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) }

export function renderPuzzles(container) {
  let index = 0
  let board = null

  container.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1 style="margin:0">Problemes</h1>
      <div class="muted" id="counter"></div>
    </div>
    <div class="board-layout" style="margin-top:14px">
      <div class="board-wrap"><div class="cg-wrap" id="pboard"></div></div>
      <div class="sidebar">
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <h2 style="margin:0" id="theme">—</h2>
            <span class="result-badge" id="rating"></span>
          </div>
          <div id="totrait" class="muted" style="margin-top:6px"></div>
          <div id="feedback" class="stat" style="font-size:18px;min-height:26px;margin-top:8px"></div>
          <div id="explanation" class="explanation" style="display:none"></div>
          <div class="row" style="margin-top:12px">
            <button class="btn secondary" id="hint">Voir la solution</button>
            <button class="btn" id="next">Suivant ▶</button>
          </div>
        </div>
        <p class="muted">Resolus : <span id="solved">0</span> / ${PUZZLES.length}</p>
      </div>
    </div>`

  const themeEl = container.querySelector('#theme')
  const ratingEl = container.querySelector('#rating')
  const traitEl = container.querySelector('#totrait')
  const fbEl = container.querySelector('#feedback')
  const explEl = container.querySelector('#explanation')
  const counterEl = container.querySelector('#counter')
  const solvedEl = container.querySelector('#solved')

  let puzzle = null
  let step = 0          // index dans la solution
  let chess = null
  let answered = false

  function load() {
    puzzle = PUZZLES[index]
    step = 0
    answered = false
    chess = new Chess(puzzle.fen)
    themeEl.textContent = puzzle.theme
    ratingEl.textContent = '~' + puzzle.rating
    const turn = puzzle.fen.split(' ')[1]
    traitEl.textContent = (turn === 'w' ? 'Les blancs jouent et gagnent' : 'Les noirs jouent et gagnent') + (puzzle.mate ? ' (mat)' : '')
    fbEl.textContent = ''
    explEl.style.display = 'none'
    counterEl.textContent = `${index + 1} / ${PUZZLES.length}`
    solvedEl.textContent = solvedSet().size

    if (board) board.destroy()
    board = new InteractiveBoard(container.querySelector('#pboard'), {
      orientation: turn === 'w' ? 'white' : 'black',
      onMove
    })
    board.setFen(puzzle.fen)
  }

  function reveal(ok) {
    answered = true
    fbEl.style.color = ok ? 'var(--accent-2)' : 'var(--text)'
    fbEl.textContent = ok ? '✓ Bien joue !' : 'Solution :'
    explEl.style.display = 'block'
    explEl.innerHTML = `<b>${esc(puzzle.solution.join(' '))}</b><br>${esc(puzzle.explanation)}`
  }

  function onMove(orig, dest) {
    if (answered) { board.setFen(chess.fen()); return }
    let m = null
    try { m = chess.move({ from: orig, to: dest, promotion: 'q' }) } catch { m = null }
    if (!m) { board.setFen(chess.fen()); return }
    const uci = orig + dest + (m.promotion || '')
    if (uci === puzzle.solution[step]) {
      step++
      board.setFen(chess.fen(), [orig, dest])
      if (step >= puzzle.solution.length) { markSolved(puzzle.id); reveal(true) }
      else {
        // reponse adverse automatique
        const reply = puzzle.solution[step]
        setTimeout(() => {
          chess.move({ from: reply.slice(0, 2), to: reply.slice(2, 4), promotion: reply[4] || undefined })
          step++
          board.setFen(chess.fen(), [reply.slice(0, 2), reply.slice(2, 4)])
          if (step >= puzzle.solution.length) { markSolved(puzzle.id); reveal(true) }
        }, 450)
      }
    } else {
      chess.undo()
      board.setFen(puzzle.fen)
      fbEl.style.color = 'var(--danger)'
      fbEl.textContent = '✗ Pas le meilleur. Reessaie.'
    }
  }

  container.querySelector('#hint').onclick = () => { board.setFen(puzzle.fen); reveal(false) }
  container.querySelector('#next').onclick = () => { index = (index + 1) % PUZZLES.length; load() }

  load()
  return () => { if (board) board.destroy() }
}
