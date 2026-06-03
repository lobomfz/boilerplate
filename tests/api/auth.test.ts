import { beforeEach, describe, expect, test } from "bun:test";

import { createRouterClient, ORPCError } from "@orpc/server";

import { JWT } from "@/api/auth/jwt";
import type { PublicUser } from "@/api/db/users";
import { router } from "@/api/router";

import { TestSeed } from "../helpers/seed";

beforeEach(() => {
	TestSeed.reset();
});

function unauthenticatedClient() {
	const resHeaders = new Headers();
	const client = createRouterClient(router, { context: { resHeaders } });
	return { client, resHeaders };
}

function authenticatedClient(user: PublicUser) {
	const resHeaders = new Headers();
	const client = createRouterClient(router, { context: { user, resHeaders } });
	return { client, resHeaders };
}

describe("auth.login", () => {
	test("sets session cookie and returns public user fields on valid credentials", async () => {
		const admin = await TestSeed.users.admin();
		const { client, resHeaders } = unauthenticatedClient();

		const result = await client.auth.login({ name: "admin", password: "password" });

		expect(result).toEqual(admin);

		const cookie = resHeaders.get("set-cookie");
		expect(cookie).toMatch(/^session=[^;]+;/u);
		expect(cookie).toContain("HttpOnly");
		expect(cookie).toContain("Path=/");
	});

	test("session cookie contains a valid JWT with the user id", async () => {
		const admin = await TestSeed.users.admin();
		const { client, resHeaders } = unauthenticatedClient();

		await client.auth.login({ name: "admin", password: "password" });

		const token = resHeaders.get("set-cookie")!.match(/session=([^;]+)/u)?.[1];
		const payload = await JWT.verify(token!);

		expect(payload?.userId).toBe(admin.id);
	});

	test("session cookie round-trips: login -> me returns the same user", async () => {
		const admin = await TestSeed.users.admin();
		const { client: loginClient, resHeaders } = unauthenticatedClient();

		await loginClient.auth.login({ name: "admin", password: "password" });

		const token = resHeaders.get("set-cookie")!.match(/session=([^;]+)/u)?.[1];
		const reqHeaders = new Headers({ cookie: `session=${token}` });
		const meClient = createRouterClient(router, { context: { reqHeaders } });

		const me = await meClient.auth.me({});

		expect(me).toEqual(admin);
	});

	test("throws UNAUTHORIZED when user does not exist", async () => {
		const { client } = unauthenticatedClient();

		const err = await client.auth
			.login({ name: "ghost", password: "password" })
			.catch((e: any) => e);

		expect(err).toBeInstanceOf(ORPCError);
		expect(err.code).toBe("UNAUTHORIZED");
	});

	test("throws UNAUTHORIZED on wrong password", async () => {
		await TestSeed.users.admin();
		const { client } = unauthenticatedClient();

		const err = await client.auth.login({ name: "admin", password: "wrong" }).catch((e: any) => e);

		expect(err).toBeInstanceOf(ORPCError);
		expect(err.code).toBe("UNAUTHORIZED");
	});
});

describe("auth.logout", () => {
	test("clears the session cookie when authenticated", async () => {
		const admin = await TestSeed.users.admin();
		const { client, resHeaders } = authenticatedClient(admin);

		const result = await client.auth.logout({});

		expect(result).toEqual({ ok: true });
		const cookie = resHeaders.get("set-cookie");
		expect(cookie).toContain("session=");
		expect(cookie).toContain("Max-Age=0");
	});

	test("throws UNAUTHORIZED when no user in context", async () => {
		const client = createRouterClient(router, { context: {} });

		const err = await client.auth.logout({}).catch((e: any) => e);

		expect(err).toBeInstanceOf(ORPCError);
		expect(err.code).toBe("UNAUTHORIZED");
	});
});

describe("auth.me", () => {
	test("returns the authenticated user", async () => {
		const admin = await TestSeed.users.admin();
		const { client } = authenticatedClient(admin);

		const result = await client.auth.me({});

		expect(result).toEqual(admin);
	});

	test("throws UNAUTHORIZED when no user in context", async () => {
		const client = createRouterClient(router, { context: {} });

		const err = await client.auth.me({}).catch((e: any) => e);

		expect(err).toBeInstanceOf(ORPCError);
		expect(err.code).toBe("UNAUTHORIZED");
	});
});
