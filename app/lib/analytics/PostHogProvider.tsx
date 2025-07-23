import React, { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  // If PostHog is not configured, just render children
  if (!import.meta.env.VITE_POSTHOG_KEY) {
    return <>{children}</>
  }

  // PostHog will be initialized by DelayedPostHogInit component
  return <PHProvider client={posthog}>{children}</PHProvider>
}

// Separate component for route tracking that must be used inside RouterProvider
export function PostHogRouteTracker() {
  useEffect(() => {
    // Track initial page view
    if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        $pathname: window.location.pathname,
      })
    }

    // Listen to route changes using browser history
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
        posthog.capture('$pageview', {
          $current_url: window.location.href,
          $pathname: window.location.pathname,
        })
      }
    }

    window.addEventListener('popstate', handleRouteChange)
    
    // Also track when history.pushState is called
    const originalPushState = window.history.pushState
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args)
      handleRouteChange()
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.history.pushState = originalPushState
    }
  }, [])

  return null
}

// Export posthog instance for direct usage
export { posthog }

// Custom hooks for common analytics events
export function useAnalytics() {
  const captureEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
      try {
        posthog.capture(eventName, properties)
      } catch (error) {
        console.warn('PostHog not initialized yet')
      }
    }
  }

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
      try {
        posthog.identify(userId, properties)
      } catch (error) {
        console.warn('PostHog not initialized yet')
      }
    }
  }

  const resetUser = () => {
    if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
      try {
        posthog.reset()
      } catch (error) {
        console.warn('PostHog not initialized yet')
      }
    }
  }

  return {
    captureEvent,
    identifyUser,
    resetUser,
  }
}