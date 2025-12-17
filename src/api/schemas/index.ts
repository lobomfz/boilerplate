import { users_plain } from "../db/generated/schemas";

export const EndpointSchemas = {
  authLogin: users_plain.pick("name", "password"),
};
