import type { ShardedGatewayEvents } from "../../mod.ts";
import type { Client } from "../src/client/mod.ts";

export type GatewayHandler<
  K extends keyof ShardedGatewayEvents,
> = (
  client: Client,
  d: ShardedGatewayEvents[K],
) => void;
