import type { Client } from "../client/mod.ts";
import type { BaseManager } from "./base.ts";

export class BaseChildManager<P, T> {
  client: Client;
  parent: BaseManager<P, T>;

  constructor(client: Client, parent: BaseManager<P, T>) {
    this.client = client;
    this.parent = parent;
  }

  _get(key: string): P | undefined {
    return this.parent._get(key);
  }
  _fetch(_key: string, ..._: string[]): Promise<P | undefined> {
    throw new Error("Not implemented");
  }

  // try _get first, if not found, fetch
  get(_key: string): T | undefined {
    throw new Error("Not implemented");
  }
  fetch(_key: string, ..._: string[]): Promise<T | undefined> {
    throw new Error("Not implemented");
  }

  set(key: string, value: P): void {
    this.parent.set(key, value);
  }

  delete(key: string): boolean {
    return this.parent.delete(key);
  }

  async resolve(key: string): Promise<T | undefined> {
    return this.get(key) ?? await this.fetch(key);
  }
}
