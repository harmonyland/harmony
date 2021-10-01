import type { Client } from '../client/mod.ts'
import { Snowflake } from '../utils/snowflake.ts'

export class Base {
  client!: Client

  // any is for untyped JSON here too.
  constructor(client: Client, _data?: any) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false })
  }
}

export class SnowflakeBase extends Base {
  id!: string

  /** Get Snowflake Object */
  get snowflake(): Snowflake {
    return new Snowflake(this.id)
  }

  /** Timestamp of when resource was created */
  get timestamp(): Date {
    return new Date(this.snowflake.timestamp)
  }
}
