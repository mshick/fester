'use strict';

const through = require('through2');

function toStdout() {
  function transform(file, enc, cb) {
    process.stdout.write(file.contents.toString());
    cb(null, file);
  }
  return through.obj(transform);
}

module.exports = toStdout;
