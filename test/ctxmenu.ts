import * as harmony from '../mod.ts'
import { TOKEN } from "./config.ts";

const client = new harmony.Client({
  token: TOKEN,
  intents: ['GUILDS']
})

client.on('interactionCreate', (d) => {

})

client.slash.handle('View')

client.slash.commands.bulkEdit([
  {
    name: 'View Embed JSON',
    type: 'MESSAGE'
  },
  {
    name: 'View User JSON',
    type: 'USER'
  }
], '796721933098024960')

client.connect().then(() => console.log('Connected!'))
