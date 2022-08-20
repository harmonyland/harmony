#!/usr/bin/env -S deno run -A --no-check

import { build, emptyDir } from 'https://deno.land/x/dnt@0.30.0/mod.ts'

await emptyDir('./npm')

await build({
  entryPoints: ['./mod.ts'],
  test: false,
  typeCheck: false,
  outDir: './npm',
  compilerOptions: {
    importHelpers: true,
    target: 'ES2021',
    lib: ['esnext', 'dom', 'dom.iterable']
  },
  shims: {
    deno: true,
    timers: true,
    undici: true,
    blob: true,
    custom: [
      {
        module: './node_shims.ts',
        globalNames: ['ErrorEvent']
      },
      {
        package: { name: 'stream/web' },
        globalNames: ['TransformStream', 'ReadableStream', 'WritableStream']
      },
      {
        globalNames: [
          {
            name: 'WebSocket',
            exportName: 'default'
          }
        ],
        package: {
          name: 'ws',
          version: '^8.5.3'
        }
      }
    ]
  },
  package: {
    name: '@harmonyland/harmony',
    version: Deno.args[0],
    description:
      'An easy to use and advanced Discord API Library for Deno and Node.js',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/harmonyland/harmony.git'
    },
    bugs: {
      url: 'https://github.com/harmonyland/harmony/issues'
    },
    devDependencies: {
      '@types/ws': '^8.5.3'
    }
  },
  mappings: {
    'https://esm.sh/ts-mixer@6.0.0': {
      name: 'ts-mixer',
      version: '^6.0.0'
    }
  }
})

// Post build steps
Deno.copyFileSync('LICENSE', 'npm/LICENSE')
Deno.copyFileSync('README.md', 'npm/README.md')
Deno.mkdirSync('./npm/assets')
Deno.copyFileSync('./assets/banner.png', './npm/assets/banner.png')
