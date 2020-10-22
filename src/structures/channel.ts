import { Base } from '../structures/mod.ts'
import { Channel as ChannelData, Client } from '../types/mod.ts'
export class Channel extends Base {
    type: Number
    client: Client
    constructor(data: ChannelData, client: Client) {
        super(data.id)
        this.type = data.type
        this.client = client
    }
}