import { signInWithPassword, signUp, isSupabaseConfigured } from '../supabase.js'

export function renderAuth(container, { onSignedIn }) {
  container.innerHTML = `
    <div class="auth-center">
      <h1>Connexion</h1>
      ${!isSupabaseConfigured ? `
        <div class="banner warn">
          Supabase n'est pas encore configure (.env.local). Tu peux deja utiliser
          <b>Jouer</b>, mais la sauvegarde des parties est desactivee.
        </div>` : ''}
      <div class="card">
        <label>E-mail</label>
        <input id="email" type="email" autocomplete="email" placeholder="toi@exemple.com" />
        <label>Mot de passe</label>
        <input id="password" type="password" autocomplete="current-password" placeholder="********" />
        <div id="msg" class="muted" style="margin-top:10px"></div>
        <div class="row" style="margin-top:14px">
          <button class="btn" id="login" ${!isSupabaseConfigured ? 'disabled' : ''}>Se connecter</button>
          <button class="btn secondary" id="signup" ${!isSupabaseConfigured ? 'disabled' : ''}>Creer un compte</button>
        </div>
      </div>
    </div>`

  const $ = (id) => container.querySelector('#' + id)
  const msg = $('msg')

  const creds = () => ({ email: $('email').value.trim(), password: $('password').value })

  $('login').onclick = async () => {
    const { email, password } = creds()
    msg.textContent = 'Connexion...'
    const { error } = await signInWithPassword(email, password)
    if (error) { msg.textContent = 'Erreur : ' + error.message; return }
    onSignedIn()
  }

  $('signup').onclick = async () => {
    const { email, password } = creds()
    msg.textContent = 'Creation du compte...'
    const { error } = await signUp(email, password)
    if (error) { msg.textContent = 'Erreur : ' + error.message; return }
    msg.textContent = 'Compte cree. Verifie tes e-mails si la confirmation est activee, puis connecte-toi.'
  }
}
