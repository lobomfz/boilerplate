import "./setup-dom";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useThemeStore } from "@/stores/theme";

import { get } from "./dom";
import { cleanup, render, userEvent } from "./testing-library";

beforeEach(() => {
	localStorage.clear();
	useThemeStore.setState({ theme: "dark" });
});

afterEach(() => {
	cleanup();
	localStorage.clear();
});

describe("ThemeToggle", () => {
	test("exposes current theme via data-theme", () => {
		render(<ThemeToggle />);
		expect(get("theme-toggle").dataset.theme).toBe("dark");
	});

	test("clicking flips the theme from dark to light", async () => {
		const user = userEvent.setup();
		render(<ThemeToggle />);

		await user.click(get("theme-toggle"));
		expect(get("theme-toggle").dataset.theme).toBe("light");
	});
});
