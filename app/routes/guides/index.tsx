import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { GuideCard } from '../../components/guides/GuideCard'
import { GuidesSidebar } from '../../components/guides/GuidesSidebar'
import { GuidesHero } from '../../components/guides/GuidesHero'

export const Route = createFileRoute('/guides/')({
  component: GuidesIndexPage,
})

interface Guide {
  id: string
  slug: string
  title: string
  description: string
  featuredImage?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  readingTime: number
  viewCount: number
  category: {
    id: string
    name: string
    slug: string
    icon?: string
  }
  concepts: Array<{
    id: string
    name: string
    slug: string
  }>
}

function GuidesIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch guides
  const { data, isLoading, error } = useQuery({
    queryKey: ['guides', selectedCategory, selectedDifficulty, selectedConcept, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty)
      if (selectedConcept) params.append('concept', selectedConcept)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/guides?${params}`)
      if (!response.ok) throw new Error('Failed to fetch guides')
      return response.json()
    },
  })

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    setSelectedConcept(null)
    
  }

  const handleDifficultySelect = (difficulty: string | null) => {
    setSelectedDifficulty(difficulty)
    
  }

  const handleConceptSelect = (conceptSlug: string | null) => {
    setSelectedConcept(conceptSlug)
    setSelectedCategory(null)
    
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
  }

  return (
    <div className="container-app py-4 sm:py-6 lg:py-8">
      <div className="min-h-screen bg-gray-50">
      <GuidesHero />
      
      <div className="container-app py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {(selectedCategory || selectedDifficulty || selectedConcept || searchQuery) && (
              <div className="mb-6 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Filtering by:</span>
                {selectedCategory && (
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
                  >
                    {selectedCategory}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {selectedDifficulty && (
                  <button
                    onClick={() => handleDifficultySelect(null)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors"
                  >
                    {selectedDifficulty}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {selectedConcept && (
                  <button
                    onClick={() => handleConceptSelect(null)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    {selectedConcept}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    "{searchQuery}"
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-64"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading guides. Please try again.</p>
              </div>
            )}

            {/* Guides Grid */}
            {data && (
              <>
                {data.guides.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No guides found matching your criteria.</p>
                    <button
                      onClick={() => {
                        handleCategorySelect(null)
                        handleDifficultySelect(null)
                        handleConceptSelect(null)
                        handleSearch('')
                      }}
                      className="mt-4 text-primary-600 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.guides.map((guide: Guide) => (
                      <GuideCard key={guide.id} guide={guide} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <GuidesSidebar
              onCategorySelect={handleCategorySelect}
              onDifficultySelect={handleDifficultySelect}
              onConceptSelect={handleConceptSelect}
              onSearch={handleSearch}
              selectedCategory={selectedCategory}
              selectedDifficulty={selectedDifficulty}
              selectedConcept={selectedConcept}
            />
          </aside>
        </div>
        </div>
      </div>
    </div>
  )
}