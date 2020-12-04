/* eslint-disable @typescript-eslint/naming-convention */
import { Client } from '../models/client.ts'

/** Gets Discord Build info for self-bot support */
export const getBuildInfo = (
  client: Client
): {
  os: string
  os_version: string
  browser: string
  browser_version: string
  browser_user_agent: string
  client_build_number: number
  client_event_source: null
  release_channel: string
} => {
  let os = 'Windows'
  let os_version = '10'
  let client_build_number = 71073
  const client_event_source = null
  let release_channel = 'stable'
  if (client.canary === true) {
    release_channel = 'canary'
    client_build_number = 71076
  }
  let browser = 'Firefox'
  let browser_version = '83.0'
  let browser_user_agent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 ' +
    browser +
    '/' +
    browser_version
  // TODO: Use current OS properties, but also browser_user_agent accordingly
  if (Deno.build.os === 'darwin') {
    os = 'MacOS'
    os_version = '10.15.6'
    browser = 'Firefox'
    browser_version = '14.0.1'
    browser_user_agent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Safari/605.1.15'
  }
  // else if (Deno.build.os === 'linux') os = 'Ubuntu'

  return {
    os,
    os_version,
    browser,
    browser_version,
    browser_user_agent,
    client_build_number,
    client_event_source,
    release_channel
  }
}
