interface User {
  id: string
  username: string
  discriminator: string
  avatar: string | undefined
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  locale?: string
  verified?: boolean
  email?: string | undefined
  flags?: number
  premium_type?: 0 | 1 | 2
  public_flags?: number
}
