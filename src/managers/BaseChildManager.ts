import { Client } from "../models/client.ts";
import { BaseManager } from "./BaseManager.ts";

export class BaseChildManager<T, T2> {
  client: Client
  parent: BaseManager<T, T2>

  constructor(client: Client, parent: BaseManager<T, T2>) {
    this.client = client
    this.parent = parent
  }

  async get(key: string): Promise<T2 | void> {
    return await this.parent.get(key)
  }

  async set(key: string, value: T) {
    return await this.parent.set(key, value)
  }

  async delete(key: string): Promise<any> {
    return false
  }
}