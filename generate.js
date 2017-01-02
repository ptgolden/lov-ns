"use strict";

const fs = require('fs')
    , path = require('path')
    , fetch = require('node-fetch')
    , mkdirp = require('mkdirp')

const LOV_URL = 'http://lov.okfn.org/dataset/lov/api/v2/vocabulary/list'

console.log(`Updating from ${LOV_URL}`)

function getUpdatedList() {
  return fetch(LOV_URL)
    .then(res => {
      if (!res.ok) {
        console.log(`Error fetching LOV list (${res.status})`);
        console.log(res.statusText);
        process.exit(1);
      }

      return res.json();
    })
    .then(list => {
      const vocabs = []

      list.forEach(vocab => {
        const { prefix, nsp } = vocab

        if (!prefix || !nsp ) {
          console.log('Error getting prefix from item in LOV list.');
          console.log('The format of the dataset has changed. Cannot continue.');
        }

        if (!/\w+/.test(prefix)) {
          console.log(`Prefix ${prefix} contains non-ascii characters. Aborting.`);
        }

        mkdirp.sync(prefix);
        vocabs.push(prefix);

        fs.writeFileSync(
          path.join(prefix, 'data.json'),
          JSON.stringify(vocab) + '\n'
        );

        fs.writeFileSync(
          path.join(prefix, 'index.js'),
          "module.exports = require('./data.json').nsp;\n"
        );
      })

      const moduleText = vocabs
        .map(prefix => `exports["${prefix}"] = require("./${prefix}/index.js")`)
        .join('\n')

      fs.writeFileSync('index.js', moduleText + '\n')
    })
    .catch(err => {
      throw err;
    })
}

getUpdatedList();
