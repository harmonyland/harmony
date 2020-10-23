import { User } from '../structures/user.ts'

export interface EmojiPayload {
  id: string
  name: string
  roles?: []
  user?: User
  require_colons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean
}
