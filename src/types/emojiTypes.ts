import { UserPayload } from './userTypes.ts'

export interface EmojiPayload {
  id: string
  name: string
  roles?: []
  user?: UserPayload
  require_colons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean
}
