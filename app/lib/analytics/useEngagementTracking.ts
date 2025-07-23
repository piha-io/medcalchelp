import { useEffect, useRef, useCallback } from 'react'
import { useAnalytics } from './analytics'

interface EngagementConfig {
  trackScrollDepth?: boolean
  trackTimeOnPage?: boolean
  trackIdleTime?: boolean
  idleThreshold?: number // milliseconds
}

// Debounce function to reduce event frequency
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function useEngagementTracking(config: EngagementConfig = {}) {
  const {
    trackScrollDepth = true,
    trackTimeOnPage = true,
    trackIdleTime = true,
    idleThreshold = 30000, // 30 seconds
  } = config

  const { track, trackTiming } = useAnalytics()
  const startTimeRef = useRef(Date.now())
  const lastActivityRef = useRef(Date.now())
  const maxScrollRef = useRef(0)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isIdleRef = useRef(false)
  const scrollDebounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startTimeRef.current = Date.now()
    maxScrollRef.current = 0
    lastActivityRef.current = Date.now()
    isIdleRef.current = false

    // Track scroll depth with debouncing
    const handleScrollImmediate = () => {
      if (!trackScrollDepth) return

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = scrollHeight > 0 
        ? Math.round((window.scrollY / scrollHeight) * 100)
        : 0

      if (scrollProgress > maxScrollRef.current) {
        maxScrollRef.current = scrollProgress

        // Track significant scroll milestones
        if ([25, 50, 75, 90, 100].includes(scrollProgress)) {
          // Debounce milestone tracking to prevent excessive events
          if (scrollDebounceTimerRef.current) clearTimeout(scrollDebounceTimerRef.current)
          scrollDebounceTimerRef.current = setTimeout(() => {
            track('scroll_milestone', {
              scroll_depth: scrollProgress,
              page_path: window.location.pathname,
            })
          }, 250)
        }
      }

      // Reset idle timer on scroll
      handleActivity()
    }

    // Debounced scroll handler
    const handleScroll = useCallback(
      debounce(handleScrollImmediate, 250),
      [trackScrollDepth]
    )

    // Track idle time with debouncing
    const handleActivityImmediate = () => {
      lastActivityRef.current = Date.now()
      
      if (isIdleRef.current) {
        isIdleRef.current = false
        track('user_active', {
          idle_duration: Date.now() - lastActivityRef.current,
          page_path: window.location.pathname,
        })
      }

      // Clear existing timer
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      // Set new idle timer
      if (trackIdleTime) {
        idleTimerRef.current = setTimeout(() => {
          isIdleRef.current = true
          track('user_idle', {
            idle_threshold: idleThreshold,
            page_path: window.location.pathname,
          })
        }, idleThreshold)
      }
    }

    // Debounced activity handler
    const handleActivity = useCallback(
      debounce(handleActivityImmediate, 500),
      [trackIdleTime, idleThreshold]
    )

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeOnPage = Date.now() - startTimeRef.current
        track('page_hidden', {
          time_on_page: timeOnPage,
          max_scroll_depth: maxScrollRef.current,
          page_path: window.location.pathname,
        })
      } else {
        track('page_visible', {
          page_path: window.location.pathname,
        })
        startTimeRef.current = Date.now() // Reset timer when page becomes visible
      }
    }

    // Add event listeners
    if (trackScrollDepth) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }
    
    if (trackIdleTime) {
      window.addEventListener('mousemove', handleActivity)
      window.addEventListener('keypress', handleActivity)
      window.addEventListener('click', handleActivity)
      window.addEventListener('touchstart', handleActivity)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Initial activity
    handleActivity()

    // Cleanup
    return () => {
      // Track time on page when component unmounts
      if (trackTimeOnPage && !document.hidden) {
        const timeOnPage = Date.now() - startTimeRef.current
        trackTiming('engagement', 'time_on_page', timeOnPage, window.location.pathname)
        
        track('page_exit', {
          time_on_page: timeOnPage,
          max_scroll_depth: maxScrollRef.current,
          was_idle: isIdleRef.current,
          page_path: window.location.pathname,
        })
      }

      // Clear timers
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
      if (scrollDebounceTimerRef.current) {
        clearTimeout(scrollDebounceTimerRef.current)
      }

      // Remove event listeners
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keypress', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [track, trackTiming, trackScrollDepth, trackTimeOnPage, trackIdleTime, idleThreshold])
}

// Hook to track specific element interactions
export function useElementTracking(elementId: string, eventName: string) {
  const { track } = useAnalytics()
  const elementRef = useRef<HTMLElement | null>(null)
  const intersectionRef = useRef<IntersectionObserver | null>(null)
  const hasBeenVisibleRef = useRef(false)

  useEffect(() => {
    elementRef.current = document.getElementById(elementId)
    
    if (!elementRef.current) return

    // Track when element comes into view
    intersectionRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasBeenVisibleRef.current) {
          hasBeenVisibleRef.current = true
          track(`${eventName}_viewed`, {
            element_id: elementId,
            page_path: window.location.pathname,
          })
        }
      })
    }, { threshold: 0.5 }) // Element is 50% visible

    intersectionRef.current.observe(elementRef.current)

    // Track clicks on the element
    const handleClick = () => {
      track(`${eventName}_clicked`, {
        element_id: elementId,
        page_path: window.location.pathname,
      })
    }

    elementRef.current.addEventListener('click', handleClick)

    return () => {
      if (intersectionRef.current) {
        intersectionRef.current.disconnect()
      }
      if (elementRef.current) {
        elementRef.current.removeEventListener('click', handleClick)
      }
    }
  }, [elementId, eventName, track])
}