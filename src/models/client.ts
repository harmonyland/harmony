import { User } from '../structures/user.ts'
import { GatewayIntents } from '../types/gatewayTypes.ts'
import { Gateway } from './gateway.ts'
import { Rest } from './rest.ts'

/**
 * Discord Client.
 */
export class Client {
  gateway?: Gateway
  rest?: Rest
  user?: User
  ping = 0
  token?: string

  constructor () {}

  /**
   * This function is used for connect to discord.
   * @param token Your token. This is required.
   * @param intents Gateway intents in array. This is required.
   */
  connect (token: string, intents: GatewayIntents[]) {
    this.token = token
    this.gateway = new Gateway(this, token, intents)
  }
}
