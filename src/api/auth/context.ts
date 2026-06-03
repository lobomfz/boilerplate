import { os } from "@orpc/server";
import { getCookie } from "@orpc/server/helpers";

import { DbUsers, type PublicUser } from "@/api/db/users";

import { JWT } from "./jwt";

export type { PublicUser } from "@/api/db/users";

interface Context {
	reqHeaders?: Headers;
	resHeaders?: Headers;
	user?: PublicUser;
}

export async function getUser(token: string | undefined) {
	if (!token) {
		return;
	}

	const payload = await JWT.verify(token);

	if (!payload) {
		return;
	}

	return await DbUsers.getPublicById(payload.userId);
}

const base = os.$context<Context>().errors({ UNAUTHORIZED: {} });

const authMiddleware = base.middleware(async ({ context, next }) => {
	if (context.user !== undefined) {
		return next({ context: { user: context.user } });
	}

	const token = getCookie(context.reqHeaders, "session");
	const user = await getUser(token);

	return next({ context: { user } });
});

export const publicProcedure = base.use(authMiddleware);

export const protectedProcedure = publicProcedure.use(({ context, next, errors }) => {
	if (!context.user) {
		throw errors.UNAUTHORIZED();
	}

	return next({ context: { user: context.user } });
});
