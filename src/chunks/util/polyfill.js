if (!DOMImplementation.prototype.createDocument) {
    (function () {
        'use strict';
        var i, docObj, docObjType, docObjs = [
            'MSXML6.DOMDocument', 'MSXML5.DOMDocument', 'MSXML4.DOMDocument',
            'MSXML3.DOMDocument', 'MSXML2.DOMDocument.5.0', 'MSXML2.DOMDocument.4.0',
            'MSXML2.DOMDocument.3.0', 'MSXML2.DOMDocument', 'MSXML.DomDocument',
            'Microsoft.XmlDom'
        ], dol = docObjs.length;
        for (i = 0; i < dol; i++) {
            try {
                docObj = new ActiveXObject(docObjs[i]);
                docObjType = docObjs[i];
                break;
            }
            catch (e) {
            }
        }
        DOMImplementation.prototype.createDocument = function (namespace, qualifiedName, doctype) {
            if (doctype) {
                throw 'This is not a complete shim for ' +
                    'DOMImplementation.prototype.createDocument.';
            }
            if (!docObjType) {
                throw 'Could not create a DOM document object';
            }
            var pos, prefix, prefixedNs = '', doc = new ActiveXObject(docObjType);
            if (qualifiedName) {
                pos = qualifiedName.indexOf(':');
                if (pos > -1) {
                    prefix = qualifiedName.slice(0, pos);
                    prefixedNs = ' xmlns:' + prefix + '="' + namespace + '"';
                }
                else if (namespace) {
                    prefixedNs = ' xmlns="' + namespace + '"';
                }
                doc.loadXML('<' + qualifiedName + prefixedNs + '/>');
            }
            return doc;
        };
    }());
}
try {
    new CustomEvent('?');
}
catch (o_O) {
    this.CustomEvent = function (eventName, defaultInitDict) {
        function CustomEvent(type, eventInitDict) {
            var event = document.createEvent(eventName);
            if (type != null) {
                initCustomEvent.call(event, type, (eventInitDict || (eventInitDict = defaultInitDict)).bubbles, eventInitDict.cancelable, eventInitDict.detail);
            }
            else {
                event["initCustomEvent"] = initCustomEvent;
            }
            return event;
        }
        function initCustomEvent(type, bubbles, cancelable, detail) {
            this['init' + eventName](type, bubbles, cancelable, detail);
            'detail' in this || (this.detail = detail);
        }
        return CustomEvent;
    }(this.CustomEvent ?
        'CustomEvent' : 'Event', {
        bubbles: false,
        cancelable: false,
        detail: null
    });
}
//# sourceMappingURL=polyfill.js.map