// I hate linter
/* eslint-disable */

import { Client, MessageComponentType } from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client({
  token: TOKEN,
  intents: []
})
