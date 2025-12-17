import { protectedProcedure, publicProcedure } from "./auth/context";
import { Auth } from "./auth/login";
import { EndpointSchemas } from "./schemas";

export const router = {
  auth: {
    login: publicProcedure
      .input(EndpointSchemas.authLogin)
      .handler(({ input, context }) => Auth.login(input, context.resHeaders)),

    logout: protectedProcedure.handler(({ context }) => Auth.logout(context.resHeaders)),

    me: protectedProcedure.handler(({ context }) => context.user ?? null),
  },
};
