import type { GatewayDataType } from "../../types/mod.ts";
import type { Client } from "../src/client/mod.ts";

export type GatewayHandler<T extends GatewayDataType> = (
  client: Client,
  d: T,
) => void;
