// Themes d'echiquier : couleurs des cases, applicables a tous les plateaux.
export const BOARD_THEMES = [
  { id: 'bois',      label: 'Bois',         light: '#f0d9b5', dark: '#b58863' },
  { id: 'nb',        label: 'Noir & blanc', light: '#e8e8e8', dark: '#5b5b5b' },
  { id: 'bleurose',  label: 'Bleu / rose',  light: '#ffd6ea', dark: '#5b8fd1' },
  { id: 'vert',      label: 'Vert',         light: '#eeeed2', dark: '#6f9d54' },
  { id: 'glace',     label: 'Glacier',      light: '#dfe7ec', dark: '#86a4b5' },
  { id: 'violet',    label: 'Violet',       light: '#e7ddf6', dark: '#8a6bbf' },
  { id: 'corail',    label: 'Corail',       light: '#ffe6d8', dark: '#e07a5f' },
  { id: 'nuit',      label: 'Nuit',         light: '#9aa7b8', dark: '#41506b' }
]

// Genere un echiquier 8x8 en data-URI SVG depuis deux couleurs.
export function boardImage(light, dark) {
  let rects = ''
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isDark = (r + c) % 2 === 1
      rects += `<rect x='${c}' y='${r}' width='1' height='1' fill='${isDark ? dark : light}'/>`
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' shape-rendering='crispEdges'>${rects}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export function getTheme(id) {
  return BOARD_THEMES.find((t) => t.id === id) || BOARD_THEMES[0]
}

export function currentBoardTheme() {
  return localStorage.getItem('boardTheme') || 'bois'
}

// Applique un theme globalement via des variables CSS sur :root.
export function applyBoardTheme(id) {
  const t = getTheme(id)
  const root = document.documentElement.style
  root.setProperty('--board-light', t.light)
  root.setProperty('--board-dark', t.dark)
  root.setProperty('--board-image', boardImage(t.light, t.dark))
  localStorage.setItem('boardTheme', t.id)
  return t
}
