import {
  APIManagerOptions,
  RESTClient,
  ShardedGateway,
} from "../../../core/mod.ts";
import { EventEmitter } from "../../deps.ts";
import { ClientEvents } from "./events.ts";
import { GatewayHandlers } from "../gateway/mod.ts";
import { ShardedGatewayEvents } from "../../../mod.ts";

export interface ClientOptions extends APIManagerOptions {
  cache?: "memory" | "redis" | "none"; // TODO: implement a proper cache system
}

export class Client extends EventEmitter<ClientEvents> {
  cache: "memory" | "redis" | "none"; // TODO: implement a proper cache system
  gateway: ShardedGateway;
  rest: RESTClient;
  token: string;

  constructor(token: string, options: ClientOptions = {}) {
    super();
    this.cache = options.cache ?? "memory";
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
