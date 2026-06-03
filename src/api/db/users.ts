import type { Insertable } from "kysely";

import { db, type UsersRow } from "./connection";

export const DbUsers = {
	async getPublicById(id: number) {
		return await db
			.selectFrom("users as u")
			.where("u.id", "=", id)
			.select(["u.id", "u.name", "u.user_type"])
			.executeTakeFirst();
	},

	async getByName(name: string) {
		return await db
			.selectFrom("users as u")
			.where("u.name", "=", name)
			.selectAll("u")
			.executeTakeFirst();
	},

	async create(input: Insertable<UsersRow>) {
		return await db.insertInto("users").values(input).returningAll().executeTakeFirstOrThrow();
	},
};

export type PublicUser = NonNullable<Awaited<ReturnType<typeof DbUsers.getPublicById>>>;
