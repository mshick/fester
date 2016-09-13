import fs from 'fs';
import childProcess from 'child_process';
import test from 'ava';
import del from 'del';

const MANIFEST = './manifest.json';
const MANIFEST_YAML = './manifest.yml';
const MANIFEST_TMP = './manifest.tmp.json';
const FIXTURE_PATH = 'fixtures/apple-touch-icon-180x180.png';
const FESTER_CLI = '../fester-cli.js';

test.beforeEach('before', t => {
  t.context.manifest = fs.readFileSync(MANIFEST, 'utf8');
  t.context.manifestYaml = fs.readFileSync(MANIFEST_YAML, 'utf8');
  const manifestTmp = {};
  manifestTmp[FIXTURE_PATH] = t.context.manifest[FIXTURE_PATH];
  fs.writeFileSync(MANIFEST_TMP, JSON.stringify(manifestTmp));
});

test.cb('main', t => {
  t.plan(1);
  childProcess.execFile(FESTER_CLI, ['fixtures/*'], (err, stdout) => {
    t.error(err);
    t.is(stdout.trim(), t.context.manifest);
    t.end();
  });
});

test.cb('merge', t => {
  t.plan(1);
  childProcess.execFile(FESTER_CLI, [
    'fixtures/*',
    '--merge',
    `--output=${MANIFEST_TMP}`
  ], err => {
    t.error(err);
    const merged = fs.readFileSync(MANIFEST_TMP, 'utf8');
    t.is(t.context.manifest, merged);
    t.end();
  });
});

test.cb('yaml', t => {
  t.plan(1);
  childProcess.execFile(FESTER_CLI, [
    'fixtures/*',
    '--format=yaml'
  ], (err, stdout) => {
    t.error(err);
    t.is(stdout, t.context.manifestYaml);
    t.end();
  });
});

test.after.always('cleanup', () => del(MANIFEST_TMP));
