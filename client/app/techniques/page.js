'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTechniques } from '@/lib/api'

const categories = ['Alla', 'Submissions', 'Sweeps', 'Passes', 'Escapes', 'Takedowns', 'Positions', 'Defenses']
const difficulties = ['Alla', 'Nybörjare', 'Mellan', 'Avancerad']

export default function TechniquesPage() {
  const [techniques, setTechniques] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Alla')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Alla')
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    fetchTechniques()
    // Ladda favoriter från localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteTechniques') || '[]')
    setFavorites(savedFavorites)
  }, [])

  const fetchTechniques = async () => {
    try {
      setLoading(true)
      const data = await getTechniques()
      setTechniques(data)
    } catch (error) {
      console.error('Kunde inte ladda tekniker:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id]
    
    setFavorites(newFavorites)
    localStorage.setItem('favoriteTechniques', JSON.stringify(newFavorites))
  }

  // Filtrera tekniker baserat på sök och filter
  const filteredTechniques = techniques.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Alla' || tech.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'Alla' || tech.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const difficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Nybörjare': return 'bg-green-100 text-green-800'
      case 'Mellan': return 'bg-yellow-100 text-yellow-800'
      case 'Avancerad': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-bjj-primary text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <Link href="/" className="flex items-center text-2xl font-bold">
                🥋 BJJ Träningsapp
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Laddar tekniker...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-bjj-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center text-2xl font-bold">
              🥋 BJJ Träningsapp
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-bjj-accent transition-colors">
                Hem
              </Link>
              <Link href="/trainings" className="hover:text-bjj-accent transition-colors">
                Träningslogg
              </Link>
              <Link href="/techniques" className="hover:text-bjj-accent transition-colors font-semibold">
                Teknikbibliotek
              </Link>
              <Link href="/stats" className="hover:text-bjj-accent transition-colors">
                Statistik
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teknikbibliotek</h1>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="label">Sök teknik</label>
              <input
                type="text"
                id="search"
                placeholder="Sök efter namn eller beskrivning..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="category" className="label">Kategori</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="label">Svårighetsgrad</label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input-field"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-4">
          Visar {filteredTechniques.length} {filteredTechniques.length === 1 ? 'teknik' : 'tekniker'}
        </p>

        {/* Techniques Grid */}
        {filteredTechniques.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">Inga tekniker hittades</h2>
            <p className="text-gray-600 mb-4">
              Prova att ändra dina sökfilter
            </p>
            {techniques.length === 0 && (
              <p className="text-sm text-gray-500">
                Kör <code className="bg-gray-200 px-2 py-1 rounded">npm run seed</code> i backend för att lägga till exempel-tekniker
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTechniques.map((technique) => (
              <div key={technique._id} className="card relative">
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(technique._id)}
                  className="absolute top-4 right-4 text-2xl hover:scale-110 transition-transform"
                >
                  {favorites.includes(technique._id) ? '⭐' : '☆'}
                </button>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-bjj-primary mb-2">
                    {technique.name}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-bjj-primary text-white px-2 py-1 rounded">
                      {technique.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${difficultyColor(technique.difficulty)}`}>
                      {technique.difficulty}
                    </span>
                    {technique.beltLevel && technique.beltLevel !== 'All' && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {technique.beltLevel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Position:</span> {technique.position}
                  </p>
                  <p className="text-sm text-gray-700">
                    {technique.description}
                  </p>
                  {technique.tags && technique.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {technique.tags.map(tag => (
                        <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button className="btn-secondary w-full text-sm">
                  Se mer
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Information</h3>
          <p className="text-sm text-blue-800 mb-2">
            Teknikerna hämtas nu från databasen! Du kan:
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Lägga till fler tekniker via backend API</li>
            <li>• Ladda upp videor och bilder (kommande funktion)</li>
            <li>• Skapa detaljerade steg-för-steg guider</li>
            <li>• Dela tekniker med andra användare</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
