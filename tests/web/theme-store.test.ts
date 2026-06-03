import "./setup-dom";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { useThemeStore } from "@/stores/theme";

beforeEach(() => {
	localStorage.clear();
	useThemeStore.setState({ theme: "dark" });
});

afterEach(() => {
	localStorage.clear();
});

describe("useThemeStore", () => {
	test("starts with dark theme", () => {
		expect(useThemeStore.getState().theme).toBe("dark");
	});

	test("setTheme replaces the current theme", () => {
		useThemeStore.getState().setTheme("light");
		expect(useThemeStore.getState().theme).toBe("light");
	});

	test("toggleTheme flips dark -> light -> dark", () => {
		useThemeStore.getState().toggleTheme();
		expect(useThemeStore.getState().theme).toBe("light");

		useThemeStore.getState().toggleTheme();
		expect(useThemeStore.getState().theme).toBe("dark");
	});

	test("persists theme in localStorage under theme-storage", () => {
		useThemeStore.getState().setTheme("light");

		const raw = localStorage.getItem("theme-storage");
		expect(raw).not.toBeNull();
		expect(JSON.parse(raw!).state.theme).toBe("light");
	});
});
