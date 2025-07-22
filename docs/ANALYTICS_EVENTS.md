# Analytics Events Documentation

This document outlines the event naming conventions and data schema for Google Analytics 4 (GA4) integration using gtag.js.

## Event Naming Conventions

### GA4 Compliance
- Event names are lowercase with underscores
- Maximum 40 characters
- No spaces or special characters except underscores
- Alphanumeric characters only (a-z, 0-9, _)

### Event Categories

#### Authentication Events
- `login` - User logs in
- `sign_up` - New user registration
- `logout` - User logs out

#### Practice & Learning Events
- `category_selected` - User selects a practice category
- `question_view` - Question is displayed to user
- `question_complete` - User submits an answer
- `hint_used` - User uses a hint

#### Achievement & Progress Events
- `level_up` - User advances to next level
- `unlock_achievement` - User unlocks an achievement
- `streak_achieved` - User maintains practice streak

#### Engagement Events
- `page_view` - Page is viewed (SPA navigation)
- `scroll_milestone` - User reaches scroll depth (25%, 50%, 75%, 90%, 100%)
- `user_idle` - User becomes idle
- `user_active` - User returns from idle state
- `page_hidden` - User switches tabs/minimizes
- `page_visible` - User returns to tab
- `page_exit` - User leaves page

## Event Parameters Schema

### Common Parameters (All Events)
```javascript
{
  user_id: string,          // Authenticated user ID
  user_type: string,        // 'guest' | 'authenticated'
  timestamp: string,        // ISO 8601 format
  session_id: string,       // Unique session identifier
  platform: string,         // 'mobile' | 'desktop'
  screen_resolution: string // e.g., "1920x1080"
}
```

### Event-Specific Parameters

#### login
```javascript
{
  method: string,           // 'email' | 'google' | 'facebook'
  user_level: number,       // Current user level
  user_points: number       // Total points earned
}
```

#### category_selected
```javascript
{
  category: string,         // Category ID
  category_question_count: number, // Total questions in category
  session_duration: number  // Time since session start (ms)
}
```

#### question_view
```javascript
{
  question_id: string,      // Unique question ID
  question_type: string,    // Question type identifier
  category: string,         // Question category
  session_question_count: number // Questions viewed this session
}
```

#### question_complete
```javascript
{
  question_id: string,
  is_correct: boolean,
  points_earned: number,
  time_to_answer: number,   // Milliseconds
  hints_used: number,
  answer_given: number,
  correct_answer: number,
  session_accuracy: number, // Percentage (0-100)
}
```

#### hint_used
```javascript
{
  question_id: string,
  question_type: string,
  category: string,
  hints_used: number,       // Total hints used on this question
  total_hints_available: number,
  time_to_hint: number      // Seconds from question start
}
```

#### level_up
```javascript
{
  level: number,            // New level (GA4 standard)
  level_before: number,     // Previous level
  level_after: number,      // New level (duplicate for clarity)
  total_points: number      // Total points accumulated
}
```

#### scroll_milestone
```javascript
{
  scroll_depth: number,     // Percentage (25, 50, 75, 90, 100)
  page_path: string         // Current page path
}
```

#### page_exit
```javascript
{
  time_on_page: number,     // Milliseconds
  max_scroll_depth: number, // Maximum scroll percentage
  was_idle: boolean,        // Whether user was idle
  page_path: string
}
```

## User Properties

User properties are set for audience segmentation in GA4:

```javascript
{
  user_id: string,
  user_type: 'guest' | 'authenticated',
  user_email: string,       // Authenticated users only
  user_display_name: string,
  user_level: number,
  user_points: number,
  user_streak: number,      // Current practice streak
}
```

## Implementation Guidelines

### 1. Event Tracking
```javascript
// Use the unified analytics module
import { useAnalytics } from '@/lib/analytics/analytics'

const { track, trackQuestionSubmit } = useAnalytics()

// Track custom event
track('category_selected', {
  category: 'pharmacology',
  category_question_count: 50
})

// Use specialized tracking methods
trackQuestionSubmit({
  question_id: 'q123',
  is_correct: true,
  points_earned: 10,
  time_to_answer: 45000
})
```

### 2. User Identification
```javascript
// Identify user on login
identify(userId, {
  email: user.email,
  level: user.level,
  totalPoints: user.totalPoints
})

// Reset on logout
reset()
```

### 3. Debugging

In development, use the GA4 debugger:
- Press `Ctrl+Shift+G` to toggle the visual debugger
- Use console utilities: `window.ga4Debug`

```javascript
// Console debugging examples
ga4Debug.sendTestEvent('test_event', { custom_param: 'value' })
ga4Debug.isLoaded()                  // Check if gtag is loaded
ga4Debug.getConfig()                 // Get GA4 configuration
ga4Debug.enableVerboseLogging()      // Enable debug mode
```

## GA4 Configuration

### 1. Setup
The application uses gtag.js with measurement ID: `G-NWLDH0NGR8`

### 2. Event Implementation
Events are sent directly to GA4 using gtag:
```javascript
window.gtag('event', 'event_name', {
  parameter1: 'value1',
  parameter2: 'value2'
})
```

### 3. Testing
1. Use the in-app GA4 debugger (Ctrl+Shift+G)
2. Check browser console for debug logs
3. Verify events in GA4 DebugView
4. Monitor GA4 Realtime reports

### 4. Debug Mode
In development, debug mode is automatically enabled:
- Events are logged to console
- GA4 DebugView receives debug signals
- Use `window.ga4Debug` utilities for testing

## Best Practices

1. **Consistent Naming**: Always use snake_case for events and parameters
2. **Data Quality**: Validate data before sending (no null/undefined values)
3. **Privacy**: Never send PII beyond user ID and email (for authenticated users)
4. **Performance**: Batch events when possible, avoid excessive tracking
5. **Testing**: Always test new events in GTM Preview before publishing

## Future Enhancements

Planned events to implement:
- Search functionality tracking
- Social sharing events
- Performance/error tracking
- A/B testing events
- Feature discovery tracking