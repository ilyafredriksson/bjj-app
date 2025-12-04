'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'
import { format, differenceInDays, addDays } from 'date-fns'
import { sv } from 'date-fns/locale'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function CompetitionPrepPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('competitions')
  const [competitions, setCompetitions] = useState([])
  const [weightLog, setWeightLog] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [newComp, setNewComp] = useState({
    name: '',
    date: '',
    weightClass: 'middle',
    division: 'gi',
    level: 'beginner',
    notes: ''
  })
  const [newWeight, setNewWeight] = useState({
    weight: '',
    date: new Date().toISOString().split('T')[0]
  })

  const weightClasses = {
    gi: [
      { value: 'rooster', label: 'Rooster (~57.5 kg)', max: 57.5 },
      { value: 'light-feather', label: 'Light Feather (~64 kg)', max: 64 },
      { value: 'feather', label: 'Feather (~70 kg)', max: 70 },
      { value: 'light', label: 'Light (~76 kg)', max: 76 },
      { value: 'middle', label: 'Middle (~82.3 kg)', max: 82.3 },
      { value: 'medium-heavy', label: 'Medium Heavy (~88.3 kg)', max: 88.3 },
      { value: 'heavy', label: 'Heavy (~94.3 kg)', max: 94.3 },
      { value: 'super-heavy', label: 'Super Heavy (~100.5 kg)', max: 100.5 },
      { value: 'ultra-heavy', label: 'Ultra Heavy (100.5+ kg)', max: 999 }
    ],
    nogi: [
      { value: 'feather', label: 'Featherweight (~65 kg)', max: 65 },
      { value: 'light', label: 'Lightweight (~70 kg)', max: 70 },
      { value: 'welter', label: 'Welterweight (~77 kg)', max: 77 },
      { value: 'middle', label: 'Middleweight (~84 kg)', max: 84 },
      { value: 'light-heavy', label: 'Light Heavyweight (~92 kg)', max: 92 },
      { value: 'heavy', label: 'Heavyweight (~99 kg)', max: 99 },
      { value: 'super-heavy', label: 'Super Heavyweight (99+ kg)', max: 999 }
    ]
  }

  const mockCompetitions = [
    {
      id: 1,
      name: 'Stockholm Open 2025',
      date: '2025-01-15',
      weightClass: 'middle',
      division: 'gi',
      level: 'intermediate',
      status: 'upcoming',
      notes: 'Fokusera på guard passing och top control'
    },
    {
      id: 2,
      name: 'Swedish National Championship',
      date: '2025-03-20',
      weightClass: 'middle',
      division: 'gi',
      level: 'advanced',
      status: 'upcoming',
      notes: 'Målsättning: medalj'
    },
    {
      id: 3,
      name: 'Gothenburg Grappling Open',
      date: '2024-11-10',
      weightClass: 'middle',
      division: 'nogi',
      level: 'intermediate',
      status: 'completed',
      result: 'bronze',
      notes: 'Bra prestation, behöver jobba på cardio'
    }
  ]

  const mockWeightLog = [
    { date: '2024-12-04', weight: 83.5 },
    { date: '2024-12-03', weight: 83.8 },
    { date: '2024-12-02', weight: 84.0 },
    { date: '2024-12-01', weight: 84.2 },
    { date: '2024-11-30', weight: 83.9 },
    { date: '2024-11-29', weight: 84.1 },
    { date: '2024-11-28', weight: 84.5 }
  ]

  const prepChecklist = [
    { category: '8 veckor innan', items: [
      'Registrera dig för tävlingen',
      'Sätt specifika träningsmål',
      'Planera viktminskningsstrategi (om nödvändigt)',
      'Öka sparring-frekvens'
    ]},
    { category: '4 veckor innan', items: [
      'Intensifiera specifik matchträning',
      'Studera motståndare (om möjligt)',
      'Finslipa dina starkaste tekniker',
      'Öka cardio-träning'
    ]},
    { category: '2 veckor innan', items: [
      'Börja taper (minska intensitet)',
      'Fokusera på återhämtning',
      'Mentalträning och visualisering',
      'Kontrollera vikten dagligen'
    ]},
    { category: '1 vecka innan', items: [
      'Lätt teknisk träning',
      'Maximal återhämtning',
      'Packa utrustning',
      'Bekräfta resedetaljer'
    ]},
    { category: 'Matchdag', items: [
      'Lätt uppvärmning (30 min innan)',
      'Mentala förberedelser',
      'Följ din matchplan',
      'Håll dig hydrerad'
    ]}
  ]

  const nutritionTips = [
    {
      title: 'Normal träningsperiod',
      tips: [
        'Balanserad kost: 40% carbs, 30% protein, 30% fett',
        'Tillräcklig vätska: 2-3 liter per dag',
        'Ät inom 30 min efter träning',
        'Inkludera grönsaker i varje måltid'
      ]
    },
    {
      title: 'Viktnedgång (4-8 veckor innan)',
      tips: [
        'Gradvis kaloriunderskott (300-500 kcal/dag)',
        'Högt proteinintag (2g per kg kroppsvikt)',
        'Reducera saltet gradvis',
        'Undvik junk food och socker'
      ]
    },
    {
      title: 'Sista veckan',
      tips: [
        'Minska fiber 3 dagar innan',
        'Carb loading 2 dagar innan',
        'Watercutting endast om nödvändigt',
        'Planera måltider noga'
      ]
    },
    {
      title: 'Efter invägning',
      tips: [
        'Återställ vätskebalans gradvis',
        'Lätta, lättsmälta måltider',
        'Elektrolyter och mineraler',
        'Undvik tung mat innan match'
      ]
    }
  ]

  useEffect(() => {
    const savedComps = localStorage.getItem('bjj-competitions')
    const savedWeights = localStorage.getItem('bjj-weight-log')
    
    if (savedComps) {
      setCompetitions(JSON.parse(savedComps))
    } else {
      setCompetitions(mockCompetitions)
      localStorage.setItem('bjj-competitions', JSON.stringify(mockCompetitions))
    }

    if (savedWeights) {
      setWeightLog(JSON.parse(savedWeights))
    } else {
      setWeightLog(mockWeightLog)
      localStorage.setItem('bjj-weight-log', JSON.stringify(mockWeightLog))
    }
  }, [])

  const handleAddCompetition = () => {
    if (!newComp.name || !newComp.date) {
      toast.error('Namn och datum krävs')
      return
    }

    const comp = {
      id: Date.now(),
      ...newComp,
      status: 'upcoming'
    }

    const updated = [...competitions, comp]
    setCompetitions(updated)
    localStorage.setItem('bjj-competitions', JSON.stringify(updated))

    setNewComp({
      name: '',
      date: '',
      weightClass: 'middle',
      division: 'gi',
      level: 'beginner',
      notes: ''
    })
    setShowAddModal(false)
    toast.success('Tävling tillagd!')
  }

  const handleAddWeight = () => {
    if (!newWeight.weight) {
      toast.error('Vikt krävs')
      return
    }

    const weight = {
      date: newWeight.date,
      weight: parseFloat(newWeight.weight)
    }

    const updated = [weight, ...weightLog].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    setWeightLog(updated)
    localStorage.setItem('bjj-weight-log', JSON.stringify(updated))

    setNewWeight({
      weight: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowWeightModal(false)
    toast.success('Vikt loggad!')
  }

  const handleDeleteCompetition = (id) => {
    if (confirm('Ta bort denna tävling?')) {
      const updated = competitions.filter(c => c.id !== id)
      setCompetitions(updated)
      localStorage.setItem('bjj-competitions', JSON.stringify(updated))
      toast.success('Tävling borttagen')
    }
  }

  const upcomingCompetitions = competitions.filter(c => c.status === 'upcoming')
  const completedCompetitions = competitions.filter(c => c.status === 'completed')

  const nextCompetition = upcomingCompetitions.length > 0 
    ? upcomingCompetitions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    : null

  const daysUntilNext = nextCompetition 
    ? differenceInDays(new Date(nextCompetition.date), new Date())
    : null

  const currentWeight = weightLog.length > 0 ? weightLog[0].weight : null
  const targetWeight = nextCompetition 
    ? weightClasses[nextCompetition.division].find(w => w.value === nextCompetition.weightClass)?.max
    : null

  const weightDifference = currentWeight && targetWeight 
    ? (currentWeight - targetWeight).toFixed(1)
    : null

  // Chart data for weight tracking
  const chartData = {
    labels: weightLog.slice(0, 14).reverse().map(w => format(new Date(w.date), 'MMM dd', { locale: sv })),
    datasets: [
      {
        label: 'Vikt (kg)',
        data: weightLog.slice(0, 14).reverse().map(w => w.weight),
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        tension: 0.4,
        fill: true
      },
      ...(targetWeight ? [{
        label: 'Målvikt',
        data: Array(Math.min(14, weightLog.length)).fill(targetWeight),
        borderColor: '#dc2626',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0
      }] : [])
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { 
        beginAtZero: false,
        min: Math.min(...weightLog.slice(0, 14).map(w => w.weight)) - 2,
        max: Math.max(...weightLog.slice(0, 14).map(w => w.weight)) + 2
      }
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Competition Preparation</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Planera och förbered dig för dina tävlingar
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Ny Tävling
          </button>
        </div>

        {/* Next Competition Alert */}
        {nextCompetition && (
          <div className="card mb-8 bg-gradient-to-r from-bjj-primary/20 to-bjj-accent/20 border-2 border-bjj-primary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">🏆 Nästa tävling: {nextCompetition.name}</h3>
                <div className="flex gap-4 text-sm">
                  <span>📅 {format(new Date(nextCompetition.date), 'PPP', { locale: sv })}</span>
                  <span>⚖️ {weightClasses[nextCompetition.division].find(w => w.value === nextCompetition.weightClass)?.label}</span>
                  <span>🥋 {nextCompetition.division === 'gi' ? 'Gi' : 'No-Gi'}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-bjj-primary mb-1">
                  {daysUntilNext}
                </div>
                <div className="text-sm font-semibold">dagar kvar</div>
              </div>
            </div>

            {weightDifference && (
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Viktförändring behövs:</span>
                  <span className={`text-xl font-bold ${
                    parseFloat(weightDifference) > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {weightDifference > 0 ? '-' : '+'}{Math.abs(weightDifference)} kg
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Nuvarande: {currentWeight} kg → Mål: {targetWeight} kg
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('competitions')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'competitions'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🏆 Tävlingar
          </button>
          <button
            onClick={() => setActiveTab('weight')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'weight'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            ⚖️ Viktspårning
          </button>
          <button
            onClick={() => setActiveTab('prep')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'prep'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            📋 Prep Checklist
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'nutrition'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🥗 Nutrition
          </button>
        </div>

        {/* Competitions Tab */}
        {activeTab === 'competitions' && (
          <div className="space-y-8">
            {/* Upcoming */}
            {upcomingCompetitions.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Kommande Tävlingar ({upcomingCompetitions.length})</h3>
                <div className="space-y-4">
                  {upcomingCompetitions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(comp => (
                    <div key={comp.id} className="card border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold mb-2">{comp.name}</h4>
                          <div className="flex flex-wrap gap-3 text-sm mb-2">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                              📅 {format(new Date(comp.date), 'PPP', { locale: sv })}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded">
                              ⚖️ {weightClasses[comp.division].find(w => w.value === comp.weightClass)?.label}
                            </span>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded">
                              🥋 {comp.division === 'gi' ? 'Gi' : 'No-Gi'}
                            </span>
                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded">
                              📊 {comp.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {differenceInDays(new Date(comp.date), new Date())} dagar kvar
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteCompetition(comp.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                      {comp.notes && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm">{comp.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedCompetitions.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Tidigare Tävlingar ({completedCompetitions.length})</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {completedCompetitions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(comp => (
                    <div key={comp.id} className="card border-l-4 border-green-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold mb-1">{comp.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {format(new Date(comp.date), 'PP', { locale: sv })}
                          </p>
                          {comp.result && (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              comp.result === 'gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              comp.result === 'silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                              comp.result === 'bronze' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {comp.result === 'gold' ? '🥇 Guld' :
                               comp.result === 'silver' ? '🥈 Silver' :
                               comp.result === 'bronze' ? '🥉 Brons' : '✅ Deltagit'}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteCompetition(comp.id)}
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

            {competitions.length === 0 && (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Inga tävlingar planerade</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Lägg till din första tävling för att börja förbereda dig
                </p>
                <button onClick={() => setShowAddModal(true)} className="btn-primary">
                  + Lägg till Tävling
                </button>
              </div>
            )}
          </div>
        )}

        {/* Weight Tracking Tab */}
        {activeTab === 'weight' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Vikthistorik</h3>
              <button onClick={() => setShowWeightModal(true)} className="btn-secondary">
                + Logga Vikt
              </button>
            </div>

            {weightLog.length > 0 && (
              <>
                <div className="card">
                  <h4 className="font-bold mb-4">Viktgraf (senaste 14 dagarna)</h4>
                  <Line data={chartData} options={chartOptions} />
                </div>

                <div className="card">
                  <h4 className="font-bold mb-4">Vikt-logg</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Datum</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Vikt</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Förändring</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {weightLog.slice(0, 20).map((entry, index) => {
                          const prevWeight = weightLog[index + 1]?.weight
                          const change = prevWeight ? (entry.weight - prevWeight).toFixed(1) : null
                          return (
                            <tr key={entry.date} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-4 py-3 text-sm">
                                {format(new Date(entry.date), 'PPP', { locale: sv })}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold">
                                {entry.weight} kg
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {change && (
                                  <span className={change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-600'}>
                                    {change > 0 ? '+' : ''}{change} kg
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Prep Checklist Tab */}
        {activeTab === 'prep' && (
          <div className="space-y-6">
            {prepChecklist.map((section, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-bold mb-4">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 text-bjj-primary rounded focus:ring-bjj-primary"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div className="grid md:grid-cols-2 gap-6">
            {nutritionTips.map((section, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-bold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-bjj-primary font-bold">✓</span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Competition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Lägg till Tävling</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tävlingsnamn *</label>
                <input
                  type="text"
                  value={newComp.name}
                  onChange={(e) => setNewComp({...newComp, name: e.target.value})}
                  placeholder="t.ex. Stockholm Open 2025"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Datum *</label>
                <input
                  type="date"
                  value={newComp.date}
                  onChange={(e) => setNewComp({...newComp, date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Division</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewComp({...newComp, division: 'gi', weightClass: 'middle'})}
                    className={`py-3 rounded-lg font-semibold transition-colors ${
                      newComp.division === 'gi'
                        ? 'bg-bjj-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    🥋 Gi
                  </button>
                  <button
                    onClick={() => setNewComp({...newComp, division: 'nogi', weightClass: 'middle'})}
                    className={`py-3 rounded-lg font-semibold transition-colors ${
                      newComp.division === 'nogi'
                        ? 'bg-bjj-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    🩳 No-Gi
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Viktklass</label>
                <select
                  value={newComp.weightClass}
                  onChange={(e) => setNewComp({...newComp, weightClass: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {weightClasses[newComp.division].map(wc => (
                    <option key={wc.value} value={wc.value}>{wc.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Nivå</label>
                <select
                  value={newComp.level}
                  onChange={(e) => setNewComp({...newComp, level: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Anteckningar</label>
                <textarea
                  value={newComp.notes}
                  onChange={(e) => setNewComp({...newComp, notes: e.target.value})}
                  placeholder="Mål, fokusområden, strategi..."
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleAddCompetition} className="flex-1 btn-primary">
                  Lägg till Tävling
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

      {/* Add Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Logga Vikt</h2>
              <button
                onClick={() => setShowWeightModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Vikt (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight.weight}
                  onChange={(e) => setNewWeight({...newWeight, weight: e.target.value})}
                  placeholder="82.5"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Datum</label>
                <input
                  type="date"
                  value={newWeight.date}
                  onChange={(e) => setNewWeight({...newWeight, date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleAddWeight} className="flex-1 btn-primary">
                  Logga Vikt
                </button>
                <button
                  onClick={() => setShowWeightModal(false)}
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
