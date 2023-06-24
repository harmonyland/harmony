import type { ShardedGatewayEvents } from "../types/gateway/events.ts";
import { ShardedGateway, ShardedGatewayOptions } from "./gateway/sharded.ts";
import type { HTTPClientOptions } from "./rest/http_client.ts";
import { RESTClient } from "./rest/rest_client.ts";

export interface APIManagerOptions {
  rest?: Omit<HTTPClientOptions, "token">;
  gateway?: ShardedGatewayOptions & { intents?: number };
}

export class APIManager {
  gateway: ShardedGateway;
  rest: RESTClient;
  token: string;

  constructor(token: string, options: APIManagerOptions) {
    this.gateway = new ShardedGateway(token, options.gateway?.intents ?? 0, {
      ...options.gateway,
    });
    this.rest = new RESTClient({ token, ...options.rest });
    this.token = token;
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
    if (listener) {
      this.gateway.on(eventName, listener);
      return this;
    } else {
      return this.gateway.on(eventName);
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
    if (listener) {
      this.gateway.once(eventName, listener);
      return this;
    } else {
      return this.gateway.once(eventName);
    }
  }

  async off<K extends keyof ShardedGatewayEvents>(
    eventName?: K | undefined,
    listener?: ((...args: ShardedGatewayEvents[K]) => void) | undefined,
  ): Promise<this> {
    await this.gateway.off(eventName, listener);
    return this;
  }

  get<T>(
    ...args: Parameters<RESTClient["get"]>
  ) {
    return this.rest.get<T>(...args);
  }

  post<T>(
    ...args: Parameters<RESTClient["post"]>
  ) {
    return this.rest.post<T>(...args);
  }

  patch<T>(
    ...args: Parameters<RESTClient["patch"]>
  ) {
    return this.rest.patch<T>(...args);
  }

  put<T>(
    ...args: Parameters<RESTClient["put"]>
  ) {
    return this.rest.put<T>(...args);
  }

  delete<T>(
    ...args: Parameters<RESTClient["delete"]>
  ): ReturnType<RESTClient["delete"]> {
    return this.rest.delete<T>(...args);
  }

  spawnAll() {
    return this.gateway.spawnAll();
  }

  runAll() {
    return this.gateway.runAll();
  }

  spawnAndRunAll() {
    return this.gateway.spawnAndRunAll();
  }

  destroyAll() {
    return this.gateway.destroyAll();
  }
}
