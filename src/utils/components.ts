import {
  ButtonStyle,
  MessageComponentData,
  MessageComponentPayload,
  MessageComponentType,
  TextInputStyle
} from '../types/messageComponents.ts'
import { toCamelCase } from '../utils/snakeCase.ts'

export function transformComponent(
  d: MessageComponentData[]
): MessageComponentPayload[] {
  return d.map((data: unknown) => {
    const e = { ...(data as Record<string, unknown>) }
    if (e.customID !== undefined) {
      e.custom_id = e.customID
      delete e.customID
    }
    if (e.minValues !== undefined) {
      e.min_values = e.minValues
      delete e.minValues
    }
    if (e.maxValues !== undefined) {
      e.max_values = e.maxValues
      delete e.maxValues
    }
    if (e.minLength !== undefined) {
      e.min_length = e.minLength
      delete e.minLength
    }
    if (e.maxLength !== undefined) {
      e.max_length = e.maxLength
      delete e.maxLength
    }
    if (e.components !== undefined) {
      e.components = transformComponent(e.components as MessageComponentData[])
    }
    if (typeof e.type === 'string') {
      e.type =
        MessageComponentType[
          e.type.toUpperCase() as keyof typeof MessageComponentType
        ]
    }
    if (e.type === MessageComponentType.BUTTON && typeof e.style === 'string') {
      if (!(e.style in ButtonStyle))
        throw new Error(`No Button style named '${e.style}' found!`)
      e.style = ButtonStyle[e.style.toUpperCase() as keyof typeof ButtonStyle]
    }
    if (
      e.type === MessageComponentType.TEXT_INPUT &&
      typeof e.style === 'string'
    ) {
      if (!(e.style in TextInputStyle))
        throw new Error(`No Text Input style named '${e.style}' found!`)
      e.style =
        TextInputStyle[e.style.toUpperCase() as keyof typeof TextInputStyle]
    }
    return e
  }) as unknown as MessageComponentPayload[]
}

export function transformComponentPayload(
  d: MessageComponentPayload[]
): MessageComponentData[] {
  return d.map(toCamelCase)
}
