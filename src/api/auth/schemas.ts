import { type } from "arktype";

export const AuthSchemas = {
	login: type({
		name: "string >= 1",
		password: "string >= 1",
	}),
};
