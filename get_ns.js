#!/usr/bin/env node

"use strict";

const prefix = process.argv[2];

if (!/\w+/.test(prefix)) {
  process.exit(1);
}

try {
  const ns = require('./' + prefix);
  console.log(ns);
} catch (e) {
  process.exit(1);
}
