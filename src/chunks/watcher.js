"use strict";
var PathTypeSniffer_1 = require("./util/PathTypeSniffer");
var ResourceInjector_1 = require("./util/ResourceInjector");
var slice = [].slice;
var Watcher = (function () {
    function Watcher(root, _resolved) {
        if (_resolved === void 0) { _resolved = []; }
        var _this = this;
        this.root = root;
        this._resolved = _resolved;
        this._injector = new ResourceInjector_1.default();
        this.monitor = function () {
            _this._getUnresolvedLinks().forEach(function (n) { return _this._loadLink(n); });
            requestAnimationFrame(_this.monitor);
        };
        this._onImportResolved = function (evt) {
            var imported = evt.detail;
            var DOM = imported["data-imported"];
            var scripts = DOM.querySelectorAll('script');
            var styles = document.querySelector('link[rel="stylesheet"], style');
            imported.parentNode.replaceChild(DOM, imported);
            slice.call(styles).forEach(function (l) { return document.head.appendChild(l); });
            [].slice.call(scripts).forEach(_this._moveScriptTag);
        };
        this._moveScriptTag = function (script) {
            var g = document.createElement('script');
            var s = document.getElementsByTagName('script')[0];
            g.text = script.innerHTML;
            s.parentNode.insertBefore(g, s);
            script.parentNode && script.parentNode.removeChild(script);
        };
        if (!document.documentElement["import-listener"]) {
            document.documentElement["import-listener"] = this._onImportResolved;
            document.documentElement.addEventListener('importResolved', document.documentElement["import-listener"]);
        }
    }
    Watcher.prototype._getUnresolvedLinks = function () {
        return slice.call(document.querySelectorAll('[data-import]')).filter(function (n) { return !n.hasAttribute('data-import-resolved'); });
    };
    Watcher.prototype._loadLink = function (link) {
        var _this = this;
        var path = link.getAttribute('data-import');
        this.getRemote(path).then(function (ok) {
            var fn = _this._loadResponse;
            if (Watcher.fn["responseLoader"]) {
                fn = Watcher.fn["responseLoader"];
            }
            link["data-imported"] = fn.call(_this, path, ok);
            _this.informLoaded(link);
        }, function (error) {
            console.error("XHR failed.", error);
        });
        this._markLoaded(link);
    };
    Watcher.prototype._markLoaded = function (link) {
        link.setAttribute('data-import-resolved', 'data-import-resolved');
    };
    Watcher.prototype.getRemote = function (url, options) {
        options = options || {};
        return new Promise(function (ok, fail) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 400) {
                        data = this.responseText;
                        if (options.json) {
                            var data = JSON.parse(this.responseText);
                        }
                        ok(data);
                    }
                    else {
                        fail(this);
                    }
                }
            };
            request.send();
            request = null;
        });
    };
    Watcher.prototype.informLoaded = function (link) {
        var evt = new CustomEvent('importResolved', {
            detail: link
        });
        document.documentElement.dispatchEvent(evt);
    };
    Watcher.prototype._loadResponse = function (path, response) {
        var type = PathTypeSniffer_1.default.getType(path);
        if (type === 'html') {
            return this._injector.loadMarkup(response);
        }
        if (type === 'js') {
            return this._injector.loadJS(response);
        }
        if (type === 'css') {
            return this._injector.loadCSS(response);
        }
    };
    return Watcher;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Watcher;
Watcher.fn = (_a = {},
    _a["responseLoader"] = null,
    _a);
var _a;
