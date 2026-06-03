import { envVariables } from "./api/config/env";
import { handleRpc, handleWsUpgrade, websocketConfig, type WsData } from "./api/handlers";
import homepage from "./index.html";

Bun.serve<WsData>({
	port: envVariables.PORT,
	development: {
		hmr: true,
		console: true,
	},
	routes: {
		"/rpc/*": handleRpc,
		"/ws": handleWsUpgrade,
		"/*": homepage,
	},
	websocket: websocketConfig,
});

console.log(`Server running at http://localhost:${envVariables.PORT}`);

export type { API, WsAPI } from "./api/app";
