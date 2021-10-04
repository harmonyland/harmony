/**
 * ICacheAdapter is the interface to be implemented by Cache Adapters for them to be usable with Harmony.
 *
 * Methods can return Promises too.
 */
export interface ICacheAdapter {
  /** Gets a key from a Cache */
  get: <T>(
    cacheName: string,
    key: string
  ) => Promise<T | undefined> | T | undefined
  /** Sets a key to value in a Cache Name with optional expire value in MS */
  set: <T>(
    cacheName: string,
    key: string,
    value: T,
    expire?: number
  ) => Promise<void> | void
  /** Deletes a key from a Cache */
  delete: (cacheName: string, ...keys: string[]) => Promise<boolean> | boolean
  /** Gets array of all values in a Cache */
  array: <T>(cacheName: string) => undefined | T[] | Promise<T[] | undefined>
  /** Entirely deletes a Cache */
  deleteCache: (cacheName: string) => boolean | Promise<boolean>
  /** Get size (length) of entries in a Cache */
  size: <T>(
    cacheName: string,
    filter?: (payload: T) => boolean
  ) => number | undefined | Promise<number | undefined>
  /** Gets all keys of the Cache */
  keys: (
    cacheName: string
  ) => string[] | undefined | Promise<string[] | undefined>
}
