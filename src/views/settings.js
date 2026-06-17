import { BOARD_THEMES, boardImage, currentBoardTheme, applyBoardTheme } from '../ui/themes.js'

export function renderSettings(container) {
  const draw = () => {
    const active = currentBoardTheme()
    container.innerHTML = `
      <h1>Reglages</h1>
      <div class="card">
        <h2>Echiquier</h2>
        <p class="muted">Choisis le style de plateau. Il s'applique partout (jeu, etudes, mini-jeux).</p>
        <div class="theme-grid">
          ${BOARD_THEMES.map((t) => `
            <button class="theme-swatch ${t.id === active ? 'active' : ''}" data-id="${t.id}">
              <span class="swatch-board" style="background-image:${boardImage(t.light, t.dark)}"></span>
              <span class="swatch-label">${t.label}</span>
            </button>`).join('')}
        </div>
      </div>`

    container.querySelectorAll('.theme-swatch').forEach((el) => {
      el.onclick = () => { applyBoardTheme(el.dataset.id); draw() }
    })
  }
  draw()
}
