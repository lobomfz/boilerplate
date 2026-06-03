import { act, cleanup as rtlCleanup, render, waitFor } from "@testing-library/react";

import { TestQueryClients } from "./query-clients";

export { render, waitFor };
export { default as userEvent } from "@testing-library/user-event";

export function cleanup() {
	act(() => {
		rtlCleanup();
		TestQueryClients.clear();
	});
}
