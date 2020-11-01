import { Gateway, GatewayEventHandler } from '../index.ts'

export const resume: GatewayEventHandler = (gateway: Gateway, d: any) => {
  gateway.debug(`Session Resumed!`)
  gateway.client.emit('resume')
  gateway.client.emit('ready')
}