import { Chessground } from 'chessground'
import { BOARD_THEMES, boardImage, currentBoardTheme, applyBoardTheme, currentAppMode, applyAppMode } from '../ui/themes.js'
import { getUser, changePassword, isSupabaseConfigured } from '../supabase.js'
import { notificationsEnabled, setNotifications } from '../srs.js'

const PREVIEW_FEN = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1'

export async function renderSettings(container) {
  if (container._preview) { try { container._preview.destroy() } catch {} container._preview = null }
  const user = isSupabaseConfigured ? await getUser() : null
  const active = currentBoardTheme()
  const mode = currentAppMode()

  container.innerHTML = `
    <h1>Reglages</h1>

    <div class="card" style="margin-bottom:16px">
      <h2>Apparence</h2>
      <div class="row" style="justify-content:space-between">
        <span>Mode ${mode === 'light' ? 'clair' : 'sombre'}</span>
        <button class="btn secondary" id="modeBtn">${mode === 'light' ? '🌙 Passer en sombre' : '☀️ Passer en clair'}</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h2>Echiquier</h2>
      <div class="settings-board">
        <div class="board-wrap" style="max-width:300px"><div class="cg-wrap" id="preview"></div></div>
        <div class="theme-grid" id="themes">
          ${BOARD_THEMES.map((t) => `
            <button class="theme-swatch ${t.id === active ? 'active' : ''}" data-id="${t.id}">
              <span class="swatch-board" style="background-image:${boardImage(t.light, t.dark)}"></span>
              <span class="swatch-label">${t.label}</span>
            </button>`).join('')}
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <h2>Rappels de revision</h2>
      <p class="muted">Recois une notification quand des ouvertures sont a reviser (a l'ouverture de l'app).</p>
      <button class="btn ${notificationsEnabled() ? '' : 'secondary'}" id="notifBtn">
        ${notificationsEnabled() ? '🔔 Rappels actives' : 'Activer les rappels'}
      </button>
    </div>

    ${user ? `
    <div class="card">
      <h2>Mot de passe</h2>
      <label>Nouveau mot de passe</label>
      <input id="pw1" type="password" autocomplete="new-password" />
      <label>Confirme</label>
      <input id="pw2" type="password" autocomplete="new-password" />
      <div id="pwmsg" class="muted" style="margin-top:8px"></div>
      <button class="btn" id="pwBtn" style="margin-top:10px">Changer le mot de passe</button>
    </div>` : ''}`

  // Apercu live (les pieces apparaissent ; le plateau suit le theme via les variables CSS)
  const preview = Chessground(container.querySelector('#preview'), { fen: PREVIEW_FEN, viewOnly: true, coordinates: false })
  container._preview = preview

  container.querySelectorAll('.theme-swatch').forEach((el) => {
    el.onclick = () => {
      applyBoardTheme(el.dataset.id)
      container.querySelectorAll('.theme-swatch').forEach((s) => s.classList.toggle('active', s === el))
    }
  })

  const modeBtn = container.querySelector('#modeBtn')
  modeBtn.onclick = () => { const m = applyAppMode(currentAppMode() === 'dark' ? 'light' : 'dark'); renderSettings(container) }

  const notifBtn = container.querySelector('#notifBtn')
  notifBtn.onclick = async () => {
    if (notificationsEnabled()) { setNotifications(false); renderSettings(container); return }
    if ('Notification' in window) {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { notifBtn.textContent = 'Permission refusee par le navigateur'; return }
    }
    setNotifications(true); renderSettings(container)
  }

  if (user) {
    const msg = container.querySelector('#pwmsg')
    container.querySelector('#pwBtn').onclick = async () => {
      const a = container.querySelector('#pw1').value, b = container.querySelector('#pw2').value
      if (a.length < 6) { msg.textContent = 'Au moins 6 caracteres.'; return }
      if (a !== b) { msg.textContent = 'Les deux mots de passe different.'; return }
      msg.textContent = 'Mise a jour...'
      try { await changePassword(a); msg.style.color = 'var(--accent-2)'; msg.textContent = '✓ Mot de passe change.' }
      catch (e) { msg.style.color = 'var(--danger)'; msg.textContent = 'Erreur : ' + e.message }
    }
  }

  return () => { if (container._preview) { try { container._preview.destroy() } catch {} container._preview = null } }
}
