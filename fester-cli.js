#!/usr/bin/env node

'use strict';

const vfs = require('vinyl-fs');
const meow = require('meow');
const hasher = require('./lib/hasher');
const formatter = require('./lib/formatter');
const stdout = require('./lib/stdout');

const cli = meow(`
	Usage
		$ fester <file1|glob1> [<file2|glob2>...<fileN|globN>] [--output manifest.json]
		$ find -type f -name '*.png' | xargs fester

	Options
		-a, --algorithm  Cipher algorithm: md5,sha1,sha256,sha512   [Default: sha512]
		-e, --encoding   Output encoding: hex,base64,buffer,binary  [Default: hex]
		-f, --format     Output format: json, yml                   [Default: json]
    -o, --output     Output filepath                            [Default: null]
    -m, --merge      If an existing file is found, merge it     [Default: null]

	Examples
		$ fester *.png --algorithm md5 --format json
		{"file1.png": "1abcb33beeb811dca15f0ac3e47b88d9", "file2.png": "2bcdb33beeb811dca15f0ac3e47b88d9"}
`, {
  alias: {
    a: 'algorithm',
    e: 'encoding',
    f: 'format',
    o: 'output',
    m: 'merge'
  }
});

const input = cli.input;

if ((!input || !input.length) && process.stdin.isTTY) {
  console.log('Please specify something to hash');
  process.exit(1);
}

const stream = vfs.src(input)
  .pipe(hasher(cli.flags))
  .pipe(formatter(cli.flags));

if (cli.flags.output) {
  stream.pipe(vfs.dest('./'));
} else {
  stream.pipe(stdout());
}
