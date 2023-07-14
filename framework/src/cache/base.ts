// deno-lint-ignore-file no-explicit-any

/**
 * This is a base model for cache systems.
 */
export declare class BaseCache {
  // You may put any needed args for cache system here.
  constructor();
  get(key: string): any;
  set(key: string, value: any): void;
  has(key: string): boolean;
  // Returns true if the key was deleted, false if an error has occured.
  delete(key: string): boolean;
  get length(): number;
  get keys(): string[];
  get values(): any[];
  get entries(): [string, any][];
  forEach(
    callbackfn: (value: any, key: string, cache: this) => void,
    thisArg?: any,
  ): void;
  [Symbol.iterator](): IterableIterator<[string, any]>;
}
