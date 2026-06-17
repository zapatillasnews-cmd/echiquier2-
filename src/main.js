import './styles/main.css'
import { getUser, signOut, onAuthChange, isSupabaseConfigured } from './supabase.js'
import { applyBoardTheme, currentBoardTheme, applyAppMode, currentAppMode, toggleAppMode } from './ui/themes.js'
import { renderCoursesHome, renderCourse, renderCourseStep } from './views/courses.js'
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
let cleanup = null   // nettoyage de la vue courante (board, listeners)

function navigate(hash) {
  if (location.hash === hash) router()
  else location.hash = hash
}

// Onglets principaux (barre du bas). Les autres modules sont accessibles via l'accueil.
const TABS = [
  { hash: '#/accueil',  label: 'Accueil',   icon: '🏠', auth: false },
  { hash: '#/parties',  label: 'Parties',   icon: '📚', auth: true  },
  { hash: '#/jouer',    label: 'Jouer',     icon: '♟️', auth: false },
  { hash: '#/minijeux', label: 'Entraîner', icon: '🎯', auth: false },
  { hash: '#/reglages', label: 'Réglages',  icon: '⚙️', auth: false }
]

// Quels onglets s'allument pour quelle route.
const TAB_GROUPS = {
  '#/accueil':  ['#/accueil'],
  '#/parties':  ['#/parties', '#/import', '#/partie/', '#/etudes', '#/etude/'],
  '#/jouer':    ['#/jouer'],
  '#/minijeux': ['#/minijeux', '#/puzzles', '#/revision'],
  '#/reglages': ['#/reglages']
}

function renderShell(activeHash) {
  const modeIcon = currentAppMode() === 'light' ? '🌙' : '☀️'
  app.innerHTML = `
    <header class="topbar">
      <a class="brand" href="#/accueil" id="brand">
        <span class="brand-mark">♟️</span>
        <span class="script brand-name">Échi<span>quier</span></span>
      </a>
      <div class="head-actions">
        <button class="icon-btn" id="modeToggle" title="Jour / nuit">${modeIcon}</button>
        <div class="userbox" id="userbox"></div>
      </div>
    </header>
    <main id="view"></main>
    <nav id="tabbar"></nav>`

  // Onglets du bas
  const tabbar = app.querySelector('#tabbar')
  TABS.forEach((t) => {
    if (t.auth && !isSupabaseConfigured) return
    const a = document.createElement('a')
    a.href = t.hash
    a.className = 'tab'
    a.innerHTML = `<span class="tab-icon">${t.icon}</span><span>${t.label}</span>`
    const group = TAB_GROUPS[t.hash] || [t.hash]
    if (group.some((g) => activeHash.startsWith(g))) a.classList.add('active')
    tabbar.appendChild(a)
  })

  // Boite utilisateur
  const userbox = app.querySelector('#userbox')
  if (!isSupabaseConfigured) {
    userbox.innerHTML = '<span class="muted">mode local</span>'
  } else if (currentUser) {
    userbox.innerHTML = `<span class="email">${currentUser.email}</span> <a href="#" id="logout">Déconnexion</a>`
    userbox.querySelector('#logout').onclick = async (e) => { e.preventDefault(); await signOut(); navigate('#/accueil') }
  } else {
    userbox.innerHTML = '<a href="#/login">Connexion</a>'
  }

  app.querySelector('#modeToggle').onclick = (e) => {
    e.preventDefault(); toggleAppMode()
    const t = app.querySelector('#modeToggle'); if (t) t.textContent = currentAppMode() === 'light' ? '🌙' : '☀️'
  }

  return app.querySelector('#view')
}

async function router() {
  if (cleanup) { try { cleanup() } catch {} cleanup = null }

  const hash = location.hash || '#/accueil'
  const view = renderShell(hash)

  const protectedRoute = hash.startsWith('#/parties') || hash.startsWith('#/import') ||
    hash.startsWith('#/partie') || hash.startsWith('#/etude') || hash.startsWith('#/revision')
  if (isSupabaseConfigured && protectedRoute && !currentUser) {
    return renderAuth(view, { onSignedIn: () => navigate('#/accueil') })
  }

  if (hash.startsWith('#/login')) return renderAuth(view, { onSignedIn: () => navigate('#/accueil') })
  if (hash.startsWith('#/cours/')) {
    const parts = hash.split('/')        // ['#','cours','italienne'] ou [...,'0']
    const cid = parts[2]
    if (parts[3] !== undefined && parts[3] !== '') { cleanup = renderCourseStep(view, cid, parseInt(parts[3], 10), navigate); return }
    return renderCourse(view, cid, navigate)
  }
  if (hash.startsWith('#/accueil')) return renderCoursesHome(view, navigate)
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
  if (hash.startsWith('#/parties')) return renderGames(view, navigate)
  if (hash.startsWith('#/reglages')) { cleanup = await renderSettings(view); return }
  // defaut
  return renderCoursesHome(view, navigate)
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
