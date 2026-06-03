import { DbUsers } from "../src/api/db/users";

await DbUsers.create({
	name: "admin",
	password: await Bun.password.hash("password"),
});
