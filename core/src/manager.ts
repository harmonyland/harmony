import { ShardedGateway, ShardedGatewayOptions } from "./gateway/sharded.ts";
import { HTTPClientOptions } from "./rest/http_client.ts";
import { RESTClient } from "./rest/rest_client.ts";

interface APIManagerOptions {
  rest?: Omit<HTTPClientOptions, "token">;
  gateway?: ShardedGatewayOptions & { intents?: number };
}

export class APIManager {
  gateway: ShardedGateway;
  rest: RESTClient;
  token: string;

  constructor(token: string, options: APIManagerOptions) {
    this.gateway = new ShardedGateway(token, options.gateway?.intents ?? 0);
    this.rest = new RESTClient({ token, ...options.rest });
    this.token = token;
  }

  on(...args: Parameters<ShardedGateway["on"]>) {
    this.gateway.on(...args);
  }

  once(...args: Parameters<ShardedGateway["once"]>) {
    this.gateway.once(...args);
  }

  off(...args: Parameters<ShardedGateway["off"]>) {
    this.gateway.off(...args);
  }

  get<T>(
    ...args: Parameters<RESTClient["get"]>
  ): ReturnType<RESTClient["get"]> {
    return this.rest.get<T>(...args);
  }

  post<T>(
    ...args: Parameters<RESTClient["post"]>
  ): ReturnType<RESTClient["post"]> {
    return this.rest.post<T>(...args);
  }

  patch<T>(
    ...args: Parameters<RESTClient["patch"]>
  ): ReturnType<RESTClient["patch"]> {
    return this.rest.patch<T>(...args);
  }

  put<T>(
    ...args: Parameters<RESTClient["put"]>
  ): ReturnType<RESTClient["put"]> {
    return this.rest.put<T>(...args);
  }

  delete<T>(
    ...args: Parameters<RESTClient["delete"]>
  ): ReturnType<RESTClient["delete"]> {
    return this.rest.delete<T>(...args);
  }
}
