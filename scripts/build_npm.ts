#!/usr/bin/env -S deno run -A --no-check

import { build, emptyDir } from 'https://deno.land/x/dnt@0.21.2/mod.ts'

await emptyDir('./npm')

await build({
  entryPoints: ['./mod.ts'],
  test: false,
  outDir: './npm',
  shims: {
    deno: true,
    timers: true,
    undici: true,
    blob: true
  },
  package: {
    // package.json properties
    name: 'harmony',
    version: Deno.args[0],
    description: 'An easy to use and advanced Discord API Library for Deno',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/harmonyland/harmony.git'
    },
    bugs: {
      url: 'https://github.com/harmonyland/harmony/issues'
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
