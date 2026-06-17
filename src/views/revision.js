import { Chess } from 'chess.js'
import { listStudies, getStudy, isSupabaseConfigured } from '../supabase.js'
import { InteractiveBoard } from '../ui/board.js'
import { cardsFromStudy, dueCards, grade, notificationsEnabled } from '../srs.js'

function esc(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) }

export async function renderRevision(container, navigate) {
  if (!isSupabaseConfigured) { container.innerHTML = `<div class="banner warn">Connecte-toi pour reviser tes etudes.</div>`; return }

  container.innerHTML = `
    <h1>Revision d'ouvertures</h1>
    <div class="card" style="margin-bottom:16px">
      <label>Choisis une etude a reviser</label>
      <div class="row">
        <select id="study" class="select" style="flex:1;min-width:200px"><option>Chargement...</option></select>
        <button class="btn" id="go" disabled>Reviser</button>
      </div>
      <p class="muted" id="info" style="margin-top:8px"></p>
    </div>
    <div id="session"></div>`

  const sel = container.querySelector('#study')
  const info = container.querySelector('#info')
  const goBtn = container.querySelector('#go')
  let cleanupSession = null

  let studies = []
  try { studies = await listStudies() } catch (e) { info.textContent = 'Erreur : ' + e.message; return }
  if (!studies.length) {
    sel.innerHTML = '<option>—</option>'
    info.innerHTML = `Aucune etude. <a href="#/etudes">Cree-en une</a> et ajoute des coups.`
    return
  }
  sel.innerHTML = studies.map((s) => `<option value="${s.id}">${esc(s.name)} (${s.color === 'black' ? 'noirs' : 'blancs'})</option>`).join('')
  goBtn.disabled = false

  async function preview() {
    const study = await getStudy(sel.value)
    const cards = cardsFromStudy(study)
    const due = dueCards(cards)
    info.textContent = `${cards.length} position(s) dans cette etude · ${due.length} a reviser maintenant.`
    return { study, cards, due }
  }
  sel.onchange = preview
  await preview()

  goBtn.onclick = async () => {
    if (cleanupSession) { cleanupSession(); cleanupSession = null }
    const { due } = await preview()
    if (!due.length) { container.querySelector('#session').innerHTML = `<div class="banner warn">Rien a reviser pour cette etude. Reviens plus tard !</div>`; return }
    cleanupSession = startSession(container.querySelector('#session'), due)
  }

  return () => { if (cleanupSession) cleanupSession() }
}

// Une session : enchaine les cartes dues.
function startSession(host, queue) {
  let i = 0
  let done = 0
  host.innerHTML = `
    <div class="board-layout">
      <div class="board-wrap"><div class="cg-wrap" id="rboard"></div></div>
      <div class="sidebar">
        <div class="card" style="text-align:center">
          <div class="muted">Joue le bon coup pour ce trait</div>
          <div id="prompt" class="big-target" style="font-size:28px">—</div>
          <div id="feedback" class="stat" style="font-size:18px;min-height:24px"></div>
        </div>
        <div class="card">
          <div class="muted">Progression : <span id="progress">0</span> / ${queue.length}</div>
          <div class="row" style="margin-top:10px">
            <button class="btn" id="continue" style="display:none">Continuer</button>
          </div>
        </div>
      </div>
    </div>`

  const promptEl = host.querySelector('#prompt')
  const fbEl = host.querySelector('#feedback')
  const progEl = host.querySelector('#progress')
  const contBtn = host.querySelector('#continue')

  const board = new InteractiveBoard(host.querySelector('#rboard'), { onMove })
  let card = null
  let answered = false

  function load() {
    if (i >= queue.length) return finish()
    card = queue[i]
    answered = false
    fbEl.textContent = ''
    contBtn.style.display = 'none'
    const turn = card.fen.split(' ')[1]
    board.setOrientation(turn === 'w' ? 'white' : 'black')
    promptEl.textContent = (turn === 'w' ? 'Trait aux blancs' : 'Trait aux noirs') + (card.name ? ' — ' + card.name : '')
    board.setFen(card.fen)
  }

  function onMove(orig, dest) {
    if (answered) { board.setFen(card.fen); return }
    const chess = new Chess(card.fen)
    let m = null
    try { m = chess.move({ from: orig, to: dest, promotion: 'q' }) } catch { m = null }
    if (!m) { board.setFen(card.fen); return }
    const uci = orig + dest + (m.promotion || '')
    answered = true
    const success = uci === card.answer
    grade(card.key, success)
    done++
    progEl.textContent = done
    if (success) {
      fbEl.style.color = 'var(--accent-2)'
      fbEl.textContent = '✓ Correct !'
      board.setFen(chess.fen(), [orig, dest])
      setTimeout(() => { i++; load() }, 700)
    } else {
      fbEl.style.color = 'var(--danger)'
      fbEl.textContent = `✗ C'etait ${card.san}`
      // montre le bon coup
      const good = new Chess(card.fen)
      good.move({ from: card.answer.slice(0, 2), to: card.answer.slice(2, 4), promotion: card.answer[4] || undefined })
      board.setFen(good.fen(), [card.answer.slice(0, 2), card.answer.slice(2, 4)])
      contBtn.style.display = 'inline-flex'
    }
  }

  contBtn.onclick = () => { i++; load() }

  function finish() {
    host.innerHTML = `<div class="card" style="text-align:center"><h2>Session terminee 🎉</h2><p class="muted">${done} carte(s) revisee(s). Reviens demain pour consolider.</p></div>`
  }

  load()
  return () => board.destroy()
}

// Rappel : compte les cartes dues sur toutes les etudes et notifie si autorise.
export async function checkReminders() {
  if (!isSupabaseConfigured || !notificationsEnabled()) return
  try {
    const studies = await listStudies()
    let total = 0
    for (const s of studies) {
      const full = await getStudy(s.id)
      total += dueCards(cardsFromStudy(full)).length
    }
    if (total > 0 && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Echiquier — revision', { body: `Tu as ${total} position(s) d'ouverture a reviser aujourd'hui.` })
    }
  } catch { /* silencieux */ }
}
