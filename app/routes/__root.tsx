import * as React from 'react'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from '../lib/auth/AuthContext'
import { PostHogRouteTracker } from '../lib/analytics/PostHogProvider'
import { GA4Tracker } from '../lib/analytics/GA4Tracker'
import { GA4Debugger } from '../lib/analytics/GA4Debugger'
import { useNavigationTracking } from '../lib/analytics/useClickTracking'
import { useAnalytics } from '../lib/analytics/analytics'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
  // Track all navigation link clicks
  useNavigationTracking()
  
  return (
    <AuthProvider>
      <PostHogRouteTracker />
      <GA4Tracker />
      <div className="min-h-screen bg-gray-50">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="container-app py-4 sm:py-6 lg:py-8">
          <Outlet />
        </main>
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'font-medium',
            duration: 4000,
          }}
        />
        <GA4Debugger />
      </div>
    </AuthProvider>
  )
}

function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { track } = useAnalytics()
  
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <nav className="container-app" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center focus-ring rounded-md px-2 -mx-2"
            aria-label="Learn Med Math - Home"
          >
            <span className="text-xl font-display font-semibold text-gray-900">
              Learn Med Math
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/practice"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors focus-ring rounded-md px-2 -mx-2"
            >
              Practice
            </Link>
            {/* <Link
              to="/guides"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors focus-ring rounded-md px-2 -mx-2"
            >
              Guides
            </Link> */}
            <Link
              to="/leaderboard"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors focus-ring rounded-md px-2 -mx-2"
            >
              Leaderboard
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm hover:text-primary-600 transition-colors focus-ring rounded-md px-2 -mx-2"
                  aria-label={`Profile - ${user.username} - ${user.profile?.totalPoints || 0} points`}
                >
                  <span className="text-gray-600">
                    {user.username}
                  </span>
                  <span className="text-primary-600 font-medium">
                    {user.profile?.totalPoints || 0} pts
                  </span>
                </Link>
                <button
                  onClick={() => {
                    track('button_click', {
                      button_name: 'logout',
                      button_location: 'header',
                      user_points: user.profile?.totalPoints || 0,
                    })
                    logout()
                  }}
                  className="btn btn-secondary btn-sm"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="btn btn-primary btn-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => {
              track('button_click', {
                button_name: 'mobile_menu_toggle',
                button_location: 'header',
                action: mobileMenuOpen ? 'close' : 'open',
              })
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus-ring"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-in">
            <div className="flex flex-col space-y-3">
              <Link
                to="/practice"
                className="text-gray-600 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 focus-ring"
                onClick={() => setMobileMenuOpen(false)}
              >
                Practice
              </Link>
              {/* <Link
                to="/guides"
                className="text-gray-600 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 focus-ring"
                onClick={() => setMobileMenuOpen(false)}
              >
                Guides
              </Link> */}
              <Link
                to="/leaderboard"
                className="text-gray-600 hover:text-primary-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 focus-ring"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-50 focus-ring"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-gray-600">
                      {user.username}
                    </span>
                    <span className="text-primary-600 font-medium">
                      {user.profile?.totalPoints || 0} pts
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="btn btn-secondary w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="btn btn-primary w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}