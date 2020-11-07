/* eslint-disable @typescript-eslint/naming-convention */
import { Client } from "../models/client.ts";

export const getBuildInfo = (client: Client): {
    os: string
    os_version: string
    browser: string
    browser_version: string
    browser_user_agent: string
    client_build_number: number
    client_event_source: null
    release_channel: string
} => {
    const os = 'Windows'
    const os_version = '10'
    let client_build_number = 71073
    const client_event_source = null
    let release_channel = 'stable'
    if (client.canary === true) {
        release_channel = 'canary'
        client_build_number = 71076
    }
    const browser = 'Firefox'
    const browser_version = '83.0'
    const browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 ' + browser + '/' + browser_version
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