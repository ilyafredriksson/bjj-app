'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { getTrainings } from '@/lib/api'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

export default function SparringStatsPage() {
  const router = useRouter()
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock sparring data (skulle komma från Training notes i framtiden)
  const [sparringData] = useState([
    { date: '2024-12-01', partner: 'Marcus', result: 'win', submission: 'Armbar', position: 'top', rounds: 3 },
    { date: '2024-11-28', partner: 'Sara', result: 'loss', submission: 'Triangle', position: 'bottom', rounds: 2 },
    { date: '2024-11-25', partner: 'Johan', result: 'win', submission: 'RNC', position: 'top', rounds: 4 },
    { date: '2024-11-22', partner: 'Erik', result: 'draw', submission: null, position: 'guard', rounds: 3 },
    { date: '2024-11-20', partner: 'Marcus', result: 'loss', submission: 'Kimura', position: 'bottom', rounds: 2 },
    { date: '2024-11-15', partner: 'Lisa', result: 'win', submission: 'Guillotine', position: 'top', rounds: 3 },
    { date: '2024-11-10', partner: 'Sara', result: 'win', submission: 'Armbar', position: 'guard', rounds: 2 },
    { date: '2024-11-05', partner: 'Johan', result: 'draw', submission: null, position: 'top', rounds: 4 },
  ])

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    try {
      const data = await getTrainings()
      setTrainings(data.filter(t => t.type === 'Sparring'))
    } catch (error) {
      toast.error('Kunde inte ladda träningar')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getWinLossRatio = () => {
    const wins = sparringData.filter(s => s.result === 'win').length
    const losses = sparringData.filter(s => s.result === 'loss').length
    const draws = sparringData.filter(s => s.result === 'draw').length
    return { wins, losses, draws, total: sparringData.length }
  }

  const getSubmissionStats = () => {
    const submissions = {}
    sparringData.forEach(s => {
      if (s.submission && s.result === 'win') {
        submissions[s.submission] = (submissions[s.submission] || 0) + 1
      }
    })
    return Object.entries(submissions).sort((a, b) => b[1] - a[1])
  }

  const getPartnerStats = () => {
    const partners = {}
    sparringData.forEach(s => {
      if (!partners[s.partner]) {
        partners[s.partner] = { wins: 0, losses: 0, draws: 0, total: 0 }
      }
      partners[s.partner].total++
      if (s.result === 'win') partners[s.partner].wins++
      else if (s.result === 'loss') partners[s.partner].losses++
      else partners[s.partner].draws++
    })
    return Object.entries(partners)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.total - a.total)
  }

  const getPositionStats = () => {
    const positions = {}
    sparringData.forEach(s => {
      positions[s.position] = (positions[s.position] || 0) + 1
    })
    return positions
  }

  const stats = getWinLossRatio()
  const submissionStats = getSubmissionStats()
  const partnerStats = getPartnerStats()
  const positionStats = getPositionStats()

  const winRate = stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(1) : 0

  // Chart data
  const winLossChartData = {
    labels: ['Vinster', 'Förluster', 'Oavgjort'],
    datasets: [{
      data: [stats.wins, stats.losses, stats.draws],
      backgroundColor: ['#22c55e', '#ef4444', '#6b7280'],
      borderColor: ['#16a34a', '#dc2626', '#4b5563'],
      borderWidth: 2
    }]
  }

  const positionChartData = {
    labels: Object.keys(positionStats),
    datasets: [{
      label: 'Antal matcher',
      data: Object.values(positionStats),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'],
      borderColor: ['#2563eb', '#7c3aed', '#d97706', '#db2777'],
      borderWidth: 2
    }]
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Sparring Statistik</h1>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-2">🤼</div>
            <div className="text-3xl font-bold text-bjj-primary mb-1">
              {stats.total}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Totalt sparringar
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.wins}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Vinster
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">❌</div>
            <div className="text-3xl font-bold text-red-600 mb-1">
              {stats.losses}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Förluster
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-bjj-accent mb-1">
              {winRate}%
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Win rate
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Win/Loss Chart */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Win/Loss fördelning</h3>
            <div className="max-w-xs mx-auto">
              <Doughnut 
                data={winLossChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>

          {/* Position Chart */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Positioner</h3>
            <Bar 
              data={positionChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Submissions */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Favorit Submissions</h3>
            {submissionStats.length > 0 ? (
              <div className="space-y-3">
                {submissionStats.map(([submission, count], index) => (
                  <div 
                    key={submission}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-bjj-primary">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{submission}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Lyckade submissions
                        </p>
                      </div>
                    </div>
                    <div className="bg-bjj-accent text-white px-4 py-2 rounded-full font-bold">
                      {count}x
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Ingen submission-data än
              </p>
            )}
          </div>

          {/* Sparring Partners Leaderboard */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Sparring Partners</h3>
            <div className="space-y-3">
              {partnerStats.map((partner, index) => {
                const partnerWinRate = ((partner.wins / partner.total) * 100).toFixed(0)
                return (
                  <div 
                    key={partner.name}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤'}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{partner.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {partner.total} matcher totalt
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-bjj-primary">
                          {partnerWinRate}%
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          win rate
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600 dark:text-green-400">
                        ✅ {partner.wins}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        ❌ {partner.losses}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ⚖️ {partner.draws}
                      </span>
                    </div>

                    {/* Win rate bar */}
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${partnerWinRate}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Sparring Sessions */}
        <div className="card mt-8">
          <h3 className="text-xl font-bold mb-4">Senaste Sparringar</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Datum</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Partner</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Resultat</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Submission</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rounds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sparringData.slice(0, 10).map((session, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm">{session.date}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{session.partner}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        session.result === 'win' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : session.result === 'loss'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {session.result === 'win' ? 'Vinst' : session.result === 'loss' ? 'Förlust' : 'Oavgjort'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {session.submission || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">{session.position}</td>
                    <td className="px-4 py-3 text-sm">{session.rounds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 Tips</h3>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Detta är exempel-data. I framtiden kommer detta att synkroniseras med dina träningsloggar. 
            Lägg till "Sparring partner" och "Resultat" i dina träningsanteckningar för att spåra din progress!
          </p>
        </div>
      </main>
    </div>
  )
}
