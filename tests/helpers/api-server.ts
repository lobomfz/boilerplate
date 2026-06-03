import { envVariables } from "@/api/config/env";
import { handleRpc, handleWsUpgrade, websocketConfig, type WsData } from "@/api/handlers";

const API_SERVER = Symbol.for("boilerplate.tests.api-server");

if (!Reflect.get(globalThis, API_SERVER)) {
	const server = Bun.serve<WsData>({
		port: envVariables.PORT,
		fetch(request, server) {
			const url = new URL(request.url);

			if (url.pathname === "/ws") {
				return handleWsUpgrade(request, server);
			}

			if (url.pathname.startsWith("/rpc")) {
				return handleRpc(request);
			}

			return new Response("Not Found", { status: 404 });
		},
		websocket: websocketConfig,
	});

	Reflect.set(globalThis, API_SERVER, server);

	const stop = () => server.stop(true);

	process.on("SIGINT", stop);
	process.on("SIGTERM", stop);
	process.on("beforeExit", stop);
}
