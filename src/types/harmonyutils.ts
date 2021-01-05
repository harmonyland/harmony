export interface ParsedEmoji {
    animated: boolean;
    name: string | null;
    id: string | null;
    url: string | null;
}

export interface MarkdownEscapeOptions {
    codeBlock?: boolean;
    inlineCode?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    spoiler?: boolean;
    codeBlockContent?: boolean;
    inlineCodeContent?: boolean;
}