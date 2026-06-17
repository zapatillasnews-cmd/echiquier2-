import { Chessground } from 'chessground'
import { Chess } from 'chess.js'

// Calcule les coups legaux au format attendu par chessground : Map(from -> [to...])
export function legalDests(chess) {
  const dests = new Map()
  for (const m of chess.moves({ verbose: true })) {
    if (!dests.has(m.from)) dests.set(m.from, [])
    dests.get(m.from).push(m.to)
  }
  return dests
}

function turnColor(chess) {
  return chess.turn() === 'w' ? 'white' : 'black'
}

// Board interactif (jeu libre, coups legaux). Promotion auto en dame pour le MVP.
export class Board {
  constructor(el, { orientation = 'white', onMove } = {}) {
    this.chess = new Chess()
    this.onMove = onMove
    this.cg = Chessground(el, {
      orientation,
      movable: {
        free: false,
        color: turnColor(this.chess),
        dests: legalDests(this.chess),
        showDests: true
      },
      highlight: { lastMove: true, check: true },
      animation: { enabled: true, duration: 150 },
      events: { move: (from, to) => this._handleMove(from, to) }
    })
    this._sync()
  }

  _handleMove(from, to) {
    const move = this.chess.move({ from, to, promotion: 'q' })
    if (!move) return
    this._sync()
    this.onMove?.(move, this.chess)
  }

  // Aligne l'etat visuel de chessground sur l'etat reel de chess.js.
  _sync() {
    const inCheck = this.chess.inCheck?.() ?? this.chess.in_check?.()
    this.cg.set({
      fen: this.chess.fen(),
      turnColor: turnColor(this.chess),
      check: inCheck ? turnColor(this.chess) : false,
      movable: { color: turnColor(this.chess), dests: legalDests(this.chess) }
    })
  }

  reset() {
    this.chess.reset()
    this._sync()
  }

  flip() {
    this.cg.toggleOrientation()
  }

  setFen(fen) {
    this.chess.load(fen)
    this._sync()
  }

  destroy() {
    this.cg.destroy()
  }
}

// Lecteur de partie : affiche une suite de FENs (issues d'un PGN) avec navigation.
export class GameViewer {
  constructor(el, moves, { orientation = 'white' } = {}) {
    this.moves = moves          // [{san, fen, ply}]
    this.index = 0
    this.cg = Chessground(el, {
      orientation,
      viewOnly: true,
      highlight: { lastMove: true },
      animation: { enabled: true, duration: 150 }
    })
    this._render()
  }

  _render() {
    this.cg.set({ fen: this.moves[this.index].fen })
  }

  goto(i) {
    this.index = Math.max(0, Math.min(this.moves.length - 1, i))
    this._render()
    return this.index
  }

  next() { return this.goto(this.index + 1) }
  prev() { return this.goto(this.index - 1) }
  first() { return this.goto(0) }
  last() { return this.goto(this.moves.length - 1) }
  flip() { this.cg.toggleOrientation() }
  destroy() { this.cg.destroy() }
}

// Plateau interactif pilote de l'exterieur : l'appelant gere l'etat (arbre de
// coups). On lui fournit une FEN ; il appelle onMove(orig, dest) a chaque coup.
export class InteractiveBoard {
  constructor(el, { orientation = 'white', onMove } = {}) {
    this.onMove = onMove
    this.cg = Chessground(el, {
      orientation,
      movable: { free: false, color: 'white', dests: new Map(), showDests: true },
      highlight: { lastMove: true, check: true },
      animation: { enabled: true, duration: 150 },
      events: { move: (orig, dest) => this.onMove?.(orig, dest) }
    })
  }

  // Place une position. lastMove = [from, to] pour la surbrillance (optionnel).
  setFen(fen, lastMove) {
    const chess = new Chess(fen)
    const color = turnColor(chess)
    const inCheck = chess.inCheck?.() ?? false
    this.cg.set({
      fen,
      turnColor: color,
      lastMove: lastMove && lastMove[0] ? lastMove : undefined,
      check: inCheck ? color : false,
      movable: { color, dests: legalDests(chess) }
    })
  }

  setOrientation(o) { this.cg.set({ orientation: o }) }
  flip() { this.cg.toggleOrientation() }
  destroy() { this.cg.destroy() }
}
