import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

interface BlogSidebarProps {
  onCategorySelect: (slug: string | null) => void
  onTagSelect: (slug: string | null) => void
  onSearch: (query: string) => void
  selectedCategory: string | null
  selectedTag: string | null
}

export function BlogSidebar({ 
  onCategorySelect, 
  onTagSelect, 
  onSearch,
  selectedCategory,
  selectedTag
}: BlogSidebarProps) {
  const [searchInput, setSearchInput] = useState('')

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const response = await fetch('/api/blog/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      return response.json()
    },
  })

  // Fetch tags
  const { data: tagsData } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const response = await fetch('/api/blog/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      return response.json()
    },
  })

  // Fetch recent posts
  const { data: recentPostsData } = useQuery({
    queryKey: ['blog-recent'],
    queryFn: async () => {
      const response = await fetch('/api/blog/recent')
      if (!response.ok) throw new Error('Failed to fetch recent posts')
      return response.json()
    },
  })

  // Fetch popular posts
  const { data: popularPostsData } = useQuery({
    queryKey: ['blog-popular'],
    queryFn: async () => {
      const response = await fetch('/api/blog/popular')
      if (!response.ok) throw new Error('Failed to fetch popular posts')
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
              placeholder="Search articles..."
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
                    {category._count.posts}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popular Tags */}
      {tagsData && tagsData.tags.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tagsData.tags.slice(0, 10).map((tag: any) => (
              <button
                key={tag.id}
                onClick={() => onTagSelect(tag.slug === selectedTag ? null : tag.slug)}
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag.slug
                    ? 'bg-accent-100 text-accent-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {recentPostsData && recentPostsData.posts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
          <ul className="space-y-3">
            {recentPostsData.posts.map((post: any) => (
              <li key={post.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="text-gray-700 hover:text-primary-600 transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popular Posts */}
      {popularPostsData && popularPostsData.posts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
          <ul className="space-y-3">
            {popularPostsData.posts.map((post: any, index: number) => (
              <li key={post.id} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="text-gray-700 hover:text-primary-600 transition-colors line-clamp-2"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
        <p className="text-sm mb-4 opacity-90">
          Get the latest medical math tips and practice questions delivered to your inbox.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            className="w-full bg-white text-primary-600 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </aside>
  )
}