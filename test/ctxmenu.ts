import * as harmony from '../mod.ts'
import { TOKEN } from "./config.ts";

const client = new harmony.Client({
  token: TOKEN,
  intents: ['GUILDS']
})

client.on('interactionCreate', (d) => {

})

client.slash.commands.bulkEdit([
  
], '796721933098024960')

client.connect().then(() => console.log('Connected!'))
