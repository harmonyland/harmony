import { HTTPClient, TokenType } from "../src/rest/http_client.ts";

Deno.test("test multiple request", async () => {
  const client = new HTTPClient({
    tokenType: TokenType.Bot,
    token: Deno.env.get("BOT_TOKEN")!,
  });
  const requests = 6;
  const promises = [];
  for (let i = 0; i < requests; i++) {
    promises.push(
      client.request("POST", `/channels/749139969192230995/messages`, {
        body: { content: "kay lets try another msg" },
      }),
    );
  }
  for (let i = 0; i < requests; i++) {
    promises.push(
      client.request("POST", `/channels/847264722734546964/messages`, {
        body: { content: "kay lets try another msg" },
      }),
    );
  }
  await Promise.all(promises);
});
