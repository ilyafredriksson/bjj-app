'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { getTrainings } from '@/lib/api'
import Navigation from '@/components/Navigation'
import { format, isSameDay, parseISO, differenceInDays } from 'date-fns'
import { sv } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function CalendarPage() {
  const router = useRouter()
  const [trainings, setTrainings] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    try {
      const data = await getTrainings()
      setTrainings(data)
      calculateStreaks(data)
    } catch (error) {
      toast.error('Kunde inte ladda träningar')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStreaks = (trainingsData) => {
    if (trainingsData.length === 0) {
      setCurrentStreak(0)
      setLongestStreak(0)
      return
    }

    // Sortera träningar efter datum (nyaste först)
    const sortedTrainings = [...trainingsData].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )

    // Beräkna current streak
    let streak = 0
    let checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)

    for (let training of sortedTrainings) {
      const trainingDate = new Date(training.date)
      trainingDate.setHours(0, 0, 0, 0)
      
      const daysDiff = differenceInDays(checkDate, trainingDate)
      
      if (daysDiff === 0 || daysDiff === 1) {
        streak++
        checkDate = trainingDate
      } else {
        break
      }
    }

    setCurrentStreak(streak)

    // Beräkna longest streak
    let maxStreak = 0
    let tempStreak = 1
    
    for (let i = 0; i < sortedTrainings.length - 1; i++) {
      const currentDate = new Date(sortedTrainings[i].date)
      const nextDate = new Date(sortedTrainings[i + 1].date)
      currentDate.setHours(0, 0, 0, 0)
      nextDate.setHours(0, 0, 0, 0)
      
      const daysDiff = differenceInDays(currentDate, nextDate)
      
      if (daysDiff === 1) {
        tempStreak++
      } else {
        maxStreak = Math.max(maxStreak, tempStreak)
        tempStreak = 1
      }
    }
    
    maxStreak = Math.max(maxStreak, tempStreak)
    setLongestStreak(maxStreak)
  }

  const getTrainingsForDate = (date) => {
    return trainings.filter(training => 
      isSameDay(parseISO(training.date), date)
    )
  }

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTrainings = getTrainingsForDate(date)
      
      if (dayTrainings.length > 0) {
        return (
          <div className="flex flex-wrap gap-1 justify-center mt-1">
            {dayTrainings.map((training, idx) => {
              let color = 'bg-gray-400'
              if (training.type === 'Gi') color = 'bg-blue-500'
              else if (training.type === 'No-Gi') color = 'bg-red-500'
              else if (training.type === 'Sparring') color = 'bg-orange-500'
              else if (training.type === 'Drilling') color = 'bg-green-500'
              else if (training.type === 'Open Mat') color = 'bg-purple-500'
              
              return (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full ${color}`}
                  title={training.type}
                />
              )
            })}
          </div>
        )
      }
    }
    return null
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayTrainings = getTrainingsForDate(date)
      if (dayTrainings.length > 0) {
        return 'has-training'
      }
    }
    return null
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const handleAddTraining = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    router.push(`/trainings/new?date=${dateStr}`)
  }

  const selectedDayTrainings = getTrainingsForDate(selectedDate)

  const getTypeColor = (type) => {
    switch(type) {
      case 'Gi': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'No-Gi': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Sparring': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'Drilling': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Open Mat': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Träningskalender</h1>

        {/* Streak Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-bjj-primary mb-1">
              {currentStreak}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Nuvarande streak (dagar)
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-bjj-accent mb-1">
              {longestStreak}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Längsta streak (dagar)
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-bjj-secondary mb-1">
              {trainings.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Totalt träningar
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="card">
              <style jsx global>{`
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                }
                .react-calendar__tile {
                  padding: 1.5em 0.5em;
                  position: relative;
                }
                .react-calendar__tile.has-training {
                  background: rgba(30, 64, 175, 0.05);
                }
                .react-calendar__tile--active {
                  background: #1e40af !important;
                  color: white;
                }
                .react-calendar__tile--now {
                  background: #f59e0b20;
                }
                .react-calendar__navigation button {
                  font-size: 1.2em;
                  font-weight: bold;
                }
                .dark .react-calendar {
                  background: transparent;
                  color: #f3f4f6;
                }
                .dark .react-calendar__tile {
                  color: #f3f4f6;
                }
                .dark .react-calendar__tile--now {
                  background: #f59e0b30;
                }
                .dark .react-calendar__navigation button {
                  color: #f3f4f6;
                }
                .dark .react-calendar__month-view__weekdays {
                  color: #9ca3af;
                }
              `}</style>
              
              <Calendar
                onChange={handleDateClick}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                locale="sv-SE"
              />
            </div>

            {/* Legend */}
            <div className="card mt-4">
              <h3 className="font-semibold mb-3">Färgkodning</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Gi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">No-Gi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Sparring</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">Drilling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Open Mat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Day Details */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h3 className="text-xl font-bold mb-4">
                {format(selectedDate, 'd MMMM yyyy', { locale: sv })}
              </h3>

              {selectedDayTrainings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Ingen träning denna dag
                  </p>
                  <button
                    onClick={handleAddTraining}
                    className="btn-primary w-full"
                  >
                    + Lägg till träning
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {selectedDayTrainings.map((training) => (
                      <div
                        key={training._id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => router.push(`/trainings/${training._id}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{training.technique}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getTypeColor(training.type)}`}>
                            {training.type}
                          </span>
                        </div>
                        
                        {training.instructor && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            👨‍🏫 {training.instructor}
                          </p>
                        )}
                        
                        {training.duration && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ⏱️ {training.duration} min
                          </p>
                        )}

                        {(training.mood || training.energy) && (
                          <div className="flex gap-2 mt-2 text-sm">
                            {training.mood && (
                              <span>😊 {training.mood}/5</span>
                            )}
                            {training.energy && (
                              <span>⚡ {training.energy}/5</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddTraining}
                    className="btn-secondary w-full"
                  >
                    + Lägg till mer träning
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
