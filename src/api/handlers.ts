import type { Server, ServerWebSocket } from "bun";
import { getCookie } from "@orpc/server/helpers";

import { rpcHandler, wsRpcHandler } from "./app";
import { getUser, type PublicUser } from "./auth/context";

export interface WsData {
	user?: PublicUser;
}

export async function handleRpc(request: Request) {
	const { response } = await rpcHandler.handle(request, {
		prefix: "/rpc",
		context: {},
	});

	return response ?? new Response("Not Found", { status: 404 });
}

export async function handleWsUpgrade(request: Request, server: Server<WsData>) {
	const token = getCookie(request.headers, "session");
	const user = await getUser(token);

	const upgraded = server.upgrade(request, { data: { user } });

	if (!upgraded) {
		return new Response("WebSocket upgrade failed", { status: 500 });
	}
}

export const websocketConfig = {
	message(ws: ServerWebSocket<WsData>, message: string | Buffer) {
		const context = { user: ws.data.user };
		return wsRpcHandler.message(ws, message, { context });
	},
	close: (ws: ServerWebSocket<WsData>) => wsRpcHandler.close(ws),
};
