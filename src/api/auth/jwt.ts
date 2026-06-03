import { type } from "arktype";
import * as jose from "jose";

import { envVariables } from "@/api/config/env";

const SECRET = new TextEncoder().encode(envVariables.JWT_SECRET);

const tokenPayloadSchema = type({
	userId: "number",
});

export type TokenPayload = typeof tokenPayloadSchema.infer;

export const JWT = {
	async create(payload: TokenPayload) {
		return await new jose.SignJWT({ ...payload })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("7d")
			.sign(SECRET);
	},

	async verify(token: string) {
		const result = await jose.jwtVerify(token, SECRET).catch(() => null);

		if (!result) {
			return null;
		}

		return tokenPayloadSchema.assert(result.payload);
	},
};
