"use strict";
var PathTypeSniffer = (function () {
    function PathTypeSniffer() {
    }
    PathTypeSniffer.getType = function (path) {
        var ext = path.split(/\./).pop();
        return ext ? ext : 'html';
    };
    return PathTypeSniffer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PathTypeSniffer;
//# sourceMappingURL=PathTypeSniffer.js.map