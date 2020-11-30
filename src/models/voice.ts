import { Client } from './client.ts'

export class VoiceClient {
  client: Client

  constructor(client: Client) {
    this.client = client
    
  }
}