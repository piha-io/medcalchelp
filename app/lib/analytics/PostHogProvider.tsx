import React, { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

// Initialize PostHog only in browser environment with delay for AdSense compatibility
let posthogInitialized = false
let posthogInitTimer: NodeJS.Timeout | null = null

function initializePostHog() {
  if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY && !posthogInitialized) {
    try {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: false, // We'll manually track page views with TanStack Router
        capture_pageleave: true,
        persistence: 'localStorage+cookie',
        autocapture: {
          dom_event_allowlist: ['click', 'submit'], // Only capture clicks and form submissions
          element_allowlist: ['button', 'input', 'a'], // Only capture specific elements
        },
        session_recording: {
          maskAllInputs: false,
          maskInputOptions: {
            password: true,
            email: true,
          },
          maskTextSelector: '[data-sensitive]', // Add data-sensitive attribute to mask specific text
        },
        loaded: (ph) => {
          posthogInitialized = true
          console.log('PostHog initialized successfully')
        }
      })
    } catch (error) {
      console.error('Failed to initialize PostHog:', error)
    }
  }
}

// Delay PostHog initialization to avoid conflicts with AdSense
if (typeof window !== 'undefined') {
  // Wait for DOM to be fully loaded and give AdSense time to initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      posthogInitTimer = setTimeout(initializePostHog, 2000)
    })
  } else {
    // DOM already loaded, still delay for AdSense
    posthogInitTimer = setTimeout(initializePostHog, 2000)
  }
}

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    // Ensure PostHog is initialized if it hasn't been already
    if (!posthogInitialized && import.meta.env.VITE_POSTHOG_KEY) {
      initializePostHog()
    }

    // Cleanup timer on unmount
    return () => {
      if (posthogInitTimer) {
        clearTimeout(posthogInitTimer)
      }
    }
  }, [])

  // If PostHog is not configured, just render children
  if (!import.meta.env.VITE_POSTHOG_KEY) {
    return <>{children}</>
  }

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
      posthog.capture(eventName, properties)
    }
  }

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
      posthog.identify(userId, properties)
    }
  }

  const resetUser = () => {
    if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
      posthog.reset()
    }
  }

  return {
    captureEvent,
    identifyUser,
    resetUser,
  }
}