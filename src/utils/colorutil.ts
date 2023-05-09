export interface Colors {
  // Custom list
  DEFAULT: number
  WHITE: number
  AQUA: number
  GREEN: number
  BLUE: number
  YELLOW: number
  PURPLE: number
  LUMINOUS_VIVID_PINK: number
  GOLD: number
  ORANGE: number
  RED: number
  GREY: number
  NAVY: number
  DARK_AQUA: number
  DARK_GREEN: number
  DARK_BLUE: number
  DARK_PURPLE: number
  DARK_VIVID_PINK: number
  DARK_GOLD: number
  DARK_ORANGE: number
  DARK_RED: number
  DARK_GREY: number
  DARKER_GREY: number
  LIGHT_GREY: number
  DARK_NAVY: number
  BLURPLE: number
  DARK_BLURPLE: number
  GREYPLE: number
  DARK_BUT_NOT_BLACK: number
  NOT_QUITE_BLACK: number

  // css color list
  aliceblue: number
  antiquewhite: number
  aqua: number
  aquamarine: number
  azure: number
  beige: number
  bisque: number
  black: number
  blanchedalmond: number
  blue: number
  blueviolet: number
  brown: number
  burlywood: number
  cadetblue: number
  chartreuse: number
  chocolate: number
  coral: number
  cornflowerblue: number
  cornsilk: number
  crimson: number
  cyan: number
  darkblue: number
  darkcyan: number
  darkgoldenrod: number
  darkgray: number
  darkgreen: number
  darkgrey: number
  darkkhaki: number
  darkmagenta: number
  darkolivegreen: number
  darkorange: number
  darkorchid: number
  darkred: number
  darksalmon: number
  darkseagreen: number
  darkslateblue: number
  darkslategray: number
  darkslategrey: number
  darkturquoise: number
  darkviolet: number
  deeppink: number
  deepskyblue: number
  dimgray: number
  dimgrey: number
  dodgerblue: number
  firebrick: number
  floralwhite: number
  forestgreen: number
  fuchsia: number
  gainsboro: number
  ghostwhite: number
  goldenrod: number
  gold: number
  gray: number
  green: number
  greenyellow: number
  grey: number
  honeydew: number
  hotpink: number
  indianred: number
  indigo: number
  ivory: number
  khaki: number
  lavenderblush: number
  lavender: number
  lawngreen: number
  lemonchiffon: number
  lightblue: number
  lightcoral: number
  lightcyan: number
  lightgoldenrodyellow: number
  lightgray: number
  lightgreen: number
  lightgrey: number
  lightpink: number
  lightsalmon: number
  lightseagreen: number
  lightskyblue: number
  lightslategray: number
  lightslategrey: number
  lightsteelblue: number
  lightyellow: number
  lime: number
  limegreen: number
  linen: number
  magenta: number
  maroon: number
  mediumaquamarine: number
  mediumblue: number
  mediumorchid: number
  mediumpurple: number
  mediumseagreen: number
  mediumslateblue: number
  mediumspringgreen: number
  mediumturquoise: number
  mediumvioletred: number
  midnightblue: number
  mintcream: number
  mistyrose: number
  moccasin: number
  navajowhite: number
  navy: number
  oldlace: number
  olive: number
  olivedrab: number
  orange: number
  orangered: number
  orchid: number
  palegoldenrod: number
  palegreen: number
  paleturquoise: number
  palevioletred: number
  papayawhip: number
  peachpuff: number
  peru: number
  pink: number
  plum: number
  powderblue: number
  purple: number
  rebeccapurple: number
  red: number
  rosybrown: number
  royalblue: number
  saddlebrown: number
  salmon: number
  sandybrown: number
  seagreen: number
  seashell: number
  sienna: number
  silver: number
  skyblue: number
  slateblue: number
  slategray: number
  slategrey: number
  snow: number
  springgreen: number
  steelblue: number
  tan: number
  teal: number
  thistle: number
  tomato: number
  turquoise: number
  violet: number
  wheat: number
  white: number
  whitesmoke: number
  yellow: number
  yellowgreen: number
}

// eslint-disable-next-line
export class ColorUtil {
  constructor() {
    throw new Error(
      `The ${this.constructor.name} class may not be instantiated!`
    )
  }

  /**
   * Encodes color int into hex code
   * @param color The color as int
   */
  static intToHex(color: number): string {
    if (!ColorUtil.validateColor(color)) throw new Error('Invalid color')
    return `#${color.toString(16).padStart(6, '0')}`
  }

  /**
   * Validates hex color
   * @param color The color to validate
   */
  static validateColor(color: number): boolean {
    if (color < 0 || color > 0xffffff) return false
    return true
  }

  /**
   * Resolves RGB color array
   * @param color RGB color array
   */
  static resolveRGB(color: [number, number, number]): number {
    return (color[0] << 16) + (color[1] << 8) + color[2]
  }

  /**
   * Resolves hex code
   * @param hexcode The hex code
   */
  static resolveHex(hexcode: string): number {
    if (!ColorUtil.isHex(hexcode)) throw new Error('Invalid hex code')
    return parseInt(hexcode.replace('#', ''), 16)
  }

  /**
   * Validates hex code
   * @param hexcode The hex code
   */
  static isHex(hexcode: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexcode)
  }

  /** Returns random hex code */
  static randomHex(): string {
    const code = `#${Math.floor(Math.random() * (0xffffff + 1))
      .toString(16)
      .padStart(6, '0')}`
    if (!ColorUtil.isHex(code)) return '#000000'
    return code
  }

  /**
   * Resolves color by name
   * @param color The color name
   */
  static resolveColor(color?: keyof Colors | 'RANDOM'): number {
    if (!color) return 0 // eslint-disable-line
    if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1))
    return ColorUtil.colorList[color]
  }

  /** Color list */
  static get colorList(): Colors {
    return {
      // custom list
      DEFAULT: 0x000000,
      WHITE: 0xffffff,
      AQUA: 0x1abc9c,
      GREEN: 0x2ecc71,
      BLUE: 0x3498db,
      YELLOW: 0xffff00,
      PURPLE: 0x9b59b6,
      LUMINOUS_VIVID_PINK: 0xe91e63,
      GOLD: 0xf1c40f,
      ORANGE: 0xe67e22,
      RED: 0xe74c3c,
      GREY: 0x95a5a6,
      NAVY: 0x34495e,
      DARK_AQUA: 0x11806a,
      DARK_GREEN: 0x1f8b4c,
      DARK_BLUE: 0x206694,
      DARK_PURPLE: 0x71368a,
      DARK_VIVID_PINK: 0xad1457,
      DARK_GOLD: 0xc27c0e,
      DARK_ORANGE: 0xa84300,
      DARK_RED: 0x992d22,
      DARK_GREY: 0x979c9f,
      DARKER_GREY: 0x7f8c8d,
      LIGHT_GREY: 0xbcc0c0,
      DARK_NAVY: 0x2c3e50,
      BLURPLE: 0x7289da,
      DARK_BLURPLE: 0x4d5e94,
      GREYPLE: 0x99aab5,
      DARK_BUT_NOT_BLACK: 0x2c2f33,
      NOT_QUITE_BLACK: 0x23272a,

      // css color list
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      goldenrod: 0xdaa520,
      gold: 0xffd700,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavenderblush: 0xfff0f5,
      lavender: 0xe6e6fa,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    }
  }

  static toJSON(): Colors {
    return ColorUtil.colorList
  }
}
