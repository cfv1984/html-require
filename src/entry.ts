/// <reference path="./../typings/index.d.ts" />
require('./chunks/util/polyfill');

import Watcher from "./chunks/Watcher";
window["Promise"] = window["Promise"] || require('Promise');

const w = new Watcher(document.documentElement);
w.monitor();

console.log("Booted", Date.now());
