import {
  HTTPClient,
  HTTPClientOptions,
  TokenType,
} from "./rest/http_client.ts";

export interface CoreClientOptions {
  http: HTTPClientOptions & { token: string };
}

export class CoreClient {
  http: HTTPClient;

  constructor({ http }: CoreClientOptions) {
    if (typeof http.token !== "string") {
      throw new TypeError("Expected token to be a string.");
    }

    http.tokenType ??= TokenType.Bot;

    this.http = new HTTPClient(http);
  }
}
