import { database } from "@/api/db/connection";
import { DbUsers } from "@/api/db/users";

export const TestSeed = {
	users: {
		async create(opts: { name: string; password: string; user_type?: "admin" | "user" }) {
			const user = await DbUsers.create({
				name: opts.name,
				password: await Bun.password.hash(opts.password),
				user_type: opts.user_type,
			});

			return { id: user.id, name: user.name, user_type: user.user_type };
		},

		async admin() {
			return await TestSeed.users.create({
				name: "admin",
				password: "password",
				user_type: "admin",
			});
		},
	},

	reset() {
		database.reset();
	},
};
