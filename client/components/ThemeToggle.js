'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  try {
    const { theme, toggleTheme } = useTheme()

    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <span className="text-2xl">🌙</span>
        ) : (
          <span className="text-2xl">☀️</span>
        )}
      </button>
    )
  } catch (error) {
    // If ThemeProvider not available, don't render
    return null
  }
}
