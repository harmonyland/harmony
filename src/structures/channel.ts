import { Base } from './base.ts'
import { Channel as ChannelData } from '../types/channelTypes.ts'
import { Client } from '../types/clientTypes.ts'
export class Channel extends Base {
    type: Number
    client: Client
    constructor(data: ChannelData) {
        super(data.id)
        this.type = data.type
        // this.client = client
    }
}