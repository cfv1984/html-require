/// <reference path="./../typings/index.d.ts" />
require('./chunks/util/polyfill');

import Watcher from "./chunks/Watcher";
var Promise = require('Promise');
window["Promise"] = Promise;

const w = new Watcher(document.documentElement);
w.monitor();

console.log("Booted", Date.now());
