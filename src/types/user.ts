export interface UserPayload {
  id: string
  username: string
  discriminator: string
  avatar?: string
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  locale?: string
  verified?: boolean
  email?: string
  flags?: number
  premium_type?: 0 | 1 | 2
  public_flags?: number
}
