import { ORPCError } from "@orpc/client";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { orpc } from "@/client";

export const Route = createFileRoute("/_app")({
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.fetchQuery(orpc.auth.me.queryOptions()).catch((err) => {
			if (err instanceof ORPCError && err.code === "UNAUTHORIZED") {
				redirect({ to: "/login", throw: true });
			}
			throw err;
		});

		return { user };
	},

	component: AppLayout,
});

function AppLayout() {
	return <Outlet />;
}
