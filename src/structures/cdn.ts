import { ImageFormats, ImageSize } from '../types/cdnTypes.ts'

export const ImageURL = (
  url: string,
  format: ImageFormats,
  size?: ImageSize | 128
): string => {
  if (url.includes('a_')) {
    return `${url}.gif?size=${size}`
  } else return `${url}.${format}?size=${size}`
}
