import { Client } from "../models/client.ts"
import { WebhookPayload } from "../types/webhookTypes.ts"
import { Base } from "./base.ts"
import { User } from "./user.ts"

export class VoiceState extends Base implements WebhookPayload {
    id: string
    type: 1 | 2
    guild_id?: string
    channel_id: string
    user?: User
    name: string | undefined
    avatar: string | undefined
    token?: string
    application_id: string | undefined

    constructor (client: Client, data: WebhookPayload) {
        super(client)
        this.id = data.id
        this.type = data.type
        this.channel_id = data.channel_id
    }
}