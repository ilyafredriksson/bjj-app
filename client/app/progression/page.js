'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { getTrainings } from '@/lib/api'
import { format, parseISO } from 'date-fns'
import { sv } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function ProgressionPage() {
  const router = useRouter()
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBeltSelector, setShowBeltSelector] = useState(false)
  const [showStripeSelector, setShowStripeSelector] = useState(false)
  
  // User progression state (skulle komma från User model i framtiden)
  const [progression, setProgression] = useState({
    currentBelt: 'White',
    stripes: 2,
    startDate: '2024-01-15',
    beltHistory: [
      { belt: 'White', stripes: 0, date: '2024-01-15', trainings: 0 },
      { belt: 'White', stripes: 1, date: '2024-03-20', trainings: 25 },
      { belt: 'White', stripes: 2, date: '2024-06-15', trainings: 50 }
    ]
  })

  const belts = [
    { name: 'White', color: 'bg-gray-100 border-gray-400', textColor: 'text-gray-900', emoji: '⚪' },
    { name: 'Blue', color: 'bg-blue-500', textColor: 'text-white', emoji: '🔵' },
    { name: 'Purple', color: 'bg-purple-600', textColor: 'text-white', emoji: '🟣' },
    { name: 'Brown', color: 'bg-amber-700', textColor: 'text-white', emoji: '🟤' },
    { name: 'Black', color: 'bg-black', textColor: 'text-white', emoji: '⚫' }
  ]

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    try {
      const data = await getTrainings()
      setTrainings(data)
    } catch (error) {
      toast.error('Kunde inte ladda träningar')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentBeltInfo = () => {
    return belts.find(b => b.name === progression.currentBelt) || belts[0]
  }

  const getTrainingsAtCurrentBelt = () => {
    const lastPromotion = progression.beltHistory[progression.beltHistory.length - 1]
    if (!lastPromotion) return trainings.length
    
    const promotionDate = new Date(lastPromotion.date)
    return trainings.filter(t => new Date(t.date) >= promotionDate).length
  }

  const getEstimatedNextPromotion = () => {
    const trainingsAtBelt = getTrainingsAtCurrentBelt()
    const stripesNeeded = 4 - progression.stripes
    const trainingsPerStripe = 25 // Genomsnitt
    
    if (progression.stripes === 4) {
      return { type: 'belt', trainingsNeeded: 100 - trainingsAtBelt }
    } else {
      return { type: 'stripe', trainingsNeeded: trainingsPerStripe - (trainingsAtBelt % trainingsPerStripe) }
    }
  }

  const getMilestones = () => {
    const trainingsAtBelt = getTrainingsAtCurrentBelt()
    return [
      { name: '10 träningar', target: 10, achieved: trainingsAtBelt >= 10 },
      { name: '25 träningar', target: 25, achieved: trainingsAtBelt >= 25 },
      { name: '50 träningar', target: 50, achieved: trainingsAtBelt >= 50 },
      { name: '75 träningar', target: 75, achieved: trainingsAtBelt >= 75 },
      { name: '100 träningar', target: 100, achieved: trainingsAtBelt >= 100 },
      { name: '150 träningar', target: 150, achieved: trainingsAtBelt >= 150 },
      { name: '200 träningar', target: 200, achieved: trainingsAtBelt >= 200 }
    ]
  }

  const currentBelt = getCurrentBeltInfo()
  const trainingsAtBelt = getTrainingsAtCurrentBelt()
  const nextPromotion = getEstimatedNextPromotion()
  const milestones = getMilestones()
  const nextMilestone = milestones.find(m => !m.achieved)

  const progressToNextStripe = ((trainingsAtBelt % 25) / 25) * 100

  const handleBeltChange = (beltName) => {
    setProgression(prev => ({
      ...prev,
      currentBelt: beltName,
      stripes: 0
    }))
    setShowBeltSelector(false)
    toast.success(`Bälte uppdaterat till ${beltName}!`)
  }

  const handleStripeChange = (stripeCount) => {
    setProgression(prev => ({
      ...prev,
      stripes: stripeCount
    }))
    setShowStripeSelector(false)
    toast.success(`Stripes uppdaterat till ${stripeCount}!`)
  }

  const getTrainingsPerBelt = () => {
    const stats = {}
    belts.forEach(belt => {
      stats[belt.name] = trainings.filter(t => t.beltLevel === belt.name).length
    })
    return stats
  }

  const beltStats = getTrainingsPerBelt()

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Belt Progression</h1>

        {/* Current Belt Display */}
        <div className="card mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{currentBelt.emoji}</div>
            <h2 className="text-4xl font-bold mb-2">
              {progression.currentBelt} Belt
            </h2>
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-8 rounded cursor-pointer hover:opacity-75 transition-opacity ${
                    i < progression.stripes 
                      ? 'bg-bjj-accent' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => handleStripeChange(i + 1)}
                  title={`Sätt till ${i + 1} stripe${i > 0 ? 's' : ''}`}
                />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {progression.stripes} {progression.stripes === 1 ? 'stripe' : 'stripes'}
            </p>
            
            <button
              onClick={() => setShowBeltSelector(!showBeltSelector)}
              className="btn-secondary"
            >
              Ändra bälte
            </button>

            {showBeltSelector && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm mb-3 font-semibold">Välj ditt nuvarande bälte:</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {belts.map(belt => (
                    <button
                      key={belt.name}
                      onClick={() => handleBeltChange(belt.name)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        belt.name === progression.currentBelt
                          ? 'border-bjj-accent bg-bjj-accent/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-bjj-primary'
                      }`}
                    >
                      <div className="text-2xl mb-1">{belt.emoji}</div>
                      <div className="text-sm font-semibold">{belt.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trainings per Belt Stats */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold mb-4">Träningar per bälte</h3>
          <div className="grid grid-cols-5 gap-4">
            {belts.map(belt => (
              <div
                key={belt.name}
                className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="text-3xl mb-2">{belt.emoji}</div>
                <div className="text-2xl font-bold text-bjj-primary mb-1">
                  {beltStats[belt.name] || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {belt.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-2">🥋</div>
            <div className="text-3xl font-bold text-bjj-primary mb-1">
              {trainingsAtBelt}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Träningar på {progression.currentBelt} bälte
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-3xl font-bold text-bjj-accent mb-1">
              {Math.floor((new Date() - new Date(progression.startDate)) / (1000 * 60 * 60 * 24))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Dagar sedan start
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-bjj-secondary mb-1">
              {trainings.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Totalt träningar
            </p>
          </div>
        </div>

        {/* Progress to Next Stripe/Belt */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold mb-4">
            Nästa {nextPromotion.type === 'stripe' ? 'Stripe' : 'Bälte'}
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{trainingsAtBelt % 25} / 25 träningar</span>
              <span>{Math.round(progressToNextStripe)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-bjj-accent h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressToNextStripe}%` }}
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-900 dark:text-blue-200">
              <strong>Uppskattning:</strong> Cirka {nextPromotion.trainingsNeeded} träningar kvar till nästa {nextPromotion.type === 'stripe' ? 'stripe' : 'bälte'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Belt Timeline */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Belt History</h3>
            
            <div className="space-y-6">
              {progression.beltHistory.map((entry, index) => {
                const beltInfo = belts.find(b => b.name === entry.belt)
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full ${beltInfo.color} flex items-center justify-center text-2xl`}>
                        {beltInfo.emoji}
                      </div>
                      {index < progression.beltHistory.length - 1 && (
                        <div className="w-1 h-12 bg-gray-300 dark:bg-gray-600 my-1" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{entry.belt} Belt</h4>
                        <div className="flex gap-1">
                          {[...Array(entry.stripes)].map((_, i) => (
                            <div key={i} className="w-2 h-5 bg-bjj-accent rounded" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(parseISO(entry.date), 'd MMMM yyyy', { locale: sv })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {entry.trainings} träningar
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => toast.info('Promotion tracking kommer snart!')}
              className="btn-secondary w-full mt-6"
            >
              + Lägg till promotion
            </button>
          </div>

          {/* Milestones */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Milstolpar</h3>
            
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    milestone.achieved
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {milestone.achieved ? '✅' : '⭕'}
                      </div>
                      <div>
                        <p className="font-semibold">{milestone.name}</p>
                        {!milestone.achieved && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {milestone.target - trainingsAtBelt} träningar kvar
                          </p>
                        )}
                      </div>
                    </div>
                    {milestone.achieved && (
                      <div className="text-green-600 dark:text-green-400 font-bold">
                        {milestone.target}
                      </div>
                    )}
                  </div>
                  
                  {!milestone.achieved && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-bjj-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(trainingsAtBelt / milestone.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {nextMilestone && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-900 dark:text-blue-200 text-sm">
                  <strong>Nästa milstolpe:</strong> {nextMilestone.name} ({nextMilestone.target - trainingsAtBelt} träningar kvar)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Belt Progression Visual */}
        <div className="card mt-8">
          <h3 className="text-xl font-bold mb-6">BJJ Belt System</h3>
          
          <div className="grid grid-cols-5 gap-4">
            {belts.map((belt, index) => {
              const isCurrent = belt.name === progression.currentBelt
              const isPast = belts.findIndex(b => b.name === progression.currentBelt) > index
              
              return (
                <div
                  key={belt.name}
                  className={`text-center p-4 rounded-lg border-2 ${
                    isCurrent
                      ? 'border-bjj-accent bg-bjj-accent/10'
                      : isPast
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600 opacity-50'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto rounded-full ${belt.color} flex items-center justify-center text-3xl mb-2`}>
                    {belt.emoji}
                  </div>
                  <p className="font-semibold">{belt.name}</p>
                  {isCurrent && (
                    <p className="text-xs text-bjj-accent font-bold mt-1">
                      Nuvarande
                    </p>
                  )}
                  {isPast && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-1">
                      ✓ Uppnått
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
