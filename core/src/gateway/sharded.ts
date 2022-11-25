import { GetGatewayBotPayload } from "../../../types/mod.ts";
import { RESTClient } from "../rest/rest_client.ts";
import { Gateway, GatewayOptions } from "./mod.ts";

export interface ShardedGatewayOptions extends Omit<GatewayOptions, "shard"> {
  shards?: number;
}

export class ShardedGateway {
  shards: Record<number, Gateway> = {};
  token: string;
  intents: number;
  options: ShardedGatewayOptions;
  shardCount?: number;

  constructor(
    token: string,
    intents: number,
    options: ShardedGatewayOptions = {},
  ) {
    this.token = token;
    this.intents = intents;
    this.options = options;
    this.shardCount = options.shards;
  }

  async getBestShardCount() {
    const restClient = new RESTClient({ token: this.token });
    const { shards }: GetGatewayBotPayload = await restClient.get(
      "/gateway/bot",
    );

    return shards;
  }

  async getShardCount() {
    if (this.shardCount) return this.shardCount;
    const shardCount = await this.getBestShardCount();
    this.shardCount = shardCount;
    return shardCount;
  }

  async spawn(shardID: number) {
    const shardCount = await this.getShardCount();
    this.shards[shardID] = new Gateway(this.token, this.intents, {
      ...this.options,
      shard: [shardID, shardCount],
    });
  }

  async spawnAll() {
    const shardCount = await this.getShardCount();
    for (let i = 0; i < shardCount; i++) {
      await this.spawn(i);
    }
  }

  async destroy(shardID: number) {
    await this.shards[shardID].disconnect();
  }

  async destroyAll() {
    for (const shardID in this.shards) {
      await this.destroy(Number(shardID));
    }
  }
}
