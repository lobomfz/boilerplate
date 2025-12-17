import { Outlet, createRootRouteWithContext, redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

import { orpc } from "@/client";
import { ErrorBoundary } from "@/components/error-boundary";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context, location }) => {
    if (location.pathname === "/login") {
      return;
    }

    const user = await context.queryClient.fetchQuery(orpc.auth.me.queryOptions());

    if (!user) {
      throw redirect({ to: "/login" });
    }
  },

  component: () => (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  ),
});
