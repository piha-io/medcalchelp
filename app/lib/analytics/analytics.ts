// Unified analytics module that sends events to both PostHog and GTM/GA4

import { usePostHog } from 'posthog-js/react';
import { ga4, GA4Events, formatEventName, validateEventParams } from './ga4';

// Extended event properties for medical calculation app
interface MedCalcEventProperties {
  // Question properties
  category?: string;
  question_id?: string;
  question_type?: string;
  difficulty?: string;
  
  // User interaction
  answer_given?: number | string;
  correct_answer?: number | string;
  is_correct?: boolean;
  time_to_answer?: number; // milliseconds
  hints_used?: number;
  attempt_number?: number;
  
  // Session context
  session_question_count?: number;
  session_correct_count?: number;
  session_duration?: number;
  
  // Achievement/Progress
  points_earned?: number;
  level_before?: number;
  level_after?: number;
  achievement_id?: string;
  streak_length?: number;
  
  // Additional context
  [key: string]: any;
}

export type AnalyticsEvent = keyof typeof GA4Events | string;

class UnifiedAnalytics {
  private posthog: any = null;
  private sessionStartTime: number = Date.now();
  private sessionQuestionCount: number = 0;
  private sessionCorrectCount: number = 0;

  /**
   * Initialize with PostHog instance
   */
  initialize(posthogInstance: any) {
    this.posthog = posthogInstance;
    this.sessionStartTime = Date.now();
  }

  /**
   * Track event to both PostHog and GTM/GA4
   */
  track(eventName: AnalyticsEvent, properties?: MedCalcEventProperties) {
    // Format event name for GA4 compliance
    const ga4EventName = GA4Events[eventName as keyof typeof GA4Events] || formatEventName(eventName);
    
    // Validate and enhance properties
    const enhancedProperties = this.enhanceEventProperties(properties);
    const validatedProperties = validateEventParams(enhancedProperties);

    // Send to PostHog
    if (this.posthog) {
      this.posthog.capture(eventName, enhancedProperties);
    }

    // Send to GA4
    ga4.sendEvent(ga4EventName, validatedProperties);

    // Update session metrics
    this.updateSessionMetrics(eventName, properties);
  }

  /**
   * Identify user for both platforms
   */
  identify(userId: string, properties?: Record<string, any>) {
    // PostHog identify
    if (this.posthog) {
      this.posthog.identify(userId, properties);
    }

    // GA4 user properties
    ga4.setUserId(userId);
    ga4.setUserProperties({
      user_type: 'authenticated' as const,
      ...properties,
    });
  }

  /**
   * Reset user (on logout)
   */
  reset() {
    if (this.posthog) {
      this.posthog.reset();
    }
    ga4.clearUserProperties();
    this.resetSessionMetrics();
  }

  /**
   * Track page view
   */
  pageView(pagePath: string, pageTitle?: string) {
    if (this.posthog) {
      this.posthog.capture('$pageview', {
        $current_url: pagePath,
        title: pageTitle,
      });
    }
    ga4.trackPageView(pagePath, pageTitle);
  }

  /**
   * Track timing events (e.g., time to answer)
   */
  trackTiming(category: string, variable: string, timeInMs: number, label?: string) {
    const timingEvent = `timing_${category}_${variable}`.toLowerCase();
    
    this.track(timingEvent, {
      timing_category: category,
      timing_variable: variable,
      timing_value: timeInMs,
      timing_label: label,
    });
    
    ga4.trackTiming(`timing_${category}_${variable}`, timeInMs, {
      timing_category: category,
      timing_variable: variable,
      timing_label: label,
    });
  }

  /**
   * Track errors
   */
  trackError(error: string | Error, fatal: boolean = false) {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    this.track('error_occurred', {
      error_message: errorMessage,
      error_stack: errorStack,
      error_fatal: fatal,
    });

    ga4.trackError(errorMessage, fatal);
  }

  /**
   * Enhanced tracking methods for specific interactions
   */
  
