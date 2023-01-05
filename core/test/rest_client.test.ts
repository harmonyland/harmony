import { MessagePayload } from "../../types/mod.ts";
import { RESTClient } from "../src/rest/rest_client.ts";

Deno.test("test multiple rest methods", async () => {
  const client = new RESTClient({
    token: Deno.env.get("BOT_TOKEN")!,
  });
  const createdMessage: MessagePayload = await client.post(
    `/channels/749139969192230995/messages`,
    {
      body: { content: "a" },
    },
  );
  await client.get(
    `/channels/${createdMessage.channel_id}/messages/${createdMessage.id}`,
  );
  await client.patch(
    `/channels/${createdMessage.channel_id}/messages/${createdMessage.id}`,
    {
      body: { content: "b" },
    },
  );
});
