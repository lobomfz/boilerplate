import "../arktype";
import { type } from "arktype";

const envSchema = type({
	DATABASE_URL: "string",
	JWT_SECRET: "string",
	"NODE_ENV?": "'development' | 'production' | 'test'",
	PORT: type("string.numeric.parse").default("3000"),
});

export const envVariables = envSchema.assert(process.env);
