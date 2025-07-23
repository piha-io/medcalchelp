import React, { useEffect, useRef } from 'react'
import { useAnalytics } from './analytics'

interface ClickTrackingOptions {
  eventName?: string
  eventProperties?: Record<string, any>
  trackOnce?: boolean
}

/**
 * Hook to track clicks on a specific element
 */
export function useClickTracking(
  elementRef: React.RefObject<HTMLElement>,
  options: ClickTrackingOptions = {}
) {
  const { track } = useAnalytics()
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleClick = (e: MouseEvent) => {
      // Skip if trackOnce is true and we've already tracked
      if (options.trackOnce && hasTrackedRef.current) return

      const target = e.target as HTMLElement
      const elementType = element.tagName.toLowerCase()
      const elementText = element.textContent?.trim().substring(0, 50) || ''
      const elementId = element.id || element.className.split(' ')[0] || 'unknown'

      track(options.eventName || 'element_click', {
        element_type: elementType,
        element_id: elementId,
        element_text: elementText,
        page_path: window.location.pathname,
        ...options.eventProperties,
      })

      hasTrackedRef.current = true
    }

    element.addEventListener('click', handleClick)

    return () => {
      element.removeEventListener('click', handleClick)
    }
  }, [elementRef, track, options])
}

/**
 * Hook to track form input interactions
 */
export function useInputTracking(
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
  fieldName: string
) {
  const { track, trackTiming } = useAnalytics()
  const startTimeRef = useRef<number | null>(null)
  const hasInteractedRef = useRef(false)

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const handleFocus = () => {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now()
      }

      if (!hasInteractedRef.current) {
        track('form_field_focus', {
          field_name: fieldName,
          field_type: input.type || 'text',
          page_path: window.location.pathname,
        })
        hasInteractedRef.current = true
      }
    }

    const handleBlur = () => {
      if (startTimeRef.current) {
        const timeSpent = Date.now() - startTimeRef.current
        
        trackTiming('form_interaction', fieldName, timeSpent)
        
        track('form_field_blur', {
          field_name: fieldName,
          field_type: input.type || 'text',
          time_spent: timeSpent,
          has_value: input.value.length > 0,
          page_path: window.location.pathname,
        })
      }
    }

    const handleChange = () => {
      // Track first interaction with the field
      if (!hasInteractedRef.current) {
        track('form_field_interaction', {
          field_name: fieldName,
          field_type: input.type || 'text',
          page_path: window.location.pathname,
        })
        hasInteractedRef.current = true
      }
    }

    input.addEventListener('focus', handleFocus)
    input.addEventListener('blur', handleBlur)
    input.addEventListener('input', handleChange)

    return () => {
      input.removeEventListener('focus', handleFocus)
      input.removeEventListener('blur', handleBlur)
      input.removeEventListener('input', handleChange)
    }
  }, [inputRef, fieldName, track, trackTiming])
}

/**
 * Hook to track navigation link clicks
 */
export function useNavigationTracking() {
  const { track } = useAnalytics()

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      if (!link) return

      const href = link.getAttribute('href')
      const text = link.textContent?.trim() || ''
      const isExternal = href?.startsWith('http') && !href.includes(window.location.hostname)

      track('navigation_click', {
        link_text: text.substring(0, 50),
        link_href: href,
        is_external: isExternal,
        page_path: window.location.pathname,
      })
    }

    // Add listener to document to catch all link clicks
    document.addEventListener('click', handleLinkClick)

    return () => {
      document.removeEventListener('click', handleLinkClick)
    }
  }, [track])
}

/**
 * Component to add automatic click tracking to its children
 */
export function ClickTracker({ 
  children, 
  eventName,
  properties 
}: { 
  children: React.ReactElement
  eventName: string
  properties?: Record<string, any>
}) {
  const ref = useRef<HTMLElement>(null)
  
  useClickTracking(ref, { eventName, eventProperties: properties })

  // Clone element and add ref
  return React.cloneElement(children, { ref })
}