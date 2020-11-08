# Welcome!

This document is for people who want to contribute to this repository!

## Code Style

We use [standard.js](https://standardjs.org) with [eslint](https://eslint.org) and [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint).
So please don't make as lint errors as possible. There're many rules in standard.js but the highlight things are:

- Use `camelCase` for function names, variables, etc.
- Use `PascalCase` for class names.
- Add return types on function. Ex:

```ts
const example = (): void => {}
```

- Do not make unused variables or unused imports.
- Make a space before a new block, Parentheses, equal, etc. Ex:

```ts
//Here   Here
if (true) {
}

//   Here    Here
const example = ''
```

- Use 'single quote' instead of "double quote".

These are not on standard.js but we want you to follow.

- Make names to simple but understandable for someone whose English is not a primary language.

## File Name Style

Nothing much, but please make it as simple as possible, and in `camelCase`.

## Submitting PR

When submitting PR, please make the title as simple as possible. Ex: `[Feature improvement]: Cache can now be loaded much faster`
Also, please make it understandable for someone whose English is not a primary language.

Thanks!
