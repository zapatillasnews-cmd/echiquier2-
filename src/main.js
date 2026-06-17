import './styles/main.css'
import { getUser, signOut, onAuthChange, isSupabaseConfigured } from './supabase.js'
import { applyBoardTheme, currentBoardTheme, applyAppMode, currentAppMode, toggleAppMode } from './ui/themes.js'
import { renderPlay } from './views/play.js'
import { renderGames, renderImport, renderGameView } from './views/games.js'
import { renderStudies, renderStudyEditor } from './views/studies.js'
import { renderRevision, checkReminders } from './views/revision.js'
import { renderPuzzles } from './views/puzzles.js'
import { renderMinigamesHub, renderCoordTrainer, renderKnightVision } from './views/minigames.js'
import { renderFindBest } from './views/findbest.js'
import { renderSettings } from './views/settings.js'
import { renderAuth } from './views/auth.js'

const app = document.getElementById('app')
let currentUser = null
let cleanup = null   // fonction de nettoyage de la vue courante (board, listeners)

function navigate(hash) {
  if (location.hash === hash) router()
  else location.hash = hash
}

const NAV = [
  { hash: '#/parties', label: 'Parties', auth: true },
  { hash: '#/etudes', label: 'Etudes', auth: true },
  { hash: '#/revision', label: 'Revision', auth: true },
  { hash: '#/puzzles', label: 'Problemes', auth: false },
  { hash: '#/jouer', label: 'Jouer', auth: false },
  { hash: '#/minijeux', label: 'Mini-jeux', auth: false },
  { hash: '#/reglages', label: 'Reglages', auth: false }
]

function renderShell(activeHash) {
  app.innerHTML = `
    <header class="topbar">
      <div class="brand">Echi<span>quier</span></div>
      <button class="menu-toggle" id="menuToggle" aria-label="Menu">☰</button>
      <div class="menu" id="menu">
        <nav id="nav"></nav>
        <div class="user" id="userbox"></div>
      </div>
    </header>
    <main id="view"></main>`

  const nav = app.querySelector('#nav')
  NAV.forEach((item) => {
    if (item.auth && !isSupabaseConfigured) return
    const a = document.createElement('a')
    a.href = item.hash
    a.textContent = item.label
    // surbrillance : route exacte ou sous-route (ex. #/etude/ pour Etudes)
    const base = item.hash.replace(/s$/, '')
    if (activeHash.startsWith(item.hash) || activeHash.startsWith(base + '/')) a.classList.add('active')
    nav.appendChild(a)
  })

  const userbox = app.querySelector('#userbox')
  const modeIcon = currentAppMode() === 'light' ? '🌙' : '☀️'
  const modeBtn = `<a href="#" id="modeToggle" title="Jour / nuit">${modeIcon}</a>`
  if (!isSupabaseConfigured) {
    userbox.innerHTML = modeBtn + ' <span class="muted">mode local</span>'
  } else if (currentUser) {
    userbox.innerHTML = `${modeBtn} <span class="email">${currentUser.email}</span> <a href="#" id="logout">Deconnexion</a>`
    userbox.querySelector('#logout').onclick = async (e) => { e.preventDefault(); await signOut(); navigate('#/jouer') }
  } else {
    userbox.innerHTML = modeBtn + ' <a href="#/login">Connexion</a>'
  }
  userbox.querySelector('#modeToggle').onclick = (e) => { e.preventDefault(); toggleAppMode(); renderShellRefresh(activeHash) }

  // menu mobile
  const menu = app.querySelector('#menu')
  app.querySelector('#menuToggle').onclick = () => menu.classList.toggle('open')
  menu.querySelectorAll('a').forEach((a) => { if (a.id !== 'modeToggle') a.addEventListener('click', () => menu.classList.remove('open')) })

  return app.querySelector('#view')
}

// Re-applique juste l'icone jour/nuit sans recharger la vue.
function renderShellRefresh(activeHash) {
  const icon = currentAppMode() === 'light' ? '🌙' : '☀️'
  const t = app.querySelector('#modeToggle'); if (t) t.textContent = icon
}

async function router() {
  if (cleanup) { try { cleanup() } catch {} cleanup = null }

  const hash = location.hash || (isSupabaseConfigured && currentUser ? '#/parties' : '#/jouer')
  const view = renderShell(hash)

  const protectedRoute = hash.startsWith('#/parties') || hash.startsWith('#/import') ||
    hash.startsWith('#/partie') || hash.startsWith('#/etude') || hash.startsWith('#/revision')
  if (isSupabaseConfigured && protectedRoute && !currentUser) {
    return renderAuth(view, { onSignedIn: () => navigate('#/parties') })
  }

  if (hash.startsWith('#/login')) return renderAuth(view, { onSignedIn: () => navigate('#/parties') })
  if (hash.startsWith('#/jouer')) { cleanup = renderPlay(view, navigate); return }
  if (hash.startsWith('#/import')) return renderImport(view, navigate)
  if (hash.startsWith('#/partie/')) { cleanup = await renderGameView(view, hash.split('/')[2], navigate); return }
  if (hash.startsWith('#/etude/')) { cleanup = await renderStudyEditor(view, hash.split('/')[2], navigate); return }
  if (hash.startsWith('#/etudes')) return renderStudies(view, navigate)
  if (hash.startsWith('#/revision')) { cleanup = await renderRevision(view, navigate); return }
  if (hash.startsWith('#/puzzles')) { cleanup = renderPuzzles(view); return }
  if (hash.startsWith('#/minijeux/coordonnees')) { cleanup = renderCoordTrainer(view, navigate); return }
  if (hash.startsWith('#/minijeux/cavalier')) { cleanup = renderKnightVision(view, navigate); return }
  if (hash.startsWith('#/minijeux/meilleurcoup')) { cleanup = renderFindBest(view, navigate); return }
  if (hash.startsWith('#/minijeux')) return renderMinigamesHub(view, navigate)
  if (hash.startsWith('#/reglages')) { cleanup = await renderSettings(view); return }
  // defaut
  if (isSupabaseConfigured) return renderGames(view, navigate)
  cleanup = renderPlay(view, navigate)
}

async function start() {
  applyAppMode(currentAppMode())
  applyBoardTheme(currentBoardTheme())
  currentUser = await getUser()
  onAuthChange((user) => { currentUser = user; router() })
  window.addEventListener('hashchange', router)
  await router()
  checkReminders() // rappel de revision (non bloquant)
}

start()
