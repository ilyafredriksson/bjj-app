'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'
import { format, differenceInDays, addDays } from 'date-fns'
import { sv } from 'date-fns/locale'
import { getTrainings } from '@/lib/api'

export default function GoalsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('goals')
  const [goals, setGoals] = useState([])
  const [milestones, setMilestones] = useState([])
  const [trainings, setTrainings] = useState([])
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'training',
    targetValue: 10,
    currentValue: 0,
    unit: 'träningar',
    deadline: '',
    priority: 'medium'
  })

  const mockGoals = [
    {
      id: 1,
      title: 'Träna 100 gånger under 2025',
      description: 'Konsekvent träning 2-3 gånger per vecka',
      category: 'training',
      targetValue: 100,
      currentValue: 45,
      unit: 'träningar',
      deadline: '2025-12-31',
      priority: 'high',
      createdAt: '2025-01-01'
    },
    {
      id: 2,
      title: 'Lär dig 10 nya tekniker',
      description: 'Fokusera på guard passing tekniker',
      category: 'technique',
      targetValue: 10,
      currentValue: 6,
      unit: 'tekniker',
      deadline: '2025-06-30',
      priority: 'medium',
      createdAt: '2025-01-15'
    },
    {
      id: 3,
      title: 'Vinn Blue Belt',
      description: 'Fortsätt träna konsekvent och visa progression',
      category: 'belt',
      targetValue: 1,
      currentValue: 0,
      unit: 'bälte',
      deadline: '2025-12-31',
      priority: 'high',
      createdAt: '2025-01-01'
    },
    {
      id: 4,
      title: 'Tävla 3 gånger',
      description: 'Få tävlingserfarenhet och testa mina skills',
      category: 'competition',
      targetValue: 3,
      currentValue: 1,
      unit: 'tävlingar',
      deadline: '2025-12-31',
      priority: 'medium',
      createdAt: '2025-02-01'
    },
    {
      id: 5,
      title: '30-dagars träningsstreak',
      description: 'Träna varje dag i 30 dagar',
      category: 'streak',
      targetValue: 30,
      currentValue: 12,
      unit: 'dagar',
      deadline: '2025-02-28',
      priority: 'high',
      createdAt: '2025-01-20'
    }
  ]

  const predefinedMilestones = [
    { value: 10, label: '10 Träningar', icon: '🥉', color: 'orange' },
    { value: 25, label: '25 Träningar', icon: '🥈', color: 'gray' },
    { value: 50, label: '50 Träningar', icon: '🥇', color: 'yellow' },
    { value: 75, label: '75 Träningar', icon: '⭐', color: 'blue' },
    { value: 100, label: '100 Träningar', icon: '🏆', color: 'purple' },
    { value: 150, label: '150 Träningar', icon: '💎', color: 'cyan' },
    { value: 200, label: '200 Träningar', icon: '👑', color: 'gold' },
    { value: 300, label: '300 Träningar', icon: '🌟', color: 'pink' },
    { value: 500, label: '500 Träningar', icon: '🔥', color: 'red' },
    { value: 1000, label: '1000 Träningar', icon: '💪', color: 'green' }
  ]

  useEffect(() => {
    fetchTrainings()
    const savedGoals = localStorage.getItem('bjj-goals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    } else {
      setGoals(mockGoals)
      localStorage.setItem('bjj-goals', JSON.stringify(mockGoals))
    }
  }, [])

  useEffect(() => {
    if (trainings.length > 0) {
      const achievedMilestones = predefinedMilestones.map(m => ({
        ...m,
        achieved: trainings.length >= m.value,
        achievedDate: trainings.length >= m.value ? trainings[m.value - 1]?.date : null
      }))
      setMilestones(achievedMilestones)
    }
  }, [trainings])

  const fetchTrainings = async () => {
    try {
      const data = await getTrainings()
      setTrainings(data)
    } catch (error) {
      console.error('Error fetching trainings:', error)
    }
  }

  const handleAddGoal = () => {
    if (!newGoal.title) {
      toast.error('Titel krävs')
      return
    }

    const goal = {
      id: Date.now(),
      ...newGoal,
      createdAt: new Date().toISOString().split('T')[0]
    }

    const updated = [...goals, goal]
    setGoals(updated)
    localStorage.setItem('bjj-goals', JSON.stringify(updated))

    setNewGoal({
      title: '',
      description: '',
      category: 'training',
      targetValue: 10,
      currentValue: 0,
      unit: 'träningar',
      deadline: '',
      priority: 'medium'
    })
    setShowGoalModal(false)
    toast.success('Mål tillagt!')
  }

  const handleUpdateProgress = (goalId, increment) => {
    const updated = goals.map(goal => {
      if (goal.id === goalId) {
        const newValue = Math.max(0, Math.min(goal.targetValue, goal.currentValue + increment))
        if (newValue === goal.targetValue && goal.currentValue !== goal.targetValue) {
          toast.success(`🎉 Grattis! Du har uppnått målet: ${goal.title}`)
        }
        return { ...goal, currentValue: newValue }
      }
      return goal
    })
    setGoals(updated)
    localStorage.setItem('bjj-goals', JSON.stringify(updated))
  }

  const handleDeleteGoal = (id) => {
    if (confirm('Ta bort detta mål?')) {
      const updated = goals.filter(g => g.id !== id)
      setGoals(updated)
      localStorage.setItem('bjj-goals', JSON.stringify(updated))
      toast.success('Mål borttaget')
    }
  }

  const getProgressPercentage = (goal) => {
    return Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
  }

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      training: '💪',
      technique: '🥋',
      belt: '🎖️',
      competition: '🏆',
      streak: '🔥',
      weight: '⚖️',
      other: '🎯'
    }
    return icons[category] || '🎯'
  }

  const activeGoals = goals.filter(g => g.currentValue < g.targetValue)
  const completedGoals = goals.filter(g => g.currentValue >= g.targetValue)
  const achievedMilestones = milestones.filter(m => m.achieved)
  const upcomingMilestones = milestones.filter(m => !m.achieved)

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Goals & Milestones</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sätt mål och spåra din progression
            </p>
          </div>
          <button
            onClick={() => setShowGoalModal(true)}
            className="btn-primary"
          >
            + Nytt Mål
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-bjj-primary mb-1">
              {activeGoals.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Aktiva mål
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {completedGoals.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Uppnådda mål
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-bjj-accent mb-1">
              {achievedMilestones.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Milstolpar
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">💪</div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {trainings.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Totalt träningar
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('goals')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'goals'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🎯 Mål
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'milestones'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🏆 Milstolpar
          </button>
        </div>

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-8">
            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Aktiva Mål ({activeGoals.length})</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {activeGoals.map(goal => {
                    const progress = getProgressPercentage(goal)
                    const daysLeft = goal.deadline ? differenceInDays(new Date(goal.deadline), new Date()) : null
                    
                    return (
                      <div key={goal.id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-3">
                            <div className="text-4xl">{getCategoryIcon(goal.category)}</div>
                            <div>
                              <h4 className="font-bold text-lg mb-1">{goal.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {goal.description}
                              </p>
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(goal.priority)}`}>
                                  {goal.priority}
                                </span>
                                {daysLeft !== null && (
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    daysLeft < 7 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                    daysLeft < 30 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  }`}>
                                    {daysLeft} dagar kvar
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold">Progress</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {goal.currentValue} / {goal.targetValue} {goal.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                            <div
                              className="bg-gradient-to-r from-bjj-primary to-bjj-accent h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                              style={{ width: `${progress}%` }}
                            >
                              {progress > 20 && (
                                <span className="text-white text-xs font-bold">{progress}%</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateProgress(goal.id, -1)}
                            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
                            disabled={goal.currentValue === 0}
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleUpdateProgress(goal.id, 1)}
                            className="flex-1 px-4 py-2 bg-bjj-primary text-white rounded-lg hover:bg-bjj-primary/90 transition-colors font-semibold"
                            disabled={goal.currentValue >= goal.targetValue}
                          >
                            +1
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Uppnådda Mål ({completedGoals.length})</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {completedGoals.map(goal => (
                    <div key={goal.id} className="card border-l-4 border-green-500">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">{getCategoryIcon(goal.category)}</div>
                          <div>
                            <h4 className="font-bold">{goal.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              ✅ Uppnått
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-sm">
                        {goal.targetValue} {goal.unit} 🎉
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {goals.length === 0 && (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Inga mål ännu</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Sätt ditt första mål och börja spåra din progression
                </p>
                <button onClick={() => setShowGoalModal(true)} className="btn-primary">
                  + Lägg till Mål
                </button>
              </div>
            )}
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="space-y-8">
            {/* Achieved Milestones */}
            {achievedMilestones.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Uppnådda Milstolpar ({achievedMilestones.length})</h3>
                <div className="grid md:grid-cols-5 gap-4">
                  {achievedMilestones.map(milestone => (
                    <div key={milestone.value} className="card text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-500">
                      <div className="text-5xl mb-2">{milestone.icon}</div>
                      <div className="text-2xl font-bold text-green-800 dark:text-green-400 mb-1">
                        {milestone.value}
                      </div>
                      <p className="text-sm font-semibold mb-2">{milestone.label}</p>
                      <div className="text-xs text-green-700 dark:text-green-500">
                        ✅ Uppnått!
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Milestones */}
            {upcomingMilestones.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Kommande Milstolpar</h3>
                <div className="grid md:grid-cols-5 gap-4">
                  {upcomingMilestones.slice(0, 5).map(milestone => {
                    const remaining = milestone.value - trainings.length
                    const progress = (trainings.length / milestone.value) * 100
                    
                    return (
                      <div key={milestone.value} className="card text-center">
                        <div className="text-5xl mb-2 opacity-50">{milestone.icon}</div>
                        <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-1">
                          {milestone.value}
                        </div>
                        <p className="text-sm font-semibold mb-3">{milestone.label}</p>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                          <div
                            className="bg-gradient-to-r from-bjj-primary to-bjj-accent h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {remaining} träningar kvar
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {milestones.length === 0 && (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Börja träna för milstolpar!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Logga träningar för att låsa upp milstolpar
                </p>
              </div>
            )}

            {/* Motivation Box */}
            <div className="card bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20">
              <div className="flex items-start gap-4">
                <div className="text-5xl">💎</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Din BJJ-resa</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Varje träning för dig närmare nästa milstolpe. Konsistens är nyckeln till framgång i BJJ!
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{trainings.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Träningar totalt</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{achievedMilestones.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Milstolpar</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {upcomingMilestones.length > 0 ? upcomingMilestones[0].value - trainings.length : 0}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Till nästa</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{completedGoals.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Uppnådda mål</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Skapa Nytt Mål</h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Mål-titel *</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="t.ex. Träna 50 gånger"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Beskrivning</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Beskriv ditt mål..."
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Kategori</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="training">💪 Träning</option>
                    <option value="technique">🥋 Teknik</option>
                    <option value="belt">🎖️ Bälte</option>
                    <option value="competition">🏆 Tävling</option>
                    <option value="streak">🔥 Streak</option>
                    <option value="weight">⚖️ Vikt</option>
                    <option value="other">🎯 Övrigt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Prioritet</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="low">Låg</option>
                    <option value="medium">Medium</option>
                    <option value="high">Hög</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Målvärde *</label>
                  <input
                    type="number"
                    min="1"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({...newGoal, targetValue: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Nuvarande värde</label>
                  <input
                    type="number"
                    min="0"
                    value={newGoal.currentValue}
                    onChange={(e) => setNewGoal({...newGoal, currentValue: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Enhet</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                    placeholder="t.ex. träningar"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Deadline (valfritt)</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 btn-primary"
                >
                  Skapa Mål
                </button>
                <button
                  onClick={() => setShowGoalModal(false)}
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
