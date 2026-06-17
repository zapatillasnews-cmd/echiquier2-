// Wrapper autour de Stockfish (Web Worker, UCI). Une seule instance partagee.
// Le moteur ne se charge que lorsqu'on l'utilise (analyse / jeux) -> pas de cout au demarrage.

let _engine = null
export function getEngine() {
  if (!_engine) _engine = new Engine()
  return _engine
}

class Engine {
  constructor() {
    this.worker = null
    this.ready = false
    this.listeners = new Set()
    this._initPromise = null
  }

  init() {
    if (this._initPromise) return this._initPromise
    this._initPromise = new Promise((resolve, reject) => {
      try {
        // Le hash transmet le chemin du .wasm au glue emscripten.
        this.worker = new Worker('/engine/stockfish.js#/engine/stockfish.wasm')
      } catch (e) { reject(e); return }
      this.worker.onerror = (e) => reject(e?.message || 'Erreur moteur')
      this.worker.onmessage = (e) => {
        const line = typeof e.data === 'string' ? e.data : (e.data && e.data.data) || ''
        if (!this.ready && line.startsWith('uciok')) { this.ready = true; resolve(this) }
        this.listeners.forEach((l) => l(line))
      }
      this.worker.postMessage('uci')
    })
    return this._initPromise
  }

  _send(cmd) { this.worker.postMessage(cmd) }

  // Analyse une position FEN. Renvoie { bestmove (uci), cp, mate, pv, depth }
  // cp / mate sont normalises du point de vue des BLANCS (+ = avantage blanc).
  async analyse(fen, { depth = 14, movetime = null } = {}) {
    await this.init()
    const whiteToMove = fen.split(' ')[1] === 'w'
    const sign = whiteToMove ? 1 : -1
    return new Promise((resolve) => {
      let cp = null, mate = null, pv = [], d = 0
      const onLine = (line) => {
        if (line.startsWith('info') && line.includes(' pv ')) {
          const dm = /depth (\d+)/.exec(line); if (dm) d = +dm[1]
          const cm = /score cp (-?\d+)/.exec(line)
          const mm = /score mate (-?\d+)/.exec(line)
          if (cm) { cp = +cm[1]; mate = null }
          if (mm) { mate = +mm[1]; cp = null }
          const pm = /\bpv (.+)$/.exec(line); if (pm) pv = pm[1].trim().split(/\s+/)
        } else if (line.startsWith('bestmove')) {
          this.listeners.delete(onLine)
          const bm = line.split(/\s+/)[1]
          resolve({
            bestmove: bm && bm !== '(none)' ? bm : null,
            cp: cp === null ? null : cp * sign,
            mate: mate === null ? null : mate * sign,
            pv, depth: d
          })
        }
      }
      this.listeners.add(onLine)
      this._send('position fen ' + fen)
      this._send(movetime ? `go movetime ${movetime}` : `go depth ${depth}`)
    })
  }

  stop() { if (this.worker) this._send('stop') }
}

// Valeur (cp ou mat) -> texte court pour affichage (cote blancs).
export function formatEval({ cp, mate }) {
  if (mate !== null && mate !== undefined) return (mate > 0 ? '#' : '#-') + Math.abs(mate)
  if (cp === null || cp === undefined) return '0.0'
  const v = (cp / 100).toFixed(1)
  return (cp > 0 ? '+' : '') + v
}

// Position de la barre d'eval (0 = noirs gagnent, 100 = blancs gagnent).
export function evalToPercent({ cp, mate }) {
  if (mate !== null && mate !== undefined) return mate > 0 ? 100 : 0
  if (cp === null || cp === undefined) return 50
  return 50 + 50 * (2 / (1 + Math.exp(-0.004 * cp)) - 1)
}
