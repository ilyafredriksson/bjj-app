'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTrainings } from '@/lib/api'
import Navigation from '@/components/Navigation'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns'
import { sv } from 'date-fns/locale'

// Registrera Chart.js komponenter
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

export default function StatsPage() {
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30') // 7, 30, 90 dagar

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

  // Filtrera träningar baserat på timeRange
  const filteredTrainings = trainings.filter(t => {
    if (!t.date && !t.createdAt) return true
    const trainingDate = new Date(t.date || t.createdAt)
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange))
    return trainingDate >= daysAgo
  })

  // Beräkna statistik
  const totalTrainings = filteredTrainings.length
  const uniqueInstructors = [...new Set(filteredTrainings.map(t => t.instructor))].length
  const uniqueTechniques = [...new Set(filteredTrainings.map(t => t.technique))].length
  
  // Total träningstid
  const totalDuration = filteredTrainings.reduce((sum, t) => sum + (t.duration || 0), 0)
  const avgDuration = totalTrainings > 0 ? Math.round(totalDuration / totalTrainings) : 0

  // Genomsnittliga ratings
  const avgMood = filteredTrainings.filter(t => t.mood).length > 0
    ? (filteredTrainings.reduce((sum, t) => sum + (t.mood || 0), 0) / filteredTrainings.filter(t => t.mood).length).toFixed(1)
    : 0
  const avgEnergy = filteredTrainings.filter(t => t.energy).length > 0
    ? (filteredTrainings.reduce((sum, t) => sum + (t.energy || 0), 0) / filteredTrainings.filter(t => t.energy).length).toFixed(1)
    : 0

  // Träningar per vecka (senaste 4 veckorna)
  const trainingsPerWeek = () => {
    const weeks = []
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7), { locale: sv })
      const weekEnd = endOfWeek(weekStart, { locale: sv })
      const count = filteredTrainings.filter(t => {
        const date = new Date(t.date || t.createdAt)
        return date >= weekStart && date <= weekEnd
      }).length
      weeks.push({
        label: `V${format(weekStart, 'w', { locale: sv })}`,
        count
      })
    }
    return weeks
  }

  // Träningstyper fördelning
  const typeDistribution = filteredTrainings.reduce((acc, t) => {
    const type = t.type || 'Gi'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  // Topp instruktörer
  const instructorCounts = filteredTrainings.reduce((acc, t) => {
    acc[t.instructor] = (acc[t.instructor] || 0) + 1
    return acc
  }, {})
  const topInstructors = Object.entries(instructorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Topp tekniker
  const techniqueCounts = filteredTrainings.reduce((acc, t) => {
    acc[t.technique] = (acc[t.technique] || 0) + 1
    return acc
  }, {})
  const topTechniques = Object.entries(techniqueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Chart data
  const weeklyChartData = {
    labels: trainingsPerWeek().map(w => w.label),
    datasets: [{
      label: 'Träningar per vecka',
      data: trainingsPerWeek().map(w => w.count),
      backgroundColor: 'rgba(30, 64, 175, 0.8)',
      borderColor: 'rgba(30, 64, 175, 1)',
      borderWidth: 2,
    }]
  }

  const typeChartData = {
    labels: Object.keys(typeDistribution),
    datasets: [{
      data: Object.values(typeDistribution),
      backgroundColor: [
        'rgba(30, 64, 175, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(220, 38, 38, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(99, 102, 241, 0.8)',
      ],
      borderWidth: 2,
    }]
  }

  const moodEnergyChartData = {
    labels: filteredTrainings
      .filter(t => t.date || t.createdAt)
      .slice(-10)
      .map(t => format(new Date(t.date || t.createdAt), 'dd/MM', { locale: sv })),
    datasets: [
      {
        label: 'Humör',
        data: filteredTrainings.slice(-10).map(t => t.mood || 0),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Energi',
        data: filteredTrainings.slice(-10).map(t => t.energy || 0),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
      }
    ]
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
    <div className="min-h-screen">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Din Progression</h1>
          
          {/* Time Range Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-auto"
          >
            <option value="7">Senaste 7 dagarna</option>
            <option value="30">Senaste 30 dagarna</option>
            <option value="90">Senaste 90 dagarna</option>
            <option value="365">Senaste året</option>
          </select>
        </div>

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
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="card text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-3xl font-bold text-bjj-primary mb-1">
                  {totalTrainings}
                </div>
                <p className="text-gray-600 text-sm">Träningar</p>
              </div>

              <div className="card text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-3xl font-bold text-bjj-primary mb-1">
                  {Math.round(totalDuration / 60)}h
                </div>
                <p className="text-gray-600 text-sm">Total tid</p>
                <p className="text-xs text-gray-500 mt-1">Ø {avgDuration} min</p>
              </div>

              <div className="card text-center">
                <div className="text-3xl mb-2">😊</div>
                <div className="text-3xl font-bold text-bjj-primary mb-1">
                  {avgMood}/5
                </div>
                <p className="text-gray-600 text-sm">Genomsnitt humör</p>
              </div>

              <div className="card text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-3xl font-bold text-bjj-primary mb-1">
                  {avgEnergy}/5
                </div>
                <p className="text-gray-600 text-sm">Genomsnitt energi</p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Weekly Training Bar Chart */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Träningar per vecka
                </h2>
                <Bar 
                  data={weeklyChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                      }
                    }
                  }}
                />
              </div>

              {/* Training Type Pie Chart */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Träningstyper
                </h2>
                <div className="max-w-xs mx-auto">
                  <Doughnut 
                    data={typeChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mood & Energy Line Chart */}
            {filteredTrainings.some(t => t.mood || t.energy) && (
              <div className="card mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Humör & Energi över tid
                </h2>
                <Line 
                  data={moodEnergyChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    },
                    scales: {
                      y: {
                        min: 0,
                        max: 5,
                        ticks: { stepSize: 1 }
                      }
                    }
                  }}
                />
              </div>
            )}

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
          </>
        )}
      </main>
    </div>
  )
}
