import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

interface GuidesSidebarProps {
  onCategorySelect: (slug: string | null) => void
  onConceptSelect: (slug: string | null) => void
  onDifficultySelect: (difficulty: string | null) => void
  onSearch: (query: string) => void
  selectedCategory: string | null
  selectedConcept: string | null
  selectedDifficulty: string | null
}

export function GuidesSidebar({ 
  onCategorySelect, 
  onConceptSelect,
  onDifficultySelect,
  onSearch,
  selectedCategory,
  selectedConcept,
  selectedDifficulty
}: GuidesSidebarProps) {
  const [searchInput, setSearchInput] = useState('')

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['guide-categories'],
    queryFn: async () => {
      const response = await fetch('/api/guides/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      return response.json()
    },
  })

  // Fetch concepts
  const { data: conceptsData } = useQuery({
    queryKey: ['guide-concepts'],
    queryFn: async () => {
      const response = await fetch('/api/guides/concepts')
      if (!response.ok) throw new Error('Failed to fetch concepts')
      return response.json()
    },
  })

  // Fetch recent guides
  const { data: recentGuidesData } = useQuery({
    queryKey: ['guides-recent'],
    queryFn: async () => {
      const response = await fetch('/api/guides/recent')
      if (!response.ok) throw new Error('Failed to fetch recent guides')
      return response.json()
    },
  })

  // Fetch popular guides
  const { data: popularGuidesData } = useQuery({
    queryKey: ['guides-popular'],
    queryFn: async () => {
      const response = await fetch('/api/guides/popular')
      if (!response.ok) throw new Error('Failed to fetch popular guides')
      return response.json()
    },
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchInput)
  }

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search guides..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      {categoriesData && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
          <ul className="space-y-2">
            {categoriesData.categories.map((category: any) => (
              <li key={category.id}>
                <button
                  onClick={() => onCategorySelect(category.slug === selectedCategory ? null : category.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === category.slug
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">
                    {category._count.guides}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Difficulty Levels */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Difficulty</h3>
        <div className="space-y-2">
          {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => onDifficultySelect(difficulty === selectedDifficulty ? null : difficulty)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedDifficulty === difficulty
                  ? 'bg-primary-50 text-primary-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="capitalize">{difficulty.toLowerCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Key Concepts */}
      {conceptsData && conceptsData.concepts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Key Concepts</h3>
          <div className="flex flex-wrap gap-2">
            {conceptsData.concepts.slice(0, 10).map((concept: any) => (
              <button
                key={concept.id}
                onClick={() => onConceptSelect(concept.slug === selectedConcept ? null : concept.slug)}
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedConcept === concept.slug
                    ? 'bg-accent-100 text-accent-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {concept.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Guides */}
      {recentGuidesData && recentGuidesData.guides.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Guides</h3>
          <ul className="space-y-3">
            {recentGuidesData.guides.map((guide: any) => (
              <li key={guide.id}>
                <Link
                  to="/guides/$slug"
                  params={{ slug: guide.slug }}
                  className="text-gray-700 hover:text-primary-600 transition-colors line-clamp-2"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popular Guides */}
      {popularGuidesData && popularGuidesData.guides.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Guides</h3>
          <ul className="space-y-3">
            {popularGuidesData.guides.map((guide: any, index: number) => (
              <li key={guide.id} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <Link
                  to="/guides/$slug"
                  params={{ slug: guide.slug }}
                  className="text-gray-700 hover:text-primary-600 transition-colors line-clamp-2"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Learning Progress CTA */}
      <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Track Your Progress</h3>
        <p className="text-sm mb-4 opacity-90">
          Create an account to save your progress and get personalized recommendations.
        </p>
        <Link
          to="/auth"
          className="block w-full bg-white text-primary-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          Get Started
        </Link>
      </div>
    </aside>
  )
}