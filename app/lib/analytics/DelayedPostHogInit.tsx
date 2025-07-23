import { useEffect } from 'react'
import posthog from 'posthog-js'

let initialized = false

export function DelayedPostHogInit() {
  useEffect(() => {
    if (!initialized && typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
      // Delay initialization to let AdSense load first
      const timer = setTimeout(() => {
        if (!initialized) {
          try {
            posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
              api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
              capture_pageview: false,
              capture_pageleave: true,
              persistence: 'localStorage+cookie',
              autocapture: {
                dom_event_allowlist: ['click', 'submit'],
                element_allowlist: ['button', 'input', 'a'],
              },
              session_recording: {
                maskAllInputs: false,
                maskInputOptions: {
                  password: true,
                  email: true,
                },
                maskTextSelector: '[data-sensitive]',
              },
            })
            initialized = true
            console.log('PostHog initialized with delay')
          } catch (error) {
            console.error('Failed to initialize PostHog:', error)
          }
        }
      }, 2000) // 2 second delay for AdSense

      return () => clearTimeout(timer)
    }
  }, [])

  return null
}