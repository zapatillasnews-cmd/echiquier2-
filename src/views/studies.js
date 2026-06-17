import { Chess } from 'chess.js'
import { listStudies, getStudy, createStudy, saveStudy, deleteStudy, isSupabaseConfigured } from '../supabase.js'
import { InteractiveBoard } from '../ui/board.js'
import { PgnTree } from '../chess/PgnTree.js'

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}
function notConfigured(container) {
  container.innerHTML = `<div class="banner warn">Connecte-toi (Supabase) pour creer des etudes.</div>`
}

// ---------------- Liste des etudes ----------------
export async function renderStudies(container, navigate) {
  if (!isSupabaseConfigured) return notConfigured(container)
  container.innerHTML = `
    <h1>Mes etudes</h1>
    <div class="card" style="margin-bottom:18px">
      <label>Nouvelle etude (ouverture, repertoire...)</label>
      <div class="row">
        <input id="newname" placeholder="Ex : Defense Sicilienne" style="flex:1;min-width:180px" />
        <select id="newcolor" class="select">
          <option value="white">Cote blancs</option>
          <option value="black">Cote noirs</option>
        </select>
        <button class="btn" id="create">Creer</button>
      </div>
    </div>
    <div id="list"><p class="muted">Chargement...</p></div>`

  container.querySelector('#create').onclick = async () => {
    const name = container.querySelector('#newname').value.trim() || 'Etude sans nom'
    const color = container.querySelector('#newcolor').value
    try {
      const study = await createStudy({ name, color })
      navigate('#/etude/' + study.id)
    } catch (e) { alert('Erreur : ' + e.message) }
  }

  try {
    const studies = await listStudies()
    const list = container.querySelector('#list')
    if (!studies.length) {
      list.innerHTML = `<div class="card"><p class="muted">Aucune etude. Cree ta premiere ci-dessus.</p></div>`
      return
    }
    list.innerHTML = `<div class="game-grid">${studies.map((s) => `
      <div class="card game-item" data-id="${s.id}">
        <div class="players">${esc(s.name)}</div>
        <div class="meta">${s.color === 'black' ? '♚ Cote noirs' : '♔ Cote blancs'}</div>
      </div>`).join('')}</div>`
    list.querySelectorAll('[data-id]').forEach((el) => {
      el.onclick = () => navigate('#/etude/' + el.dataset.id)
    })
  } catch (e) {
    container.querySelector('#list').innerHTML = `<div class="banner error">Erreur : ${e.message}</div>`
  }
}

