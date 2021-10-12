import { Client } from '../mod.ts'
import { TOKEN } from './config.ts'

type events = {
	'custom_event': [string]
}

const client = new Client<events>()

client.on('custom_event', (message: string) => {
	console.log(message)
})

await client.connect(TOKEN, ["GUILD_MESSAGES", "DIRECT_MESSAGES"])

client.emit('custom_event', "Hello user")