  trackQuestionView(properties: MedCalcEventProperties) {
    this.track('question_view', {
      ...properties,
      session_question_count: this.sessionQuestionCount + 1,
    });
  }

  trackQuestionSubmit(properties: MedCalcEventProperties & { is_correct: boolean }) {
    const startTime = properties.time_to_answer 
      ? Date.now() - properties.time_to_answer 
      : undefined;

    this.track('question_complete', {
      ...properties,
      session_question_count: this.sessionQuestionCount,
      session_correct_count: this.sessionCorrectCount,
      session_accuracy: this.sessionQuestionCount > 0 
        ? (this.sessionCorrectCount / this.sessionQuestionCount) * 100 
        : 0,
    });

    // Track performance metrics
    if (startTime && properties.time_to_answer) {
      this.trackTiming('question', 'time_to_answer', properties.time_to_answer, properties.category);
    }
  }

  trackHintUsed(properties: MedCalcEventProperties) {
    this.track('hint_used', properties);
  }

  trackCategorySelected(category: string, totalQuestions?: number) {
    this.track('category_selected', {
      category,
      category_question_count: totalQuestions,
      session_duration: Date.now() - this.sessionStartTime,
    });
  }

  trackAchievementUnlocked(achievementId: string, properties?: MedCalcEventProperties) {
    this.track('unlock_achievement', {
      achievement_id: achievementId,
      ...properties,
    });
  }

  trackLevelUp(levelBefore: number, levelAfter: number, totalPoints: number) {
    this.track('level_up', {
      level_before: levelBefore,
      level_after: levelAfter,
      level: levelAfter,
      total_points: totalPoints,
    });
  }

  trackStreakAchieved(streakLength: number) {
    this.track('streak_achieved', {
      streak_length: streakLength,
      streak_days: streakLength,
    });
  }

  /**
   * Private helper methods
   */
  
  private enhanceEventProperties(properties?: MedCalcEventProperties): MedCalcEventProperties {
    return {
      ...properties,
      session_id: this.getSessionId(),
      session_duration: Date.now() - this.sessionStartTime,
      timestamp: new Date().toISOString(),
      platform: this.getPlatform(),
      screen_resolution: this.getScreenResolution(),
    };
  }

  private updateSessionMetrics(eventName: string, properties?: MedCalcEventProperties) {
    if (eventName === 'question_view' || eventName === 'question_complete') {
      this.sessionQuestionCount++;
    }
    
    if (eventName === 'question_complete' && properties?.is_correct) {
      this.sessionCorrectCount++;
    }
  }

  private resetSessionMetrics() {
    this.sessionStartTime = Date.now();
    this.sessionQuestionCount = 0;
    this.sessionCorrectCount = 0;
  }

  private getSessionId(): string {
    // Simple session ID based on start time
    return `session_${this.sessionStartTime}`;
  }

  private getPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getScreenResolution(): string {
    return `${window.screen.width}x${window.screen.height}`;
  }
}

// Create singleton instance
export const analytics = new UnifiedAnalytics();

// React hook for using analytics
export function useAnalytics() {
  const posthog = usePostHog();
  
  // Initialize analytics with PostHog instance
  if (posthog && !analytics['posthog']) {
    analytics.initialize(posthog);
  }

  return {
    track: analytics.track.bind(analytics),
    identify: analytics.identify.bind(analytics),
    reset: analytics.reset.bind(analytics),
    pageView: analytics.pageView.bind(analytics),
    trackTiming: analytics.trackTiming.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackQuestionView: analytics.trackQuestionView.bind(analytics),
    trackQuestionSubmit: analytics.trackQuestionSubmit.bind(analytics),
    trackHintUsed: analytics.trackHintUsed.bind(analytics),
    trackCategorySelected: analytics.trackCategorySelected.bind(analytics),
    trackAchievementUnlocked: analytics.trackAchievementUnlocked.bind(analytics),
    trackLevelUp: analytics.trackLevelUp.bind(analytics),
    trackStreakAchieved: analytics.trackStreakAchieved.bind(analytics),
  };
}