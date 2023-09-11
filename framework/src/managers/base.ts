import { Collection } from "../cache/collection.ts";
import type { Client } from "../client/mod.ts";

export class BaseManager<P, T> {
  client: Client;
  cache: Collection<string, P>;

  constructor(client: Client) {
    this.client = client;
    this.cache = new Collection<string, P>();
  }

  _get(key: string): P | undefined {
    return this.cache.get(key);
  }
  _fetch(_key: string, ..._: string[]): Promise<P | undefined> {
    throw new Error("Not implemented");
  }

  get(_key: string): T | undefined {
    throw new Error("Not implemented");
  }
  fetch(_key: string, ..._: string[]): Promise<T | undefined> {
    throw new Error("Not implemented");
  }

  set(key: string, value: P): void {
    this.cache.set(key, value);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  async resolve(key: string): Promise<T | undefined> {
    return this.get(key) ?? await this.fetch(key);
  }
}
