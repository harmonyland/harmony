import type { Client } from '../client/mod.ts'
import { Base } from '../structures/base.ts'
import { Collection } from '../utils/collection.ts'
import { BaseManager } from './base.ts'

/** Child Managers validate data from their parents i.e. from Managers */
export class BaseChildManager<T, T2> extends Base {
  /** Parent Manager */
  parent: BaseManager<T, T2>

  constructor(client: Client, parent: BaseManager<T, T2>) {
    super(client)
    this.parent = parent
  }

  get cacheName(): string {
    return this.parent.cacheName
  }

  async get(key: string): Promise<T2 | undefined> {
    return this.parent.get(key)
  }

  async set(key: string, value: T): Promise<void> {
    return this.parent.set(key, value)
  }

  async delete(_: string): Promise<any> {
    return false
  }

  async array(): Promise<any> {
    return this.parent.array()
  }

  async collection(): Promise<Collection<string, T2>> {
    const arr = (await this.array()) as undefined | T2[]
    if (arr === undefined) return new Collection()
    const collection = new Collection()
    for (const elem of arr) {
      // any is required here. Else you would need ts-ignore or expect-error.
      collection.set((elem as any).id, elem)
    }
    return collection
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<T2> {
    const arr = (await this.array()) ?? []
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    arr.forEach((el: unknown) => writer.write(el))
    writer.close()
    yield* readable
  }

  async fetch(...args: unknown[]): Promise<T2 | undefined> {
    return this.parent.fetch(...args)
  }

  /** Try to get value from cache, if not found then fetch */
  async resolve(key: string): Promise<T2 | undefined> {
    const cacheValue = await this.get(key)
    if (cacheValue !== undefined) return cacheValue
    else {
      const fetchValue = await this.fetch(key).catch(() => undefined)
      if (fetchValue !== undefined) return fetchValue
    }
  }

  /** Gets number of values stored in Cache */
  async size(): Promise<number> {
    return this.parent.size()
  }

  [Deno.customInspect](): string {
    return `ChildManager(${this.cacheName})`
  }
}
