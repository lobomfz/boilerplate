import { db } from "./connection";

export const DbUsers = {
  async getById(id: number) {
    return db.selectFrom("users").where("id", "=", id).selectAll().executeTakeFirst();
  },

  async getByName(name: string) {
    return db.selectFrom("users").where("name", "=", name).selectAll().executeTakeFirst();
  },
};
