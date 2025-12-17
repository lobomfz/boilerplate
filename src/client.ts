import type { API } from "./api/app";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient, InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL ?? "http://localhost:5400"}/rpc`,
  fetch: (input, init) => fetch(input, { ...init, credentials: "include" }),
});

const client: RouterClient<API> = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);

export type RouterOutputs = InferRouterOutputs<API>;
export type RouterInputs = InferRouterInputs<API>;
