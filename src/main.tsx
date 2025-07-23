import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '../app/routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PostHogProvider } from '../app/lib/analytics/PostHogProvider'
import { DelayedPostHogInit } from '../app/lib/analytics/DelayedPostHogInit'
import { AnalyticsErrorBoundary } from '../app/components/AnalyticsErrorBoundary'
import '../app/styles/globals.css'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AnalyticsErrorBoundary>
        <DelayedPostHogInit />
        <PostHogProvider>
          <RouterProvider router={router} />
        </PostHogProvider>
      </AnalyticsErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>
)