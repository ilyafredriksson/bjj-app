'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getTrainingById, updateTraining, deleteTraining } from '@/lib/api'

export default function TrainingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [training, setTraining] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    technique: '',
    instructor: '',
  })

  useEffect(() => {
    if (params.id) {
      fetchTraining()
    }
  }, [params.id])

  const fetchTraining = async () => {
    try {
      setLoading(true)
      const data = await getTrainingById(params.id)
      setTraining(data)
      setFormData({
        technique: data.technique,
        instructor: data.instructor,
      })
    } catch (error) {
      console.error(error)
      alert('Kunde inte ladda träning')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const updated = await updateTraining(params.id, formData)
      setTraining(updated)
      setEditing(false)
    } catch (error) {
      alert('Kunde inte uppdatera träning')
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Är du säker på att du vill ta bort denna träning?')) return
    
    try {
      await deleteTraining(params.id)
      router.push('/trainings')
    } catch (error) {
      alert('Kunde inte ta bort träning')
      console.error(error)
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Laddar träning...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!training) {
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card text-center">
            <p className="text-gray-600">Träning hittades inte</p>
            <Link href="/trainings" className="text-bjj-primary hover:text-bjj-accent mt-4 inline-block">
              Tillbaka till träningsloggen
            </Link>
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
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/trainings" className="text-bjj-primary hover:text-bjj-accent">
            ← Tillbaka till träningsloggen
          </Link>
        </div>

        <div className="card">
          {editing ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Redigera träning</h1>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label htmlFor="technique" className="label">Teknik</label>
                  <input
                    type="text"
                    id="technique"
                    name="technique"
                    value={formData.technique}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="instructor" className="label">Instruktör</label>
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Spara ändringar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)}
                    className="btn-secondary flex-1"
                  >
                    Avbryt
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Träningsdetaljer</h1>
                <span className="bg-bjj-accent text-white px-3 py-1 rounded text-sm font-semibold">
                  BJJ
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Teknik</h3>
                  <p className="text-2xl font-bold text-bjj-primary mt-1">
                    {training.technique}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Instruktör</h3>
                  <p className="text-xl text-gray-900 mt-1">{training.instructor}</p>
                </div>

                {training.createdAt && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Datum</h3>
                    <p className="text-gray-700 mt-1">
                      {new Date(training.createdAt).toLocaleDateString('sv-SE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 border-t pt-6">
                <button 
                  onClick={() => setEditing(true)}
                  className="btn-primary flex-1"
                >
                  Redigera
                </button>
                <button 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex-1"
                >
                  Ta bort
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
