'use strict';

const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const merge = require('lodash/fp/merge');
const trim = require('lodash/trim');
const through = require('through2');
const hasha = require('hasha');
const File = require('vinyl');
const vinylFile = require('vinyl-file');

const DEFAULTS = {
  path: 'manifest.json'
};

function getManifestFile(options) {
  let file;

  try {
    file = vinylFile.readSync(options.path);
  } catch (e) {
    file = new File(options);
  }

  return file;
}

function stringify(obj) {
  return JSON.stringify(obj, null, '  ');
}

function hasher(options) {
  const hashaOpts = pick(options, ['encoding', 'algorithm']);
  const settings = {
    path: options.output || DEFAULTS.path,
    merge: {}.hasOwnProperty.call(options, 'merge')
  };

  let manifest = {};

  function transform(file, enc, cb) {
    if (file.isNull()) {
      cb();
      return;
    }
    const relPath = trim(file.path.replace(process.cwd(), ''), '/');
    manifest[relPath] = hasha(file.contents.toString(), hashaOpts);
    cb();
  }

  function flush(cb) {
    if (isEmpty(manifest)) {
      cb();
      return;
    }
    const manifestFile = getManifestFile(settings);
    if (settings.merge && !manifestFile.isNull()) {
      try {
        const oldManifest = JSON.parse(manifestFile.contents.toString());
        manifest = merge(oldManifest, manifest);
      } catch (e) {}
    }
    manifestFile.contents = new Buffer(stringify(manifest));
    this.push(manifestFile);
    cb();
  }

  return through.obj(transform, flush);
}

module.exports = hasher;
