'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'
import { format, differenceInDays } from 'date-fns'
import { sv } from 'date-fns/locale'

export default function InjuryTrackingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('injuries')
  const [injuries, setInjuries] = useState([])
  const [recoveryPlan, setRecoveryPlan] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newInjury, setNewInjury] = useState({
    type: 'finger',
    severity: 'mild',
    date: new Date().toISOString().split('T')[0],
    description: '',
    treatment: ''
  })

  const injuryTypes = [
    { value: 'finger', label: '🤚 Finger', icon: '🤚' },
    { value: 'knee', label: '🦵 Knä', icon: '🦵' },
    { value: 'shoulder', label: '💪 Axel', icon: '💪' },
    { value: 'neck', label: '🧑 Nacke', icon: '🧑' },
    { value: 'back', label: '🔙 Rygg', icon: '🔙' },
    { value: 'elbow', label: '💪 Armbåge', icon: '💪' },
    { value: 'ribs', label: '🫁 Revben', icon: '🫁' },
    { value: 'ankle', label: '🦶 Fotled', icon: '🦶' },
    { value: 'other', label: '🩹 Övrigt', icon: '🩹' }
  ]

  const severityLevels = [
    { value: 'mild', label: 'Mild', color: 'green' },
    { value: 'moderate', label: 'Måttlig', color: 'yellow' },
    { value: 'severe', label: 'Allvarlig', color: 'red' }
  ]

  const mockInjuries = [
    {
      id: 1,
      type: 'finger',
      severity: 'mild',
      date: '2024-11-28',
      description: 'Stukat lillfinger under sparring',
      treatment: 'Tape, vila 3 dagar',
      status: 'recovering',
      recoveryDays: 7
    },
    {
      id: 2,
      type: 'knee',
      severity: 'moderate',
      date: '2024-11-15',
      description: 'Vrickat knä under guard pass',
      treatment: 'Fysioterapi, lätt träning',
      status: 'recovered',
      recoveryDays: 14
    },
    {
      id: 3,
      type: 'shoulder',
      severity: 'mild',
      date: '2024-12-01',
      description: 'Öm axel efter heavy sparring',
      treatment: 'Is, stretching',
      status: 'recovering',
      recoveryDays: 5
    }
  ]

  const preventionTips = [
    {
      category: 'Uppvärmning',
      icon: '🔥',
      tips: [
        'Alltid 10-15 min uppvärmning innan träning',
        'Fokusera på rörlighet i leder',
        'Dynamisk stretching, inte statisk',
        'Inkludera sport-specifika rörelser'
      ]
    },
    {
      category: 'Teknik',
      icon: '🥋',
      tips: [
        'Tappa inte ego - tappa istället',
        'Lär dig att tappa tidigt vid lås',
        'Kontrollera intensiteten',
        'Kommunicera med din partner'
      ]
    },
    {
      category: 'Vila',
      icon: '😴',
      tips: [
        'Minst 1-2 vilodagar per vecka',
        '7-9 timmars sömn per natt',
        'Lyssna på din kropp',
        'Träna inte vid sjukdom'
      ]
    },
    {
      category: 'Återhämtning',
      icon: '💆',
      tips: [
        'Stretching efter varje träning',
        'Foam rolling för muskelåterhämtning',
        'Kalla bad/dusch efter intensiv träning',
        'Massage 1-2 gånger per månad'
      ]
    },
    {
      category: 'Nutrition',
      icon: '🥗',
      tips: [
        'Tillräckligt med protein (1.6-2g per kg)',
        'Håll dig hydrerad under träning',
        'Anti-inflammatorisk kost',
        'Omega-3 för ledvård'
      ]
    },
    {
      category: 'Styrketräning',
      icon: '💪',
      tips: [
        'Komplettera BJJ med styrketräning',
        'Fokusera på starka leder',
        'Core-stabilitet är kritisk',
        'Balanserad träning av hela kroppen'
      ]
    }
  ]

  const stretchingExercises = [
    {
      name: 'Neck Rolls',
      target: 'Nacke',
      duration: '2 min',
      description: 'Rulla huvudet långsamt i cirkel båda hållen'
    },
    {
      name: 'Shoulder Circles',
      target: 'Axlar',
      duration: '2 min',
      description: 'Stora cirklar fram och bak med axlarna'
    },
    {
      name: 'Hip Openers',
      target: 'Höfter',
      duration: '3 min',
      description: 'Butterfly stretch och hip circles'
    },
    {
      name: 'Spinal Twists',
      target: 'Rygg',
      duration: '2 min',
      description: 'Ligg på rygg och rotera knäna åt sidan'
    },
    {
      name: 'Wrist Stretches',
      target: 'Handleder',
      duration: '2 min',
      description: 'Böj handleden i alla riktningar'
    },
    {
      name: 'Groin Stretch',
      target: 'Ljumskar',
      duration: '3 min',
      description: 'Butterfly och deep lunges'
    }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('bjj-injuries')
    if (saved) {
      setInjuries(JSON.parse(saved))
    } else {
      setInjuries(mockInjuries)
      localStorage.setItem('bjj-injuries', JSON.stringify(mockInjuries))
    }
  }, [])

  const handleAddInjury = () => {
    if (!newInjury.description) {
      toast.error('Beskrivning krävs')
      return
    }

    const injury = {
      id: Date.now(),
      ...newInjury,
      status: 'recovering',
      recoveryDays: newInjury.severity === 'mild' ? 7 : newInjury.severity === 'moderate' ? 14 : 21
    }

    const updated = [...injuries, injury]
    setInjuries(updated)
    localStorage.setItem('bjj-injuries', JSON.stringify(updated))

    setNewInjury({
      type: 'finger',
      severity: 'mild',
      date: new Date().toISOString().split('T')[0],
      description: '',
      treatment: ''
    })
    setShowAddModal(false)
    toast.success('Skada loggad')
  }

  const handleMarkRecovered = (id) => {
    const updated = injuries.map(inj =>
      inj.id === id ? { ...inj, status: 'recovered' } : inj
    )
    setInjuries(updated)
    localStorage.setItem('bjj-injuries', JSON.stringify(updated))
    toast.success('Markerad som återhämtad! 🎉')
  }

  const handleDeleteInjury = (id) => {
    if (confirm('Ta bort denna skada från loggen?')) {
      const updated = injuries.filter(inj => inj.id !== id)
      setInjuries(updated)
      localStorage.setItem('bjj-injuries', JSON.stringify(updated))
      toast.success('Skada borttagen')
    }
  }

  const getStatusColor = (status) => {
    if (status === 'recovered') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  }

  const getSeverityColor = (severity) => {
    if (severity === 'mild') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    if (severity === 'moderate') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }

  const getInjuryIcon = (type) => {
    return injuryTypes.find(t => t.value === type)?.icon || '🩹'
  }

  const activeInjuries = injuries.filter(i => i.status === 'recovering')
  const recoveredInjuries = injuries.filter(i => i.status === 'recovered')

  const daysSinceLastInjury = injuries.length > 0
    ? differenceInDays(new Date(), new Date(injuries[injuries.length - 1].date))
    : 0

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Injury Prevention & Recovery</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Spåra skador och förebygg framtida problem
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Logga Skada
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-2">🏥</div>
            <div className="text-3xl font-bold text-bjj-primary mb-1">
              {activeInjuries.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Aktiva skador
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {recoveredInjuries.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Återhämtade
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-3xl font-bold text-bjj-accent mb-1">
              {daysSinceLastInjury}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Dagar sedan senaste skada
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {injuries.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Totalt loggade
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('injuries')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'injuries'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🏥 Skadelogg
          </button>
          <button
            onClick={() => setActiveTab('prevention')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'prevention'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🛡️ Förebyggande
          </button>
          <button
            onClick={() => setActiveTab('stretching')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'stretching'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🧘 Stretching
          </button>
        </div>

        {/* Injuries Tab */}
        {activeTab === 'injuries' && (
          <div className="space-y-6">
            {/* Active Injuries */}
            {activeInjuries.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Aktiva Skador ({activeInjuries.length})</h3>
                <div className="space-y-4">
                  {activeInjuries.map(injury => (
                    <div key={injury.id} className="card border-l-4 border-yellow-500">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-4">
                          <div className="text-5xl">{getInjuryIcon(injury.type)}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-lg">
                                {injuryTypes.find(t => t.value === injury.type)?.label}
                              </h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(injury.severity)}`}>
                                {severityLevels.find(s => s.value === injury.severity)?.label}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                              {injury.description}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              📅 {format(new Date(injury.date), 'PPP', { locale: sv })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMarkRecovered(injury.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            ✓ Återhämtad
                          </button>
                          <button
                            onClick={() => handleDeleteInjury(injury.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {injury.treatment && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                          <h5 className="font-semibold text-sm mb-1">💊 Behandling:</h5>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {injury.treatment}
                          </p>
                        </div>
                      )}

                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold">Uppskattad återhämtningstid</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ~{injury.recoveryDays} dagar
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {differenceInDays(new Date(), new Date(injury.date))} dagar sedan skada
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recovered Injuries */}
            {recoveredInjuries.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Återhämtade Skador ({recoveredInjuries.length})</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {recoveredInjuries.map(injury => (
                    <div key={injury.id} className="card border-l-4 border-green-500">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{getInjuryIcon(injury.type)}</div>
                          <div>
                            <h4 className="font-bold">
                              {injuryTypes.find(t => t.value === injury.type)?.label}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {format(new Date(injury.date), 'PP', { locale: sv })}
                            </p>
                            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(injury.status)}`}>
                              ✓ Återhämtad
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteInjury(injury.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {injuries.length === 0 && (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold mb-2">Inga skador loggade!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fortsätt träna säkert och förebyggande
                </p>
              </div>
            )}
          </div>
        )}

        {/* Prevention Tab */}
        {activeTab === 'prevention' && (
          <div className="grid md:grid-cols-2 gap-6">
            {preventionTips.map((category, index) => (
              <div key={index} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <h3 className="text-xl font-bold">{category.category}</h3>
                </div>
                <ul className="space-y-2">
                  {category.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-bjj-primary font-bold">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Stretching Tab */}
        {activeTab === 'stretching' && (
          <div>
            <div className="card mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <h3 className="font-bold text-lg mb-2">🧘 Daglig Stretching Rutin</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Utför dessa övningar dagligen för att förbättra rörlighet och förebygga skador. 
                Total tid: ~15 minuter.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stretchingExercises.map((exercise, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{exercise.name}</h3>
                    <span className="px-3 py-1 bg-bjj-primary text-white rounded-full text-sm font-semibold">
                      {exercise.duration}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                      🎯 {exercise.target}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {exercise.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="card mt-6 bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-bold text-lg mb-3">💡 Stretching Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-bjj-primary">✓</span>
                  <span>Stretcha aldrig kalla muskler - värm upp först</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bjj-primary">✓</span>
                  <span>Håll varje stretch i minst 30 sekunder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bjj-primary">✓</span>
                  <span>Andas djupt och lugnt under stretching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bjj-primary">✓</span>
                  <span>Stretcha inte till smärta - lätt obehag är OK</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bjj-primary">✓</span>
                  <span>Gör stretching efter varje träning för bästa resultat</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Add Injury Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Logga Skada</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Typ av skada</label>
                <select
                  value={newInjury.type}
                  onChange={(e) => setNewInjury({...newInjury, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {injuryTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Allvarlighetsgrad</label>
                <div className="grid grid-cols-3 gap-3">
                  {severityLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setNewInjury({...newInjury, severity: level.value})}
                      className={`py-3 rounded-lg font-semibold transition-colors ${
                        newInjury.severity === level.value
                          ? level.color === 'green' ? 'bg-green-500 text-white'
                          : level.color === 'yellow' ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Datum</label>
                <input
                  type="date"
                  value={newInjury.date}
                  onChange={(e) => setNewInjury({...newInjury, date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Beskrivning *</label>
                <textarea
                  value={newInjury.description}
                  onChange={(e) => setNewInjury({...newInjury, description: e.target.value})}
                  placeholder="Beskriv hur skadan uppstod..."
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Behandling</label>
                <textarea
                  value={newInjury.treatment}
                  onChange={(e) => setNewInjury({...newInjury, treatment: e.target.value})}
                  placeholder="Vilken behandling planerar du? (t.ex. vila, fysio, is)"
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddInjury}
                  className="flex-1 btn-primary"
                >
                  Logga Skada
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
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
