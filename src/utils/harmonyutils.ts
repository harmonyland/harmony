// based on discord.js util

import { ParsedEmoji, MarkdownEscapeOptions } from '../types/harmonyutils.ts';

export class HarmonyUtils {
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated!`)
    }

    /**
     * Creates Discord server name acronym
     * @param text input text
     */
    static createAcronym(text: string): string {
        return text.replace(/'s /g, ' ')
        .replace(/\w+/g, e => e[0])
        .replace(/\s/g, '')
    }

    /**
     * Removes discord mentions
     * @param text Text to clean
     * @param channels If it should clean channel mentions
     */
    static removeMentions(text: string, channels?: boolean): string {
        return channels ? text.replace(/@/g, '@\u200b') : text.replace(/@/g, '@\u200b').replace(/#/g, '#\u200b')
    }

    /**
     * Parse discord emojis from text
     * @param text Text to parse emojis from
     * @param parseAll If it should try to parse all matching emojis
     */
    static parseEmoji(text: string, parseAll?: false): ParsedEmoji;
    static parseEmoji(text: string, parseAll: true): ParsedEmoji[];
    static parseEmoji(text: string, parseAll?: boolean): ParsedEmoji | ParsedEmoji[] {
        if (text.includes('%')) text = decodeURIComponent(text);
        if (!text.includes(':')) return { animated: false, name: text, id: null, url: null };
        
        if (!parseAll) {
            const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/);
            if (!m) return { animated: false, name: null, id: null, url: null };

            return {
                animated: Boolean(m[1]),
                name: m[2],
                id: m[3] || null,
                url: m[3] ? `https://cdn.discordapp.com/emojis/${m[3]}.${Boolean(m[1]) ? 'gif' : 'png'}` : null
            };
        } else {
            const m = text.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/g);
            if (!m) return { animated: false, name: null, id: null, url: null };
            const parsed = m.map(a => a.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/));
            
            const list: ParsedEmoji[] = [];
            parsed.forEach(emoji => {
                if (emoji) list.push({
                    animated: Boolean(emoji[1]),
                    name: emoji[2],
                    id: emoji[3] || null,
                    url: emoji[3] ? `https://cdn.discordapp.com/emojis/${emoji[3]}.${Boolean(emoji[1]) ? 'gif' : 'png'}` : null
                })
            });

            return list;
        }
    }

    /**
   * Escapes code block markdown in a string.
   * @param text Content to escape
   */
    static escapeCodeBlock(text: string): string {
        return text.replace(/```/g, '\\`\\`\\`');
    }

    /**
     * Escapes inline code markdown in a string.
     * @param text Content to escape
     */
    static escapeInlineCode(text: string): string {
        return text.replace(/(?<=^|[^`])`(?=[^`]|$)/g, '\\`');
    }

    /**
     * Escapes italic markdown in a string.
     * @param text Content to escape
     */
    static escapeItalic(text: string): string {
        let i = 0;
        text = text.replace(/(?<=^|[^*])\*([^*]|\*\*|$)/g, (_, match) => {
            if (match === '**') return ++i % 2 ? `\\*${match}` : `${match}\\*`;
            return `\\*${match}`;
        });
        i = 0;
        return text.replace(/(?<=^|[^_])_([^_]|__|$)/g, (_, match) => {
            if (match === '__') return ++i % 2 ? `\\_${match}` : `${match}\\_`;
            return `\\_${match}`;
        });
    }

    /**
     * Escapes bold markdown in a string.
     * @param text Content to escape
     */
    static escapeBold(text: string): string {
        let i = 0;
        return text.replace(/\*\*(\*)?/g, (_, match) => {
            if (match) return ++i % 2 ? `${match}\\*\\*` : `\\*\\*${match}`;
            return '\\*\\*';
        });
    }

    /**
     * Escapes underline markdown in a string.
     * @param text Content to escape
     */
    static escapeUnderline(text: string): string {
        let i = 0;
        return text.replace(/__(_)?/g, (_, match) => {
            if (match) return ++i % 2 ? `${match}\\_\\_` : `\\_\\_${match}`;
            return '\\_\\_';
        });
    }

    /**
     * Escapes strikethrough markdown in a string.
     * @param text Content to escape
     */
    static escapeStrikethrough(text: string): string {
        return text.replace(/~~/g, '\\~\\~');
    }

    /**
     * Escapes spoiler markdown in a string.
     * @param text Content to escape
     */
    static escapeSpoiler(text: string): string {
        return text.replace(/\|\|/g, '\\|\\|');
    }

    /**
     * Escapes any Discord-flavour markdown in a string.
     * @param text Text to clean
     * @param escapeOptions Escape Options
     */
    static escapeMarkdown(text: string, escapeOptions?: MarkdownEscapeOptions): string {
        if (!text || typeof text !== 'string') return ''

        if (!escapeOptions?.codeBlockContent) {
            return text
                .split('```')
                .map((subString, index, array) => {
                    if (index % 2 && index !== array.length - 1) return subString;
                    return HarmonyUtils.escapeMarkdown(subString, {
                        inlineCode: escapeOptions?.inlineCode,
                        bold: escapeOptions?.bold,
                        italic: escapeOptions?.italic,
                        underline: escapeOptions?.underline,
                        strikethrough: escapeOptions?.strikethrough,
                        spoiler: escapeOptions?.spoiler,
                        inlineCodeContent: escapeOptions?.inlineCodeContent
                    });
                })
                .join(escapeOptions?.codeBlock ? '\\`\\`\\`' : '```');
        }

        if (!escapeOptions.inlineCodeContent) {
            return text
                .split(/(?<=^|[^`])`(?=[^`]|$)/g)
                .map((subString, index, array) => {
                    if (index % 2 && index !== array.length - 1) return subString;
                    return HarmonyUtils.escapeMarkdown(subString, {
                        codeBlock: escapeOptions?.codeBlock,
                        bold: escapeOptions?.bold,
                        italic: escapeOptions?.italic,
                        underline: escapeOptions?.underline,
                        strikethrough: escapeOptions?.strikethrough,
                        spoiler: escapeOptions?.spoiler
                    });
                })
                .join(escapeOptions?.inlineCode ? '\\`' : '`');
        }

        if (escapeOptions?.inlineCode) text = HarmonyUtils.escapeInlineCode(text);
        if (escapeOptions?.codeBlock) text = HarmonyUtils.escapeCodeBlock(text);
        if (escapeOptions?.italic) text = HarmonyUtils.escapeItalic(text);
        if (escapeOptions?.bold) text = HarmonyUtils.escapeBold(text);
        if (escapeOptions?.underline) text = HarmonyUtils.escapeUnderline(text);
        if (escapeOptions?.strikethrough) text = HarmonyUtils.escapeStrikethrough(text);
        if (escapeOptions?.spoiler) text = HarmonyUtils.escapeSpoiler(text);

        return text
    }

}