# Fester

[![npm version](https://badge.fury.io/js/fester-cli.svg)](https://badge.fury.io/js/fester-cli)
[![Build Status](https://travis-ci.org/mshick/fester-cli.svg?branch=master)](https://travis-ci.org/mshick/fester-cli)

Create a manifest of files and hashes from a file, directory or glob. Output in json or yml.

## Install

```sh
npm install --global fester-cli
```

## Usage

```sh
fester --help
CLI to generate a manifest of file paths and hashes in JSON or YAML.

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
```

## Related

* [hasha](https://github.com/sindresorhus/hasha)
