import { Chess } from 'chess.js'
import { Board } from '../ui/board.js'
import { PgnTree } from '../chess/PgnTree.js'
import { isSupabaseConfigured, createStudy, saveStudy } from '../supabase.js'

// Jeu libre : on joue les deux camps, coups legaux, historique cliquable.
export function renderPlay(container, navigate) {
  container.innerHTML = `
    <h1>Echiquier</h1>
    <div class="board-layout">
      <div class="board-wrap"><div class="cg-wrap" id="board"></div></div>
      <div class="sidebar">
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <h2 style="margin:0">Coups</h2>
            <div class="row">
              <button class="btn secondary" id="flip">Retourner</button>
              <button class="btn secondary" id="reset">Reset</button>
            </div>
          </div>
          <div class="movelist" id="moves"></div>
          <p class="muted" id="status" style="margin-top:12px"></p>
        </div>
        ${isSupabaseConfigured ? `
        <div class="card">
          <h2>Sauvegarder</h2>
          <p class="muted">Transforme cette suite de coups en etude (variantes editables).</p>
          <button class="btn" id="tostudy">Enregistrer dans Etudes</button>
          <span id="savemsg" class="muted"></span>
        </div>` : ''}
        <div class="card">
          <h2>FEN</h2>
          <input id="fen" readonly />
        </div>
      </div>
    </div>`

  const movesEl = container.querySelector('#moves')
  const statusEl = container.querySelector('#status')
  const fenEl = container.querySelector('#fen')
  const history = []

  const board = new Board(container.querySelector('#board'), {
    onMove: (move, chess) => {
      history.push(move.san)
      renderMoves()
      updateStatus(chess)
      fenEl.value = chess.fen()
    }
  })
  fenEl.value = board.chess.fen()

  function renderMoves() {
    let html = ''
    for (let i = 0; i < history.length; i++) {
      if (i % 2 === 0) html += `<span class="num">${i / 2 + 1}.</span>`
      html += `<span class="mv">${history[i]}</span>`
    }
    movesEl.innerHTML = html
  }

  function updateStatus(chess) {
    if (chess.isCheckmate()) statusEl.textContent = 'Echec et mat.'
    else if (chess.isStalemate()) statusEl.textContent = 'Pat.'
    else if (chess.isDraw()) statusEl.textContent = 'Nulle.'
    else if (chess.inCheck()) statusEl.textContent = 'Echec !'
    else statusEl.textContent = (chess.turn() === 'w' ? 'Trait aux blancs' : 'Trait aux noirs')
  }

  container.querySelector('#flip').onclick = () => board.flip()
  container.querySelector('#reset').onclick = () => {
    board.reset(); history.length = 0; renderMoves(); statusEl.textContent = ''
    fenEl.value = board.chess.fen()
  }

  const toStudyBtn = container.querySelector('#tostudy')
  if (toStudyBtn) {
    toStudyBtn.onclick = async () => {
      if (!history.length) { container.querySelector('#savemsg').textContent = ' Joue d\'abord quelques coups.'; return }
      const name = prompt('Nom de l\'etude :', 'Ma combinaison')
      if (name === null) return
      const tree = new PgnTree()
      let cur = tree.rootId
      const c = new Chess()
      for (const san of history) { const m = c.move(san); cur = tree.addMove(cur, m, c.fen()) }
      try {
        const study = await createStudy({ name: name || 'Ma combinaison', color: 'white' })
        await saveStudy(study.id, { name: name || 'Ma combinaison', color: 'white', tree: tree.toJSON() })
        navigate('#/etude/' + study.id)
      } catch (e) { container.querySelector('#savemsg').textContent = ' Erreur : ' + e.message }
    }
  }

  updateStatus(board.chess)
  return () => board.destroy()
}
