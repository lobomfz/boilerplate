import { RPCHandler } from "@orpc/server/fetch";
import { RequestHeadersPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins";

import { router } from "./router";

export const rpcHandler = new RPCHandler(router, {
  plugins: [new RequestHeadersPlugin(), new ResponseHeadersPlugin()],
});

export type API = typeof router;
