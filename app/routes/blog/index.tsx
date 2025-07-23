import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BlogCard } from '../../components/blog/BlogCard'
import { BlogSidebar } from '../../components/blog/BlogSidebar'
import { Pagination } from '../../components/blog/Pagination'
import { BlogHero } from '../../components/blog/BlogHero'
import { useAnalytics } from '../../lib/analytics/analytics'

export const Route = createFileRoute('/blog/')({
  component: BlogListingPage,
})

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage?: string
  publishedAt: string
  readingTime: number
  viewCount: number
  author: {
    id: string
    username: string
    profile?: {
      displayName: string
      avatarUrl?: string
    }
  }
  category: {
    id: string
    name: string
    slug: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
}

function BlogListingPage() {
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { track } = useAnalytics()

  // Fetch blog posts
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-posts', page, selectedCategory, selectedTag, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9', // 3x3 grid
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedTag && { tag: selectedTag }),
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetch(`/api/blog/posts?${params}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      return response.json()
    },
  })

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    setSelectedTag(null)
    setPage(1)
    
    if (categorySlug) {
      track('blog_category_selected', {
        category_slug: categorySlug,
      })
    }
  }

  const handleTagSelect = (tagSlug: string | null) => {
    setSelectedTag(tagSlug)
    setSelectedCategory(null)
    setPage(1)
    
    if (tagSlug) {
      track('blog_tag_selected', {
        tag_slug: tagSlug,
      })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
    
    if (query) {
      track('blog_search', {
        search_query: query,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHero />
      
      <div className="container-app py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {(selectedCategory || selectedTag || searchQuery) && (
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
                {selectedTag && (
                  <button
                    onClick={() => handleTagSelect(null)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium hover:bg-accent-200 transition-colors"
                  >
                    #{selectedTag}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load blog posts</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-secondary"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Blog Posts Grid */}
            {data && (
              <>
                {data.posts.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {data.posts.map((post: BlogPost) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={data.pagination.totalPages}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar
              onCategorySelect={handleCategorySelect}
              onTagSelect={handleTagSelect}
              onSearch={handleSearch}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
            />
          </div>
        </div>
      </div>
    </div>
  )
}