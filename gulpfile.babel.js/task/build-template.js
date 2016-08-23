'use strict';

import gulp from 'gulp';
import glob from 'glob';

import {watch} from './watch';
import clean from '../lib/clean';

import {
  DIR_SRC,
  DIR_DEST,
  SRC_TEMPLATE,
  WATCH_PATTERN_TEMPLATE
} from '../config';

export default function buildTemplate() {
  return gulp.src(SRC_TEMPLATE, {base: DIR_SRC})
    .pipe(gulp.dest(DIR_DEST));
}

export function watchTemplate() {
  return watch(WATCH_PATTERN_TEMPLATE, (done) => buildTemplate(done));
}

export function cleanTemplate() {
  const sources = glob.sync(SRC_TEMPLATE);
  const targets = sources.map(file => file.replace(DIR_SRC, DIR_DEST));
  return clean(targets);
}
