'use strict';

import path from 'path';

import browserify from 'browserify';
import watchify from 'watchify';
import glob from 'glob';
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

import clean from '../lib/clean';
import {logRebuilding} from '../lib/log';
import {
  DIR_SRC,
  DIR_DEST,
  SRC_SCRIPT,
  SCRIPT_BUNDLE_FILENAME,
  SCRIPT_ENTRY_FILENAME
} from '../config';

const ENTRY_FILE = new RegExp(`${SCRIPT_ENTRY_FILENAME}\.(js|jsx)$`);
const BUNDLED_FILE = `${SCRIPT_BUNDLE_FILENAME}.js`;
const ENTRIES_PATTERN = new RegExp(`^.+?${DIR_SRC}${path.sep}`);

const initBundler = (entry) => {
  return browserify(entry, {
    cache: {},
    packageCache: {},
    debug: true
  }).transform('babelify', {sourceMaps: true})
    .on('error', function (err) {
      console.error(err);
      this.emit('end');
    });
};

const bundle = function (bundler, entry) {
  const output = entry.replace(ENTRIES_PATTERN, '').replace(ENTRY_FILE, BUNDLED_FILE);
  bundler.bundle()
    .pipe(source(output))
    .pipe(buffer())
    .pipe(gulp.dest(DIR_DEST));
};

export default function () {
  const entries = glob.sync(SRC_SCRIPT);

  entries.forEach((entry)=> {
    const bundler = initBundler(entry);
    return bundle(bundler, entry);
  });
}

export function watchScript() {
  const entries = glob.sync(SRC_SCRIPT);

  entries.forEach((entry)=> {
    const bundler = initBundler(entry);

    bundler.plugin(watchify);
    bundler.on('update', () => {
      logRebuilding();
      return bundle(bundler, entry);
    });

    return bundle(bundler, entry);
  });
}

export function cleanScript() {
  const sources = glob.sync(SRC_SCRIPT);
  const targets = sources.map(file => file.replace(DIR_SRC, DIR_DEST).replace(ENTRY_FILE, BUNDLED_FILE));
  return clean(targets);
}
