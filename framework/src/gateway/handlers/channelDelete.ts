import { GatewayHandler } from "../../../types/mod.ts";

const channelDelete: GatewayHandler<"CHANNEL_DELETE"> = (
  client,
  [_, channel],
) => {
  const channelObj = client.channels.get(channel.id)!;
  client.channels.delete(channel.id);
  client.emit("channelDelete", channelObj);
};

export default channelDelete;
