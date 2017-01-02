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
      list.forEach(vocab => {
        const { prefix, nsp } = vocab

        if (!prefix || !nsp) {
          console.log('Error getting prefix from item in LOV list.');
          console.log('The format of the dataset has changed. Cannot continue.');
          console.log('The format of the dataset may have changed.');
        }

        mkdirp.sync(prefix);

        fs.writeFileSync(
          path.join(prefix, 'data.json'),
          JSON.stringify(vocab) + '\n'
        );

        fs.writeFileSync(
          path.join(prefix, 'index.js'),
          "module.exports = require('./vocab.json').nsp;\n"
        );
      })
    })
    .catch(err => {
      throw err;
    })
}

getUpdatedList();
