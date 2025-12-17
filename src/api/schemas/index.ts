import { type } from "arktype";

export const EndpointSchemas = {
  authLogin: type({
    name: "string",
    password: "string",
  }),
};
