import React, { useState, useEffect } from 'react'

interface GA4Event {
  event: string
  parameters: Record<string, any>
  timestamp: number
}

export function GA4Debugger() {
  const [isOpen, setIsOpen] = useState(false)
  const [events, setEvents] = useState<GA4Event[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // Intercept gtag calls to capture events
    const originalGtag = window.gtag
    const capturedEvents: GA4Event[] = []

    window.gtag = function(...args: any[]) {
      // Call original gtag
      originalGtag.apply(window, args)

      // Capture event calls
      if (args[0] === 'event') {
        const event: GA4Event = {
          event: args[1],
          parameters: args[2] || {},
          timestamp: Date.now()
        }
        capturedEvents.push(event)
        if (capturedEvents.length > 50) {
          capturedEvents.shift() // Keep only last 50 events
        }
        setEvents([...capturedEvents])
      }
    }

    // Keyboard shortcut to toggle debugger
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.gtag = originalGtag // Restore original
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isOpen) {
    return null
  }

  const filteredEvents = events.filter(event => {
    if (!filter) return true
    const eventString = JSON.stringify(event).toLowerCase()
    return eventString.includes(filter.toLowerCase())
  })

  return (
    <div className="fixed bottom-0 right-0 w-96 max-h-96 bg-white shadow-2xl border border-gray-300 rounded-t-lg z-[9999]">
      <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-sm">GA4 Debugger</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close debugger"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="Filter events..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="overflow-y-auto max-h-64 p-3 space-y-2">
        {filteredEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">No events captured yet</p>
        ) : (
          filteredEvents.reverse().map((event, index) => (
            <div key={`${event.timestamp}-${index}`} className="bg-gray-50 rounded p-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary-600">
                  {event.event}
                </span>
                <span className="text-gray-400">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <pre className="mt-1 text-gray-600 overflow-x-auto">
                {JSON.stringify(event.parameters, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          Press Ctrl+Shift+G to toggle debugger
        </p>
      </div>
    </div>
  )
}

// Console utilities for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).ga4Debug = {
    // Send test event
    sendTestEvent: (eventName: string = 'test_event', parameters: any = {}) => {
      window.gtag('event', eventName, {
        ...parameters,
        test: true,
        timestamp: new Date().toISOString(),
      })
    },
    
    // Check if gtag is loaded
    isLoaded: () => {
      return typeof window.gtag === 'function'
    },
    
    // Get GA4 config
    getConfig: () => {
      return {
        measurementId: 'G-NWLDH0NGR8',
        gtagLoaded: typeof window.gtag === 'function',
        dataLayerSize: window.dataLayer?.length || 0,
      }
    },
    
    // Enable verbose logging
    enableVerboseLogging: () => {
      window.gtag('config', 'G-NWLDH0NGR8', {
        debug_mode: true
      })
    },
  }
  
  console.log('GA4 Debug utilities available at window.ga4Debug')
}