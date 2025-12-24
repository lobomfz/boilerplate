import type { API } from "./server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient, InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new RPCLink({
  url: new URL("/rpc", window.location.origin).href,
  fetch: (input, init) => fetch(input, { ...init, credentials: "include" }),
});

const client: RouterClient<API> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);

export type RouterOutputs = InferRouterOutputs<API>;
export type RouterInputs = InferRouterInputs<API>;
