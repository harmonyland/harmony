import { Client } from "../models/client.ts";

export const getBuildInfo = (client: Client) => {
    let os = 'Windows'
    let os_version = '10'
    let client_build_number = 71073
    let client_event_source = null
    let release_channel = 'stable'
    if (client.canary) {
        release_channel = 'canary'
        client_build_number = 71076
    }
    let browser = 'Firefox'
    let browser_version = '83.0'
    let browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 ' + browser + '/' + browser_version
    // TODO: Use current OS properties, but also browser_user_agent accordingly
    // if (Deno.build.os === 'darwin') os = 'MacOS'
    // else if (Deno.build.os === 'linux') os = 'Ubuntu'

    return {
        os,
        os_version,
        browser,
        browser_version,
        browser_user_agent,
        client_build_number,
        client_event_source,
        release_channel,
    }
};