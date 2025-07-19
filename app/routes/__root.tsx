import * as React from 'react'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  )
}

function Header() {
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
            <Link
              to="/auth/login"
              className="btn btn-primary btn-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}