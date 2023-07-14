import {
  APIManagerOptions,
  RESTClient,
  ShardedGateway,
} from "../../../core/mod.ts";
import { EventEmitter } from "../../deps.ts";
import { ClientEvents } from "./events.ts";
import { GatewayHandlers } from "../gateway/mod.ts";
import { ShardedGatewayEvents } from "../../../mod.ts";
import { BaseCache } from "../cache/base.ts";
import { MemoryCache } from "../cache/memory.ts";

export interface ClientOptions extends APIManagerOptions {
  cache?: BaseCache;
}

export class Client extends EventEmitter<ClientEvents> {
  gateway: ShardedGateway;
  rest: RESTClient;
  token: string;
  cache: BaseCache;

  constructor(token: string, options: ClientOptions = {}) {
    super();
    this.cache = options.cache ?? new MemoryCache();
    this.gateway = new ShardedGateway(token, options.gateway?.intents ?? 0, {
      ...options.gateway,
    });
    for (const [key, value] of Object.entries(GatewayHandlers)) {
      this.gateway.on(key as keyof ShardedGatewayEvents, (...args) => {
        value(this, args);
      });
    }
    this.rest = new RESTClient({ token, ...options.rest });
    this.token = token;
  }

  waitFor<K extends keyof ClientEvents>(
    event: K,
    check: (...args: ClientEvents[K]) => boolean,
    timeout?: number,
  ): Promise<ClientEvents[K] | []> {
    return new Promise((resolve) => {
      let timeoutID: number | undefined;
      if (timeout !== undefined) {
        timeoutID = setTimeout(() => {
          this.off(event, eventFunc);
          resolve([]);
        }, timeout);
      }
      const eventFunc = (...args: ClientEvents[K]): void => {
        if (check(...args)) {
          resolve(args);
          this.off(event, eventFunc);
          if (timeoutID !== undefined) clearTimeout(timeoutID);
        }
      };
      this.on(event, eventFunc);
    });
  }
}
