import { Kysely, ParseJSONResultsPlugin } from "kysely";
import type { DB } from "./generated/types";
import { BunSqliteDialect } from "kysely-bun-sqlite";
import { Database } from "bun:sqlite";

export const db = new Kysely<DB>({
  dialect: new BunSqliteDialect({
    database: new Database(`${import.meta.dir}/db.sqlite`),
  }),
  plugins: [new ParseJSONResultsPlugin()],
});
