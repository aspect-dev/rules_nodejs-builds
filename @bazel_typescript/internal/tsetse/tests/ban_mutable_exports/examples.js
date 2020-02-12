/**
 * @fileoverview Examples for the mutable exports rule.
 * We expect every 'bad' to be an error, and every 'ok' to pass.
 * These are checked as expected diagnostics in the BUILD file.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bad1 = 3;
    exports.bad2 = 3;
    exports.bad3 = 3, exports.bad4 = 3;
    var bad5 = 3;
    exports.bad5 = bad5;
    let bad6 = 3;
    exports.bad6 = bad6;
    exports.bad6alias = bad6;
    var bad7 = 3;
    exports.default = bad7;
    exports.bad8 = {
        bad8: 3
    }.bad8;
    let ok1 = 3;
    var ok2 = 3;
    exports.ok3 = 3;
    const ok4 = 3;
    const ok5 = 3;
    exports.ok5 = ok5;
    function ok7() { }
    exports.ok7 = ok7;
    class ok8 {
    }
    exports.ok8 = ok8;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9leHRlcm5hbC9idWlsZF9iYXplbF9ydWxlc190eXBlc2NyaXB0L2ludGVybmFsL3RzZXRzZS90ZXN0cy9iYW5fbXV0YWJsZV9leHBvcnRzL2V4YW1wbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7OztJQUVRLFFBQUEsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNULFFBQUEsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNULFFBQUEsSUFBSSxHQUFHLENBQUMsRUFBRSxRQUFBLElBQUksR0FBRyxDQUFDLENBQUM7SUFDOUIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ0wsb0JBQUk7SUFDWixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7SUFDTCxvQkFBSTtJQUNJLHlCQUFTO0lBQ3pCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNHLHVCQUFPO0lBQ3ZCOztXQUVFO0lBR0YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ1osSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ0MsUUFBQSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNkLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNOLGtCQUFHO0lBRVgsU0FBZ0IsR0FBRyxLQUFJLENBQUM7SUFBeEIsa0JBQXdCO0lBQ3hCLE1BQWEsR0FBRztLQUFHO0lBQW5CLGtCQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVvdmVydmlldyBFeGFtcGxlcyBmb3IgdGhlIG11dGFibGUgZXhwb3J0cyBydWxlLlxuICogV2UgZXhwZWN0IGV2ZXJ5ICdiYWQnIHRvIGJlIGFuIGVycm9yLCBhbmQgZXZlcnkgJ29rJyB0byBwYXNzLlxuICogVGhlc2UgYXJlIGNoZWNrZWQgYXMgZXhwZWN0ZWQgZGlhZ25vc3RpY3MgaW4gdGhlIEJVSUxEIGZpbGUuXG4gKi9cblxuZXhwb3J0IGxldCBiYWQxID0gMztcbmV4cG9ydCB2YXIgYmFkMiA9IDM7XG5leHBvcnQgdmFyIGJhZDMgPSAzLCBiYWQ0ID0gMztcbnZhciBiYWQ1ID0gMztcbmV4cG9ydCB7YmFkNX07XG5sZXQgYmFkNiA9IDM7XG5leHBvcnQge2JhZDZ9O1xuZXhwb3J0IHtiYWQ2IGFzIGJhZDZhbGlhc307XG52YXIgYmFkNyA9IDM7XG5leHBvcnQge2JhZDcgYXMgZGVmYXVsdH07XG5leHBvcnQgbGV0IHtiYWQ4fSA9IHtcbiAgYmFkODogM1xufTtcbmV4cG9ydCBsZXQgYmFkOTogdW5rbm93bjtcblxubGV0IG9rMSA9IDM7XG52YXIgb2syID0gMztcbmV4cG9ydCBjb25zdCBvazMgPSAzO1xuY29uc3Qgb2s0ID0gMztcbmNvbnN0IG9rNSA9IDM7XG5leHBvcnQge29rNX07XG5leHBvcnQgdHlwZSBvazYgPSBzdHJpbmc7XG5leHBvcnQgZnVuY3Rpb24gb2s3KCkge31cbmV4cG9ydCBjbGFzcyBvazgge31cbiJdfQ==