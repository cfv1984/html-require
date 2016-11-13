if (!DOMImplementation.prototype.createDocument) {

(function () {
'use strict';

var i, docObj, docObjType,
    docObjs = [
        'MSXML6.DOMDocument', 'MSXML5.DOMDocument', 'MSXML4.DOMDocument',
        'MSXML3.DOMDocument', 'MSXML2.DOMDocument.5.0', 'MSXML2.DOMDocument.4.0',
        'MSXML2.DOMDocument.3.0', 'MSXML2.DOMDocument', 'MSXML.DomDocument',
        'Microsoft.XmlDom'
    ],
    dol = docObjs.length;

for (i=0; i < dol; i++) {
    try {
        docObj = new ActiveXObject(docObjs[i]);
        docObjType = docObjs[i]; // Set this after ActiveXObject to ensure only set if no errors thrown
        break;
    }
    catch (e) {
    }
}

/**
* This shim implementation does not provide any support for doctype, nor does it wrap the resulting
* document so as to support all current DOM methods and properties
*/
DOMImplementation.prototype.createDocument = function (namespace, qualifiedName, doctype) {
    if (doctype) {
        throw 'This is not a complete shim for ' +
                        'DOMImplementation.prototype.createDocument.';
    }
    if (!docObjType) {
        throw 'Could not create a DOM document object';
    }
    var pos, prefix,
        prefixedNs = '',
        doc = new ActiveXObject(docObjType);

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

try{new CustomEvent('?')}catch(o_O){
  /*!(C) Andrea Giammarchi -- WTFPL License*/
  this.CustomEvent = function(
    eventName,
    defaultInitDict
  ){

    // the infamous substitute
    function CustomEvent(type, eventInitDict) {
      var event = document.createEvent(eventName);
      if (type != null) {
        initCustomEvent.call(
          event,
          type,
          (eventInitDict || (
            // if falsy we can just use defaults
            eventInitDict = defaultInitDict
          )).bubbles,
          eventInitDict.cancelable,
          eventInitDict.detail
        );
      } else {
        // no need to put the expando property otherwise
        // since an event cannot be initialized twice
        // previous case is the most common one anyway
        // but if we end up here ... there it goes
        event["initCustomEvent"] = initCustomEvent;
      }
      return event;
    }

    // borrowed or attached at runtime
    function initCustomEvent(
      type, bubbles, cancelable, detail
    ) {
      this['init' + eventName](type, bubbles, cancelable, detail);
      'detail' in this || (this.detail = detail);
    }

    // that's it
    return CustomEvent;
  }(
    // is this IE9 or IE10 ?
    // where CustomEvent is there
    // but not usable as construtor ?
    this.CustomEvent ?
      // use the CustomEvent interface in such case
      'CustomEvent' : 'Event',
      // otherwise the common compatible one
    {
      bubbles: false,
      cancelable: false,
      detail: null
    }
  );
}
