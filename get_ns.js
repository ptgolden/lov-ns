#!/usr/bin/env node

const prefix = process.argv[2];

if (!/\w+/.test(prefix)) {
  process.exit(1);
}

async function main() {
  try {
    const resp = await import(`./esm/${prefix}.js`)

    console.log(resp.default)
  } catch (e) {
    if (e.message.startsWith('Cannot find module')) {
      console.error(`Prefix \`${prefix}\` does not exist`)
    } else {
      console.error(e)
    }
    process.exit(1);
  }
}

main()
