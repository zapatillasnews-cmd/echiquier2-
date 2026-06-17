import { listGames, getGame, insertGame, deleteGame, isSupabaseConfigured } from '../supabase.js'
import { parsePgn, metaFromPgn } from '../chess/pgn.js'
import { GameViewer } from '../ui/board.js'

function notConfigured(container) {
  container.innerHTML = `
    <div class="banner warn">
      Supabase n'est pas configure. Ajoute tes cles dans <code>.env.local</code>
      puis relance <code>npm run dev</code> pour activer la base de parties.
    </div>`
}

// ---------- Liste des parties ----------
export async function renderGames(container, navigate) {
  if (!isSupabaseConfigured) return notConfigured(container)
  container.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1 style="margin:0">Mes parties</h1>
      <button class="btn" id="add">+ Importer un PGN</button>
    </div>
    <div id="list" style="margin-top:18px"><p class="muted">Chargement...</p></div>`

  container.querySelector('#add').onclick = () => navigate('#/import')

  try {
    const games = await listGames()
    const list = container.querySelector('#list')
    if (!games.length) {
      list.innerHTML = `<div class="card"><p class="muted">Aucune partie pour le moment. Clique sur "Importer un PGN".</p></div>`
      return
    }
    list.innerHTML = `<div class="game-grid">${games.map(gameCard).join('')}</div>`
    list.querySelectorAll('[data-id]').forEach((el) => {
      el.onclick = () => navigate('#/partie/' + el.dataset.id)
    })
  } catch (e) {
    container.querySelector('#list').innerHTML = `<div class="banner error">Erreur : ${e.message}</div>`
  }
}

function gameCard(g) {
  const players = `${g.white || '?'} — ${g.black || '?'}`
  const meta = [g.event, g.game_date, g.eco].filter(Boolean).join(' · ')
  return `
    <div class="card game-item" data-id="${g.id}">
      <div class="row" style="justify-content:space-between">
        <span class="players">${escapeHtml(players)}</span>
        <span class="result-badge">${g.result || '*'}</span>
      </div>
      <div class="meta">${escapeHtml(meta || 'Sans metadonnees')}</div>
      ${g.opening_name ? `<div class="meta">${escapeHtml(g.opening_name)}</div>` : ''}
    </div>`
}

// ---------- Import PGN ----------
export function renderImport(container, navigate) {
  if (!isSupabaseConfigured) return notConfigured(container)
  container.innerHTML = `
    <h1>Importer une partie (PGN)</h1>
    <div class="card">
      <label>Colle ton PGN ici</label>
      <textarea id="pgn" placeholder='[White "..."]\n[Black "..."]\n\n1. e4 e5 2. Nf3 ...'></textarea>
      <div id="msg" class="muted" style="margin-top:8px"></div>
      <div class="row" style="margin-top:12px">
        <button class="btn" id="save">Enregistrer</button>
        <button class="btn secondary" id="cancel">Annuler</button>
      </div>
    </div>`

  const msg = container.querySelector('#msg')
  container.querySelector('#cancel').onclick = () => navigate('#/parties')

  container.querySelector('#save').onclick = async () => {
    const pgn = container.querySelector('#pgn').value.trim()
    if (!pgn) { msg.textContent = 'PGN vide.'; return }
    try {
      parsePgn(pgn) // valide avant d'envoyer
      msg.textContent = 'Enregistrement...'
      const game = await insertGame(metaFromPgn(pgn))
      navigate('#/partie/' + game.id)
    } catch (e) {
      msg.textContent = 'Erreur : ' + e.message
    }
  }
}

// ---------- Lecture d'une partie ----------
export async function renderGameView(container, id, navigate) {
  if (!isSupabaseConfigured) return notConfigured(container)
  container.innerHTML = `<p class="muted">Chargement de la partie...</p>`
  let game
  try {
    game = await getGame(id)
  } catch (e) {
    container.innerHTML = `<div class="banner error">Erreur : ${e.message}</div>`
    return
  }

  let parsed
  try {
    parsed = parsePgn(game.pgn)
  } catch (e) {
    container.innerHTML = `<div class="banner error">PGN illisible : ${e.message}</div>`
    return
  }

  container.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <h1 style="margin:0">${escapeHtml(game.white || '?')} — ${escapeHtml(game.black || '?')}
        <span class="result-badge">${game.result || '*'}</span></h1>
      <button class="btn danger" id="del">Supprimer</button>
    </div>
    <div class="board-layout" style="margin-top:16px">
      <div class="board-wrap"><div class="cg-wrap" id="board"></div></div>
      <div class="sidebar">
        <div class="card">
          <div class="row">
            <button class="btn secondary" id="first">|◀</button>
            <button class="btn secondary" id="prev">◀</button>
            <button class="btn secondary" id="next">▶</button>
            <button class="btn secondary" id="last">▶|</button>
            <button class="btn secondary" id="flip">Retourner</button>
          </div>
          <div class="movelist" id="moves" style="margin-top:12px"></div>
        </div>
      </div>
    </div>`

  const viewer = new GameViewer(container.querySelector('#board'), parsed.moves)
  const movesEl = container.querySelector('#moves')

  function renderMoves() {
    let html = ''
    for (let i = 1; i < parsed.moves.length; i++) {
      const ply = i // 1-based
      if (ply % 2 === 1) html += `<span class="num">${(ply + 1) / 2}.</span>`
      const cls = viewer.index === ply ? 'mv current' : 'mv'
      html += `<span class="${cls}" data-i="${ply}">${parsed.moves[i].san}</span>`
    }
    movesEl.innerHTML = html
    movesEl.querySelectorAll('[data-i]').forEach((el) => {
      el.onclick = () => { viewer.goto(Number(el.dataset.i)); renderMoves() }
    })
    const cur = movesEl.querySelector('.current')
    cur?.scrollIntoView({ block: 'nearest' })
  }

  const nav = (fn) => () => { fn.call(viewer); renderMoves() }
  container.querySelector('#first').onclick = nav(viewer.first)
  container.querySelector('#prev').onclick = nav(viewer.prev)
  container.querySelector('#next').onclick = nav(viewer.next)
  container.querySelector('#last').onclick = nav(viewer.last)
  container.querySelector('#flip').onclick = () => viewer.flip()

  // navigation clavier
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') { viewer.prev(); renderMoves() }
    if (e.key === 'ArrowRight') { viewer.next(); renderMoves() }
  }
  window.addEventListener('keydown', onKey)

  container.querySelector('#del').onclick = async () => {
    if (!confirm('Supprimer cette partie ?')) return
    await deleteGame(id)
    navigate('#/parties')
  }

  renderMoves()
  return () => { viewer.destroy(); window.removeEventListener('keydown', onKey) }
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}
