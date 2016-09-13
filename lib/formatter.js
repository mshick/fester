'use strict';

const yaml = require('js-yaml');
const through = require('through2');

function formatter(options) {
  function transform(file, enc, cb) {
    if (options.format === 'yml' || options.format === 'yaml') {
      const contents = yaml.safeDump(JSON.parse(file.contents.toString()));
      file.contents = new Buffer(contents);
    }
    cb(null, file);
  }
  return through.obj(transform);
}

module.exports = formatter;
