'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'

export default function VideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    category: 'Guard',
    belt: 'White',
    notes: ''
  })

  // Mock video library
  const initialVideos = [
    {
      id: 1,
      title: 'Basic Closed Guard Techniques',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Guard',
      belt: 'White',
      instructor: 'Roger Gracie',
      duration: '12:34',
      views: 0,
      notes: 'Fundamentals för closed guard positioner',
      addedDate: '2024-12-01'
    },
    {
      id: 2,
      title: 'Armbar from Mount Step by Step',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Submissions',
      belt: 'Blue',
      instructor: 'Bernardo Faria',
      duration: '8:45',
      views: 0,
      notes: 'Detaljerad genomgång av armbar från mount',
      addedDate: '2024-11-28'
    },
    {
      id: 3,
      title: 'Triangle Choke Masterclass',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Submissions',
      belt: 'Blue',
      instructor: 'John Danaher',
      duration: '15:22',
      views: 0,
      notes: 'Komplett guide till triangle choke',
      addedDate: '2024-11-25'
    },
    {
      id: 4,
      title: 'Passing the Guard - Fundamentals',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Passes',
      belt: 'White',
      instructor: 'Gordon Ryan',
      duration: '10:15',
      views: 0,
      notes: 'Grundläggande guard passing tekniker',
      addedDate: '2024-11-20'
    },
    {
      id: 5,
      title: 'Advanced Sweep Techniques',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Sweeps',
      belt: 'Purple',
      instructor: 'Marcus Almeida',
      duration: '14:30',
      views: 0,
      notes: 'Avancerade sweeps från olika guards',
      addedDate: '2024-11-15'
    },
    {
      id: 6,
      title: 'Back Take Strategies',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Positions',
      belt: 'Blue',
      instructor: 'André Galvão',
      duration: '11:20',
      views: 0,
      notes: 'Strategier för att ta ryggen',
      addedDate: '2024-11-10'
    }
  ]

  useEffect(() => {
    // Load videos from localStorage or use initial
    const savedVideos = localStorage.getItem('bjj-videos')
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos))
    } else {
      setVideos(initialVideos)
      localStorage.setItem('bjj-videos', JSON.stringify(initialVideos))
    }
  }, [])

  useEffect(() => {
    let filtered = videos

    if (filterCategory !== 'all') {
      filtered = filtered.filter(v => v.category === filterCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.notes.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredVideos(filtered)
  }, [videos, filterCategory, searchTerm])

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.url) {
      toast.error('Titel och URL krävs')
      return
    }

    // Extract YouTube video ID if it's a full URL
    let embedUrl = newVideo.url
    if (newVideo.url.includes('youtube.com') || newVideo.url.includes('youtu.be')) {
      const videoId = extractYouTubeId(newVideo.url)
      embedUrl = `https://www.youtube.com/embed/${videoId}`
    }

    const video = {
      id: Date.now(),
      ...newVideo,
      url: embedUrl,
      views: 0,
      addedDate: new Date().toISOString().split('T')[0],
      duration: '0:00'
    }

    const updatedVideos = [...videos, video]
    setVideos(updatedVideos)
    localStorage.setItem('bjj-videos', JSON.stringify(updatedVideos))

    setNewVideo({
      title: '',
      url: '',
      category: 'Guard',
      belt: 'White',
      notes: ''
    })
    setShowAddModal(false)
    toast.success('Video tillagd!')
  }

  const extractYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : url
  }

  const handleViewVideo = (video) => {
    const updatedVideos = videos.map(v => 
      v.id === video.id ? { ...v, views: v.views + 1 } : v
    )
    setVideos(updatedVideos)
    localStorage.setItem('bjj-videos', JSON.stringify(updatedVideos))
    setSelectedVideo(video)
  }

  const handleDeleteVideo = (videoId) => {
    if (confirm('Är du säker på att du vill ta bort denna video?')) {
      const updatedVideos = videos.filter(v => v.id !== videoId)
      setVideos(updatedVideos)
      localStorage.setItem('bjj-videos', JSON.stringify(updatedVideos))
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(null)
      }
      toast.success('Video borttagen')
    }
  }

  const categories = ['all', 'Guard', 'Submissions', 'Passes', 'Sweeps', 'Positions', 'Takedowns', 'Escapes']

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teknik Videos</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            + Lägg till Video
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-2">📹</div>
            <div className="text-3xl font-bold text-bjj-primary mb-1">
              {videos.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Totalt videos
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">👁️</div>
            <div className="text-3xl font-bold text-bjj-accent mb-1">
              {videos.reduce((sum, v) => sum + v.views, 0)}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Totalt visningar
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-bjj-secondary mb-1">
              {new Set(videos.map(v => v.category)).size}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Kategorier
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {videos.length > 0 ? Math.max(...videos.map(v => v.views)) : 0}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Mest sedda
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Sök videos, instruktör eller teknik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    filterCategory === cat
                      ? 'bg-bjj-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat === 'all' ? 'Alla' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Player */}
        {selectedVideo && (
          <div className="card mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedVideo.instructor} • {selectedVideo.category} • {selectedVideo.belt} Belt
                </p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo.url}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Anteckningar:</h3>
              <p className="text-gray-700 dark:text-gray-300">{selectedVideo.notes || 'Inga anteckningar'}</p>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div key={video.id} className="card hover:shadow-lg transition-shadow">
              <div 
                className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 cursor-pointer overflow-hidden relative group"
                onClick={() => handleViewVideo(video)}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors">
                  <div className="text-6xl">▶️</div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-bjj-primary/10 text-bjj-primary rounded text-xs font-semibold">
                  {video.category}
                </span>
                <span className="px-2 py-1 bg-bjj-accent/10 text-bjj-accent rounded text-xs font-semibold">
                  {video.belt} Belt
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                👤 {video.instructor}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>👁️ {video.views} visningar</span>
                <span>📅 {video.addedDate}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewVideo(video)}
                  className="flex-1 btn-primary text-sm py-2"
                >
                  Spela upp
                </button>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold mb-2">Inga videos hittades</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterCategory !== 'all' 
                ? 'Prova att ändra filter eller sök' 
                : 'Lägg till din första video!'}
            </p>
          </div>
        )}
      </main>

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Lägg till Video</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Titel *</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                  placeholder="t.ex. Triangle Choke from Guard"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">YouTube URL *</label>
                <input
                  type="text"
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Klistra in YouTube-länken här
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Kategori</label>
                  <select
                    value={newVideo.category}
                    onChange={(e) => setNewVideo({...newVideo, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Bälte Nivå</label>
                  <select
                    value={newVideo.belt}
                    onChange={(e) => setNewVideo({...newVideo, belt: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="White">White</option>
                    <option value="Blue">Blue</option>
                    <option value="Purple">Purple</option>
                    <option value="Brown">Brown</option>
                    <option value="Black">Black</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Anteckningar</label>
                <textarea
                  value={newVideo.notes}
                  onChange={(e) => setNewVideo({...newVideo, notes: e.target.value})}
                  placeholder="Skriv dina anteckningar om tekniken..."
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddVideo}
                  className="flex-1 btn-primary"
                >
                  Lägg till Video
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
