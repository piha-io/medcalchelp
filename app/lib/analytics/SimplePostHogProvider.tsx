import React from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

// Initialize PostHog if we have the key
if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    // Disable session recording to prevent time value errors
    disable_session_recording: true,
    // Add error handling
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        console.log('PostHog loaded successfully')
      }
    },
    // Disable potentially problematic features
    capture_pageview: true,
    capture_pageleave: false,
  })
}

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  if (!import.meta.env.VITE_POSTHOG_KEY) {
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
}