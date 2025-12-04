'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path) => pathname === path

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
    const isDark = document.documentElement.classList.contains('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  return (
    <nav className="bg-bjj-primary text-white shadow-lg dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex items-center text-2xl font-bold hover:text-bjj-accent transition-colors">
            🥋 BJJ Träningsapp
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Hem
            </Link>
            <Link 
              href="/trainings" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/trainings') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Träningslogg
            </Link>
            <Link 
              href="/techniques" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/techniques') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Teknikbibliotek
            </Link>
            <Link 
              href="/stats" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/stats') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Statistik
            </Link>
            <Link 
              href="/calendar" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/calendar') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Kalender
            </Link>
            <Link 
              href="/progression" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/progression') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Progression
            </Link>
            <Link 
              href="/sparring" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/sparring') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Sparring Stats
            </Link>
            <Link 
              href="/videos" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/videos') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Videos
            </Link>
            <Link 
              href="/social" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/social') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Community
            </Link>
            <Link 
              href="/ai-analyzer" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/ai-analyzer') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              AI Analyzer
            </Link>
            <Link 
              href="/injury-tracking" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/injury-tracking') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Injury Tracking
            </Link>
            <Link 
              href="/competition" 
              className={`hover:text-bjj-accent transition-colors ${isActive('/competition') ? 'font-semibold text-bjj-accent' : ''}`}
            >
              Competition
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              <span className="text-2xl">🌙</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
