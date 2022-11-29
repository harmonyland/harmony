import { GetGatewayBotPayload } from "../../../types/mod.ts";
import { EventEmitter } from "../../deps.ts";
import {
  GatewayEvents,
  ShardedGatewayEvents,
} from "../../types/gateway/events.ts";
import { RESTClient } from "../rest/rest_client.ts";
import { Gateway, GatewayOptions } from "./mod.ts";

export interface ShardedGatewayOptions extends Omit<GatewayOptions, "shard"> {
  shards?: number;
}

export class ShardedGateway extends EventEmitter<ShardedGatewayEvents> {
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
    super();
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
    if (!this.shards[shardID]) return;
    await this.shards[shardID].disconnect();
  }

  async destroyAll() {
    for (const shardID in this.shards) {
      await this.destroy(Number(shardID));
    }
  }

  async run(shardID: number) {
    if (!this.shards[shardID]) return;
    await this.shards[shardID].connect();
  }

  async runAll() {
    for (const shardID in this.shards) {
      await this.run(Number(shardID));
    }
  }

  async spawnAndRun(shardID: number) {
    await this.spawn(shardID);
    await this.run(shardID);
  }

  async spawnAndRunAll() {
    await this.spawnAll();
    await this.runAll();
  }

  on<K extends keyof ShardedGatewayEvents>(
    eventName: K,
    listener: (...args: ShardedGatewayEvents[K]) => void,
  ): this;
  on<K extends keyof ShardedGatewayEvents>(
    eventName: K,
  ): AsyncIterableIterator<ShardedGatewayEvents[K]>;
  // deno fmt breaks the lsp here
  // deno-fmt-ignore
  on(
    eventName: keyof ShardedGatewayEvents,
    listener?: (
      ...args: ShardedGatewayEvents[keyof ShardedGatewayEvents]
    ) => void,
  ): this | AsyncIterableIterator<ShardedGatewayEvents[keyof ShardedGatewayEvents]> {
    Object.entries(this.shards).forEach(([shardID, shard]) => {
      const innerListener = (
        ...args: GatewayEvents[keyof ShardedGatewayEvents]
      ) => {
        this.emit(eventName, Number(shardID), ...args);
      };
      shard.on(eventName, innerListener);
    });
    if (listener) {
      return super.on(eventName, listener);
    } else {
      return super.on(eventName);
    }
  }
}
