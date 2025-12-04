'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTrainings } from '@/lib/api'

export default function StatsPage() {
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    try {
      setLoading(true)
      const data = await getTrainings()
      setTrainings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Beräkna statistik
  const totalTrainings = trainings.length
  
  // Räkna unika instruktörer
  const uniqueInstructors = [...new Set(trainings.map(t => t.instructor))].length
  
  // Räkna tekniker
  const uniqueTechniques = [...new Set(trainings.map(t => t.technique))].length
  
  // Topp instruktörer
  const instructorCounts = trainings.reduce((acc, training) => {
    acc[training.instructor] = (acc[training.instructor] || 0) + 1
    return acc
  }, {})
  
  const topInstructors = Object.entries(instructorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  
  // Topp tekniker
  const techniqueCounts = trainings.reduce((acc, training) => {
    acc[training.technique] = (acc[training.technique] || 0) + 1
    return acc
  }, {})
  
  const topTechniques = Object.entries(techniqueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

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
            <p className="mt-4 text-gray-600">Laddar statistik...</p>
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
              <Link href="/techniques" className="hover:text-bjj-accent transition-colors">
                Teknikbibliotek
              </Link>
              <Link href="/stats" className="hover:text-bjj-accent transition-colors font-semibold">
                Statistik
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Din Progression</h1>

        {totalTrainings === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-2">Ingen statistik än</h2>
            <p className="text-gray-600 mb-6">
              Börja logga dina träningar för att se din progression
            </p>
            <Link href="/trainings/new">
              <button className="btn-primary">
                Lägg till första träningen
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card text-center">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-4xl font-bold text-bjj-primary mb-1">
                  {totalTrainings}
                </div>
                <p className="text-gray-600">Totalt antal träningar</p>
              </div>

              <div className="card text-center">
                <div className="text-4xl mb-2">👨‍🏫</div>
                <div className="text-4xl font-bold text-bjj-primary mb-1">
                  {uniqueInstructors}
                </div>
                <p className="text-gray-600">Unika instruktörer</p>
              </div>

              <div className="card text-center">
                <div className="text-4xl mb-2">🥋</div>
                <div className="text-4xl font-bold text-bjj-primary mb-1">
                  {uniqueTechniques}
                </div>
                <p className="text-gray-600">Olika tekniker</p>
              </div>
            </div>

            {/* Top Lists */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Top Instructors */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Topp Instruktörer
                </h2>
                {topInstructors.length > 0 ? (
                  <div className="space-y-3">
                    {topInstructors.map(([instructor, count], index) => (
                      <div 
                        key={instructor} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-bjj-primary">
                            #{index + 1}
                          </span>
                          <span className="font-semibold">{instructor}</span>
                        </div>
                        <span className="bg-bjj-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {count} {count === 1 ? 'träning' : 'träningar'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Ingen data tillgänglig</p>
                )}
              </div>

              {/* Top Techniques */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Mest tränade tekniker
                </h2>
                {topTechniques.length > 0 ? (
                  <div className="space-y-3">
                    {topTechniques.map(([technique, count], index) => (
                      <div 
                        key={technique} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-bjj-accent">
                            #{index + 1}
                          </span>
                          <span className="font-semibold">{technique}</span>
                        </div>
                        <span className="bg-bjj-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {count}x
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Ingen data tillgänglig</p>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Framtida förbättringar</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Grafer och diagram för visuell representation</li>
                <li>• Progression över tid (veckovis, månadsvis)</li>
                <li>• Sparring-statistik (vinster, förluster, submissions)</li>
                <li>• Bältesprogression och milstolpar</li>
                <li>• Jämförelse med tidigare perioder</li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
