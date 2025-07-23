# Analytics Tracking Examples

## Current Implementation

Your app currently tracks these specific events:
- Page views (automatic)
- Login/logout
- Category selection
- Question views
- Hint usage
- Answer submissions
- Scroll depth and engagement

## Why You Don't See Button/Input Events

Unlike some analytics tools, GA4 doesn't automatically track all interactions unless you:
1. Enable Enhanced Measurement in GA4 console (for basic interactions)
2. Explicitly implement tracking for specific interactions (recommended for better data)

## How to Add More Tracking

### 1. Track Answer Input Interactions

```typescript
// In QuestionCard.tsx
import { useRef } from 'react'
import { useInputTracking } from '../lib/analytics/useClickTracking'

function QuestionCard({ question, onSubmit, onUseHint, hintsUsed, isSubmitting }) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Track input interactions
  useInputTracking(inputRef, 'answer_input')
  
  return (
    <input
      ref={inputRef}
      type="number"
      value={userAnswer}
      onChange={(e) => setUserAnswer(e.target.value)}
      // ... rest of props
    />
  )
}
```

### 2. Track Specific Button Clicks

```typescript
// For important buttons
import { useAnalytics } from '../lib/analytics/analytics'

function MyComponent() {
  const { track } = useAnalytics()
  
  return (
    <button
      onClick={() => {
        track('cta_button_click', {
          button_text: 'Start Practice',
          button_location: 'hero_section'
        })
        // ... rest of click handler
      }}
    >
      Start Practice
    </button>
  )
}
```

### 3. Track Navigation Clicks

```typescript
// In your root component
import { useNavigationTracking } from '../lib/analytics/useClickTracking'

function RootComponent() {
  // Automatically tracks all navigation link clicks
  useNavigationTracking()
  
  return <YourApp />
}
```

### 4. Track Dropdown/Select Changes

```typescript
const { track } = useAnalytics()

<select
  onChange={(e) => {
    track('filter_changed', {
      filter_type: 'difficulty',
      filter_value: e.target.value
    })
    // ... rest of handler
  }}
>
  <option value="easy">Easy</option>
  <option value="medium">Medium</option>
  <option value="hard">Hard</option>
</select>
```

## What You Should Track vs What You Shouldn't

### DO Track:
- Important user actions (start practice, submit answer, use hint)
- Navigation between major sections
- Feature discovery (first time using a feature)
- Errors and abandonment
- Time spent on critical tasks

### DON'T Track:
- Every mouse movement
- Every keystroke
- Passive interactions that don't indicate intent
- Sensitive information in event parameters

## Viewing Events in GA4

1. **Real-time Reports**: See events as they happen
2. **DebugView**: Enable debug mode to see detailed event parameters
3. **Events Report**: Historical data (may take 24-48 hours)
4. **Explorations**: Create custom reports

## Enable Enhanced Measurement in GA4

To automatically track some interactions:
1. Go to GA4 Admin > Data Streams
2. Click on your web stream
3. Toggle on Enhanced Measurement
4. Enable:
   - Scrolls (you already track this)
   - Outbound clicks
   - Site search
   - Form interactions
   - File downloads

However, custom implementation gives you better control and more meaningful data.