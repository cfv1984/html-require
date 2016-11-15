/// <reference path="./../typings/index.d.ts" />
require('./chunks/util/polyfill');

import Watcher from "./chunks/Watcher";
window["Promise"] = window["Promise"] || require('Promise');

var DOMReady = function(a?:any,b?:any,c?:any){b=document,c='addEventListener';b[c]?b[c]('DOMContentLoaded',a):window["attachEvent"]('onload',a)}

DOMReady(() =>
{
  const w = new Watcher(document.documentElement);
  w.monitor();
});

console.log("Booted", Date.now());
