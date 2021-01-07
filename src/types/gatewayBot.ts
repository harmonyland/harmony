export interface ISessionStartLimit {
  total: number
  remaining: number
  reset_after: number
}

export interface GatewayBotPayload {
  url: string
  shards: number
  session_start_limit: ISessionStartLimit
}
