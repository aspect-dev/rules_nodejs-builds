var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "protobufjs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path = require("path");
    const protobufjs = require("protobufjs");
    // Equivalent of running node with --expose-gc
    // but easier to write tooling since we don't need to inject that arg to
    // nodejs_binary
    if (typeof global.gc !== 'function') {
        // tslint:disable-next-line:no-require-imports
        require('v8').setFlagsFromString('--expose_gc');
        // tslint:disable-next-line:no-require-imports
        global.gc = require('vm').runInNewContext('gc');
    }
    /**
     * Whether to print debug messages (to console.error) from the debug function
     * below.
     */
    exports.DEBUG = false;
    /** Maybe print a debug message (depending on a flag defaulting to false). */
    function debug(...args) {
        if (exports.DEBUG)
            console.error.call(console, ...args);
    }
    exports.debug = debug;
    /**
     * Write a message to stderr, which appears in the bazel log and is visible to
     * the end user.
     */
    function log(...args) {
        console.error.call(console, ...args);
    }
    exports.log = log;
    /**
     * runAsWorker returns true if the given arguments indicate the process should
     * run as a persistent worker.
     */
    function runAsWorker(args) {
        return args.indexOf('--persistent_worker') !== -1;
    }
    exports.runAsWorker = runAsWorker;
    /**
     * loadWorkerPb finds and loads the protocol buffer definition for bazel's
     * worker protocol using protobufjs. In protobufjs, this means it's a reflection
     * object that also contains properties for the individual messages.
     */
    function loadWorkerPb() {
        const protoPath = '../../third_party/github.com/bazelbuild/bazel/src/main/protobuf/worker_protocol.proto';
        // Use node module resolution so we can find the .proto file in any of the
        // root dirs
        let protofile;
        try {
            // Look for the .proto file relative in its @bazel/typescript npm package
            // location
            protofile = require.resolve(protoPath);
        }
        catch (e) {
        }
        if (!protofile) {
            // If not found above, look for the .proto file in its rules_typescript
            // workspace location
            // This extra lookup should never happen in google3. It's only needed for
            // local development in the rules_typescript repo.
            protofile = require.resolve('@bazel/worker/third_party/github.com/bazelbuild/bazel/src/main/protobuf/worker_protocol.proto');
        }
        const protoNamespace = protobufjs.loadSync(protofile);
        if (!protoNamespace) {
            throw new Error('Cannot find ' + path.resolve(protoPath));
        }
        const workerpb = protoNamespace.lookup('blaze.worker');
        if (!workerpb) {
            throw new Error(`Cannot find namespace blaze.worker`);
        }
        return workerpb;
    }
    /**
     * workerpb contains the runtime representation of the worker protocol buffer,
     * including accessor for the defined messages.
     */
    const workerpb = loadWorkerPb();
    /**
     * runWorkerLoop handles the interacton between bazel workers and the
     * TypeScript compiler. It reads compilation requests from stdin, unmarshals the
     * data, and dispatches into `runOneBuild` for the actual compilation to happen.
     *
     * The compilation handler is parameterized so that this code can be used by
     * different compiler entry points (currently TypeScript compilation, Angular
     * compilation, and the contrib vulcanize worker).
     *
     * It's also exposed publicly as an npm package:
     *   https://www.npmjs.com/package/@bazel/worker
     */
    function runWorkerLoop(runOneBuild) {
        return __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            // Hook all output to stderr and write it to a buffer, then include
            // that buffer's in the worker protcol proto's textual output.  This
            // means you can log via console.error() and it will appear to the
            // user as expected.
            let consoleOutput = '';
            process.stderr.write =
                (chunk, ...otherArgs) => {
                    consoleOutput += chunk.toString();
                    return true;
                };
            // Accumulator for asynchronously read input.
            // protobufjs uses node's Buffer, but has its own reader abstraction on top of
            // it (for browser compatiblity). It ignores Buffer's builtin start and
            // offset, which means the handling code below cannot use Buffer in a
            // meaningful way (such as cycling data through it). The handler below reads
            // any data available on stdin, concatenating it into this buffer. It then
            // attempts to read a delimited Message from it. If a message is incomplete,
            // it exits and waits for more input. If a message has been read, it strips
            // its data of this buffer.
            let buf = Buffer.alloc(0);
            try {
                stdinLoop: for (var _b = __asyncValues(process.stdin), _c; _c = yield _b.next(), !_c.done;) {
                    const chunk = _c.value;
                    buf = Buffer.concat([buf, chunk]);
                    try {
                        const reader = new protobufjs.Reader(buf);
                        // Read all requests that have accumulated in the buffer.
                        while (reader.len - reader.pos > 0) {
                            const messageStart = reader.len;
                            const msgLength = reader.uint32();
                            // chunk might be an incomplete read from stdin. If there are not enough
                            // bytes for the next full message, wait for more input.
                            if ((reader.len - reader.pos) < msgLength)
                                continue stdinLoop;
                            const req = workerpb.WorkRequest.decode(reader, msgLength);
                            // Once a message has been read, remove it from buf so that if we pause
                            // to read more input, this message will not be processed again.
                            buf = buf.slice(messageStart);
                            debug('=== Handling new build request');
                            // Reset accumulated log output.
                            consoleOutput = '';
                            const args = req.arguments;
                            const inputs = {};
                            for (const input of req.inputs) {
                                inputs[input.path] = input.digest.toString('hex');
                            }
                            debug('Compiling with:\n\t' + args.join('\n\t'));
                            const exitCode = (yield runOneBuild(args, inputs)) ? 0 : 1;
                            process.stdout.write((workerpb.WorkResponse.encodeDelimited({
                                exitCode,
                                output: consoleOutput,
                            })).finish());
                            // Force a garbage collection pass.  This keeps our memory usage
                            // consistent across multiple compilations, and allows the file
                            // cache to use the current memory usage as a guideline for expiring
                            // data.  Note: this is intentionally not within runOneBuild(), as
                            // we want to gc only after all its locals have gone out of scope.
                            global.gc();
                        }
                        // All messages have been handled, make sure the invariant holds and
                        // Buffer is empty once all messages have been read.
                        if (buf.length > 0) {
                            throw new Error('buffer not empty after reading all messages');
                        }
                    }
                    catch (e) {
                        log('Compilation failed', e.stack);
                        process.stdout.write(workerpb.WorkResponse
                            .encodeDelimited({ exitCode: 1, output: consoleOutput })
                            .finish());
                        // Clear buffer so the next build won't read an incomplete request.
                        buf = Buffer.alloc(0);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    exports.runWorkerLoop = runWorkerLoop;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vZXh0ZXJuYWwvYnVpbGRfYmF6ZWxfcnVsZXNfdHlwZXNjcmlwdC9pbnRlcm5hbC90c2Nfd3JhcHBlZC93b3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSw2QkFBNkI7SUFDN0IseUNBQXlDO0lBRXpDLDhDQUE4QztJQUM5Qyx3RUFBd0U7SUFDeEUsZ0JBQWdCO0lBQ2hCLElBQUksT0FBTyxNQUFNLENBQUMsRUFBRSxLQUFLLFVBQVUsRUFBRTtRQUNuQyw4Q0FBOEM7UUFDOUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hELDhDQUE4QztRQUM5QyxNQUFNLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakQ7SUFFRDs7O09BR0c7SUFDVSxRQUFBLEtBQUssR0FBRyxLQUFLLENBQUM7SUFFM0IsNkVBQTZFO0lBQzdFLFNBQWdCLEtBQUssQ0FBQyxHQUFHLElBQW9CO1FBQzNDLElBQUksYUFBSztZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFGRCxzQkFFQztJQUVEOzs7T0FHRztJQUNILFNBQWdCLEdBQUcsQ0FBQyxHQUFHLElBQW9CO1FBQ3pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFGRCxrQkFFQztJQUVEOzs7T0FHRztJQUNILFNBQWdCLFdBQVcsQ0FBQyxJQUFjO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFD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QUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO3lCQUNoRTtxQkFDRjtvQkFBQyxPQUFPLENBQUMsRUFBRTt3QkFDVixHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNuQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDaEIsUUFBUSxDQUFDLFlBQVk7NkJBQ2hCLGVBQWUsQ0FBQyxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBQyxDQUFDOzZCQUNyRCxNQUFNLEVBQVksQ0FBQyxDQUFDO3dCQUM3QixtRUFBbUU7d0JBQ25FLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2QjtpQkFDRjs7Ozs7Ozs7O1FBQ0gsQ0FBQztLQUFBO0lBN0VELHNDQTZFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBwcm90b2J1ZmpzIGZyb20gJ3Byb3RvYnVmanMnO1xuXG4vLyBFcXVpdmFsZW50IG9mIHJ1bm5pbmcgbm9kZSB3aXRoIC0tZXhwb3NlLWdjXG4vLyBidXQgZWFzaWVyIHRvIHdyaXRlIHRvb2xpbmcgc2luY2Ugd2UgZG9uJ3QgbmVlZCB0byBpbmplY3QgdGhhdCBhcmcgdG9cbi8vIG5vZGVqc19iaW5hcnlcbmlmICh0eXBlb2YgZ2xvYmFsLmdjICE9PSAnZnVuY3Rpb24nKSB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgcmVxdWlyZSgndjgnKS5zZXRGbGFnc0Zyb21TdHJpbmcoJy0tZXhwb3NlX2djJyk7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgZ2xvYmFsLmdjID0gcmVxdWlyZSgndm0nKS5ydW5Jbk5ld0NvbnRleHQoJ2djJyk7XG59XG5cbi8qKlxuICogV2hldGhlciB0byBwcmludCBkZWJ1ZyBtZXNzYWdlcyAodG8gY29uc29sZS5lcnJvcikgZnJvbSB0aGUgZGVidWcgZnVuY3Rpb25cbiAqIGJlbG93LlxuICovXG5leHBvcnQgY29uc3QgREVCVUcgPSBmYWxzZTtcblxuLyoqIE1heWJlIHByaW50IGEgZGVidWcgbWVzc2FnZSAoZGVwZW5kaW5nIG9uIGEgZmxhZyBkZWZhdWx0aW5nIHRvIGZhbHNlKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyguLi5hcmdzOiBBcnJheTx1bmtub3duPikge1xuICBpZiAoREVCVUcpIGNvbnNvbGUuZXJyb3IuY2FsbChjb25zb2xlLCAuLi5hcmdzKTtcbn1cblxuLyoqXG4gKiBXcml0ZSBhIG1lc3NhZ2UgdG8gc3RkZXJyLCB3aGljaCBhcHBlYXJzIGluIHRoZSBiYXplbCBsb2cgYW5kIGlzIHZpc2libGUgdG9cbiAqIHRoZSBlbmQgdXNlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvZyguLi5hcmdzOiBBcnJheTx1bmtub3duPikge1xuICBjb25zb2xlLmVycm9yLmNhbGwoY29uc29sZSwgLi4uYXJncyk7XG59XG5cbi8qKlxuICogcnVuQXNXb3JrZXIgcmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBhcmd1bWVudHMgaW5kaWNhdGUgdGhlIHByb2Nlc3Mgc2hvdWxkXG4gKiBydW4gYXMgYSBwZXJzaXN0ZW50IHdvcmtlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJ1bkFzV29ya2VyKGFyZ3M6IHN0cmluZ1tdKSB7XG4gIHJldHVybiBhcmdzLmluZGV4T2YoJy0tcGVyc2lzdGVudF93b3JrZXInKSAhPT0gLTE7XG59XG5cbi8qKlxuICogd29ya2VyUHJvdG8gZGVjbGFyZXMgdGhlIHN0YXRpYyB0eXBlIG9mIHRoZSBvYmplY3QgY29uc3RydWN0ZWQgYXQgcnVudGltZSBieVxuICogcHJvdG9idWZqcywgYmFzZWQgb24gcmVhZGluZyB0aGUgcHJvdG9jb2wgYnVmZmVyIGRlZmluaXRpb24uXG4gKi9cbmRlY2xhcmUgbmFtZXNwYWNlIHdvcmtlclByb3RvIHtcbiAgLyoqIElucHV0IHJlcHJlc2VudHMgdGhlIGJsYXplLndvcmtlci5JbnB1dCBtZXNzYWdlLiAqL1xuICBpbnRlcmZhY2UgSW5wdXQgZXh0ZW5kcyBwcm90b2J1ZmpzLk1lc3NhZ2U8SW5wdXQ+IHtcbiAgICBwYXRoOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogSW4gTm9kZSwgZGlnZXN0IGlzIGEgQnVmZmVyLiBJbiB0aGUgYnJvd3NlciwgaXQncyBhIHJlcGxhY2VtZW50XG4gICAgICogaW1wbGVtZW50YXRpb24uIFdlIG9ubHkgY2FyZSBhYm91dCBpdHMgdG9TdHJpbmcoZW5jb2RpbmcpIG1ldGhvZC5cbiAgICAgKi9cbiAgICBkaWdlc3Q6IHt0b1N0cmluZyhlbmNvZGluZzogc3RyaW5nKTogc3RyaW5nfTtcbiAgfVxuXG4gIC8qKiBXb3JrUmVxdWVzdCByZXBlc2VudHMgdGhlIGJsYXplLndvcmtlci5Xb3JrUmVxdWVzdCBtZXNzYWdlLiAqL1xuICBpbnRlcmZhY2UgV29ya1JlcXVlc3QgZXh0ZW5kcyBwcm90b2J1ZmpzLk1lc3NhZ2U8V29ya1JlcXVlc3Q+IHtcbiAgICBhcmd1bWVudHM6IHN0cmluZ1tdO1xuICAgIGlucHV0czogSW5wdXRbXTtcbiAgfVxuXG4gIC8vIHRzbGludDpkaXNhYmxlOnZhcmlhYmxlLW5hbWUgcmVmbGVjdGVkLCBjb25zdHJ1Y3RhYmxlIHR5cGVzLlxuICBjb25zdCBXb3JrUmVxdWVzdDogcHJvdG9idWZqcy5UeXBlO1xuICBjb25zdCBXb3JrUmVzcG9uc2U6IHByb3RvYnVmanMuVHlwZTtcbiAgLy8gdHNsaW50OmVuYWJsZTp2YXJpYWJsZS1uYW1lXG59XG5cbi8qKlxuICogbG9hZFdvcmtlclBiIGZpbmRzIGFuZCBsb2FkcyB0aGUgcHJvdG9jb2wgYnVmZmVyIGRlZmluaXRpb24gZm9yIGJhemVsJ3NcbiAqIHdvcmtlciBwcm90b2NvbCB1c2luZyBwcm90b2J1ZmpzLiBJbiBwcm90b2J1ZmpzLCB0aGlzIG1lYW5zIGl0J3MgYSByZWZsZWN0aW9uXG4gKiBvYmplY3QgdGhhdCBhbHNvIGNvbnRhaW5zIHByb3BlcnRpZXMgZm9yIHRoZSBpbmRpdmlkdWFsIG1lc3NhZ2VzLlxuICovXG5mdW5jdGlvbiBsb2FkV29ya2VyUGIoKSB7XG4gIGNvbnN0IHByb3RvUGF0aCA9XG4gICAgICAnLi4vLi4vdGhpcmRfcGFydHkvZ2l0aHViLmNvbS9iYXplbGJ1aWxkL2JhemVsL3NyYy9tYWluL3Byb3RvYnVmL3dvcmtlcl9wcm90b2NvbC5wcm90byc7XG5cbiAgLy8gVXNlIG5vZGUgbW9kdWxlIHJlc29sdXRpb24gc28gd2UgY2FuIGZpbmQgdGhlIC5wcm90byBmaWxlIGluIGFueSBvZiB0aGVcbiAgLy8gcm9vdCBkaXJzXG4gIGxldCBwcm90b2ZpbGU7XG4gIHRyeSB7XG4gICAgLy8gTG9vayBmb3IgdGhlIC5wcm90byBmaWxlIHJlbGF0aXZlIGluIGl0cyBAYmF6ZWwvdHlwZXNjcmlwdCBucG0gcGFja2FnZVxuICAgIC8vIGxvY2F0aW9uXG4gICAgcHJvdG9maWxlID0gcmVxdWlyZS5yZXNvbHZlKHByb3RvUGF0aCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgfVxuICBpZiAoIXByb3RvZmlsZSkge1xuICAgIC8vIElmIG5vdCBmb3VuZCBhYm92ZSwgbG9vayBmb3IgdGhlIC5wcm90byBmaWxlIGluIGl0cyBydWxlc190eXBlc2NyaXB0XG4gICAgLy8gd29ya3NwYWNlIGxvY2F0aW9uXG4gICAgLy8gVGhpcyBleHRyYSBsb29rdXAgc2hvdWxkIG5ldmVyIGhhcHBlbiBpbiBnb29nbGUzLiBJdCdzIG9ubHkgbmVlZGVkIGZvclxuICAgIC8vIGxvY2FsIGRldmVsb3BtZW50IGluIHRoZSBydWxlc190eXBlc2NyaXB0IHJlcG8uXG4gICAgcHJvdG9maWxlID0gcmVxdWlyZS5yZXNvbHZlKFxuICAgICAgICAnYnVpbGRfYmF6ZWxfcnVsZXNfdHlwZXNjcmlwdC90aGlyZF9wYXJ0eS9naXRodWIuY29tL2JhemVsYnVpbGQvYmF6ZWwvc3JjL21haW4vcHJvdG9idWYvd29ya2VyX3Byb3RvY29sLnByb3RvJyk7XG4gIH1cblxuICBjb25zdCBwcm90b05hbWVzcGFjZSA9IHByb3RvYnVmanMubG9hZFN5bmMocHJvdG9maWxlKTtcbiAgaWYgKCFwcm90b05hbWVzcGFjZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgJyArIHBhdGgucmVzb2x2ZShwcm90b1BhdGgpKTtcbiAgfVxuICBjb25zdCB3b3JrZXJwYiA9IHByb3RvTmFtZXNwYWNlLmxvb2t1cCgnYmxhemUud29ya2VyJyk7XG4gIGlmICghd29ya2VycGIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIG5hbWVzcGFjZSBibGF6ZS53b3JrZXJgKTtcbiAgfVxuICByZXR1cm4gd29ya2VycGIgYXMgcHJvdG9idWZqcy5SZWZsZWN0aW9uT2JqZWN0ICYgdHlwZW9mIHdvcmtlclByb3RvO1xufVxuXG4vKipcbiAqIHdvcmtlcnBiIGNvbnRhaW5zIHRoZSBydW50aW1lIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB3b3JrZXIgcHJvdG9jb2wgYnVmZmVyLFxuICogaW5jbHVkaW5nIGFjY2Vzc29yIGZvciB0aGUgZGVmaW5lZCBtZXNzYWdlcy5cbiAqL1xuY29uc3Qgd29ya2VycGIgPSBsb2FkV29ya2VyUGIoKTtcblxuLyoqXG4gKiBydW5Xb3JrZXJMb29wIGhhbmRsZXMgdGhlIGludGVyYWN0b24gYmV0d2VlbiBiYXplbCB3b3JrZXJzIGFuZCB0aGVcbiAqIFR5cGVTY3JpcHQgY29tcGlsZXIuIEl0IHJlYWRzIGNvbXBpbGF0aW9uIHJlcXVlc3RzIGZyb20gc3RkaW4sIHVubWFyc2hhbHMgdGhlXG4gKiBkYXRhLCBhbmQgZGlzcGF0Y2hlcyBpbnRvIGBydW5PbmVCdWlsZGAgZm9yIHRoZSBhY3R1YWwgY29tcGlsYXRpb24gdG8gaGFwcGVuLlxuICpcbiAqIFRoZSBjb21waWxhdGlvbiBoYW5kbGVyIGlzIHBhcmFtZXRlcml6ZWQgc28gdGhhdCB0aGlzIGNvZGUgY2FuIGJlIHVzZWQgYnlcbiAqIGRpZmZlcmVudCBjb21waWxlciBlbnRyeSBwb2ludHMgKGN1cnJlbnRseSBUeXBlU2NyaXB0IGNvbXBpbGF0aW9uLCBBbmd1bGFyXG4gKiBjb21waWxhdGlvbiwgYW5kIHRoZSBjb250cmliIHZ1bGNhbml6ZSB3b3JrZXIpLlxuICpcbiAqIEl0J3MgYWxzbyBleHBvc2VkIHB1YmxpY2x5IGFzIGFuIG5wbSBwYWNrYWdlOlxuICogICBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AYmF6ZWwvd29ya2VyXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW5Xb3JrZXJMb29wKFxuICAgIHJ1bk9uZUJ1aWxkOiAoYXJnczogc3RyaW5nW10sIGlucHV0cz86IHtbcGF0aDogc3RyaW5nXTogc3RyaW5nfSkgPT5cbiAgICAgICAgYm9vbGVhbiB8IFByb21pc2U8Ym9vbGVhbj4pIHtcbiAgLy8gSG9vayBhbGwgb3V0cHV0IHRvIHN0ZGVyciBhbmQgd3JpdGUgaXQgdG8gYSBidWZmZXIsIHRoZW4gaW5jbHVkZVxuICAvLyB0aGF0IGJ1ZmZlcidzIGluIHRoZSB3b3JrZXIgcHJvdGNvbCBwcm90bydzIHRleHR1YWwgb3V0cHV0LiAgVGhpc1xuICAvLyBtZWFucyB5b3UgY2FuIGxvZyB2aWEgY29uc29sZS5lcnJvcigpIGFuZCBpdCB3aWxsIGFwcGVhciB0byB0aGVcbiAgLy8gdXNlciBhcyBleHBlY3RlZC5cbiAgbGV0IGNvbnNvbGVPdXRwdXQgPSAnJztcbiAgcHJvY2Vzcy5zdGRlcnIud3JpdGUgPVxuICAgICAgKGNodW5rOiBzdHJpbmd8QnVmZmVyLCAuLi5vdGhlckFyZ3M6IEFycmF5PHVua25vd24+KTogYm9vbGVhbiA9PiB7XG4gICAgICAgIGNvbnNvbGVPdXRwdXQgKz0gY2h1bmsudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gIC8vIEFjY3VtdWxhdG9yIGZvciBhc3luY2hyb25vdXNseSByZWFkIGlucHV0LlxuICAvLyBwcm90b2J1ZmpzIHVzZXMgbm9kZSdzIEJ1ZmZlciwgYnV0IGhhcyBpdHMgb3duIHJlYWRlciBhYnN0cmFjdGlvbiBvbiB0b3Agb2ZcbiAgLy8gaXQgKGZvciBicm93c2VyIGNvbXBhdGlibGl0eSkuIEl0IGlnbm9yZXMgQnVmZmVyJ3MgYnVpbHRpbiBzdGFydCBhbmRcbiAgLy8gb2Zmc2V0LCB3aGljaCBtZWFucyB0aGUgaGFuZGxpbmcgY29kZSBiZWxvdyBjYW5ub3QgdXNlIEJ1ZmZlciBpbiBhXG4gIC8vIG1lYW5pbmdmdWwgd2F5IChzdWNoIGFzIGN5Y2xpbmcgZGF0YSB0aHJvdWdoIGl0KS4gVGhlIGhhbmRsZXIgYmVsb3cgcmVhZHNcbiAgLy8gYW55IGRhdGEgYXZhaWxhYmxlIG9uIHN0ZGluLCBjb25jYXRlbmF0aW5nIGl0IGludG8gdGhpcyBidWZmZXIuIEl0IHRoZW5cbiAgLy8gYXR0ZW1wdHMgdG8gcmVhZCBhIGRlbGltaXRlZCBNZXNzYWdlIGZyb20gaXQuIElmIGEgbWVzc2FnZSBpcyBpbmNvbXBsZXRlLFxuICAvLyBpdCBleGl0cyBhbmQgd2FpdHMgZm9yIG1vcmUgaW5wdXQuIElmIGEgbWVzc2FnZSBoYXMgYmVlbiByZWFkLCBpdCBzdHJpcHNcbiAgLy8gaXRzIGRhdGEgb2YgdGhpcyBidWZmZXIuXG4gIGxldCBidWY6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygwKTtcbiAgc3RkaW5Mb29wOiBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIHByb2Nlc3Muc3RkaW4pIHtcbiAgICBidWYgPSBCdWZmZXIuY29uY2F0KFtidWYsIGNodW5rIGFzIEJ1ZmZlcl0pO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgcHJvdG9idWZqcy5SZWFkZXIoYnVmKTtcbiAgICAgIC8vIFJlYWQgYWxsIHJlcXVlc3RzIHRoYXQgaGF2ZSBhY2N1bXVsYXRlZCBpbiB0aGUgYnVmZmVyLlxuICAgICAgd2hpbGUgKHJlYWRlci5sZW4gLSByZWFkZXIucG9zID4gMCkge1xuICAgICAgICBjb25zdCBtZXNzYWdlU3RhcnQgPSByZWFkZXIubGVuO1xuICAgICAgICBjb25zdCBtc2dMZW5ndGg6IG51bWJlciA9IHJlYWRlci51aW50MzIoKTtcbiAgICAgICAgLy8gY2h1bmsgbWlnaHQgYmUgYW4gaW5jb21wbGV0ZSByZWFkIGZyb20gc3RkaW4uIElmIHRoZXJlIGFyZSBub3QgZW5vdWdoXG4gICAgICAgIC8vIGJ5dGVzIGZvciB0aGUgbmV4dCBmdWxsIG1lc3NhZ2UsIHdhaXQgZm9yIG1vcmUgaW5wdXQuXG4gICAgICAgIGlmICgocmVhZGVyLmxlbiAtIHJlYWRlci5wb3MpIDwgbXNnTGVuZ3RoKSBjb250aW51ZSBzdGRpbkxvb3A7XG5cbiAgICAgICAgY29uc3QgcmVxID0gd29ya2VycGIuV29ya1JlcXVlc3QuZGVjb2RlKHJlYWRlciwgbXNnTGVuZ3RoKSBhc1xuICAgICAgICAgICAgd29ya2VyUHJvdG8uV29ya1JlcXVlc3Q7XG4gICAgICAgIC8vIE9uY2UgYSBtZXNzYWdlIGhhcyBiZWVuIHJlYWQsIHJlbW92ZSBpdCBmcm9tIGJ1ZiBzbyB0aGF0IGlmIHdlIHBhdXNlXG4gICAgICAgIC8vIHRvIHJlYWQgbW9yZSBpbnB1dCwgdGhpcyBtZXNzYWdlIHdpbGwgbm90IGJlIHByb2Nlc3NlZCBhZ2Fpbi5cbiAgICAgICAgYnVmID0gYnVmLnNsaWNlKG1lc3NhZ2VTdGFydCk7XG4gICAgICAgIGRlYnVnKCc9PT0gSGFuZGxpbmcgbmV3IGJ1aWxkIHJlcXVlc3QnKTtcbiAgICAgICAgLy8gUmVzZXQgYWNjdW11bGF0ZWQgbG9nIG91dHB1dC5cbiAgICAgICAgY29uc29sZU91dHB1dCA9ICcnO1xuICAgICAgICBjb25zdCBhcmdzID0gcmVxLmFyZ3VtZW50cztcbiAgICAgICAgY29uc3QgaW5wdXRzOiB7W3BhdGg6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBpbnB1dCBvZiByZXEuaW5wdXRzKSB7XG4gICAgICAgICAgaW5wdXRzW2lucHV0LnBhdGhdID0gaW5wdXQuZGlnZXN0LnRvU3RyaW5nKCdoZXgnKTtcbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZygnQ29tcGlsaW5nIHdpdGg6XFxuXFx0JyArIGFyZ3Muam9pbignXFxuXFx0JykpO1xuICAgICAgICBjb25zdCBleGl0Q29kZSA9IChhd2FpdCBydW5PbmVCdWlsZChhcmdzLCBpbnB1dHMpKSA/IDAgOiAxO1xuICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgod29ya2VycGIuV29ya1Jlc3BvbnNlLmVuY29kZURlbGltaXRlZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpdENvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiBjb25zb2xlT3V0cHV0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSkuZmluaXNoKCkgYXMgQnVmZmVyKTtcbiAgICAgICAgLy8gRm9yY2UgYSBnYXJiYWdlIGNvbGxlY3Rpb24gcGFzcy4gIFRoaXMga2VlcHMgb3VyIG1lbW9yeSB1c2FnZVxuICAgICAgICAvLyBjb25zaXN0ZW50IGFjcm9zcyBtdWx0aXBsZSBjb21waWxhdGlvbnMsIGFuZCBhbGxvd3MgdGhlIGZpbGVcbiAgICAgICAgLy8gY2FjaGUgdG8gdXNlIHRoZSBjdXJyZW50IG1lbW9yeSB1c2FnZSBhcyBhIGd1aWRlbGluZSBmb3IgZXhwaXJpbmdcbiAgICAgICAgLy8gZGF0YS4gIE5vdGU6IHRoaXMgaXMgaW50ZW50aW9uYWxseSBub3Qgd2l0aGluIHJ1bk9uZUJ1aWxkKCksIGFzXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gZ2Mgb25seSBhZnRlciBhbGwgaXRzIGxvY2FscyBoYXZlIGdvbmUgb3V0IG9mIHNjb3BlLlxuICAgICAgICBnbG9iYWwuZ2MoKTtcbiAgICAgIH1cbiAgICAgIC8vIEFsbCBtZXNzYWdlcyBoYXZlIGJlZW4gaGFuZGxlZCwgbWFrZSBzdXJlIHRoZSBpbnZhcmlhbnQgaG9sZHMgYW5kXG4gICAgICAvLyBCdWZmZXIgaXMgZW1wdHkgb25jZSBhbGwgbWVzc2FnZXMgaGF2ZSBiZWVuIHJlYWQuXG4gICAgICBpZiAoYnVmLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdidWZmZXIgbm90IGVtcHR5IGFmdGVyIHJlYWRpbmcgYWxsIG1lc3NhZ2VzJyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nKCdDb21waWxhdGlvbiBmYWlsZWQnLCBlLnN0YWNrKTtcbiAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKFxuICAgICAgICAgIHdvcmtlcnBiLldvcmtSZXNwb25zZVxuICAgICAgICAgICAgICAuZW5jb2RlRGVsaW1pdGVkKHtleGl0Q29kZTogMSwgb3V0cHV0OiBjb25zb2xlT3V0cHV0fSlcbiAgICAgICAgICAgICAgLmZpbmlzaCgpIGFzIEJ1ZmZlcik7XG4gICAgICAvLyBDbGVhciBidWZmZXIgc28gdGhlIG5leHQgYnVpbGQgd29uJ3QgcmVhZCBhbiBpbmNvbXBsZXRlIHJlcXVlc3QuXG4gICAgICBidWYgPSBCdWZmZXIuYWxsb2MoMCk7XG4gICAgfVxuICB9XG59XG4iXX0=