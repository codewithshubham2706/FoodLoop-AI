export type Theme = 'dark' | 'light'

const KEY = 'fl-theme'

function initial(): Theme {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* storage unavailable — fall through to default */
  }
  return 'dark'
}

function apply(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

/**
 * Dark-first theme. `dark` is the default even with no stored preference;
 * the user's explicit choice wins until they clear it.
 */
export function initTheme(): Theme {
  const theme = initial()
  apply(theme)
  return theme
}

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme): void {
  apply(theme)
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* storage unavailable — theme applies for this session only */
  }
}

export function toggleTheme(): Theme {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}
