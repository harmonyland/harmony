// 일단 대충 여러 봇 라이브러리에서 본 구조 가져오는 중..
import { Client } from '../models/client.ts'

export class Base {
  // property 읍
  client: Client
  constructor (client: Client) {
    this.client = client
  }
}
// discord.js 보는중
