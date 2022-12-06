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

interface Listeners {
  innerListeners: ((
    ...args: GatewayEvents[keyof GatewayEvents]
  ) => void)[];
  outerListener?: (
    ...args: ShardedGatewayEvents[keyof ShardedGatewayEvents]
  ) => void;
  once: boolean;
}

export class ShardedGateway extends EventEmitter<ShardedGatewayEvents> {
  shards: Record<number, Gateway> = {};
  token: string;
  intents: number;
  options: ShardedGatewayOptions;
  shardCount?: number;
  #_listeners: Record<string, Listeners[]> = {};

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

  emit<K extends keyof ShardedGatewayEvents>(
    eventName: K,
    ...args: ShardedGatewayEvents[K]
  ): Promise<void> {
    this.#_listeners[eventName]?.forEach((l) => {
      if (l.once) {
        l.innerListeners.forEach((innerListener) => {
          Object.values(this.shards).forEach((shard) => {
            shard.off(eventName, innerListener);
          });
        });
      }
    });
    return super.emit(eventName, ...args);
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
    if (this.#_listeners[eventName] === undefined) {
      this.#_listeners[eventName] = [];
    }
    const result: Listeners = {
      innerListeners: [],
      once: false
    }
    Object.entries(this.shards).forEach(([shardID, shard]) => {
      const innerListener = (
        ...args: GatewayEvents[keyof GatewayEvents]
      ) => {
        this.emit(eventName, Number(shardID), ...args);
      };
      shard.on(eventName, innerListener);
      result.innerListeners.push(innerListener);
    });
    if (listener) {
      result.outerListener = listener;
      this.#_listeners[eventName].push(result);
      return super.on(eventName, listener);
    } else {
      this.#_listeners[eventName].push(result);
      return super.on(eventName);
    }
  }

  once<K extends keyof ShardedGatewayEvents>(
    eventName: K,
    listener: (...args: ShardedGatewayEvents[K]) => void,
  ): this;
  once<K extends keyof ShardedGatewayEvents>(
    eventName: K,
  ): Promise<ShardedGatewayEvents[K]>;
  once(
    eventName: keyof ShardedGatewayEvents,
    listener?: (
      ...args: ShardedGatewayEvents[keyof ShardedGatewayEvents]
    ) => void,
  ): this | Promise<ShardedGatewayEvents[keyof ShardedGatewayEvents]> {
    if (this.#_listeners[eventName] === undefined) {
      this.#_listeners[eventName] = [];
    }
    const result: Listeners = {
      innerListeners: [],
      once: true,
    };

    Object.entries(this.shards).forEach(([shardID, shard]) => {
      const innerListener = (
        ...args: GatewayEvents[keyof GatewayEvents]
      ) => {
        this.emit(eventName, Number(shardID), ...args);
      };
      shard.once(eventName, innerListener);
      result.innerListeners.push(innerListener);
    });
    if (listener) {
      result.outerListener = listener;
      this.#_listeners[eventName].push(result);
      return super.once(eventName, listener);
    } else {
      result.outerListener = listener;
      this.#_listeners[eventName].push(result);
      return super.once(eventName);
    }
  }

  off<K extends keyof ShardedGatewayEvents>(
    eventName?: K | undefined,
    listener?: ((...args: ShardedGatewayEvents[K]) => void) | undefined,
  ): Promise<this> {
    if (eventName) {
      if (listener) {
        const listeners = this.#_listeners[eventName];
        if (listeners) {
          const index = listeners.findIndex((l) =>
            l.outerListener === listener
          );
          if (index !== -1) {
            listeners[index].innerListeners.forEach((innerListener) => {
              Object.values(this.shards).forEach((shard) => {
                shard.off(eventName, innerListener);
              });
            });
            listeners.splice(index, 1);
          }
        }
        return super.off(eventName, listener);
      } else {
        this.#_listeners[eventName]?.forEach((l) => {
          l.innerListeners.forEach((innerListener) => {
            Object.values(this.shards).forEach((shard) => {
              shard.off(eventName, innerListener);
            });
          });
        });
        this.#_listeners[eventName] = [];
        return super.off(eventName);
      }
    } else {
      Object.entries(this.#_listeners).forEach(([eventName, listeners]) => {
        listeners.forEach((l) => {
          l.innerListeners.forEach((innerListener) => {
            Object.values(this.shards).forEach((shard) => {
              shard.off(eventName as keyof ShardedGatewayEvents, innerListener);
            });
          });
        });
      });
      this.#_listeners = {};
      return super.off();
    }
  }
}
