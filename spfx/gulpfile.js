'use strict';

// Override Node version check for SPFx on modern Node versions
const process = require('process');
const originalExit = process.exit;
const originalError = console.error;

// Monkey-patch SPBuildRig node version check
const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local css class the 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);
  try {
    result.set('serve', result.get('serve-deprecated'));
  } catch (e) {}
  return result;
};

build.initialize(require('gulp'));
