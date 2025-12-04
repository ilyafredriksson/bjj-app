'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createTraining } from '@/lib/api'

export default function NewTrainingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    technique: '',
    instructor: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.technique || !formData.instructor) {
      alert('Fyll i alla fält')
      return
    }

    try {
      setLoading(true)
      await createTraining(formData)
      router.push('/trainings')
    } catch (error) {
      alert('Kunde inte skapa träning. Är backend-servern igång?')
      console.error(error)
    } finally {
      setLoading(false)
    }
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
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/trainings" className="text-bjj-primary hover:text-bjj-accent">
            ← Tillbaka till träningsloggen
          </Link>
        </div>

        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Lägg till ny träning</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="technique" className="label">
                Teknik *
              </label>
              <input
                type="text"
                id="technique"
                name="technique"
                value={formData.technique}
                onChange={handleChange}
                placeholder="T.ex. Armbar från guard"
                className="input-field"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Vilken teknik eller övning tränade du?
              </p>
            </div>

            <div>
              <label htmlFor="instructor" className="label">
                Instruktör *
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="T.ex. John Danaher"
                className="input-field"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Vem ledde träningen?
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sparar...' : 'Spara träning'}
              </button>
              <Link href="/trainings" className="flex-1">
                <button type="button" className="btn-secondary w-full">
                  Avbryt
                </button>
              </Link>
            </div>
          </form>
        </div>

        {/* Tips Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
          <p className="text-sm text-blue-800">
            Dokumentera dina träningar regelbundet för att kunna följa din utveckling över tid. 
            Detta är bara en grundläggande version - vi kan lägga till fler fält som datum, 
            anteckningar, sparring partners och mycket mer!
          </p>
        </div>
      </main>
    </div>
  )
}
