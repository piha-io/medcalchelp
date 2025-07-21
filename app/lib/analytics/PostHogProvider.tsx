import React, { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useLocation } from '@tanstack/react-router'

// Initialize PostHog
if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
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
  })
}

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const location = useLocation()

  // Track page views when route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        $pathname: location.pathname,
      })
    }
  }, [location.pathname])

  // If PostHog is not initialized, just render children
  if (!import.meta.env.VITE_POSTHOG_KEY) {
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
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