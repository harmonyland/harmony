import { Webhook, MessageAttachment } from '../mod.ts'

const hook = await Webhook.fromURL(Deno.env.get('WEBHOOK')!)
await hook.send({
  file: await MessageAttachment.load(
    'https://cdn.discordapp.com/emojis/783639203153575948.png?size=96'
  )
})
