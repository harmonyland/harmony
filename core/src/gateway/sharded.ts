import { GetGatewayBotPayload } from "../../../types/mod.ts";
import { RESTClient } from "../rest/rest_client.ts";
import { Gateway, GatewayOptions } from "./mod.ts";

export interface ShardedGatewayOptions extends Omit<GatewayOptions, "shard"> {
  shards: number;
}

export class ShardedGateway {
  shards: Gateway[] = [];
  token: string;
  intents: number;
  options: GatewayOptions;

  constructor(
    token: string,
    intents: number,
    options = {},
  ) {
    this.token = token;
    this.intents = intents;
    this.options = options;
  }

  async getBestShardCount() {
    const restClient = new RESTClient({ token: this.token });
    const { shards }: GetGatewayBotPayload = await restClient.get(
      "/gateway/bot",
    );

    return shards;
  }

  async spawn() {
    const shardCount = await this.getBestShardCount();
    for (let i = 0; i < shardCount; i++) {
      this.shards.push(
        new Gateway(this.token, this.intents, {
          ...this.options,
          shard: [i, shardCount],
        }),
      );
    }
  }
}
