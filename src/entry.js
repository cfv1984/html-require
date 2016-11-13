"use strict";
require('./chunks/util/polyfill');
var Watcher_1 = require("./chunks/Watcher");
var Promise = require('Promise');
window["Promise"] = Promise;
var w = new Watcher_1.default(document.documentElement);
w.monitor();
console.log("Booted", Date.now());
//# sourceMappingURL=entry.js.map