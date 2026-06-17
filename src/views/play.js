import { Chess } from 'chess.js'
import { InteractiveBoard } from '../ui/board.js'
import { PgnTree } from '../chess/PgnTree.js'

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const FR = { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C' }
const frSan = (san) => String(san).replace(/[KQRBN]/g, (c) => FR[c])

// Bibliotheque locale d'ouvertures (localStorage).
const LIB = 'my_openings_v1'
const loadLib = () => { try { return JSON.parse(localStorage.getItem(LIB) || '[]') } catch { return [] } }
const saveLib = (a) => localStorage.setItem(LIB, JSON.stringify(a))

// Jouer : on joue, on enregistre des ouvertures + variantes, on rejoue.
export function renderPlay(container, navigate) {
  let tree = new PgnTree()
  let currentId = tree.rootId
  let mode = 'edit'      // 'edit' = on joue ; 'replay' = navigation seule
  let libOpen = false

  container.innerHTML = `
    <div class="row" style="justify-content:space-between;align-items:center">
      <h1 style="margin:0">Échiquier</h1>
      <div class="row">
        <button class="btn secondary btn-sm" id="lib">📂 Mes ouvertures</button>
        <button class="btn secondary btn-sm" id="flip">⟲</button>
      </div>
    </div>

    <div class="board-layout" style="margin-top:12px">
      <div>
        <div class="board-wrap"><div class="cg-wrap" id="board"></div></div>

        <div class="play-actions" id="actions">
          <button class="btn secondary" id="reset">🔄 Reset</button>
          <button class="btn secondary" id="rejouer">⏯ Rejouer</button>
          <button class="btn secondary" id="variante">🌿 Variante</button>
          <button class="btn" id="ouverture">💾 Ouverture</button>
        </div>

        <div class="replay-bar" id="replaybar" hidden>
          <button class="btn secondary btn-sm" id="first">|◀</button>
          <button class="btn secondary btn-sm" id="prev">◀</button>
          <span class="counter" id="counter">0/0 coups</span>
          <button class="btn secondary btn-sm" id="next">▶</button>
          <button class="btn secondary btn-sm" id="last">▶|</button>
          <button class="btn btn-sm" id="playhere">▶ Jouer depuis ici</button>
        </div>

        <p class="muted" id="status" style="margin-top:10px;text-align:center"></p>
      </div>

      <div class="sidebar">
        <div class="card" id="libcard" hidden>
          <div class="row" style="justify-content:space-between"><h2 style="margin:0">Mes ouvertures</h2><button class="btn secondary btn-sm" id="libclose">✕</button></div>
          <div id="liblist" style="margin-top:10px"></div>
        </div>

        <div class="card">
          <h2 style="margin:0 0 8px">Coups & variantes</h2>
          <div class="tree" id="tree"></div>
          <div id="nodetools"></div>
        </div>

        <div class="card">
          <div class="row" style="justify-content:space-between;align-items:center">
            <h2 style="margin:0">FEN</h2>
            <button class="btn secondary btn-sm" id="copyfen">Copier</button>
          </div>
          <input id="fen" readonly style="margin-top:6px;font-family:ui-monospace,monospace;font-size:0.78rem" />
          <p class="muted" style="margin-top:8px">La FEN est une « photo » de la position en une ligne de texte : copie-la pour sauvegarder ou partager une position exacte.</p>
        </div>
      </div>
    </div>`

  const board = new InteractiveBoard(container.querySelector('#board'), { orientation: 'white', onMove: handleMove })
  const $ = (s) => container.querySelector(s)
  const treeEl = $('#tree'), statusEl = $('#status'), fenEl = $('#fen')
  const replayBar = $('#replaybar'), counterEl = $('#counter'), nodeTools = $('#nodetools')

  function hasMoves() { return tree.nodes[tree.rootId].children.length > 0 }
  function plyOf(id) { let n = 0, c = id; while (tree.get(c) && tree.get(c).parentId) { c = tree.get(c).parentId; n++ } return n }
  function lineTotal(id) { let n = plyOf(id), c = id; while (tree.childMainline(c)) { c = tree.childMainline(c); n++ } return n }

  function handleMove(orig, dest) {
    if (mode !== 'edit') { refresh(); return }
    const node = tree.get(currentId)
    const chess = new Chess(node.fen)
    let move = null
    try { move = chess.move({ from: orig, to: dest, promotion: 'q' }) } catch { move = null }
    if (!move) { refresh(); return }
    currentId = tree.addMove(currentId, move, chess.fen())
    refresh()
  }

  function go(id) { if (id && tree.get(id)) { currentId = id; refresh() } }

  function refresh() {
    const node = tree.get(currentId)
    board.setFen(node.fen, [node.from, node.to])
    board.setViewOnly(mode === 'replay')
    fenEl.value = node.fen
    updateStatus(node.fen)
    counterEl.textContent = `${plyOf(currentId)}/${lineTotal(currentId)} coups`
    replayBar.hidden = mode !== 'replay'
    // boutons actifs seulement s'il y a des coups
    ;['rejouer', 'variante', 'ouverture'].forEach((id) => { $('#' + id).disabled = !hasMoves() })
    renderTree()
    renderNodeTools()
  }

  function updateStatus(fen) {
    const c = new Chess(fen)
    if (c.isCheckmate()) statusEl.textContent = 'Échec et mat.'
    else if (c.isStalemate()) statusEl.textContent = 'Pat.'
    else if (c.isDraw()) statusEl.textContent = 'Nulle.'
    else if (c.inCheck()) statusEl.textContent = 'Échec !'
    else statusEl.textContent = c.turn() === 'w' ? 'Trait aux Blancs' : 'Trait aux Noirs'
  }

  // --- arbre cliquable ---
  function numLabel(node, forceBlack) {
    const parts = node.fen.split(' '); const turn = parts[1], full = parseInt(parts[5], 10)
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
    // scroll DANS l'arbre seulement (pas la page) — corrige le saut sur mobile
    const cur = treeEl.querySelector('.current')
    if (cur) treeEl.scrollTop = Math.max(0, cur.offsetTop - treeEl.clientHeight / 2)
  }

  function renderNodeTools() {
    if (tree.isRoot(currentId)) { nodeTools.innerHTML = ''; return }
    nodeTools.innerHTML = `
      <div class="row" style="margin-top:10px">
        <button class="btn secondary btn-sm" id="promote" ${tree.isMainline(currentId) ? 'disabled' : ''}>⬆ Promouvoir</button>
        <button class="btn danger btn-sm" id="del">🗑 Supprimer ce coup</button>
      </div>`
    $('#promote').onclick = () => { tree.promote(currentId); refresh() }
    $('#del').onclick = () => { const p = tree.remove(currentId); currentId = p || tree.rootId; refresh() }
  }

  // --- bibliotheque ---
  function renderLib() {
    const list = loadLib()
    const el = $('#liblist')
    if (!list.length) { el.innerHTML = '<p class="muted">Aucune ouverture enregistrée. Joue des coups puis clique 💾 Ouverture.</p>'; return }
    el.innerHTML = list.map((o) => `
      <div class="opening-item">
        <button class="opening-open" data-id="${o.id}">📖 ${esc(o.name)}</button>
        <button class="btn danger btn-sm" data-del="${o.id}">🗑</button>
      </div>`).join('')
    el.querySelectorAll('.opening-open').forEach((b) => { b.onclick = () => openOpening(b.dataset.id) })
    el.querySelectorAll('[data-del]').forEach((b) => { b.onclick = () => { saveLib(loadLib().filter((o) => o.id !== b.dataset.del)); renderLib() } })
  }
  function openOpening(id) {
    const o = loadLib().find((x) => x.id === id)
    if (!o) return
    tree = PgnTree.fromJSON(o.tree)
    currentId = tree.rootId
    mode = 'replay'            // on arrive en mode lecture : navigue puis "Jouer depuis ici"
    toggleLib(false)
    refresh()
  }
  function toggleLib(open) {
    libOpen = open ?? !libOpen
    $('#libcard').hidden = !libOpen
    if (libOpen) renderLib()
  }

  // --- actions ---
  $('#flip').onclick = () => board.flip()
  $('#lib').onclick = () => toggleLib()
  $('#libclose').onclick = () => toggleLib(false)

  $('#reset').onclick = () => {
    tree = new PgnTree(); currentId = tree.rootId; mode = 'edit'; refresh()
  }
  $('#rejouer').onclick = () => {
    mode = mode === 'replay' ? 'edit' : 'replay'
    if (mode === 'replay') currentId = tree.rootId   // on rejoue depuis le debut
    refresh()
  }
  $('#variante').onclick = () => {
    if (tree.isRoot(currentId)) { return }
    const name = prompt('Nom de cette variante :', tree.get(currentId).name || 'Ma variante')
    if (name === null) return
    tree.setName(currentId, name); refresh()
  }
  $('#ouverture').onclick = () => {
    if (!hasMoves()) return
    const name = prompt("Nom de l'ouverture :", 'Mon ouverture')
    if (name === null) return
    const list = loadLib()
    list.unshift({ id: 'o' + Date.now(), name: name || 'Mon ouverture', tree: tree.toJSON() })
    saveLib(list)
    statusEl.textContent = '✓ Ouverture enregistrée dans 📂 Mes ouvertures'
  }

  $('#first').onclick = () => go(tree.rootId)
  $('#prev').onclick = () => { const n = tree.get(currentId); if (n.parentId) go(n.parentId) }
  $('#next').onclick = () => { const c = tree.childMainline(currentId); if (c) go(c) }
  $('#last').onclick = () => { let id = currentId; while (tree.childMainline(id)) id = tree.childMainline(id); go(id) }
  $('#playhere').onclick = () => { mode = 'edit'; refresh() }
  $('#copyfen').onclick = () => navigator.clipboard?.writeText(fenEl.value)

  refresh()
  return () => board.destroy()
}
