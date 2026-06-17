// Repetition espacee (SM-2 simplifie). Etat conserve en localStorage.
import { PgnTree } from './chess/PgnTree.js'

const STORE = 'srs_state_v1'
const DAY = 86400000

function loadState() { try { return JSON.parse(localStorage.getItem(STORE)) || {} } catch { return {} } }
function saveState(s) { localStorage.setItem(STORE, JSON.stringify(s)) }

// Cartes d'une etude : positions ou c'est a l'utilisateur de jouer (selon la
// couleur etudiee), reponse attendue = continuation principale.
export function cardsFromStudy(study) {
  const tree = PgnTree.fromJSON(study.tree)
  const color = study.color === 'black' ? 'b' : 'w'
  const cards = []
  const seen = new Set()
  function walk(nodeId) {
    const node = tree.get(nodeId)
    if (!node) return
    const turn = node.fen.split(' ')[1]
    if (turn === color && node.children.length) {
      const child = tree.get(node.children[0])
      const key = study.id + ':' + node.fen
      if (!seen.has(key)) {
        seen.add(key)
        cards.push({ key, fen: node.fen, answer: child.uci, san: child.san, name: child.name || node.name || '' })
      }
    }
    for (const cid of node.children) walk(cid)
  }
  walk(tree.rootId)
  return cards
}

export function dueCards(cards) {
  const st = loadState()
  const now = Date.now()
  return cards.filter((c) => { const s = st[c.key]; return !s || s.due <= now })
}

export function grade(key, success) {
  const st = loadState()
  const s = st[key] || { interval: 0, ease: 2.5, reps: 0 }
  if (success) {
    s.reps += 1
    s.interval = s.reps === 1 ? 1 : s.reps === 2 ? 3 : Math.round(s.interval * s.ease)
    s.ease = Math.min(2.8, s.ease + 0.05)
  } else {
    s.reps = 0
    s.interval = 0
    s.ease = Math.max(1.3, s.ease - 0.2)
  }
  s.due = Date.now() + (s.interval > 0 ? s.interval * DAY : 60000)
  st[key] = s
  saveState(st)
  return s
}

export function notificationsEnabled() { return localStorage.getItem('srs_notify') === '1' }
export function setNotifications(on) { localStorage.setItem('srs_notify', on ? '1' : '0') }
