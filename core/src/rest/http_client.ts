import {
  DISCORD_API_BASE,
  DISCORD_API_VERSION,
  USER_AGENT,
} from "../../../types/src/constants.ts";
import { Endpoint } from "../../../types/src/endpoints.ts";
import { getRouteBucket } from "./bucket.ts";
import {
  DiscordAPIError,
  DiscordAPIInternalError,
  DiscordAPITimeoutError,
} from "./errors.ts";

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestOptions {
  bucket?: string;
  body?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  reason?: string;
}

/**
 * Represents the token type to be used for authorization.
 *
 * Bearer token is used in OAuth2 protocol.
 * While Bot token is used for authorizing a Bot User account.
 */
export enum TokenType {
  Bearer = "Bearer",
  Bot = "Bot",
  None = "",
}

export interface HTTPClientOptions {
  /** Type of token used for authorization. Defaults to `TokenType.Bot`. */
  tokenType?: TokenType;

  /** Token to be used for authorization. */
  token?: string;

  /** The User-Agent value to set. Default is a library name and repo URL. */
  userAgent?: string;

  /**
   * The base URL to use for requests.
   *
   * Default is exported as `DISCORD_BAPI_BASE` from `types/src/constants.ts`.
   */
  baseURL?: string;

  /**
   * The API version to use for requests.
   *
   * Default is exported as `DISCORD_API_VERSION` from `types/src/constants.ts`.
   */
  version?: number;

  /** Max request retries. Defaults to 5. */
  maxRetries?: number;

  /** Request timeout in milliseconds. Defaults to 10000. */
  timeout?: number;
}

export class Queue {
  #promises: {
    wait: Promise<void>;
    resolve: () => void;
  }[] = [];

  resetTime = 0;

  get length() {
    return this.#promises.length;
  }

  async wait() {
    if (this.resetTime > Date.now()) {
      await new Promise((r) => setTimeout(r, this.resetTime - Date.now()));
    }

    const next = this.#promises[this.#promises.length - 1]?.wait ??
      Promise.resolve();

    let resolve!: () => void;
    const wait = new Promise<void>((r) => (resolve = r));

    this.#promises.push({
      wait,
      resolve,
    });

    await next;
  }

  shift() {
    let item;
    if ((item = this.#promises.shift())) {
      item.resolve();
    }
  }
}

/**
 * HTTP Client manages requests to be sent to Discord REST API.
 *
 * This client manages rate limits, authorization, retries, etc.
 */
export class HTTPClient implements HTTPClientOptions {
  tokenType?: TokenType;
  token?: string;
  userAgent: string;
  baseURL: string;
  version: number;
  maxRetries = 5;
  timeout = 10000;

  private queue = new Map<string, Queue>();

  constructor(options?: HTTPClientOptions) {
    this.tokenType = options?.tokenType ?? TokenType.Bot;
    this.token = options?.token;
    this.userAgent = options?.userAgent ?? USER_AGENT;
    this.baseURL = options?.baseURL ?? DISCORD_API_BASE;
    this.version = options?.version ?? DISCORD_API_VERSION;
    this.maxRetries = options?.maxRetries ?? this.maxRetries;
    this.timeout = options?.timeout ?? this.timeout;
  }

  async request<T>(
    method: HTTPMethod,
    endpoint: Endpoint,
    options?: RequestOptions,
  ) {
    const bucket = options?.bucket ?? getRouteBucket(endpoint);
    const queue = this.queue.get(bucket) ??
      (this.queue.set(bucket, new Queue()), this.queue.get(bucket)!);

    const execute = async (): Promise<T> => {
      await queue.wait();

      // Enqueue it and wait for the queue to be resolved.
      const headers: Record<string, string> = {
        "user-agent": this.userAgent,
      };

      if (this.token !== undefined && this.tokenType !== undefined) {
        headers["authorization"] = `${this.tokenType} ${this.token}`.trim();
      }

      if (options?.headers !== undefined) {
        Object.assign(headers, options.headers);
      }

      let body = undefined;
      if (
        ["POST", "PATCH", "PUT"].includes(method)
      ) {
        // It's multipart formdata.
        if (options?.body instanceof FormData) {
          body = options.body;
        } else {
          if (typeof options?.body === "object") {
            // It's a simple JSON body.
            body = JSON.stringify(
              options.body,
              (_, v) => typeof v === "bigint" ? v.toString() : v,
            );
            headers["content-type"] = "application/json";
          } else {
            // Default to empty body to avoid Cloudflare errors.
            body = "";
          }
        }
      }

      const abortController = new AbortController();
      const timeoutID = setTimeout(() => {
        abortController.abort();
      }, this.timeout);

      const res = await fetch(
        `${this.baseURL}/v${this.version}${endpoint}`,
        {
          method,
          headers,
          body,
          signal: abortController.signal,
        },
      );

      clearTimeout(timeoutID);

      const resetTime = Date.now() +
        Number(res.headers.get("X-RateLimit-Reset-After")) * 1000 + 5; // add a little bit of delay to avoid 429s
      queue.resetTime = resetTime;
      if (res.headers.get("X-RateLimit-Global") === "true") {
        this.queue.forEach((q) => {
          if (q.resetTime < resetTime) {
            q.resetTime = resetTime;
          }
        });
      }

      queue.shift();
      if (res.ok) {
        if (res.status === 204) return null as unknown as T;
        return res.json();
      } else if (res.status >= 500 && res.status < 600) {
        await res.body?.cancel();
        throw new DiscordAPIInternalError(
          res.status,
          `Discord API Internal Server Error (${res.status})`,
        );
      } else if (res.status >= 400 && res.status < 500) {
        const body = await res.text();
        throw new DiscordAPIError(
          res.status,
          body,
          `Discord API Error (${res.status}): ${body}`,
        );
      } else {
        await res.body?.cancel();
        throw new Error(
          `What in the world is this code? (${res.status})`,
        );
      }
    };

    let tries = 0;
    let nextCause;
    while (tries < this.maxRetries) {
      try {
        return await execute();
      } catch (error) {
        if (error instanceof DiscordAPIError) {
          throw error;
        }
        tries++;
        if (nextCause !== undefined) error.cause = nextCause;
        if (tries === this.maxRetries) {
          if (error instanceof DOMException && error.name === "AbortError") {
            throw new DiscordAPITimeoutError(this.timeout, "Request timed out");
          }
          throw error;
        } else {
          nextCause = error;
        }
      }
    }
    throw new Error("Unreachable");
  }

  [Symbol.for("Deno.customInspect")]() {
    return "HTTPClient";
  }
}
