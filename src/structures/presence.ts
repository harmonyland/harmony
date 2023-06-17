import {
  ActivityGame,
  ActivityPayload,
  ClientActivity,
  ClientStatus,
  StatusType
} from '../types/presence.ts'
import { PresenceUpdatePayload, StatusUpdatePayload } from '../types/gateway.ts'
import { Base } from './base.ts'
import type { Guild } from './guild.ts'
import type { User } from './user.ts'
import type { Client } from '../client/mod.ts'

export enum ActivityTypes {
  PLAYING = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM_STATUS = 4,
  COMPETING = 5
}

export class Presence extends Base {
  user: User
  guild: Guild
  status!: StatusType
  // TODO: Maybe a new structure for this?
  activities!: ActivityPayload[]
  clientStatus!: ClientStatus

  constructor(
    client: Client,
    data: PresenceUpdatePayload,
    user: User,
    guild: Guild
  ) {
    super(client, data)
    this.user = user
    this.guild = guild
    this.fromPayload(data)
  }

  fromPayload(data: PresenceUpdatePayload): Presence {
    this.status = data.status
    this.activities = data.activities
    this.clientStatus = data.client_status
    return this
  }
}

interface StatusPayload extends StatusUpdatePayload {
  client_status?: ClientStatus
}

export class ClientPresence {
  status: StatusType = 'online'
  activity?: ActivityGame | ActivityGame[]
  since?: number | null
  afk?: boolean
  clientStatus?: ClientStatus

  constructor(data?: ClientActivity | StatusPayload | ActivityGame) {
    if (data !== undefined) {
      if (['name', 'type', 'url'].some((k) => k in data)) {
        // ActivityGame
        if (this.activity === undefined) {
          this.activity = data as ActivityGame
        } else if (this.activity instanceof Array) {
          this.activity.push(data as ActivityGame)
        } else this.activity = [this.activity, data as ActivityGame]
      } else if (['client_status', 'activities'].some((k) => k in data)) {
        // StatusPayload
        this.parse(data as StatusPayload)
      } else if (
        ['since', 'activity', 'status', 'afk'].some((k) => k in data)
      ) {
        // ClientActivity
        Object.assign(this, data)
      }
    }
  }

  /** Parses from Payload */
  parse(payload: StatusPayload): ClientPresence {
    this.afk = payload.afk
    this.activity = payload.activities ?? undefined
    this.since = payload.since
    this.status = payload.status
    // this.clientStatus = payload.client_status
    return this
  }

  /** Parses from Payload and creates new ClientPresence */
  static parse(payload: StatusUpdatePayload): ClientPresence {
    return new ClientPresence().parse(payload)
  }

  /** Creates Presence Payload */
  create(): StatusPayload {
    return {
      afk: this.afk === undefined ? false : this.afk,
      activities: this.createActivity() ?? [],
      since:
        this.since === undefined
          ? this.status === 'idle'
            ? Date.now()
            : null
          : this.since,
      status: this.status === undefined ? 'online' : this.status
      // client_status: this.clientStatus
    }
  }

  /** Creates Activity Payload */
  createActivity(): ActivityGame[] | null {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const activity =
      this.activity === undefined
        ? null
        : this.activity instanceof Array
        ? this.activity
        : [this.activity]
    if (activity === null) return activity
    else {
      activity.map((e) => {
        if (typeof e.type === 'string') e.type = ActivityTypes[e.type]
        return e
      })
      return activity
    }
  }

  /** Set Status of Presence */
  setStatus(status: StatusType): ClientPresence {
    this.status = status
    return this
  }

  /** Set Activity for Presence */
  setActivity(activity: ActivityGame): ClientPresence {
    this.activity = activity
    return this
  }

  /** Set Activities for Presence */
  setActivities(activities: ActivityGame[]): ClientPresence {
    this.activity = activities
    return this
  }

  /** Set AFK value */
  setAFK(afk: boolean): ClientPresence {
    this.afk = afk
    return this
  }

  /** Remove AFK (set false) */
  removeAFK(): ClientPresence {
    this.afk = false
    return this
  }

  /** Toggle AFK (boolean) value */
  toggleAFK(): ClientPresence {
    this.afk = this.afk === undefined ? true : !this.afk
    return this
  }

  /** Set Since property of Activity */
  setSince(since?: number): ClientPresence {
    this.since = since
    return this
  }
}
