import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen";

import { TestQueryClients } from "./query-clients";
import { render, userEvent } from "./testing-library";

export async function mountApp(initialPath: string) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false, throwOnError: false },
			mutations: { retry: false },
		},
	});

	TestQueryClients.add(queryClient);

	const router = createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries: [initialPath] }),
		context: { queryClient },
	});

	await router.load();

	const user = userEvent.setup();

	render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
	);

	return { user, queryClient, router };
}
