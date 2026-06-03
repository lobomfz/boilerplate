import { ORPCError } from "@orpc/server";
import { setCookie } from "@orpc/server/helpers";

import { envVariables } from "@/api/config/env";
import { DbUsers, type PublicUser } from "@/api/db/users";

import { JWT } from "./jwt";
import type { AuthSchemas } from "./schemas";

export class Auth {
	constructor(private headers: Headers | undefined) {}

	async login(input: typeof AuthSchemas.login.infer): Promise<PublicUser> {
		const user = await DbUsers.getByName(input.name);

		if (!user) {
			throw new ORPCError("UNAUTHORIZED");
		}

		const passwordMatch = await Bun.password.verify(input.password, user.password);

		if (!passwordMatch) {
			throw new ORPCError("UNAUTHORIZED");
		}

		const token = await JWT.create({ userId: user.id });

		setCookie(this.headers, "session", token, {
			httpOnly: true,
			secure: envVariables.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60,
			path: "/",
		});

		return { id: user.id, name: user.name, user_type: user.user_type };
	}

	logout() {
		setCookie(this.headers, "session", "", { maxAge: 0, path: "/" });

		return { ok: true };
	}
}
