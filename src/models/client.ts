import { User } from '../structures/user.ts'
import { GatewayIntents } from '../types/gatewayTypes.ts'
import { Gateway } from './gateway.ts'

/**
 * Discord Client.
 */
export class Client {
  gateway?: Gateway
  user?: User
  ping = 0

  constructor () {}

  /**
   * This function is used for connect to discord.
   * @param token Your token. This is required.
   * @param intents Gateway intents in array. This is required.
   */
  connect (token: string, intents: GatewayIntents[]) {
    this.gateway = new Gateway(this, token, intents)
  }
}
