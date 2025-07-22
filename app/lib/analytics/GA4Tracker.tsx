import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { ga4 } from './ga4'
import { useAuth } from '../auth/AuthContext'

export function GA4Tracker() {
  const location = useLocation()
  const { user } = useAuth()

  // Initialize session tracking
  useEffect(() => {
    // Store session start time
    if (typeof window !== 'undefined' && !window.sessionStart) {
      window.sessionStart = Date.now()
    }

    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      ga4.enableDebugMode(true)
    }

    // Track initial page view
    ga4.trackPageView(location.pathname, document.title)
  }, [])

  // Track route changes
  useEffect(() => {
    ga4.trackPageView(location.pathname, document.title)
  }, [location])

  // Update user properties when user changes
  useEffect(() => {
    if (user) {
      ga4.setUserId(user.id)
      ga4.setUserProperties({
        user_type: 'authenticated',
        user_email: user.email,
        user_display_name: user.profile?.displayName || user.username || undefined,
        user_level: user.profile?.level,
        user_points: user.profile?.totalPoints,
        user_streak: user.profile?.currentStreak,
      })
    } else {
      ga4.clearUserProperties()
      ga4.setUserProperties({
        user_type: 'guest',
      })
    }
  }, [user])

  return null
}

// Extend Window interface for session tracking
declare global {
  interface Window {
    sessionStart?: number
  }
}