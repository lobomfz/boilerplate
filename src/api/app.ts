import "./arktype";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin, RequestHeadersPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins";

import { router } from "./router";

const handler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin({
      origin: "http://localhost:3000",
      credentials: true,
    }),
    new RequestHeadersPlugin(),
    new ResponseHeadersPlugin(),
  ],
});

Bun.serve({
  port: 5400,
  async fetch(request: Request) {
    const { matched, response } = await handler.handle(request, {
      prefix: "/rpc",
      context: {},
    });

    if (matched) {
      return response;
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log("Backend rodando em http://localhost:5400");

export type API = typeof router;
