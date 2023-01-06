import { ShardedGateway } from "../src/gateway/sharded.ts";

Deno.test("test receiving ready", async () => {
  const client = new ShardedGateway(Deno.env.get("BOT_TOKEN")!, 0);
  await client.spawnAll();

  const readyPromise: Promise<number> = new Promise((res) => {
    client.on("READY", res);
  });

  await client.runAll();

  const shardID = await readyPromise;
  console.log(shardID);
  await client.destroy(shardID);
});
