interface PresenceUpdate {
    user: User
    guild_id: string
    status: string
    activities: Activity
    client_status: 
}

interface ClientStatus {
    desktop?: string
    mobile?: string
    web?: string
}

interface Activity {
    name: string
    type: 0 | 1 | 2 | 3 | 4 | 5
    url?: string | undefined
    created_at: number
    timestamps?: ActivityTimestamps
    application_id?: string
    details?: string | undefined
    state?: string | undefined
    emoji?: ActivityEmoji
    party?: ActivityParty
    assets?: ActivityAssets
    secrets?: ActivitySecrets
    instance?: boolean
    flags?: number
}

interface ActivityTimestamps {
    start?: number
    end?: number
}

interface ActivityEmoji {
    name: string
    id?: string
    animated?: boolean
}

interface ActivityParty {
    id?: string
    size?: number[]
}

interface ActivityAssets {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
}

interface ActivitySecrets {
    join?: string
    spectate?: string
    match?: string
}

enum ActivityFlags {
    INSTANCE = 1 << 0,
    JOIN = 1 << 1,
    SPECTATE = 1 << 2,
    JOIN_REQUEST = 1 << 3,
    SYNC = 1 << 4,
    PLAY = 1 << 5
}

// channel 에서 message 부분 하삼 ㄳ
//시1 오늘 7교시 수업안듣고 이거 ㅋㅋ 에바 온라인수업이라 ㅆㄱㄴ
//나도 한다 디코에서 알려주셈 뭐하면되는지