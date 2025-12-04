import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-bjj-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold">🥋 BJJ Träningsapp</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-bjj-accent transition-colors">
                Hem
              </Link>
              <Link href="/trainings" className="hover:text-bjj-accent transition-colors">
                Träningslogg
              </Link>
              <Link href="/techniques" className="hover:text-bjj-accent transition-colors">
                Teknikbibliotek
              </Link>
              <Link href="/stats" className="hover:text-bjj-accent transition-colors">
                Statistik
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Välkommen till din BJJ Träningsapp
          </h1>
          <p className="text-xl text-gray-600">
            Logga träningar, lär dig tekniker och förbättra din progression
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Link href="/trainings" className="card hover:scale-105 transition-transform">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2">Träningslogg</h2>
            <p className="text-gray-600">
              Dokumentera dina träningspass och sparring-sessioner
            </p>
          </Link>

          <Link href="/techniques" className="card hover:scale-105 transition-transform">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">Teknikbibliotek</h2>
            <p className="text-gray-600">
              Utforska och lär dig nya tekniker inom BJJ
            </p>
          </Link>

          <Link href="/stats" className="card hover:scale-105 transition-transform">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">Statistik</h2>
            <p className="text-gray-600">
              Se din progression och utveckling över tid
            </p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="card max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-4">Snabbåtgärder</h3>
          <div className="space-y-3">
            <Link href="/trainings/new" className="block">
              <button className="btn-primary w-full">
                + Lägg till ny träning
              </button>
            </Link>
            <Link href="/techniques" className="block">
              <button className="btn-secondary w-full">
                Bläddra i tekniker
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 BJJ Träningsapp - Utvecklad för BJJ-utövare</p>
        </div>
      </footer>
    </div>
  )
}
