export function BlogHero() {
  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b">
      <div className="container-app py-12 lg:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Medical Math Mastery Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Expert tips, practice strategies, and in-depth guides to help you excel at medical calculations. 
            Learn from experienced nurses and educators.
          </p>
          
          {/* Featured Topics */}
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="text-sm text-gray-600">Popular topics:</span>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-primary-700 shadow-sm">
              Dosage Calculations
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-primary-700 shadow-sm">
              IV Drip Rates
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-primary-700 shadow-sm">
              Unit Conversions
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-primary-700 shadow-sm">
              Study Tips
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}