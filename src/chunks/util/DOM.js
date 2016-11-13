"use strict";
function findBySelector(sel, all) {
    var d = document;
    if (!all) {
        return d.querySelector(sel);
    }
    return [].slice.call(d.querySelectorAll(sel));
}
module.exports = {
    $: findBySelector
};
//# sourceMappingURL=DOM.js.map