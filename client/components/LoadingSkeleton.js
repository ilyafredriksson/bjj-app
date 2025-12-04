export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'grid') {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className="grid md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card text-center animate-pulse">
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-3"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mx-auto"></div>
          </div>
        ))}
      </div>
    )
  }

  return null
}
