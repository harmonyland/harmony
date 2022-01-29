import { Endpoint } from "../../../types/src/endpoints.ts";

const CHANNELS_OR_GUILDS_BUCKET_REGEX = /\/(channels|guilds)\/\d{15,20}/;

/**
 * Based on https://discord.com/developers/docs/topics/rate-limits#rate-limits
 *
 * @param endpoint Endpoint string.
 * @returns Bucket identifier for the given endpoint.
 */
export function getRouteBucket(endpoint: Endpoint) {
  // Reaction rate-limits are channel-specific. Message ID part is simply ignored.
  if (endpoint.includes("/reactions")) {
    return endpoint.substring(0, endpoint.indexOf("/reactions"));
    // Currently, only channels and guilds are major parameters.
  } else if (CHANNELS_OR_GUILDS_BUCKET_REGEX.test(endpoint)) {
    return endpoint.replaceAll(CHANNELS_OR_GUILDS_BUCKET_REGEX, "/$1/id");
    // Else, just return the endpoint as bucket identifier.
  } else {
    return endpoint;
  }
}
