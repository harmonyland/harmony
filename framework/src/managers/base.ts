import type { Client } from "../client/mod.ts";

export declare class BaseManager<P, T> {
  client: Client;

  constructor(client: Client);

  _get(key: string): P | undefined;
  _fetch(key: string): Promise<P | undefined>;

  // try _get first, if not found, fetch
  get(key: string): Promise<T | undefined>;
  fetch(key: string): Promise<T | undefined>;

  set(key: string, value: P): void;

  delete(key: string): boolean;
}
