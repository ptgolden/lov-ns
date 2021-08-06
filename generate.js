import * as fs from 'fs'
import * as path from 'path'
import fetch from 'node-fetch'
import mkdirp from 'mkdirp'

const LOV_URL = 'http://lov.okfn.org/dataset/lov/api/v2/vocabulary/list'

const PREFIX_CC_CONTEXT = 'http://prefix.cc/context'
    , PREFIX_CC_POPULAR = 'http://prefix.cc/popular/all'

console.log(`Updating from ${PREFIX_CC_CONTEXT}`)

async function fetchContext() {
  const resp = await fetch(PREFIX_CC_CONTEXT)

  if (!resp.ok) {
    throw new Error('Error downloading context file')
  }

  return resp.json()
}

mkdirp.sync('esm')
mkdirp.sync('cjs')

const ESM_FILE = './index.js'
    , CJS_FILE = './index.cjs'
    , TYPES_FILE = './index.d.ts'
    , CONTEXT_FILE = 'context.json'

async function getUpdatedList() {
  const context = await fetchContext()

  let cjs = `module.exports = {\n`
    , esm = `export default {\n`
    , types = `type RDFNS = {\n`

  const entries = Object.entries(context['@context'])
    .sort((a, b) => a[0] === b[0] ? 0 : a[0] > b[0] ? 1 : -1)

  for (const [ prefix, url ] of entries) {
    const obj = `    "${prefix}": "${url}",\n`
    cjs += obj
    esm += obj
    types += obj
    // types += `    "${prefix}": string;\n`

    mkdirp.sync(`cjs/${prefix}`)
    mkdirp.sync(`esm/${prefix}`)

    fs.writeFileSync(`cjs/${prefix}/index.cjs`, `module.exports = "${url}"\n`, { encoding: 'utf-8' })
    fs.writeFileSync(`esm/${prefix}/index.js`, `export default "${url}"\n`, { encoding: 'utf-8' })

    const typeDef = `type RDFNS_${prefix} = ${url}\n\nexport default RDFNS_${prefix}\n`

    fs.writeFileSync(`cjs/${prefix}/index.d.ts`, typeDef, { encoding: 'utf-8' })
    fs.writeFileSync(`esm/${prefix}/index.d.ts`, typeDef, { encoding: 'utf-8' })

  }

  types += '}\n\nexport default RDFNS\n'
  cjs += '}\n'
  esm += '}\n'

  fs.writeFileSync(CJS_FILE, cjs, { encoding: 'utf-8' })
  fs.writeFileSync(ESM_FILE, esm, { encoding: 'utf-8' })
  fs.writeFileSync(TYPES_FILE, types, { encoding: 'utf-8' })
  fs.writeFileSync(CONTEXT_FILE, JSON.stringify(context['@context'], true, '  '), { encoding: 'utf-8' })
}

getUpdatedList();
