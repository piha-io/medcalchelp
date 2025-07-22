import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAnalytics } from '../analytics/analytics'

interface User {
  id: string
  email: string
  username: string | null
  profile?: {
    displayName?: string
    totalPoints: number
    currentStreak: number
    longestStreak: number
    level: number
    experience: number
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateUser: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { identify, reset, track } = useAnalytics()

  // Use React Query to fetch and cache user data
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.user as User
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })

  // Identify user in analytics when user data changes
  useEffect(() => {
    if (user) {
      identify(user.id, {
        email: user.email,
        username: user.username,
        displayName: user.profile?.displayName,
        totalPoints: user.profile?.totalPoints,
        level: user.profile?.level,
        currentStreak: user.profile?.currentStreak,
        longestStreak: user.profile?.longestStreak,
        experience: user.profile?.experience,
      })
    } else {
      reset()
    }
  }, [user, identify, reset])

  const login = async (userData: User) => {
    // Update the query cache with the new user data
    queryClient.setQueryData(['auth', 'me'], userData)
    
    // Track login event with enhanced data
    track('LOGIN', {
      method: 'email',
      user_id: userData.id,
      user_level: userData.profile?.level,
      user_points: userData.profile?.totalPoints,
    })
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      // Track logout event before clearing user
      if (user) {
        track('logout', {
          user_id: user.id,
          session_duration: Date.now() - (window.sessionStart || Date.now()),
          user_level: user.profile?.level,
          user_points: user.profile?.totalPoints,
        })
      }

      // Clear the query cache
      queryClient.setQueryData(['auth', 'me'], null)
      queryClient.removeQueries({ queryKey: ['auth', 'me'] })
      toast.success('Logged out successfully')
      navigate({ to: '/' })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const refreshUser = async () => {
    await refetch()
  }

  const updateUser = (userData: User) => {
    // Update the query cache with the new user data
    queryClient.setQueryData(['auth', 'me'], userData)
  }

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, login, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}