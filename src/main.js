import './styles/main.css'
import { getUser, signOut, onAuthChange, isSupabaseConfigured } from './supabase.js'
import { renderPlay } from './views/play.js'
import { renderGames, renderImport, renderGameView } from './views/games.js'
import { renderAuth } from './views/auth.js'

const app = document.getElementById('app')
let currentUser = null
let cleanup = null   // fonction de nettoyage de la vue courante (board, listeners)

function navigate(hash) {
  if (location.hash === hash) router()
  else location.hash = hash
}

const NAV = [
  { hash: '#/parties', label: 'Mes parties', auth: true },
  { hash: '#/jouer', label: 'Jouer', auth: false }
]

function renderShell(activeHash) {
  app.innerHTML = `
    <header class="topbar">
      <div class="brand">Echi<span>quier</span></div>
      <nav id="nav"></nav>
      <div class="user" id="userbox"></div>
    </header>
    <main id="view"></main>`

  const nav = app.querySelector('#nav')
  NAV.forEach((item) => {
    if (item.auth && !isSupabaseConfigured) return
    const a = document.createElement('a')
    a.href = item.hash
    a.textContent = item.label
    if (activeHash.startsWith(item.hash)) a.classList.add('active')
    nav.appendChild(a)
  })

  const userbox = app.querySelector('#userbox')
  if (!isSupabaseConfigured) {
    userbox.innerHTML = '<span class="muted">mode local</span>'
  } else if (currentUser) {
    userbox.innerHTML = `<span>${currentUser.email}</span> &nbsp;<a href="#" id="logout">Deconnexion</a>`
    userbox.querySelector('#logout').onclick = async (e) => {
      e.preventDefault(); await signOut(); navigate('#/jouer')
    }
  } else {
    userbox.innerHTML = '<a href="#/login">Connexion</a>'
  }
  return app.querySelector('#view')
}

async function router() {
  if (cleanup) { try { cleanup() } catch {} cleanup = null }

  const hash = location.hash || (isSupabaseConfigured && currentUser ? '#/parties' : '#/jouer')
  const view = renderShell(hash)

  // Routes protegees (necessitent une connexion quand Supabase est configure)
  const protectedRoute = hash.startsWith('#/parties') || hash.startsWith('#/import') || hash.startsWith('#/partie')
  if (isSupabaseConfigured && protectedRoute && !currentUser) {
    return renderAuth(view, { onSignedIn: () => navigate('#/parties') })
  }

  if (hash.startsWith('#/login')) {
    return renderAuth(view, { onSignedIn: () => navigate('#/parties') })
  }
  if (hash.startsWith('#/jouer')) {
    cleanup = renderPlay(view); return
  }
  if (hash.startsWith('#/import')) {
    return renderImport(view, navigate)
  }
  if (hash.startsWith('#/partie/')) {
    const id = hash.split('/')[2]
    cleanup = await renderGameView(view, id, navigate); return
  }
  // defaut
  if (isSupabaseConfigured) return renderGames(view, navigate)
  cleanup = renderPlay(view)
}

async function start() {
  currentUser = await getUser()
  onAuthChange((user) => { currentUser = user; router() })
  window.addEventListener('hashchange', router)
  router()
}

start()
