import "../setup-dom";
import "../../helpers/api-server";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { TestSeed } from "../../helpers/seed";
import { get, slot } from "../dom";
import { mountApp } from "../mount-app";
import { cleanup, waitFor } from "../testing-library";

beforeEach(() => {
	TestSeed.reset();
});

afterEach(() => {
	cleanup();
});

describe("login flow", () => {
	test("submits valid credentials and clears the submitting state", async () => {
		await TestSeed.users.admin();
		const { user } = await mountApp("/login");

		await waitFor(() => get("login-page"));

		const page = get("login-page");
		await user.type(slot(page, "name-input"), "admin");
		await user.type(slot(page, "password-input"), "password");

		expect(slot(page, "submit").dataset.submitting).toBe("false");

		await user.click(slot(page, "submit"));

		await waitFor(
			() => {
				expect(slot(get("login-page"), "submit").dataset.submitting).toBe("false");
			},
			{ timeout: 5000 },
		);
	});

	test("keeps the user on /login when credentials are wrong", async () => {
		await TestSeed.users.admin();
		const { user, router } = await mountApp("/login");

		await waitFor(() => get("login-page"));

		const page = get("login-page");
		await user.type(slot(page, "name-input"), "admin");
		await user.type(slot(page, "password-input"), "wrong");
		await user.click(slot(page, "submit"));

		await waitFor(
			() => {
				expect(slot(get("login-page"), "submit").dataset.submitting).toBe("false");
			},
			{ timeout: 5000 },
		);

		expect(router.state.location.pathname).toBe("/login");
	});
});
