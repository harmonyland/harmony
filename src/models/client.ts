import { User } from '../structures/user.ts'
import { GatewayIntents } from '../types/gatewayTypes.ts'
import { Gateway } from './gateway.ts'
import { Rest } from './rest.ts'
import EventEmitter from 'https://deno.land/std@0.74.0/node/events.ts'
/**
 * Discord Client.
 */
export class Client extends EventEmitter {
  gateway?: Gateway
  rest?: Rest
  user?: User
  ping = 0
  token?: string

  // constructor () {
  //   super()
  // }

  /**
   * This function is used for connect to discord.
   * @param token Your token. This is required.
   * @param intents Gateway intents in array. This is required.
   */
  connect (token: string, intents: GatewayIntents[]): void {
    this.token = token
    this.gateway = new Gateway(this, token, intents)
  }
}
