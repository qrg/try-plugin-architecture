'use strict';

import debounce from 'lodash.debounce';
import gulpWatch from 'gulp-watch';

import {watchTemplate} from './build-template';
import {watchStyle} from './build-style';

import {watchScript} from './build-script';

export default function () {
  watchTemplate();
  watchStyle();
  watchScript();
}

export function watch(pattern, fn) {
  gulpWatch(pattern, debounce(() => {
    console.log('\nrebuilding...');
    fn();
  }, 100));
}
