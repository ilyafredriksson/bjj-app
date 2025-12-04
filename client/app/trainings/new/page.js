'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createTraining } from '@/lib/api'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'

export default function NewTrainingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  
  const preselectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0]
  
  const [formData, setFormData] = useState({
    technique: '',
    instructor: '',
    date: preselectedDate,
    duration: '',
    notes: '',
    sparringPartner: '',
    type: 'Gi',
    beltLevel: '',
    mood: 3,
    energy: 3,
    difficulty: 3,
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.technique || !formData.instructor) {
      alert('Fyll i minst teknik och instruktör')
      return
    }

    try {
      setLoading(true)
      // Ta bort tomma fält
      const dataToSend = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '')
      )
      await createTraining(dataToSend)
      toast.success('Träning skapad!')
      router.push('/trainings')
    } catch (error) {
      toast.error('Kunde inte skapa träning. Är backend-servern igång?')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/trainings" className="text-bjj-primary hover:text-bjj-accent dark:text-bjj-accent">
            ← Tillbaka till träningsloggen
          </Link>
        </div>

        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Lägg till ny träning</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grundläggande info */}
            <div className="grid md:grid-cols-2 gap-6">
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
              </div>
            </div>

            {/* Datum och duration */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="date" className="label">
                  Datum
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="duration" className="label">
                  Längd (minuter)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="60"
                  min="0"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="type" className="label">
                  Typ av träning
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Gi">Gi</option>
                  <option value="No-Gi">No-Gi</option>
                  <option value="Drilling">Drilling</option>
                  <option value="Sparring">Sparring</option>
                  <option value="Open Mat">Open Mat</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>

            {/* Sparring partner och belt level */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sparringPartner" className="label">
                  Sparring Partner
                </label>
                <input
                  type="text"
                  id="sparringPartner"
                  name="sparringPartner"
                  value={formData.sparringPartner}
                  onChange={handleChange}
                  placeholder="T.ex. Marcus, Lisa"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="beltLevel" className="label">
                  Ditt bälte
                </label>
                <select
                  id="beltLevel"
                  name="beltLevel"
                  value={formData.beltLevel}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Välj bälte</option>
                  <option value="White">Vitt</option>
                  <option value="Blue">Blått</option>
                  <option value="Purple">Lila</option>
                  <option value="Brown">Brunt</option>
                  <option value="Black">Svart</option>
                </select>
              </div>
            </div>

            {/* Ratings */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="mood" className="label">
                  Humör: {formData.mood}/5
                </label>
                <input
                  type="range"
                  id="mood"
                  name="mood"
                  min="1"
                  max="5"
                  value={formData.mood}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>😞</span>
                  <span>😐</span>
                  <span>🙂</span>
                  <span>😊</span>
                  <span>😄</span>
                </div>
              </div>

              <div>
                <label htmlFor="energy" className="label">
                  Energi: {formData.energy}/5
                </label>
                <input
                  type="range"
                  id="energy"
                  name="energy"
                  min="1"
                  max="5"
                  value={formData.energy}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>🔋</span>
                  <span>⚡</span>
                  <span>⚡⚡</span>
                  <span>⚡⚡⚡</span>
                  <span>⚡⚡⚡⚡</span>
                </div>
              </div>

              <div>
                <label htmlFor="difficulty" className="label">
                  Svårighet: {formData.difficulty}/5
                </label>
                <input
                  type="range"
                  id="difficulty"
                  name="difficulty"
                  min="1"
                  max="5"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Lätt</span>
                  <span>Medel</span>
                  <span>Svår</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="label">
                Anteckningar
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Vad lärde du dig? Hur gick det? Tips och tankar..."
                rows="4"
                maxLength="1000"
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.notes.length}/1000 tecken
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
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Fyll i så mycket du vill - endast teknik och instruktör är obligatoriskt</li>
            <li>• Anteckningar hjälper dig komma ihåg vad du lärde dig</li>
            <li>• Använd ratings för att följa din utveckling över tid</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
