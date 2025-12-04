'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { sv } from 'date-fns/locale'

export default function SocialPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('feed')
  const [posts, setPosts] = useState([])
  const [followers, setFollowers] = useState([])
  const [challenges, setChallenges] = useState([])
  const [newPost, setNewPost] = useState({ text: '', type: 'achievement' })
  const [showPostModal, setShowPostModal] = useState(false)

  // Mock current user
  const currentUser = {
    id: 1,
    name: 'Du',
    belt: 'Blue',
    stripes: 2,
    avatar: '🥋',
    followers: 45,
    following: 32
  }

  // Mock users/followers
  const mockUsers = [
    { id: 2, name: 'Marcus Andersson', belt: 'Purple', stripes: 3, avatar: '👤', isFollowing: true, mutualFollowers: 12 },
    { id: 3, name: 'Sara Lindberg', belt: 'Blue', stripes: 4, avatar: '👤', isFollowing: true, mutualFollowers: 8 },
    { id: 4, name: 'Johan Nilsson', belt: 'Brown', stripes: 1, avatar: '👤', isFollowing: false, mutualFollowers: 5 },
    { id: 5, name: 'Erik Svensson', belt: 'Blue', stripes: 2, avatar: '👤', isFollowing: true, mutualFollowers: 15 },
    { id: 6, name: 'Lisa Karlsson', belt: 'Purple', stripes: 0, avatar: '👤', isFollowing: false, mutualFollowers: 3 }
  ]

  // Mock social feed posts
  const mockPosts = [
    {
      id: 1,
      user: mockUsers[0],
      type: 'achievement',
      content: 'Äntligen fått min tredje stripe! 🎉',
      timestamp: new Date('2024-12-03T18:30:00'),
      likes: 23,
      comments: 5,
      isLiked: false,
      stats: { trainings: 150, streak: 12 }
    },
    {
      id: 2,
      user: mockUsers[1],
      type: 'training',
      content: 'Episk träning idag! Fokus på triangle chokes från closed guard 💪',
      timestamp: new Date('2024-12-03T14:20:00'),
      likes: 15,
      comments: 3,
      isLiked: true,
      technique: 'Triangle Choke'
    },
    {
      id: 3,
      user: mockUsers[3],
      type: 'milestone',
      content: '100 träningar klarat! Känner verkligen progressionen 🔥',
      timestamp: new Date('2024-12-02T20:15:00'),
      likes: 42,
      comments: 12,
      isLiked: false,
      milestone: 100
    },
    {
      id: 4,
      user: mockUsers[0],
      type: 'challenge',
      content: 'Utmanar alla till 30-dagars BJJ challenge! Minst 3 träningar per vecka 🥋',
      timestamp: new Date('2024-12-01T16:00:00'),
      likes: 31,
      comments: 8,
      isLiked: true,
      challenge: '30-Day BJJ Challenge'
    },
    {
      id: 5,
      user: mockUsers[2],
      type: 'competition',
      content: 'Bronsnedal på dagens turnering! Stolt över min prestation 🥉',
      timestamp: new Date('2024-11-30T19:45:00'),
      likes: 56,
      comments: 18,
      isLiked: false,
      competition: 'Stockholm Open 2024'
    }
  ]

  // Mock challenges
  const mockChallenges = [
    {
      id: 1,
      title: '30-Day BJJ Challenge',
      description: 'Träna minst 3 gånger per vecka i 30 dagar',
      creator: mockUsers[0],
      participants: 24,
      daysLeft: 15,
      progress: 50,
      isJoined: true
    },
    {
      id: 2,
      title: '100 Armbars Challenge',
      description: 'Träna 100 armbars under december månad',
      creator: mockUsers[1],
      participants: 18,
      daysLeft: 27,
      progress: 23,
      isJoined: false
    },
    {
      id: 3,
      title: 'Weekly Sparring Streak',
      description: 'Sparra minst en gång varje vecka',
      creator: mockUsers[3],
      participants: 32,
      daysLeft: 4,
      progress: 75,
      isJoined: true
    }
  ]

  useEffect(() => {
    setPosts(mockPosts)
    setFollowers(mockUsers)
    setChallenges(mockChallenges)
  }, [])

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ))
    toast.success(posts.find(p => p.id === postId).isLiked ? 'Like borttagen' : 'Gillad!')
  }

  const handleFollowUser = (userId) => {
    setFollowers(followers.map(user =>
      user.id === userId
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ))
    const user = followers.find(u => u.id === userId)
    toast.success(user.isFollowing ? `Du följer inte längre ${user.name}` : `Du följer nu ${user.name}`)
  }

  const handleJoinChallenge = (challengeId) => {
    setChallenges(challenges.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, isJoined: !challenge.isJoined, participants: challenge.isJoined ? challenge.participants - 1 : challenge.participants + 1 }
        : challenge
    ))
    const challenge = challenges.find(c => c.id === challengeId)
    toast.success(challenge.isJoined ? 'Lämnade challenge' : 'Gick med i challenge!')
  }

  const handleCreatePost = () => {
    if (!newPost.text.trim()) {
      toast.error('Skriv något i ditt inlägg')
      return
    }

    const post = {
      id: Date.now(),
      user: currentUser,
      type: newPost.type,
      content: newPost.text,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false
    }

    setPosts([post, ...posts])
    setNewPost({ text: '', type: 'achievement' })
    setShowPostModal(false)
    toast.success('Inlägg publicerat!')
  }

  const getBeltEmoji = (belt) => {
    const emojis = { White: '⚪', Blue: '🔵', Purple: '🟣', Brown: '🟤', Black: '⚫' }
    return emojis[belt] || '⚪'
  }

  const getPostIcon = (type) => {
    const icons = {
      achievement: '🏆',
      training: '💪',
      milestone: '🎯',
      challenge: '⚔️',
      competition: '🥋'
    }
    return icons[type] || '📝'
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">BJJ Community</h1>
          <button
            onClick={() => setShowPostModal(true)}
            className="btn-primary"
          >
            + Nytt Inlägg
          </button>
        </div>

        {/* Profile Overview */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{currentUser.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span>{getBeltEmoji(currentUser.belt)} {currentUser.belt} Belt</span>
                  <span>•</span>
                  <span>{currentUser.stripes} Stripes</span>
                </div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-bjj-primary">{currentUser.followers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Följare</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-bjj-accent">{currentUser.following}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Följer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('feed')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'feed'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            📰 Feed
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'followers'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            👥 Följare & Community
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'challenges'
                ? 'text-bjj-primary border-b-2 border-bjj-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            ⚔️ Challenges
          </button>
        </div>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{post.user.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold">{post.user.name}</h3>
                      <span className="text-sm text-gray-500">
                        {getBeltEmoji(post.user.belt)} {post.user.belt}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {format(post.timestamp, 'PPp', { locale: sv })}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm mb-2">
                        {getPostIcon(post.type)} {post.type}
                      </span>
                      <p className="text-lg">{post.content}</p>
                    </div>

                    {post.stats && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                        <div className="flex gap-4 text-sm">
                          <span>🎯 {post.stats.trainings} träningar</span>
                          <span>🔥 {post.stats.streak} dagar streak</span>
                        </div>
                      </div>
                    )}

                    {post.milestone && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mb-3">
                        <div className="text-sm font-semibold">
                          🎯 Milstolpe: {post.milestone} träningar
                        </div>
                      </div>
                    )}

                    {post.challenge && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg mb-3">
                        <div className="text-sm font-semibold">
                          ⚔️ Challenge: {post.challenge}
                        </div>
                      </div>
                    )}

                    {post.competition && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-3">
                        <div className="text-sm font-semibold">
                          🏆 Tävling: {post.competition}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-6 text-gray-600 dark:text-gray-400">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-2 hover:text-red-500 transition-colors ${
                          post.isLiked ? 'text-red-500 font-semibold' : ''
                        }`}
                      >
                        {post.isLiked ? '❤️' : '🤍'} {post.likes}
                      </button>
                      <button className="flex items-center gap-2 hover:text-bjj-primary transition-colors">
                        💬 {post.comments}
                      </button>
                      <button className="flex items-center gap-2 hover:text-bjj-accent transition-colors">
                        🔄 Dela
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Followers Tab */}
        {activeTab === 'followers' && (
          <div className="grid md:grid-cols-2 gap-6">
            {followers.map(user => (
              <div key={user.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{user.avatar}</div>
                    <div>
                      <h3 className="font-bold text-lg">{user.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{getBeltEmoji(user.belt)} {user.belt} Belt</span>
                        <span>•</span>
                        <span>{user.stripes} stripes</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {user.mutualFollowers} gemensamma följare
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowUser(user.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      user.isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-bjj-primary text-white hover:bg-bjj-primary/90'
                    }`}
                  >
                    {user.isFollowing ? 'Följer' : 'Följ'}
                  </button>
                </div>
              </div>
            ))}

            <div className="card bg-gradient-to-r from-bjj-primary/10 to-bjj-accent/10 border-2 border-dashed border-bjj-primary/30">
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-bold text-lg mb-2">Hitta fler BJJ-utövare</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Anslut med din BJJ-community
                </p>
                <button className="btn-primary">
                  Sök efter användare
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {challenges.map(challenge => (
              <div key={challenge.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Skapad av {challenge.creator.name}</span>
                      <span>•</span>
                      <span>👥 {challenge.participants} deltagare</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      challenge.isJoined
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        : 'bg-bjj-primary text-white hover:bg-bjj-primary/90'
                    }`}
                  >
                    {challenge.isJoined ? '✓ Deltar' : 'Gå med'}
                  </button>
                </div>

                {challenge.isJoined && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Din progress</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {challenge.daysLeft} dagar kvar
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                      <div
                        className="bg-gradient-to-r from-bjj-primary to-bjj-accent h-3 rounded-full transition-all duration-500"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                    <div className="text-right text-sm font-semibold text-bjj-primary">
                      {challenge.progress}% klart
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="card bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-dashed border-orange-500/30">
              <div className="text-center py-8">
                <div className="text-5xl mb-4">⚔️</div>
                <h3 className="font-bold text-lg mb-2">Skapa din egen Challenge</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Utmana community och väx tillsammans
                </p>
                <button className="btn-primary">
                  + Skapa Challenge
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Skapa inlägg</h2>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Typ av inlägg</label>
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="achievement">🏆 Prestation</option>
                  <option value="training">💪 Träning</option>
                  <option value="milestone">🎯 Milstolpe</option>
                  <option value="challenge">⚔️ Challenge</option>
                  <option value="competition">🥋 Tävling</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Vad vill du dela?</label>
                <textarea
                  value={newPost.text}
                  onChange={(e) => setNewPost({...newPost, text: e.target.value})}
                  placeholder="Dela din BJJ-resa med communityn..."
                  rows="6"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreatePost}
                  className="flex-1 btn-primary"
                >
                  Publicera
                </button>
                <button
                  onClick={() => setShowPostModal(false)}
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
