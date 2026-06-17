import { Chess } from 'chess.js'
import { InteractiveBoard } from '../ui/board.js'
import { PgnTree } from '../chess/PgnTree.js'
import { isSupabaseConfigured, createStudy, saveStudy } from '../supabase.js'

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

// Notation francaise pour l'affichage de l'arbre.
const FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' }
const frSan = (san) => String(san).replace(/[KQRBN]/g, (c) => FR[c])

// Jeu libre + ENREGISTREMENT : tu joues, tu crees des variantes (reviens en
// arriere et joue un autre coup), tu les nommes, tu sauvegardes en Etude.
export function renderPlay(container, navigate) {
  const tree = new PgnTree()
  let currentId = tree.rootId

  container.innerHTML = `
    <div class="row" style="justify-content:space-between;align-items:center">
      <h1 style="margin:0">Échiquier</h1>
      <div class="row">
        <button class="btn secondary btn-sm" id="flip">Retourner</button>
        <button class="btn secondary btn-sm" id="reset">Vider</button>
      </div>
    </div>
    <p class="muted" style="margin:6px 0 14px">Joue tes coups. Pour créer une <b>variante</b>, reviens à un coup précédent (clique-le dans l'arbre) et joue un autre coup.</p>

    <div class="board-layout">
      <div>
        <div class="board-wrap"><div class="cg-wrap" id="board"></div></div>
        <div class="row" style="margin-top:10px">
          <button class="btn secondary" id="first">|◀</button>
          <button class="btn secondary" id="prev">◀</button>
          <button class="btn secondary" id="next">▶</button>
          <button class="btn secondary" id="last">▶|</button>
        </div>
        <p class="muted" id="status" style="margin-top:10px"></p>
      </div>

      <div class="sidebar">
        <div class="card" id="nodepanel"></div>
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <h2 style="margin:0">Arbre de coups</h2>
            ${isSupabaseConfigured ? '<button class="btn btn-sm" id="save">💾 Enregistrer en Étude</button>' : ''}
          </div>
          <div class="tree" id="tree" style="margin-top:8px"></div>
          <span id="savemsg" class="muted"></span>
        </div>
        <div class="card">
          <div class="row" style="justify-content:space-between;align-items:center">
            <h2 style="margin:0">FEN</h2>
            <button class="btn secondary btn-sm" id="copyfen">Copier</button>
          </div>
          <input id="fen" readonly style="margin-top:6px;font-family:ui-monospace,monospace;font-size:0.8rem" />
          <p class="muted" style="margin-top:8px">La FEN est une « photo » de la position en une ligne de texte : copie-la pour sauvegarder ou partager une position exacte.</p>
        </div>
      </div>
    </div>`

  const board = new InteractiveBoard(container.querySelector('#board'), { orientation: 'white', onMove: handleMove })
  const treeEl = container.querySelector('#tree')
  const panelEl = container.querySelector('#nodepanel')
  const statusEl = container.querySelector('#status')
  const fenEl = container.querySelector('#fen')

  function handleMove(orig, dest) {
    const node = tree.get(currentId)
    const chess = new Chess(node.fen)
    let move = null
    try { move = chess.move({ from: orig, to: dest, promotion: 'q' }) } catch { move = null }
    if (!move) { refresh(); return }
    currentId = tree.addMove(currentId, move, chess.fen())
    refresh()
  }

  function go(id) { if (id && tree.get(id)) { currentId = id; refresh() } }
  function gotoLast() {
    let id = currentId
    while (tree.childMainline(id)) id = tree.childMainline(id)
    go(id)
  }

  function refresh() {
    const node = tree.get(currentId)
    board.setFen(node.fen, [node.from, node.to])
    fenEl.value = node.fen
    updateStatus(node.fen)
    renderTree()
    renderPanel()
  }

  function updateStatus(fen) {
    const c = new Chess(fen)
    if (c.isCheckmate()) statusEl.textContent = 'Échec et mat.'
    else if (c.isStalemate()) statusEl.textContent = 'Pat.'
    else if (c.isDraw()) statusEl.textContent = 'Nulle.'
    else if (c.inCheck()) statusEl.textContent = 'Échec !'
    else statusEl.textContent = c.turn() === 'w' ? 'Trait aux Blancs' : 'Trait aux Noirs'
  }

  // --- arbre cliquable (ligne principale + variantes entre parentheses) ---
  function numLabel(node, forceBlack) {
    const parts = node.fen.split(' ')
    const turn = parts[1], full = parseInt(parts[5], 10)
    if (turn === 'b') return `<span class="num">${full}.</span>`
    if (forceBlack) return `<span class="num">${full - 1}…</span>`
    return ''
  }
  const nameBadge = (n) => (n.name ? `<span class="line-name">${esc(n.name)}</span>` : '')
  const moveSpan = (n) => `<span class="${n.id === currentId ? 'mv current' : 'mv'}" data-id="${n.id}">${esc(frSan(n.san))}</span>`
  function line(node, forceFirstBlack) {
    const kids = node.children
    if (!kids.length) return ''
    const main = tree.nodes[kids[0]]
    let out = numLabel(main, forceFirstBlack) + nameBadge(main) + moveSpan(main) + ' '
    for (let i = 1; i < kids.length; i++) {
      const v = tree.nodes[kids[i]]
      out += `<span class="variation">( ${numLabel(v, true)}${nameBadge(v)}${moveSpan(v)} ${line(v, false)})</span> `
    }
    out += line(main, kids.length > 1)
    return out
  }
  function renderTree() {
    treeEl.innerHTML = line(tree.nodes[tree.rootId], false) || '<span class="muted">Joue un coup pour commencer.</span>'
    treeEl.querySelectorAll('.mv[data-id]').forEach((el) => { el.onclick = () => go(el.dataset.id) })
    treeEl.querySelector('.current')?.scrollIntoView({ block: 'nearest' })
  }

  // --- panneau du coup courant (nom / commentaire / promouvoir / supprimer) ---
  function renderPanel() {
    const node = tree.get(currentId)
    const isRoot = tree.isRoot(currentId)
    panelEl.innerHTML = `
      <h2 style="margin:0 0 8px">${isRoot ? 'Position de départ' : 'Coup : ' + esc(frSan(node.san))}</h2>
      <label>Nom de la ligne (optionnel)</label>
      <input id="nname" placeholder="Ex : Variante Najdorf" value="${esc(node.name)}" ${isRoot ? 'disabled' : ''}/>
      <label>Commentaire</label>
      <textarea id="ncomment" style="min-height:60px" ${isRoot ? 'disabled' : ''}>${esc(node.comment)}</textarea>
      <div class="row" style="margin-top:10px">
        <button class="btn secondary btn-sm" id="promote" ${isRoot || tree.isMainline(currentId) ? 'disabled' : ''}>⬆ Promouvoir</button>
        <button class="btn danger btn-sm" id="delete" ${isRoot ? 'disabled' : ''}>🗑 Supprimer</button>
      </div>`
    if (isRoot) return
    panelEl.querySelector('#nname').oninput = (e) => tree.setName(currentId, e.target.value)
    panelEl.querySelector('#nname').onchange = () => renderTree()
    panelEl.querySelector('#ncomment').oninput = (e) => tree.setComment(currentId, e.target.value)
    panelEl.querySelector('#promote').onclick = () => { tree.promote(currentId); refresh() }
    panelEl.querySelector('#delete').onclick = () => { const p = tree.remove(currentId); currentId = p || tree.rootId; refresh() }
  }

  container.querySelector('#flip').onclick = () => board.flip()
  container.querySelector('#reset').onclick = () => {
    const fresh = new PgnTree(); tree.nodes = fresh.nodes; tree.rootId = fresh.rootId; tree.seq = 0
    currentId = tree.rootId; refresh()
  }
  container.querySelector('#first').onclick = () => go(tree.rootId)
  container.querySelector('#prev').onclick = () => { const n = tree.get(currentId); if (n.parentId) go(n.parentId) }
  container.querySelector('#next').onclick = () => { const c = tree.childMainline(currentId); if (c) go(c) }
  container.querySelector('#last').onclick = gotoLast
  container.querySelector('#copyfen').onclick = () => { navigator.clipboard?.writeText(fenEl.value) }

  const saveBtn = container.querySelector('#save')
  if (saveBtn) {
    saveBtn.onclick = async () => {
      const msg = container.querySelector('#savemsg')
      if (!tree.nodes[tree.rootId].children.length) { msg.textContent = " Joue d'abord quelques coups."; return }
      const name = prompt("Nom de l'étude :", 'Ma partie')
      if (name === null) return
      msg.textContent = ' Enregistrement…'
      try {
        const study = await createStudy({ name: name || 'Ma partie', color: 'white' })
        await saveStudy(study.id, { name: name || 'Ma partie', color: 'white', tree: tree.toJSON() })
        navigate('#/etude/' + study.id)
      } catch (e) { msg.textContent = ' Erreur : ' + e.message }
    }
  }

  refresh()
  return () => board.destroy()
}
