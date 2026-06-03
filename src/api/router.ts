import { AuthSchemas } from "./auth/schemas";
import { protectedProcedure, publicProcedure } from "./auth/context";
import { Auth } from "./auth/login";
import { PubSub } from "./pubsub";

export const router = {
	auth: {
		login: publicProcedure
			.input(AuthSchemas.login)
			.handler(({ input, context }) => new Auth(context.resHeaders).login(input)),

		logout: protectedProcedure.handler(({ context }) => new Auth(context.resHeaders).logout()),

		me: protectedProcedure.handler(({ context }) => context.user),
	},

	testNotification: protectedProcedure.handler(async ({ context }) => {
		await PubSub.publish("notification", context.user, {
			id: crypto.randomUUID(),
			title: "Test notification",
			message: "You received a test notification.",
		});

		return { sent: true };
	}),
};

export const wsRouter = {
	auth: {
		me: protectedProcedure.handler(({ context }) => context.user),
	},

	notifications: protectedProcedure.handler(({ context, signal }) =>
		PubSub.subscribe("notification", context.user, signal),
	),
};
