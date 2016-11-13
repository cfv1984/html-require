"use strict";
var _ = require('./util/DOM');
var Watcher = (function () {
    function Watcher(root, _resolved) {
        if (_resolved === void 0) { _resolved = []; }
        var _this = this;
        this.root = root;
        this._resolved = _resolved;
        this.monitor = function () {
            _this._getUnresolvedLinks().forEach(function (n) { return _this._loadLink(n); });
            requestAnimationFrame(_this.monitor);
        };
        this._onImportResolved = function (evt) {
            var imported = evt.detail;
            var DOM = imported["data-imported"];
            var scripts = DOM.querySelectorAll('script');
            imported.parentNode.replaceChild(DOM, imported);
            [].slice.call(scripts).forEach(function (script) {
                var g = document.createElement('script');
                var s = document.getElementsByTagName('script')[0];
                g.text = script.innerHTML;
                s.parentNode.insertBefore(g, s);
            });
        };
        if (!document.documentElement["import-listener"]) {
            document.documentElement["import-listener"] = this._onImportResolved;
            document.documentElement.addEventListener('importResolved', document.documentElement["import-listener"]);
        }
    }
    Watcher.prototype._getUnresolvedLinks = function () {
        return _.$('[data-import]', true).filter(function (n) { return !n.hasAttribute('data-import-resolved'); });
    };
    Watcher.prototype._loadLink = function (link) {
        var _this = this;
        var path = link.getAttribute('data-import');
        this.getRemote(path).then(function (ok) {
            var doc = _this._getDocumentFor(ok);
            doc["watcher"] = new Watcher(doc);
            doc["watcher"].monitor();
            link["data-imported"] = doc;
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
    Watcher.prototype._getDocumentFor = function (imported) {
        var df = document.createDocumentFragment();
        var parent = document.createElement('import');
        parent["id"] = 'import-' + Date.now() + Math.ceil(Math.random() * 1024) + Math.ceil(Math.random() * 1024) + Math.ceil(Math.random() * 1024);
        df.appendChild(parent);
        parent.innerHTML = imported;
        return df;
    };
    Watcher.prototype.informLoaded = function (link) {
        var evt = new CustomEvent('importResolved', {
            detail: link
        });
        document.documentElement.dispatchEvent(evt);
    };
    return Watcher;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Watcher;
//# sourceMappingURL=Watcher.js.map