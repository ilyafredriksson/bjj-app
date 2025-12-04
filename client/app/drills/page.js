'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'

export default function DrillBuilderPage() {
  const router = useRouter()
  const [drills, setDrills] = useState([])
  const [activeTab, setActiveTab] = useState('library')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeDrill, setActiveDrill] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [newDrill, setNewDrill] = useState({
    name: '',
    description: '',
    category: 'positional',
    difficulty: 'beginner',
    rounds: 3,
    steps: []
  })
  const [newStep, setNewStep] = useState({
    name: '',
    duration: 60,
    instruction: ''
  })

  const audioRef = useRef(null)

  const mockDrills = [
    {
      id: 1,
      name: 'Guard Retention Flow',
      description: 'Kontinuerlig guard retention med olika passes',
      category: 'positional',
      difficulty: 'intermediate',
      rounds: 5,
      totalTime: 300,
      steps: [
        { name: 'Closed Guard Hold', duration: 60, instruction: 'Håll closed guard, motståndare försöker bryta' },
        { name: 'Open Guard Transition', duration: 60, instruction: 'Övergång till open guard när broken' },
        { name: 'Guard Recovery', duration: 60, instruction: 'Motståndare försöker passa, du recoverar' },
        { name: 'Sweep Attempt', duration: 60, instruction: 'Försök sweeps från olika guards' },
        { name: 'Free Flow', duration: 60, instruction: 'Fri guard retention träning' }
      ]
    },
    {
      id: 2,
      name: 'Submission Chain Drill',
      description: 'Flöde mellan olika submissions från mount',
      category: 'submission',
      difficulty: 'advanced',
      rounds: 4,
      totalTime: 240,
      steps: [
        { name: 'Mount Control', duration: 30, instruction: 'Etablera stabil mount position' },
        { name: 'Armbar Setup', duration: 30, instruction: 'Sätt upp armbar, släpp innan finish' },
        { name: 'Triangle Transition', duration: 30, instruction: 'Övergång till triangle från armbar' },
        { name: 'Americana Flow', duration: 30, instruction: 'Flow till americana från mount' },
        { name: 'Ezekiel Attempt', duration: 30, instruction: 'Försök ezekiel choke' },
        { name: 'Free Chain', duration: 60, instruction: 'Fri kedja mellan alla submissions' }
      ]
    },
    {
      id: 3,
      name: 'Takedown to Guard Pass',
      description: 'Komplett sekvens från standing till pass',
      category: 'takedown',
      difficulty: 'intermediate',
      rounds: 6,
      totalTime: 360,
      steps: [
        { name: 'Grip Fighting', duration: 30, instruction: 'Få dominant grip standing' },
        { name: 'Takedown', duration: 30, instruction: 'Genomför takedown' },
        { name: 'Establish Top', duration: 30, instruction: 'Stabilisera top position' },
        { name: 'Guard Pass', duration: 60, instruction: 'Passa garden' },
        { name: 'Side Control Hold', duration: 30, instruction: 'Håll side control 10 sek' }
      ]
    },
    {
      id: 4,
      name: 'Escape Sequence Drill',
      description: 'Systematisk träning av escapes från dåliga positioner',
      category: 'escape',
      difficulty: 'beginner',
      rounds: 4,
      totalTime: 240,
      steps: [
        { name: 'Mount Escape', duration: 60, instruction: 'Escape från mount till guard' },
        { name: 'Side Control Escape', duration: 60, instruction: 'Shrimp och recover guard' },
        { name: 'Back Escape', duration: 60, instruction: 'Escape från back control' },
        { name: 'Turtle Recovery', duration: 60, instruction: 'Från turtle till guard' }
      ]
    },
    {
      id: 5,
      name: 'Cardio Flow Drill',
      description: 'Högtempo bewegelses-drill för kondition',
      category: 'movement',
      difficulty: 'beginner',
      rounds: 8,
      totalTime: 480,
      steps: [
        { name: 'Shrimping', duration: 30, instruction: 'Kontinuerlig shrimping fram och tillbaka' },
        { name: 'Forward Roll', duration: 30, instruction: 'Forward rolls snabbt' },
        { name: 'Backward Roll', duration: 30, instruction: 'Backward rolls' },
        { name: 'Technical Standup', duration: 30, instruction: 'Technical standup x10' },
        { name: 'Hip Escape', duration: 30, instruction: 'Hip escapes åt båda hållen' },
        { name: 'Rest', duration: 30, instruction: 'Andas och återhämta' }
      ]
    }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('bjj-drills')
    if (saved) {
      setDrills(JSON.parse(saved))
    } else {
      setDrills(mockDrills)
      localStorage.setItem('bjj-drills', JSON.stringify(mockDrills))
    }
  }, [])

  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Step completed, move to next
            if (currentStep < activeDrill.steps.length - 1) {
              playBeep()
              setCurrentStep(prev => prev + 1)
              return activeDrill.steps[currentStep + 1].duration
            } else {
              // Drill completed
              playBeep()
              setIsRunning(false)
              toast.success('Drill klar! 🎉')
              return 0
            }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, currentStep, activeDrill])

  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  const handleStartDrill = (drill) => {
    setActiveDrill(drill)
    setCurrentStep(0)
    setTimeLeft(drill.steps[0].duration)
    setIsRunning(true)
    setActiveTab('timer')
    toast.success('Drill startad!')
  }

  const handlePauseResume = () => {
    setIsRunning(!isRunning)
    toast(isRunning ? 'Pausad' : 'Återupptagen')
  }

  const handleSkipStep = () => {
    if (currentStep < activeDrill.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setTimeLeft(activeDrill.steps[currentStep + 1].duration)
      toast.success('Nästa steg!')
    }
  }

  const handleResetDrill = () => {
    setCurrentStep(0)
    setTimeLeft(activeDrill.steps[0].duration)
    setIsRunning(false)
    toast.success('Drill återställd')
  }

  const handleAddStep = () => {
    if (!newStep.name) {
      toast.error('Steg-namn krävs')
      return
    }

    setNewDrill({
      ...newDrill,
      steps: [...newDrill.steps, { ...newStep }]
    })

    setNewStep({
      name: '',
      duration: 60,
      instruction: ''
    })

    toast.success('Steg tillagt!')
  }

  const handleRemoveStep = (index) => {
    setNewDrill({
      ...newDrill,
      steps: newDrill.steps.filter((_, i) => i !== index)
    })
  }

  const handleCreateDrill = () => {
    if (!newDrill.name || newDrill.steps.length === 0) {
      toast.error('Namn och minst ett steg krävs')
      return
    }

    const totalTime = newDrill.steps.reduce((sum, step) => sum + step.duration, 0) * newDrill.rounds

    const drill = {
      id: Date.now(),
      ...newDrill,
      totalTime
    }

    const updated = [...drills, drill]
    setDrills(updated)
    localStorage.setItem('bjj-drills', JSON.stringify(updated))

    setNewDrill({
      name: '',
      description: '',
      category: 'positional',
      difficulty: 'beginner',
      rounds: 3,
      steps: []
    })
    setShowCreateModal(false)
    toast.success('Drill skapad!')
  }

  const handleDeleteDrill = (id) => {
    if (confirm('Ta bort denna drill?')) {
      const updated = drills.filter(d => d.id !== id)
      setDrills(updated)
      localStorage.setItem('bjj-drills', JSON.stringify(updated))
      toast.success('Drill borttagen')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'beginner') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    if (difficulty === 'intermediate') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      positional: '🎯',
      submission: '🔒',
      takedown: '🤸',
      escape: '🏃',
      movement: '🔄',
      cardio: '💪'
    }
    return icons[category] || '🥋'
  }

  const progressPercentage = activeDrill 
    ? ((currentStep / activeDrill.steps.length) * 100).toFixed(0)
    : 0

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hidden audio element for beep */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryy3gsBSV4yPDej0ELElyx6OytWRQKSKDi8r1rIgU=" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Drill Builder</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Skapa och kör anpassade träningsdrills med timer
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            + Skapa Drill
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'library'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            📚 Drill Library
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'timer'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            disabled={!activeDrill}
          >
            ⏱️ Timer
          </button>
        </div>

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="grid md:grid-cols-2 gap-6">
            {drills.map(drill => (
              <div key={drill.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getCategoryIcon(drill.category)}</span>
                      <h3 className="text-xl font-bold">{drill.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {drill.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDrill(drill.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    🗑️
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(drill.difficulty)}`}>
                    {drill.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-xs font-semibold">
                    {drill.steps.length} steg
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded text-xs font-semibold">
                    {drill.rounds} rounds
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                    ⏱️ {formatTime(drill.totalTime)}
                  </span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">
                  <h4 className="font-semibold text-sm mb-2">Steg:</h4>
                  <ol className="space-y-1">
                    {drill.steps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                        {index + 1}. {step.name} <span className="text-gray-500">({formatTime(step.duration)})</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <button
                  onClick={() => handleStartDrill(drill)}
                  className="w-full btn-primary"
                >
                  ▶️ Starta Drill
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Timer Tab */}
        {activeTab === 'timer' && activeDrill && (
          <div className="max-w-4xl mx-auto">
            <div className="card mb-6">
              <h2 className="text-2xl font-bold mb-4 text-center">{activeDrill.name}</h2>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Steg {currentStep + 1} av {activeDrill.steps.length}</span>
                  <span>{progressPercentage}% klart</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-bjj-primary to-bjj-accent h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Current Step */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold mb-4 text-bjj-primary">
                  {formatTime(timeLeft)}
                </div>
                <h3 className="text-3xl font-bold mb-3">
                  {activeDrill.steps[currentStep].name}
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {activeDrill.steps[currentStep].instruction}
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePauseResume}
                  className="px-8 py-4 bg-bjj-primary text-white rounded-lg hover:bg-bjj-primary/90 transition-colors font-bold text-lg"
                >
                  {isRunning ? '⏸️ Pausa' : '▶️ Fortsätt'}
                </button>
                <button
                  onClick={handleSkipStep}
                  className="px-8 py-4 bg-bjj-accent text-white rounded-lg hover:bg-bjj-accent/90 transition-colors font-bold text-lg"
                  disabled={currentStep >= activeDrill.steps.length - 1}
                >
                  ⏭️ Nästa
                </button>
                <button
                  onClick={handleResetDrill}
                  className="px-8 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold text-lg"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* All Steps Overview */}
            <div className="card">
              <h4 className="font-bold mb-4">Alla Steg</h4>
              <div className="space-y-2">
                {activeDrill.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg transition-colors ${
                      index === currentStep
                        ? 'bg-bjj-primary text-white'
                        : index < currentStep
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {index === currentStep ? '▶️' : index < currentStep ? '✅' : '⏹️'} {step.name}
                      </span>
                      <span className="text-sm">{formatTime(step.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timer' && !activeDrill && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold mb-2">Ingen aktiv drill</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Välj en drill från biblioteket för att starta
            </p>
            <button onClick={() => setActiveTab('library')} className="btn-primary">
              Till Drill Library
            </button>
          </div>
        )}
      </main>

      {/* Create Drill Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Skapa Ny Drill</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Drill-namn *</label>
                  <input
                    type="text"
                    value={newDrill.name}
                    onChange={(e) => setNewDrill({...newDrill, name: e.target.value})}
                    placeholder="t.ex. Guard Retention Flow"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Antal Rounds</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newDrill.rounds}
                    onChange={(e) => setNewDrill({...newDrill, rounds: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Beskrivning</label>
                <textarea
                  value={newDrill.description}
                  onChange={(e) => setNewDrill({...newDrill, description: e.target.value})}
                  placeholder="Beskriv drillens syfte och mål..."
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Kategori</label>
                  <select
                    value={newDrill.category}
                    onChange={(e) => setNewDrill({...newDrill, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="positional">Positional</option>
                    <option value="submission">Submission</option>
                    <option value="takedown">Takedown</option>
                    <option value="escape">Escape</option>
                    <option value="movement">Movement</option>
                    <option value="cardio">Cardio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Svårighetsgrad</label>
                  <select
                    value={newDrill.difficulty}
                    onChange={(e) => setNewDrill({...newDrill, difficulty: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Add Steps */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">Lägg till Steg</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Steg-namn</label>
                    <input
                      type="text"
                      value={newStep.name}
                      onChange={(e) => setNewStep({...newStep, name: e.target.value})}
                      placeholder="t.ex. Closed Guard Hold"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Duration (sek)</label>
                    <input
                      type="number"
                      min="10"
                      step="10"
                      value={newStep.duration}
                      onChange={(e) => setNewStep({...newStep, duration: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Instruktion</label>
                  <textarea
                    value={newStep.instruction}
                    onChange={(e) => setNewStep({...newStep, instruction: e.target.value})}
                    placeholder="Detaljerad instruktion för detta steg..."
                    rows="2"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <button
                  onClick={handleAddStep}
                  className="btn-secondary w-full"
                >
                  + Lägg till Steg
                </button>
              </div>

              {/* Steps List */}
              {newDrill.steps.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-4">Steg ({newDrill.steps.length})</h3>
                  <div className="space-y-2">
                    {newDrill.steps.map((step, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold">{index + 1}. {step.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTime(step.duration)} - {step.instruction}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveStep(index)}
                          className="text-red-500 hover:text-red-700 ml-4"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm font-semibold">
                      Total tid per round: {formatTime(newDrill.steps.reduce((sum, s) => sum + s.duration, 0))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total tid för alla {newDrill.rounds} rounds: {formatTime(newDrill.steps.reduce((sum, s) => sum + s.duration, 0) * newDrill.rounds)}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleCreateDrill}
                  className="flex-1 btn-primary"
                  disabled={!newDrill.name || newDrill.steps.length === 0}
                >
                  Skapa Drill
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