// ---------------- Editeur d'arbre de coups ----------------
export async function renderStudyEditor(container, id, navigate) {
  if (!isSupabaseConfigured) return notConfigured(container)
  container.innerHTML = `<p class="muted">Chargement de l'etude...</p>`

  let study
  try { study = await getStudy(id) } catch (e) {
    container.innerHTML = `<div class="banner error">Erreur : ${e.message}</div>`; return
  }

  const tree = PgnTree.fromJSON(study.tree)
  let currentId = tree.rootId
  let dirty = false

  container.innerHTML = `
    <div class="row" style="justify-content:space-between;align-items:center">
      <input id="title" class="title-input" value="${esc(study.name)}" />
      <div class="row">
        <span id="savestate" class="muted"></span>
        <button class="btn" id="save">Enregistrer</button>
        <button class="btn secondary" id="back">Retour</button>
      </div>
    </div>

    <div class="board-layout" style="margin-top:14px">
      <div>
        <div class="board-wrap"><div class="cg-wrap" id="board"></div></div>
        <div class="row" style="margin-top:10px">
          <button class="btn secondary" id="first">|◀</button>
          <button class="btn secondary" id="prev">◀</button>
          <button class="btn secondary" id="next">▶</button>
          <button class="btn secondary" id="last">▶|</button>
          <button class="btn secondary" id="flip">Retourner</button>
        </div>
      </div>

      <div class="sidebar">
        <div class="card" id="nodepanel"></div>
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <h2 style="margin:0">Arbre de coups</h2>
            <button class="btn secondary" id="export">Exporter PGN</button>
          </div>
          <div class="tree" id="tree"></div>
        </div>
      </div>
    </div>`

  const board = new InteractiveBoard(container.querySelector('#board'), {
    orientation: study.color === 'black' ? 'black' : 'white',
    onMove: handleMove
  })

  const treeEl = container.querySelector('#tree')
  const panelEl = container.querySelector('#nodepanel')
  const saveState = container.querySelector('#savestate')

  function markDirty() { dirty = true; saveState.textContent = '● non enregistre' }

  function handleMove(orig, dest) {
    const node = tree.get(currentId)
    const chess = new Chess(node.fen)
    let move = null
    try { move = chess.move({ from: orig, to: dest, promotion: 'q' }) } catch { move = null }
    if (!move) { refresh(); return } // coup illegal : on resynchronise
    currentId = tree.addMove(currentId, move, chess.fen())
    markDirty()
    refresh()
  }

  function go(id) { if (id) { currentId = id; refresh() } }

  function refresh() {
    const node = tree.get(currentId)
    board.setFen(node.fen, [node.from, node.to])
    renderTree()
    renderPanel()
  }

  // --- rendu de l'arbre facon notation PGN, cliquable ---
  function numLabel(node, forceBlack) {
    const parts = node.fen.split(' ')
    const turn = parts[1], full = parseInt(parts[5], 10)
    if (turn === 'b') return `<span class="num">${full}.</span>`
    if (forceBlack) return `<span class="num">${full - 1}…</span>`
    return ''
  }
  function nameBadge(node) {
    return node.name ? `<span class="line-name">${esc(node.name)}</span>` : ''
  }
  function moveSpan(node) {
    const cls = node.id === currentId ? 'mv current' : 'mv'
    return `<span class="${cls}" data-id="${node.id}">${esc(node.san)}</span>`
  }
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
    const html = line(tree.nodes[tree.rootId], false)
    treeEl.innerHTML = html || '<span class="muted">Joue un coup sur l\'echiquier pour commencer.</span>'
    treeEl.querySelectorAll('.mv[data-id]').forEach((el) => { el.onclick = () => go(el.dataset.id) })
    treeEl.querySelector('.current')?.scrollIntoView({ block: 'nearest' })
  }

  // --- panneau du coup courant (nom / commentaire / actions) ---
  function renderPanel() {
    const node = tree.get(currentId)
    const isRoot = tree.isRoot(currentId)
    panelEl.innerHTML = `
      <h2 style="margin:0 0 8px">${isRoot ? 'Position de depart' : 'Coup : ' + esc(node.san)}</h2>
      <label>Nom de la ligne</label>
      <input id="nname" placeholder="Ex : Variante Najdorf" value="${esc(node.name)}" ${isRoot ? 'disabled' : ''}/>
      <label>Commentaire</label>
      <textarea id="ncomment" style="min-height:70px" ${isRoot ? 'disabled' : ''}>${esc(node.comment)}</textarea>
      <div class="row" style="margin-top:12px">
        <button class="btn secondary" id="promote" ${isRoot || tree.isMainline(currentId) ? 'disabled' : ''}>Promouvoir</button>
        <button class="btn danger" id="delete" ${isRoot ? 'disabled' : ''}>Supprimer</button>
      </div>`

    if (!isRoot) {
      const nname = panelEl.querySelector('#nname')
      const ncom = panelEl.querySelector('#ncomment')
      nname.oninput = () => { tree.setName(currentId, nname.value); markDirty() }
      nname.onblur = renderTree
      ncom.oninput = () => { tree.setComment(currentId, ncom.value); markDirty() }
      panelEl.querySelector('#promote').onclick = () => { tree.promote(currentId); markDirty(); refresh() }
      panelEl.querySelector('#delete').onclick = () => {
        if (!confirm('Supprimer ce coup et toute sa suite ?')) return
        const parent = tree.remove(currentId)
        currentId = parent || tree.rootId
        markDirty(); refresh()
      }
    }
  }

  // --- navigation ---
  container.querySelector('#prev').onclick = () => { const n = tree.get(currentId); go(n.parentId || currentId) }
  container.querySelector('#next').onclick = () => go(tree.childMainline(currentId))
  container.querySelector('#first').onclick = () => go(tree.rootId)
  container.querySelector('#last').onclick = () => {
    let id = currentId; let next = tree.childMainline(id)
    while (next) { id = next; next = tree.childMainline(id) }
    go(id)
  }
  container.querySelector('#flip').onclick = () => board.flip()

  const onKey = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
    if (e.key === 'ArrowLeft') { const n = tree.get(currentId); go(n.parentId || currentId) }
    if (e.key === 'ArrowRight') go(tree.childMainline(currentId))
  }
  window.addEventListener('keydown', onKey)

  // --- titre / sauvegarde / export ---
  const titleInput = container.querySelector('#title')
  titleInput.oninput = () => { study.name = titleInput.value; markDirty() }

  container.querySelector('#save').onclick = async () => {
    saveState.textContent = 'Enregistrement...'
    try {
      await saveStudy(id, { name: titleInput.value.trim() || 'Etude sans nom', color: study.color, tree: tree.toJSON() })
      dirty = false; saveState.textContent = '✓ enregistre'
    } catch (e) { saveState.textContent = 'Erreur : ' + e.message }
  }

  container.querySelector('#export').onclick = async () => {
    const pgn = tree.toPGN() || '(vide)'
    try { await navigator.clipboard.writeText(pgn); saveState.textContent = 'PGN copie !' }
    catch { prompt('PGN :', pgn) }
  }

  container.querySelector('#back').onclick = () => {
    if (dirty && !confirm('Quitter sans enregistrer ?')) return
    navigate('#/etudes')
  }

  refresh()
  return () => { board.destroy(); window.removeEventListener('keydown', onKey) }
}
