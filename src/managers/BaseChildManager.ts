import { Client } from "../models/client.ts";
import { Collection } from "../utils/collection.ts";
import { BaseManager } from "./BaseManager.ts";

export class BaseChildManager<T, T2> {
  client: Client
  parent: BaseManager<T, T2>

  constructor(client: Client, parent: BaseManager<T, T2>) {
    this.client = client
    this.parent = parent
  }

  async get(key: string): Promise<T2 | undefined> {
    return this.parent.get(key)
  }

  async set(key: string, value: T): Promise<void> {
    return this.parent.set(key, value)
  }

  async delete(key: string): Promise<any> {
    return false
  }

  async array(): Promise<any> {
    return this.parent.array()
  }

  async collection(): Promise<Collection<string, T2>> {
    const arr = await this.array() as undefined | T2[]
    if(arr === undefined) return new Collection()
    const collection = new Collection()
    for (const elem of arr) {
      // @ts-expect-error
      collection.set(elem.id, elem)
    }
    return collection
  }
}