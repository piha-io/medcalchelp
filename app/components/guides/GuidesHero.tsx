export function GuidesHero() {
  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b">
      <div className="container-app py-12 lg:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            Medical Math Learning Guides
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Comprehensive educational guides for mastering medical calculations. 
            From basic concepts to advanced techniques, learn at your own pace.
          </p>
          
          {/* Featured Topics */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm text-gray-600">Start learning:</span>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-primary-700 shadow-sm">
                📊 Dimensional Analysis
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-primary-700 shadow-sm">
                💊 Dosage Calculations
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-primary-700 shadow-sm">
                💧 IV Flow Rates
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-primary-700 shadow-sm">
                🔄 Unit Conversions
              </span>
            </div>
            
            {/* Difficulty Levels */}
            <div className="mt-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">All levels:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Beginner
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Intermediate
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Advanced
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}