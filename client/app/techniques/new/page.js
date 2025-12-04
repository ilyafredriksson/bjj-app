'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createTechnique } from '@/lib/api'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'

export default function NewTechniquePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    position: '',
    difficulty: '',
    beltLevel: '',
    description: '',
    steps: [''],
    tags: '',
    videoUrl: '',
    imageUrl: ''
  })

  const categories = [
    'Submissions',
    'Sweeps',
    'Passes',
    'Escapes',
    'Takedowns',
    'Positions',
    'Defenses'
  ]

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  const beltLevels = ['White', 'Blue', 'Purple', 'Brown', 'Black']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps]
    newSteps[index] = value
    setFormData(prev => ({ ...prev, steps: newSteps }))
  }

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }))
  }

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, steps: newSteps }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category) {
      toast.error('Namn och kategori krävs')
      return
    }

    try {
      const techniqueData = {
        ...formData,
        steps: formData.steps.filter(step => step.trim() !== ''),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      }

      await createTechnique(techniqueData)
      toast.success('Teknik skapad!')
      router.push('/techniques')
    } catch (error) {
      console.error('Error creating technique:', error)
      toast.error('Kunde inte skapa teknik')
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Lägg till ny teknik</h1>
          <Link href="/techniques">
            <button className="btn-secondary">
              ← Tillbaka
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Name */}
          <div>
            <label className="label">
              Tekniknamn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="t.ex. Armbar from Guard"
              required
            />
          </div>

          {/* Category & Position */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Välj kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="input-field"
                placeholder="t.ex. Closed Guard"
              />
            </div>
          </div>

          {/* Difficulty & Belt Level */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Svårighetsgrad</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Välj svårighetsgrad</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Bälte</label>
              <select
                name="beltLevel"
                value={formData.beltLevel}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Välj bälte</option>
                {beltLevels.map(belt => (
                  <option key={belt} value={belt}>{belt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Beskrivning</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="4"
              placeholder="Förklara tekniken..."
            />
          </div>

          {/* Steps */}
          <div>
            <label className="label">Steg-för-steg instruktioner</label>
            <div className="space-y-3">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-bjj-primary text-white font-bold rounded">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder={`Steg ${index + 1}`}
                  />
                  {formData.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="btn-secondary px-3"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="btn-secondary w-full"
              >
                + Lägg till steg
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="label">Taggar</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input-field"
              placeholder="guard, submission, fundamental (separera med komma)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separera taggar med komma
            </p>
          </div>

          {/* URLs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Video URL</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label className="label">Bild URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Spara teknik
            </button>
            <Link href="/techniques" className="flex-1">
              <button type="button" className="btn-secondary w-full">
                Avbryt
              </button>
            </Link>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Var specifik med tekniknamnet för bättre sökbarhet</li>
            <li>• Lägg till steg-för-steg instruktioner för att komma ihåg detaljer</li>
            <li>• Använd taggar för att gruppera relaterade tekniker</li>
            <li>• Video-länkar från YouTube eller Vimeo fungerar bra</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
