import { Database, generated, type } from "@lobomfz/db";

import { envVariables } from "@/api/config/env";

export const database = new Database({
	path: envVariables.DATABASE_URL,
	schema: {
		tables: {
			users: type({
				id: generated("autoincrement"),
				name: "string",
				password: "string",
				"user_type?": type.enumerated("admin", "user").configure({ default: "user" }),
			}),
		},
	},
});

export const db = database.kysely;

export type UsersRow = (typeof database.infer)["users"];
