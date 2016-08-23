'use strict';

import gulp from 'gulp';
import glob from 'glob';

import {watch} from './watch';
import clean from '../lib/clean';

import {flatten} from '../lib/array';
import {
  DIR_SRC,
  DIR_DEST,
  SRCS_TO_COPY,
  WATCH_PATTERN_TEMPLATE
} from '../config';

export default function copy() {
  return gulp.src(SRCS_TO_COPY, {base: DIR_SRC})
    .pipe(gulp.dest(DIR_DEST));
}

export function watchCopying() {
  return watch(WATCH_PATTERN_TEMPLATE, copy);
}

export function cleanCopied() {
  const sources = flatten(SRCS_TO_COPY.map(file => glob.sync(file)));
  const targets = sources.map(file => file.replace(DIR_SRC, DIR_DEST));
   return clean(targets);
}
