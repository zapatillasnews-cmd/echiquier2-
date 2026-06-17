// Arbre de coups : ligne principale + variantes + sous-variantes, avec nom et
// commentaire par noeud. Serialisable en JSON (stockage Supabase) et exportable en PGN.

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export class PgnTree {
  constructor(rootFen = START_FEN) {
    this.seq = 0
    this.rootId = 'root'
    this.nodes = {
      root: {
        id: 'root', parentId: null, san: null, uci: null, from: null, to: null,
        fen: rootFen, comment: '', name: '', nags: [], children: []
      }
    }
  }

  get(id) { return this.nodes[id] }
  isRoot(id) { return id === this.rootId }

  _uci(m) { return m.from + m.to + (m.promotion || '') }

  // Ajoute un coup depuis parentId. Si le coup existe deja (meme UCI), renvoie
  // le noeud existant (pas de doublon). Sinon cree une nouvelle branche.
  addMove(parentId, move, fen) {
    const parent = this.nodes[parentId]
    if (!parent) throw new Error('Noeud parent introuvable')
    const uci = this._uci(move)
    const existing = parent.children.map((id) => this.nodes[id]).find((n) => n.uci === uci)
    if (existing) return existing.id

    const id = 'n' + (++this.seq)
    this.nodes[id] = {
      id, parentId, san: move.san, uci, from: move.from, to: move.to,
      fen, comment: '', name: '', nags: [], children: []
    }
    parent.children.push(id)
    return id
  }

  // Supprime un noeud et tout son sous-arbre.
  remove(id) {
    if (this.isRoot(id)) return
    const node = this.nodes[id]
    const parent = this.nodes[node.parentId]
    parent.children = parent.children.filter((c) => c !== id)
    const stack = [id]
    while (stack.length) {
      const cur = stack.pop()
      stack.push(...this.nodes[cur].children)
      delete this.nodes[cur]
    }
    return node.parentId
  }

  // Promeut une variante en tete (vers la ligne principale).
  promote(id) {
    if (this.isRoot(id)) return
    const parent = this.nodes[this.nodes[id].parentId]
    const i = parent.children.indexOf(id)
    if (i > 0) {
      parent.children.splice(i, 1)
      parent.children.unshift(id)
    }
  }

  isMainline(id) {
    if (this.isRoot(id)) return true
    const parent = this.nodes[this.nodes[id].parentId]
    return parent.children[0] === id
  }

  setName(id, name) { if (this.nodes[id]) this.nodes[id].name = name }
  setComment(id, c) { if (this.nodes[id]) this.nodes[id].comment = c }

  childMainline(id) {
    const node = this.nodes[id]
    return node && node.children.length ? node.children[0] : null
  }

  toJSON() { return { v: 1, rootId: this.rootId, nodes: this.nodes } }

  static fromJSON(obj) {
    const t = new PgnTree()
    if (!obj || !obj.nodes || !obj.nodes[obj.rootId || 'root']) return t
    t.rootId = obj.rootId || 'root'
    t.nodes = obj.nodes
    let max = 0
    for (const k of Object.keys(t.nodes)) {
      const m = /^n(\d+)$/.exec(k)
      if (m) max = Math.max(max, +m[1])
    }
    t.seq = max
    return t
  }

  // Export PGN (variantes entre parentheses, noms et commentaires en {accolades}).
  toPGN() {
    const self = this
    const numLabel = (node, forceBlack) => {
      const parts = node.fen.split(' ')
      const turn = parts[1], full = parseInt(parts[5], 10)
      if (turn === 'b') return full + '. '
      if (forceBlack) return (full - 1) + '... '
      return ''
    }
    const annot = (node) => {
      let s = ''
      if (node.name) s += ` {[${node.name}]}`
      if (node.comment) s += ` {${node.comment}}`
      return s
    }
    const line = (node, forceFirstBlack) => {
      const kids = node.children
      if (!kids.length) return ''
      const main = self.nodes[kids[0]]
      let out = numLabel(main, forceFirstBlack) + main.san + annot(main) + ' '
      for (let i = 1; i < kids.length; i++) {
        const v = self.nodes[kids[i]]
        out += '(' + numLabel(v, true) + v.san + annot(v) + ' ' + line(v, false).trim() + ') '
      }
      out += line(main, kids.length > 1)
      return out
    }
    return line(this.nodes[this.rootId], false).trim()
  }
}
