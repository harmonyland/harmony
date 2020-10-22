// 일단 대충 여러 봇 라이브러리에서 본 구조 가져오는 중..

/**
 * Represents a model that is identifiable by a Snowflake
 */
export class Base {
  id?: string
  constructor (id: string | undefined) {
    if (id) {
      this.id = id
    }
  }
}
