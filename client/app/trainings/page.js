'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTrainings, deleteTraining } from '@/lib/api'

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Hämta träningar när komponenten laddas
  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    try {
      setLoading(true)
      const data = await getTrainings()
      setTrainings(data)
      setError(null)
    } catch (err) {
      setError('Kunde inte ladda träningar. Är backend-servern igång?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Är du säker på att du vill ta bort denna träning?')) return
    
    try {
      await deleteTraining(id)
      // Ta bort från listan lokalt
      setTrainings(trainings.filter(t => t._id !== id))
    } catch (err) {
      alert('Kunde inte ta bort träning')
      console.error(err)
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
            <p className="mt-4 text-gray-600">Laddar träningar...</p>
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
              <Link href="/trainings" className="hover:text-bjj-accent transition-colors font-semibold">
                Träningslogg
              </Link>
              <Link href="/techniques" className="hover:text-bjj-accent transition-colors">
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Träningslogg</h1>
          <Link href="/trainings/new">
            <button className="btn-primary">
              + Ny träning
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {trainings.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2">Inga träningar än</h2>
            <p className="text-gray-600 mb-6">
              Börja dokumentera dina träningar genom att lägga till din första session
            </p>
            <Link href="/trainings/new">
              <button className="btn-primary">
                Lägg till första träningen
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainings.map((training) => (
              <div key={training._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-bjj-primary">
                    {training.technique}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded text-white ${
                    training.type === 'Gi' ? 'bg-blue-600' :
                    training.type === 'No-Gi' ? 'bg-purple-600' :
                    training.type === 'Sparring' ? 'bg-red-600' :
                    'bg-bjj-accent'
                  }`}>
                    {training.type || 'BJJ'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Instruktör:</span> {training.instructor}
                  </p>
                  {training.duration && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Längd:</span> {training.duration} min
                    </p>
                  )}
                  {training.sparringPartner && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Partner:</span> {training.sparringPartner}
                    </p>
                  )}
                  {training.date && (
                    <p className="text-xs text-gray-500">
                      📅 {new Date(training.date).toLocaleDateString('sv-SE')}
                    </p>
                  )}
                  
                  {/* Ratings */}
                  {(training.mood || training.energy || training.difficulty) && (
                    <div className="flex gap-3 pt-2">
                      {training.mood && (
                        <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                          😊 {training.mood}/5
                        </span>
                      )}
                      {training.energy && (
                        <span className="text-xs bg-green-100 px-2 py-1 rounded">
                          ⚡ {training.energy}/5
                        </span>
                      )}
                      {training.difficulty && (
                        <span className="text-xs bg-orange-100 px-2 py-1 rounded">
                          🎯 {training.difficulty}/5
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/trainings/${training._id}`} className="flex-1">
                    <button className="btn-secondary w-full text-sm">
                      Se detaljer
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(training._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
