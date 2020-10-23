import { Client } from '../models/client.ts'

export class Base {
  // property 읍
  client: Client
  constructor (client: Client) {
    this.client = client
  }
}
// discord.js 보는중
