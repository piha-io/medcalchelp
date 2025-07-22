// Google Analytics 4 integration using gtag.js

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GA4Event {
  [key: string]: any;
}

interface UserProperties {
  user_id?: string;
  user_type?: 'guest' | 'authenticated';
  user_level?: number;
  user_points?: number;
  user_email?: string;
  user_display_name?: string;
  [key: string]: any;
}

// Your GA4 Measurement ID
const GA4_MEASUREMENT_ID = 'G-NWLDH0NGR8';

class GA4Manager {
  private static instance: GA4Manager;
  private userProperties: UserProperties = {};
  private debugMode: boolean = false;
  private isInitialized: boolean = false;

  private constructor() {
    // Check if gtag is available
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      this.isInitialized = true;
    }
  }

  static getInstance(): GA4Manager {
    if (!GA4Manager.instance) {
      GA4Manager.instance = new GA4Manager();
    }
    return GA4Manager.instance;
  }

  /**
   * Enable debug mode for console logging
   */
  enableDebugMode(enabled: boolean = true) {
    this.debugMode = enabled;
    if (this.isInitialized) {
      // Enable GA4 debug mode
      window.gtag('config', GA4_MEASUREMENT_ID, {
        debug_mode: enabled
      });
    }
  }

  /**
   * Send event to GA4 using gtag
   */
  sendEvent(eventName: string, eventParameters?: Record<string, any>) {
    if (!this.isInitialized) {
      console.warn('GA4: gtag not available');
      return;
    }

    // Merge user properties with event parameters
    const parameters = {
      ...this.userProperties,
      ...eventParameters,
      send_to: GA4_MEASUREMENT_ID,
    };

    // Send event using gtag
    window.gtag('event', eventName, parameters);

    if (this.debugMode) {
      console.log('GA4 Event:', eventName, parameters);
    }
  }

  /**
   * Set user properties that will be included with all events
   */
  setUserProperties(properties: UserProperties) {
    this.userProperties = {
      ...this.userProperties,
      ...properties,
    };

    if (this.isInitialized) {
      // Set user properties in GA4
      window.gtag('set', {
        user_properties: properties
      });
    }
  }

  /**
   * Set user ID for cross-platform tracking
   */
  setUserId(userId: string | null) {
    if (!this.isInitialized) return;

    if (userId) {
      window.gtag('config', GA4_MEASUREMENT_ID, {
        user_id: userId
      });
      this.userProperties.user_id = userId;
    } else {
      // Clear user ID
      window.gtag('config', GA4_MEASUREMENT_ID, {
        user_id: null
      });
      delete this.userProperties.user_id;
    }
  }

  /**
   * Clear user properties (e.g., on logout)
   */
  clearUserProperties() {
    this.userProperties = {};
    this.setUserId(null);
  }

  /**
   * Track page view for SPAs
   */
  trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.isInitialized) return;

    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
      send_to: GA4_MEASUREMENT_ID,
    });
  }

  /**
   * Track user timing events
   */
  trackTiming(eventName: string, value: number, eventParameters?: Record<string, any>) {
    this.sendEvent(eventName, {
      value: Math.round(value), // GA expects integer milliseconds
      ...eventParameters,
    });
  }

  /**
   * Track exceptions/errors
   */
  trackError(description: string, fatal: boolean = false) {
    if (!this.isInitialized) return;

    window.gtag('event', 'exception', {
      description,
      fatal,
      send_to: GA4_MEASUREMENT_ID,
    });
  }

  /**
   * Track custom conversions
   */
  trackConversion(conversionEvent: string, value?: number, currency?: string) {
    const parameters: any = {
      send_to: GA4_MEASUREMENT_ID,
    };

    if (value !== undefined) {
      parameters.value = value;
    }

    if (currency) {
      parameters.currency = currency;
    }

    this.sendEvent(conversionEvent, parameters);
  }

  /**
   * Check if GA4 is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const ga4 = GA4Manager.getInstance();

// GA4 Recommended Events
export const GA4Events = {
  // Authentication
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  
  // Engagement
  SELECT_CONTENT: 'select_content',
  VIEW_ITEM: 'view_item',
  SEARCH: 'search',
  SHARE: 'share',
  
  // Progress
  LEVEL_UP: 'level_up',
  UNLOCK_ACHIEVEMENT: 'unlock_achievement',
  POST_SCORE: 'post_score',
  
  // Tutorial/Learning
  TUTORIAL_BEGIN: 'tutorial_begin',
  TUTORIAL_COMPLETE: 'tutorial_complete',
  
  // Custom events for medical app
  PRACTICE_START: 'practice_start',
  QUESTION_ATTEMPT: 'question_attempt',
  QUESTION_COMPLETE: 'question_complete',
  HINT_USED: 'hint_used',
  CATEGORY_SELECTED: 'category_selected',
  STREAK_ACHIEVED: 'streak_achieved',
} as const;

// Helper function to format GA4 compliant event names
export function formatEventName(eventName: string): string {
  // GA4 event names should be lowercase with underscores
  return eventName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 40); // GA4 limit
}

// Helper to validate event parameters
export function validateEventParams(params: Record<string, any>): Record<string, any> {
  const validated: Record<string, any> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    // GA4 parameter name restrictions
    const validKey = key
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 40);
    
    // Convert values to appropriate types
    if (value === null || value === undefined) {
      return; // Skip null/undefined values
    }
    
    if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      // Flatten nested objects
      Object.entries(value).forEach(([subKey, subValue]) => {
        validated[`${validKey}_${subKey}`] = subValue;
      });
    } else if (value instanceof Date) {
      validated[validKey] = value.toISOString();
    } else {
      validated[validKey] = value;
    }
  });
  
  return validated;
}