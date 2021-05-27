/**
 * @license
 * Copyright 2017 The Bazel Authors. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@bazel/protractor", ["require", "exports", "child_process", "net"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runServer = exports.waitForServer = exports.findFreeTcpPort = exports.isTcpPortBound = exports.isTcpPortFree = void 0;
    const runfiles = require(process.env['BAZEL_NODE_RUNFILES_HELPER']);
    const child_process = require("child_process");
    const net = require("net");
    function isTcpPortFree(port) {
        return new Promise((resolve, reject) => {
            const server = net.createServer();
            server.on('error', (e) => {
                resolve(false);
            });
            server.on('close', () => {
                resolve(true);
            });
            server.listen(port, () => {
                server.close();
            });
        });
    }
    exports.isTcpPortFree = isTcpPortFree;
    function isTcpPortBound(port) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            client.once('connect', () => {
                resolve(true);
            });
            client.once('error', (e) => {
                resolve(false);
            });
            client.connect(port);
        });
    }
    exports.isTcpPortBound = isTcpPortBound;
    function findFreeTcpPort() {
        return __awaiter(this, void 0, void 0, function* () {
            const range = {
                min: 32768,
                max: 60000,
            };
            for (let i = 0; i < 100; i++) {
                let port = Math.floor(Math.random() * (range.max - range.min) + range.min);
                if (yield isTcpPortFree(port)) {
                    return port;
                }
            }
            throw new Error('Unable to find a free port');
        });
    }
    exports.findFreeTcpPort = findFreeTcpPort;
    function waitForServer(port, timeout) {
        return isTcpPortBound(port).then(isBound => {
            if (!isBound) {
                if (timeout <= 0) {
                    throw new Error('Timeout waiting for server to start');
                }
                const wait = Math.min(timeout, 500);
                return new Promise((res, rej) => setTimeout(res, wait))
                    .then(() => waitForServer(port, timeout - wait));
            }
            return true;
        });
    }
    exports.waitForServer = waitForServer;
    /**
     * Runs the specified server binary from a given workspace and waits for the server
     * being ready. The server binary will be resolved from the Bazel runfiles. Note that
     * the server will be launched with a random free port in order to support test concurrency
     * with Bazel.
     */
    function runServer(workspace, serverTarget, portFlag, serverArgs, timeout = 5000) {
        return __awaiter(this, void 0, void 0, function* () {
            const serverPath = runfiles.resolve(`${workspace}/${serverTarget}`);
            const port = yield findFreeTcpPort();
            // Start the Bazel server binary with a random free TCP port.
            const serverProcess = child_process.spawn(serverPath, serverArgs.concat([portFlag, port.toString()]), { stdio: 'inherit' });
            // In case the process exited with an error, we want to propagate the error.
            serverProcess.on('exit', exitCode => {
                if (exitCode !== 0) {
                    throw new Error(`Server exited with error code: ${exitCode}`);
                }
            });
            // Wait for the server to be bound to the given port.
            yield waitForServer(port, timeout);
            return { port };
        });
    }
    exports.runServer = runServer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdHJhY3Rvci11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3Byb3RyYWN0b3IvcHJvdHJhY3Rvci11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFSCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBRSxDQUFDLENBQUM7SUFDckUsK0NBQStDO0lBQy9DLDJCQUEyQjtJQUUzQixTQUFnQixhQUFhLENBQUMsSUFBWTtRQUN4QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNsQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtnQkFDdkIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBYkQsc0NBYUM7SUFFRCxTQUFnQixjQUFjLENBQUMsSUFBWTtRQUN6QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFD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QUFDLENBQUMsQ0FBQztZQUVILHFEQUFxRDtZQUNyRCxNQUFNLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFbkMsT0FBTyxFQUFDLElBQUksRUFBQyxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQXJCRCw4QkFxQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBUaGUgQmF6ZWwgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICpcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuY29uc3QgcnVuZmlsZXMgPSByZXF1aXJlKHByb2Nlc3MuZW52WydCQVpFTF9OT0RFX1JVTkZJTEVTX0hFTFBFUiddISk7XG5pbXBvcnQgKiBhcyBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgbmV0IGZyb20gJ25ldCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RjcFBvcnRGcmVlKHBvcnQ6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHNlcnZlciA9IG5ldC5jcmVhdGVTZXJ2ZXIoKTtcbiAgICBzZXJ2ZXIub24oJ2Vycm9yJywgKGUpID0+IHtcbiAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgIH0pO1xuICAgIHNlcnZlci5vbignY2xvc2UnLCAoKSA9PiB7XG4gICAgICByZXNvbHZlKHRydWUpO1xuICAgIH0pO1xuICAgIHNlcnZlci5saXN0ZW4ocG9ydCwgKCkgPT4ge1xuICAgICAgc2VydmVyLmNsb3NlKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUY3BQb3J0Qm91bmQocG9ydDogbnVtYmVyKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgY2xpZW50ID0gbmV3IG5ldC5Tb2NrZXQoKTtcbiAgICBjbGllbnQub25jZSgnY29ubmVjdCcsICgpID0+IHtcbiAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgfSk7XG4gICAgY2xpZW50Lm9uY2UoJ2Vycm9yJywgKGUpID0+IHtcbiAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgIH0pO1xuICAgIGNsaWVudC5jb25uZWN0KHBvcnQpO1xuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmRGcmVlVGNwUG9ydCgpOiBQcm9taXNlPG51bWJlcj4ge1xuICBjb25zdCByYW5nZSA9IHtcbiAgICBtaW46IDMyNzY4LFxuICAgIG1heDogNjAwMDAsXG4gIH07XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcbiAgICBsZXQgcG9ydCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyYW5nZS5tYXggLSByYW5nZS5taW4pICsgcmFuZ2UubWluKTtcbiAgICBpZiAoYXdhaXQgaXNUY3BQb3J0RnJlZShwb3J0KSkge1xuICAgICAgcmV0dXJuIHBvcnQ7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgYSBmcmVlIHBvcnQnKTtcbn1cblxuLy8gSW50ZXJmYWNlIGZvciBjb25maWcgcGFyYW1ldGVyIG9mIHRoZSBwcm90cmFjdG9yX3dlYl90ZXN0X3N1aXRlIG9uUHJlcGFyZSBmdW5jdGlvblxuZXhwb3J0IGludGVyZmFjZSBPblByZXBhcmVDb25maWcge1xuICAvLyBUaGUgd29ya3NwYWNlIG5hbWVcbiAgd29ya3NwYWNlOiBzdHJpbmc7XG5cbiAgLy8gVGhlIHNlcnZlciBiaW5hcnkgdG8gcnVuXG4gIHNlcnZlcjogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2FpdEZvclNlcnZlcihwb3J0OiBudW1iZXIsIHRpbWVvdXQ6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gaXNUY3BQb3J0Qm91bmQocG9ydCkudGhlbihpc0JvdW5kID0+IHtcbiAgICBpZiAoIWlzQm91bmQpIHtcbiAgICAgIGlmICh0aW1lb3V0IDw9IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaW1lb3V0IHdhaXRpbmcgZm9yIHNlcnZlciB0byBzdGFydCcpO1xuICAgICAgfVxuICAgICAgY29uc3Qgd2FpdCA9IE1hdGgubWluKHRpbWVvdXQsIDUwMCk7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiBzZXRUaW1lb3V0KHJlcywgd2FpdCkpXG4gICAgICAgICAgLnRoZW4oKCkgPT4gd2FpdEZvclNlcnZlcihwb3J0LCB0aW1lb3V0IC0gd2FpdCkpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5cbi8vIFJldHVybiB0eXBlIGZyb20gcnVuU2VydmVyIGZ1bmN0aW9uXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZlclNwZWMge1xuICAvLyBQb3J0IG51bWJlciB0aGF0IHRoZSBzZXJ2ZXIgaXMgcnVubmluZyBvblxuICBwb3J0OiBudW1iZXI7XG59XG5cbi8qKlxuICogUnVucyB0aGUgc3BlY2lmaWVkIHNlcnZlciBiaW5hcnkgZnJvbSBhIGdpdmVuIHdvcmtzcGFjZSBhbmQgd2FpdHMgZm9yIHRoZSBzZXJ2ZXJcbiAqIGJlaW5nIHJlYWR5LiBUaGUgc2VydmVyIGJpbmFyeSB3aWxsIGJlIHJlc29sdmVkIGZyb20gdGhlIEJhemVsIHJ1bmZpbGVzLiBOb3RlIHRoYXRcbiAqIHRoZSBzZXJ2ZXIgd2lsbCBiZSBsYXVuY2hlZCB3aXRoIGEgcmFuZG9tIGZyZWUgcG9ydCBpbiBvcmRlciB0byBzdXBwb3J0IHRlc3QgY29uY3VycmVuY3lcbiAqIHdpdGggQmF6ZWwuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW5TZXJ2ZXIoXG4gICAgd29ya3NwYWNlOiBzdHJpbmcsIHNlcnZlclRhcmdldDogc3RyaW5nLCBwb3J0RmxhZzogc3RyaW5nLCBzZXJ2ZXJBcmdzOiBzdHJpbmdbXSxcbiAgICB0aW1lb3V0ID0gNTAwMCk6IFByb21pc2U8U2VydmVyU3BlYz4ge1xuICBjb25zdCBzZXJ2ZXJQYXRoID0gcnVuZmlsZXMucmVzb2x2ZShgJHt3b3Jrc3BhY2V9LyR7c2VydmVyVGFyZ2V0fWApO1xuICBjb25zdCBwb3J0ID0gYXdhaXQgZmluZEZyZWVUY3BQb3J0KCk7XG5cbiAgLy8gU3RhcnQgdGhlIEJhemVsIHNlcnZlciBiaW5hcnkgd2l0aCBhIHJhbmRvbSBmcmVlIFRDUCBwb3J0LlxuICBjb25zdCBzZXJ2ZXJQcm9jZXNzID0gY2hpbGRfcHJvY2Vzcy5zcGF3bihcbiAgICAgIHNlcnZlclBhdGgsIHNlcnZlckFyZ3MuY29uY2F0KFtwb3J0RmxhZywgcG9ydC50b1N0cmluZygpXSksIHtzdGRpbzogJ2luaGVyaXQnfSk7XG5cbiAgLy8gSW4gY2FzZSB0aGUgcHJvY2VzcyBleGl0ZWQgd2l0aCBhbiBlcnJvciwgd2Ugd2FudCB0byBwcm9wYWdhdGUgdGhlIGVycm9yLlxuICBzZXJ2ZXJQcm9jZXNzLm9uKCdleGl0JywgZXhpdENvZGUgPT4ge1xuICAgIGlmIChleGl0Q29kZSAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZXJ2ZXIgZXhpdGVkIHdpdGggZXJyb3IgY29kZTogJHtleGl0Q29kZX1gKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFdhaXQgZm9yIHRoZSBzZXJ2ZXIgdG8gYmUgYm91bmQgdG8gdGhlIGdpdmVuIHBvcnQuXG4gIGF3YWl0IHdhaXRGb3JTZXJ2ZXIocG9ydCwgdGltZW91dCk7XG5cbiAgcmV0dXJuIHtwb3J0fTtcbn1cbiJdfQ==