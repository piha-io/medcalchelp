import * as React from 'react'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from '../lib/auth/AuthContext'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  )
}

function Header() {
  const { user, logout } = useAuth()
  
  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">MedCalcHelp</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/practice"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Practice
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Leaderboard
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm hover:text-primary-600 transition-colors"
                >
                  <span className="text-gray-600">
                    {user.username}
                  </span>
                  <span className="text-primary-600 font-medium">
                    {user.profile?.totalPoints || 0} pts
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-secondary btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="btn btn-primary btn-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}