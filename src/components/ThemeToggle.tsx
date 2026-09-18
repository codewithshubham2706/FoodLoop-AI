import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { getTheme, initTheme, toggleTheme, type Theme } from '../lib/theme'

/**
 * Dark-first theme toggle. The theme module applies `data-theme` on <html>
 * before React mounts (main.tsx), so there is no flash of the wrong theme.
 */
export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme())

  // Re-sync if another tab changes the theme (storage event fires cross-tab).
  useEffect(() => {
    initTheme()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'fl-theme') setThemeState(getTheme())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setThemeState(toggleTheme())}
      aria-pressed={theme === 'light'}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
    </button>
  )
}
