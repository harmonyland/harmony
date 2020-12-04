import { Client } from '../models/client.ts'

export class Base {
  client: Client

  constructor(client: Client, _data?: any) {
    this.client = client
  }
}
