import { Link } from '@tanstack/react-router'
import { DifficultyBadge } from './DifficultyBadge'

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
  learningOutcomes?: string[]
}

interface GuideCardProps {
  guide: Guide
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Featured Image */}
      <Link 
        to="/guides/$slug" 
        params={{ slug: guide.slug }}
        className="block aspect-[16/9] overflow-hidden bg-gray-100 relative"
      >
        {guide.featuredImage ? (
          <img
            src={guide.featuredImage}
            alt={guide.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <svg className="w-16 h-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        
        {/* Difficulty Badge Overlay */}
        <div className="absolute top-4 right-4">
          <DifficultyBadge difficulty={guide.difficulty} />
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-3 flex items-center gap-2">
          {guide.category.icon && (
            <span className="text-xl">{guide.category.icon}</span>
          )}
          <Link
            to="/guides"
            search={{ category: guide.category.slug }}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {guide.category.name}
          </Link>
        </div>

        {/* Title */}
        <h3 className="mb-2">
          <Link
            to="/guides/$slug"
            params={{ slug: guide.slug }}
            className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
          >
            {guide.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {guide.description}
        </p>

        {/* Learning Outcomes Preview */}
        {guide.learningOutcomes && guide.learningOutcomes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">You'll learn:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {guide.learningOutcomes.slice(0, 2).map((outcome, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span className="line-clamp-1">{outcome}</span>
                </li>
              ))}
              {guide.learningOutcomes.length > 2 && (
                <li className="text-primary-600 text-xs">
                  +{guide.learningOutcomes.length - 2} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{guide.readingTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{guide.viewCount.toLocaleString()}</span>
            </div>
          </div>
          
          {guide.concepts.length > 0 && (
            <div className="text-xs text-gray-500">
              {guide.concepts.length} concept{guide.concepts.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}