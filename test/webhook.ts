import { MessageAttachment, Webhook } from "../mod.ts";
import { WEBHOOK } from "./config.ts";

const hook = await Webhook.fromURL(WEBHOOK)

await hook.send({
  file: await MessageAttachment.load(
    "https://cdn.discordapp.com/emojis/783639203153575948.png?size=96",
  ),
});
