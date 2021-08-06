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
    , CONTEXT_FILE = 'context.json'

async function getUpdatedList() {
  const context = await fetchContext()

  let cjs = `module.exports = {\n`
    , esm = `export default {\n`

  const entries = Object.entries(context['@context'])
    .sort((a, b) => a[0] === b[0] ? 0 : a[0] > b[0] ? 1 : -1)

  for (const [ prefix, url ] of entries) {
    const obj = `    "${prefix}": "${url}",\n`
    cjs += obj
    esm += obj

    fs.writeFileSync(`cjs/${prefix}.cjs`, `module.exports = "${url}"`, { encoding: 'utf-8' })
    fs.writeFileSync(`esm/${prefix}.js`, `export default "${url}"`, { encoding: 'utf-8' })

  }

  cjs += '}'
  esm += '}'

  fs.writeFileSync(CJS_FILE, cjs, { encoding: 'utf-8' })
  fs.writeFileSync(ESM_FILE, esm, { encoding: 'utf-8' })
  fs.writeFileSync(CONTEXT_FILE, JSON.stringify(context['@context'], true, '  '), { encoding: 'utf-8' })
}

getUpdatedList();
