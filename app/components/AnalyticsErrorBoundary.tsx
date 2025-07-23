import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class AnalyticsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    console.error('Analytics Error Boundary caught error:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('Analytics Error Details:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      // Return fallback UI or just render children without analytics
      return this.props.fallback || this.props.children
    }

    return this.props.children
  }
}

// HOC to wrap components with analytics error boundary
export function withAnalyticsErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.ComponentType<P> {
  return (props: P) => (
    <AnalyticsErrorBoundary fallback={fallback}>
      <Component {...props} />
    </AnalyticsErrorBoundary>
  )
}