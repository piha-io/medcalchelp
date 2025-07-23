import { Link } from '@tanstack/react-router'

interface GuideLink {
  id: string
  slug: string
  title: string
}

interface GuideNavigationProps {
  previous?: GuideLink | null
  next?: GuideLink | null
}

export function GuideNavigation({ previous, next }: GuideNavigationProps) {
  if (!previous && !next) return null

  return (
    <nav className="mt-12 pt-8 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Guide */}
        {previous ? (
          <Link
            to="/guides/$slug"
            params={{ slug: previous.slug }}
            className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
          >
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left">
              <p className="text-sm text-gray-500 group-hover:text-primary-700">Previous</p>
              <p className="font-medium text-gray-900 group-hover:text-primary-800 line-clamp-1">
                {previous.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Next Guide */}
        {next ? (
          <Link
            to="/guides/$slug"
            params={{ slug: next.slug }}
            className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all md:justify-end text-right"
          >
            <div>
              <p className="text-sm text-gray-500 group-hover:text-primary-700">Next</p>
              <p className="font-medium text-gray-900 group-hover:text-primary-800 line-clamp-1">
                {next.title}
              </p>
            </div>
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}