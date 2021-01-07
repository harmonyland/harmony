import { UserPayload } from './user.ts'

export interface ApplicationPayload {
  id: string
  name: string
  icon: string
  description: string
  summary: string
  bot?: UserPayload
}
