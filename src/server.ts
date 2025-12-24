import "./api/arktype";
import { rpcHandler } from "./api/app";
import homepage from "./index.html";

const port = 3000;

Bun.serve({
  port,
  development: {
    hmr: true,
    console: true,
  },
  routes: {
    "/rpc/*": async (request) => {
      const { response } = await rpcHandler.handle(request, {
        prefix: "/rpc",
        context: {},
      });
      return response ?? new Response("Not Found", { status: 404 });
    },
    "/*": homepage,
  },
});

console.log(`Servidor rodando em http://localhost:${port}`);

export type { API } from "./api/app";
