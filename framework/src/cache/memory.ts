// deno-lint-ignore-file no-explicit-any
import type { BaseCache } from "./base.ts";

export class MemoryCache implements BaseCache {
  private cache: Map<string, any>;

  constructor() {
    this.cache = new Map();
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  get length(): number {
    return this.cache.size;
  }

  get keys(): string[] {
    return [...this.cache.keys()];
  }

  get values(): any[] {
    return [...this.cache.values()];
  }

  get entries(): [string, any][] {
    return [...this.cache.entries()];
  }

  forEach(
    callbackfn: (value: any, key: string, cache: this) => void,
    thisArg?: any,
  ): void {
    this.cache.forEach((value, key) => {
      callbackfn.bind(thisArg)(value, key, this);
    });
  }

  [Symbol.iterator](): IterableIterator<[string, any]> {
    return this.cache[Symbol.iterator]();
  }
}
