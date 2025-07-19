import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query'

export function createRouterInstance() {
  const queryClient = new QueryClient()

  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
      queryClient,
    },
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouterInstance>
  }
}