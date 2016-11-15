"use strict";
var rando = function () { return Math.ceil(Math.random() * 1024); };
var ResourceInjector = (function () {
    function ResourceInjector() {
    }
    ResourceInjector.prototype.loadMarkup = function (loaded) {
        var doc = this._getDocumentFor(loaded);
        return doc;
    };
    ResourceInjector.prototype.loadJS = function (script) {
        var g = document.createElement('script');
        var s = document.getElementsByTagName('script')[0];
        g.text = script;
        return g;
    };
    ResourceInjector.prototype.loadCSS = function (css) {
        var style = document.createElement('style');
        style.type = "text/css";
        if (style["styleSheet"]) {
            style["styleSheet"]["cssText"] = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        return style;
    };
    ResourceInjector.prototype._getDocumentFor = function (imported) {
        var df = document.createDocumentFragment();
        var parent = document.createElement('import');
        parent["id"] = 'import-' + Date.now() + rando() + rando() + rando();
        df.appendChild(parent);
        parent.innerHTML = imported;
        return df;
    };
    return ResourceInjector;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResourceInjector;
