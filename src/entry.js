"use strict";
require('./chunks/util/polyfill');
var Watcher_1 = require("./chunks/Watcher");
window["Promise"] = window["Promise"] || require('Promise');
var DOMReady = function (a, b, c) { b = document, c = 'addEventListener'; b[c] ? b[c]('DOMContentLoaded', a) : window["attachEvent"]('onload', a); };
DOMReady(function () {
    var w = new Watcher_1.default(document.documentElement);
    w.monitor();
});
console.log("Booted", Date.now());
//# sourceMappingURL=entry.js.map