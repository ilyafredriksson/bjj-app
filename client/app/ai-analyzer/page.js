'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import toast from 'react-hot-toast'

export default function AIAnalyzerPage() {
  const router = useRouter()
  const [situation, setSituation] = useState({
    position: 'closed-guard',
    role: 'bottom',
    opponent: 'aggressive',
    goal: 'submit',
    beltLevel: 'blue'
  })
  const [analyzing, setAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState(null)

  const positions = [
    { value: 'closed-guard', label: 'Closed Guard' },
    { value: 'open-guard', label: 'Open Guard' },
    { value: 'half-guard', label: 'Half Guard' },
    { value: 'side-control', label: 'Side Control' },
    { value: 'mount', label: 'Mount' },
    { value: 'back-control', label: 'Back Control' },
    { value: 'turtle', label: 'Turtle' },
    { value: 'standing', label: 'Standing' }
  ]

  const roles = [
    { value: 'top', label: 'Top (Överläge)' },
    { value: 'bottom', label: 'Bottom (Underläge)' }
  ]

  const opponents = [
    { value: 'aggressive', label: 'Aggressiv' },
    { value: 'defensive', label: 'Defensiv' },
    { value: 'bigger', label: 'Större/Starkare' },
    { value: 'faster', label: 'Snabbare/Smidigare' },
    { value: 'technical', label: 'Teknisk' }
  ]

  const goals = [
    { value: 'submit', label: 'Submission' },
    { value: 'sweep', label: 'Sweep' },
    { value: 'escape', label: 'Escape' },
    { value: 'pass', label: 'Pass Guard' },
    { value: 'control', label: 'Kontroll' }
  ]

  const belts = [
    { value: 'white', label: 'White Belt' },
    { value: 'blue', label: 'Blue Belt' },
    { value: 'purple', label: 'Purple Belt' },
    { value: 'brown', label: 'Brown Belt' },
    { value: 'black', label: 'Black Belt' }
  ]

  // Mock AI analysis logic
  const techniqueDatabase = {
    'closed-guard-bottom-submit': [
      {
        name: 'Triangle Choke',
        difficulty: 'Medium',
        success: 85,
        steps: [
          'Få armkontroll på en arm',
          'Lyft höfterna och sväng benet över',
          'Ankel bakom knä för att låsa',
          'Dra ner huvudet och pressa höfterna upp'
        ],
        counters: ['Posture up kraftigt', 'Vinkla ut', 'Slam (ej tillåtet i träning)'],
        videoUrl: '/videos/triangle-choke'
      },
      {
        name: 'Armbar from Guard',
        difficulty: 'Medium',
        success: 80,
        steps: [
          'Håll armen tight mot din kropp',
          'Sväng upp benet över ansiktet',
          'Pinca knäna och höft upp',
          'Håll tummen uppåt och sträck'
        ],
        counters: ['Grip händerna', 'Stack', 'Rulla över'],
        videoUrl: '/videos/armbar-guard'
      },
      {
        name: 'Kimura from Guard',
        difficulty: 'Hard',
        success: 70,
        steps: [
          'Fånga handleden med figurefour-grip',
          'Håll armbågen nära kroppen',
          'Rotera upp och bakåt',
          'Kontrollera ryggen om motståndaren vänder'
        ],
        counters: ['Lås upp greppet', 'Rulla in mot greppet'],
        videoUrl: '/videos/kimura-guard'
      }
    ],
    'closed-guard-bottom-sweep': [
      {
        name: 'Scissor Sweep',
        difficulty: 'Easy',
        success: 90,
        steps: [
          'Få grepp i ärm och krage',
          'Placera ena foten på höften',
          'Andra benet bakom knäet',
          'Saxrörelse och vrid'
        ],
        counters: ['Base ut med benet', 'Hoppa över'],
        videoUrl: '/videos/scissor-sweep'
      },
      {
        name: 'Hip Bump Sweep',
        difficulty: 'Easy',
        success: 85,
        steps: [
          'Sitt upp och få kontroll på armen',
          'Fäst huvudet på axeln',
          'Bumpa höften och sveep',
          'Följ till mount'
        ],
        counters: ['Base bakåt', 'Tripod position'],
        videoUrl: '/videos/hip-bump'
      }
    ],
    'mount-top-submit': [
      {
        name: 'Armbar from Mount',
        difficulty: 'Medium',
        success: 88,
        steps: [
          'Högt mount, knän under armhålorna',
          'Isolera armen',
          'Sväng benet över huvudet',
          'Fall bakåt och sträck'
        ],
        counters: ['Grip händerna', 'Bro och rulla'],
        videoUrl: '/videos/armbar-mount'
      },
      {
        name: 'Americana from Mount',
        difficulty: 'Easy',
        success: 82,
        steps: [
          'Håll ner handleden mot mattan',
          'Figurefour-grip',
          'Rotera armen upp mot huvudet',
          'Håll skuldrorna nedåt'
        ],
        counters: ['Dra in armen', 'Bro kraftigt'],
        videoUrl: '/videos/americana'
      },
      {
        name: 'Ezekiel Choke',
        difficulty: 'Medium',
        success: 75,
        steps: [
          'För ena armen under nacken',
          'Grip din egen ärm',
          'Pressa underarmen mot halsen',
          'Dra andra armen bakåt'
        ],
        counters: ['Tuck hakan', 'Bro och escape'],
        videoUrl: '/videos/ezekiel'
      }
    ],
    'side-control-top-submit': [
      {
        name: 'Americana from Side Control',
        difficulty: 'Easy',
        success: 85,
        steps: [
          'Isolera armen på mattan',
          'Figurefour-grip på handleden',
          'Håll kroppen tung på bröstet',
          'Rotera armen upp och mot huvudet'
        ],
        counters: ['Gripa händerna', 'Bridge och shrimp'],
        videoUrl: '/videos/americana-side'
      },
      {
        name: 'Kimura from Side Control',
        difficulty: 'Medium',
        success: 80,
        steps: [
          'Fånga armen under din armhåla',
          'Figurefour-grip',
          'Lift armbågen uppåt',
          'Rotera bakåt'
        ],
        counters: ['Rulla in mot greppet', 'Låsning av händer'],
        videoUrl: '/videos/kimura-side'
      }
    ],
    'back-control-top-submit': [
      {
        name: 'Rear Naked Choke',
        difficulty: 'Medium',
        success: 95,
        steps: [
          'För armen under hakan',
          'Gripa bicepsen på andra armen',
          'Andra handen bakom huvudet',
          'Squeeze och expandera bröstet'
        ],
        counters: ['Tuck hakan', 'Dra ner armbågen', 'Escape höfterna'],
        videoUrl: '/videos/rnc'
      },
      {
        name: 'Bow and Arrow Choke',
        difficulty: 'Hard',
        success: 85,
        steps: [
          'Grip kragen djupt',
          'Grip byxbenet',
          'Sträck ut som en båge',
          'Dra kragen över halsen'
        ],
        counters: ['Tuck hakan', 'Hand in choke'],
        videoUrl: '/videos/bow-arrow'
      }
    ]
  }

  const handleAnalyze = () => {
    setAnalyzing(true)
    
    // Simulate AI processing
    setTimeout(() => {
      const key = `${situation.position}-${situation.role}-${situation.goal}`
      let techniques = techniqueDatabase[key] || []
      
      // Default fallback techniques if no exact match
      if (techniques.length === 0) {
        techniques = [
          {
            name: 'Grundläggande Position Control',
            difficulty: 'Easy',
            success: 75,
            steps: [
              'Fokusera på att behålla positionen',
              'Kontrollera motståndaren\'s händer',
              'Håll tyngden balanserad',
              'Leta efter öppningar'
            ],
            counters: ['Varna för counter-attacks', 'Behåll base'],
            videoUrl: null
          }
        ]
      }

      // Filter based on belt level
      const filteredTechniques = techniques.filter(t => {
        if (situation.beltLevel === 'white') return t.difficulty === 'Easy'
        if (situation.beltLevel === 'blue') return t.difficulty !== 'Hard'
        return true
      })

      const result = {
        techniques: filteredTechniques.length > 0 ? filteredTechniques : techniques,
        position: positions.find(p => p.value === situation.position)?.label,
        analysis: generateAnalysis(),
        tips: generateTips()
      }

      setSuggestions(result)
      setAnalyzing(false)
      toast.success('Analys klar!')
    }, 2000)
  }

  const generateAnalysis = () => {
    const analyses = {
      'closed-guard': 'Closed guard är en stark defensiv position med många möjligheter för sweeps och submissions. Håll alltid din guard tight och leta efter arm-kontroler.',
      'mount': 'Mount är en av de mest dominanta positionerna i BJJ. Fokusera på att behålla höft-kontroll och håll din base bred.',
      'side-control': 'Side control ger utmärkta möjligheter för både kontroll och submissions. Viktigt att hålla kroppen tung och hindra shrimping.',
      'back-control': 'Ryggkontroll är den mest dominanta positionen. Fokusera på att hålla hooks in och sök efter collar grip för chokes.'
    }
    return analyses[situation.position] || 'Analysera situationen noggrant och planera ditt nästa drag.'
  }

  const generateTips = () => {
    const allTips = [
      '💡 Timing är viktigare än kraft - vänta på rätt moment',
      '💡 Kontrollera alltid motståndaren\'s posture först',
      '💡 Använd dina höfter - de är din starkaste vapen',
      '💡 Kedjekombinationer: Om en teknik misslyckas, gå till nästa',
      '💡 Fokusera på fundamentals innan avancerade tekniker',
      '💡 Positionering före submission',
      '💡 Håll alltid minst två kontaktpunkter',
      '💡 Var tålmodig - BJJ är ett tänkande spel'
    ]
    
    return allTips.sort(() => Math.random() - 0.5).slice(0, 3)
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return 'text-green-600 bg-green-100 dark:bg-green-900/30'
    if (difficulty === 'Medium') return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
    return 'text-red-600 bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Technique Analyzer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Beskriv din situation och få AI-drivna teknikförslag
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Beskriv situationen</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Position</label>
                <select
                  value={situation.position}
                  onChange={(e) => setSituation({...situation, position: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-lg"
                >
                  {positions.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Din roll</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setSituation({...situation, role: r.value})}
                      className={`py-3 rounded-lg font-semibold transition-colors ${
                        situation.role === r.value
                          ? 'bg-bjj-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Motståndare typ</label>
                <select
                  value={situation.opponent}
                  onChange={(e) => setSituation({...situation, opponent: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {opponents.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Ditt mål</label>
                <select
                  value={situation.goal}
                  onChange={(e) => setSituation({...situation, goal: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {goals.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Din bälte-nivå</label>
                <select
                  value={situation.beltLevel}
                  onChange={(e) => setSituation({...situation, beltLevel: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {belts.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full btn-primary py-4 text-lg font-bold"
              >
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">🔄</span>
                    Analyserar...
                  </span>
                ) : (
                  '🤖 Analysera & Få Förslag'
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!suggestions ? (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">Redo att analysera</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Välj din situation och klicka på "Analysera" för att få AI-drivna teknikförslag
                </p>
              </div>
            ) : (
              <>
                {/* Analysis Box */}
                <div className="card bg-gradient-to-r from-bjj-primary/10 to-bjj-accent/10">
                  <h3 className="font-bold text-lg mb-3">📊 Situations-analys</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Position:</strong> {suggestions.position}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {suggestions.analysis}
                  </p>
                </div>

                {/* Tips */}
                <div className="card bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-bold text-lg mb-3">💡 Pro Tips</h3>
                  <ul className="space-y-2">
                    {suggestions.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Techniques */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xl">Rekommenderade Tekniker</h3>
                  {suggestions.techniques.map((tech, index) => (
                    <div key={index} className="card hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold mb-2">{tech.name}</h4>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tech.difficulty)}`}>
                              {tech.difficulty}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                              {tech.success}% framgång
                            </span>
                          </div>
                        </div>
                        <div className="text-3xl">#{index + 1}</div>
                      </div>

                      <div className="mb-4">
                        <h5 className="font-semibold mb-2 text-sm">Steg för steg:</h5>
                        <ol className="space-y-1">
                          {tech.steps.map((step, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                              <span className="font-bold text-bjj-primary">{i + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-3">
                        <h5 className="font-semibold mb-2 text-sm text-red-800 dark:text-red-400">
                          ⚠️ Vanliga counters att vara medveten om:
                        </h5>
                        <ul className="space-y-1">
                          {tech.counters.map((counter, i) => (
                            <li key={i} className="text-sm text-red-700 dark:text-red-300">
                              • {counter}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {tech.videoUrl && (
                        <button
                          onClick={() => router.push(tech.videoUrl)}
                          className="w-full btn-secondary"
                        >
                          📹 Se Video Tutorial
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 card bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Om AI Technique Analyzer</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Denna AI-analyzer använder en omfattande databas av BJJ-tekniker och situationsanalys 
                för att ge dig de bästa teknikförslagen baserat på din specifika situation.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 Tips: Kombinera AI-förslagen med praktisk träning och vägledning från din instruktör 
                för bästa resultat. AI:n lär sig kontinuerligt från tusentals BJJ-matcher och tekniker.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
