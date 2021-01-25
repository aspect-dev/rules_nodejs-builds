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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdHJhY3Rvci11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3Byb3RyYWN0b3IvcHJvdHJhY3Rvci11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVILE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFFLENBQUMsQ0FBQztJQUNyRSwrQ0FBK0M7SUFDL0MsMkJBQTJCO0lBRTNCLFNBQWdCLGFBQWEsQ0FBQyxJQUFZO1FBQ3hDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUN2QixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFiRCxzQ0FhQztJQUVELFNBQWdCLGNBQWMsQ0FBQyxJQUFZO1FBQ3pDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7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QUMsQ0FBQyxDQUFDO1lBRUgscURBQXFEO1lBQ3JELE1BQU0sYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUVuQyxPQUFPLEVBQUMsSUFBSSxFQUFDLENBQUM7UUFDaEIsQ0FBQztLQUFBO0lBckJELDhCQXFCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IFRoZSBCYXplbCBBdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5jb25zdCBydW5maWxlcyA9IHJlcXVpcmUocHJvY2Vzcy5lbnZbJ0JBWkVMX05PREVfUlVORklMRVNfSEVMUEVSJ10hKTtcbmltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBuZXQgZnJvbSAnbmV0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGNwUG9ydEZyZWUocG9ydDogbnVtYmVyKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgc2VydmVyID0gbmV0LmNyZWF0ZVNlcnZlcigpO1xuICAgIHNlcnZlci5vbignZXJyb3InLCAoZSkgPT4ge1xuICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgfSk7XG4gICAgc2VydmVyLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgfSk7XG4gICAgc2VydmVyLmxpc3Rlbihwb3J0LCAoKSA9PiB7XG4gICAgICBzZXJ2ZXIuY2xvc2UoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RjcFBvcnRCb3VuZChwb3J0OiBudW1iZXIpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgbmV0LlNvY2tldCgpO1xuICAgIGNsaWVudC5vbmNlKCdjb25uZWN0JywgKCkgPT4ge1xuICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICB9KTtcbiAgICBjbGllbnQub25jZSgnZXJyb3InLCAoZSkgPT4ge1xuICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgfSk7XG4gICAgY2xpZW50LmNvbm5lY3QocG9ydCk7XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluZEZyZWVUY3BQb3J0KCk6IFByb21pc2U8bnVtYmVyPiB7XG4gIGNvbnN0IHJhbmdlID0ge1xuICAgIG1pbjogMzI3NjgsXG4gICAgbWF4OiA2MDAwMCxcbiAgfTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgIGxldCBwb3J0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHJhbmdlLm1heCAtIHJhbmdlLm1pbikgKyByYW5nZS5taW4pO1xuICAgIGlmIChhd2FpdCBpc1RjcFBvcnRGcmVlKHBvcnQpKSB7XG4gICAgICByZXR1cm4gcG9ydDtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBhIGZyZWUgcG9ydCcpO1xufVxuXG4vLyBJbnRlcmZhY2UgZm9yIGNvbmZpZyBwYXJhbWV0ZXIgb2YgdGhlIHByb3RyYWN0b3Jfd2ViX3Rlc3Rfc3VpdGUgb25QcmVwYXJlIGZ1bmN0aW9uXG5leHBvcnQgaW50ZXJmYWNlIE9uUHJlcGFyZUNvbmZpZyB7XG4gIC8vIFRoZSB3b3Jrc3BhY2UgbmFtZVxuICB3b3Jrc3BhY2U6IHN0cmluZztcblxuICAvLyBUaGUgc2VydmVyIGJpbmFyeSB0byBydW5cbiAgc2VydmVyOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yU2VydmVyKHBvcnQ6IG51bWJlciwgdGltZW91dDogbnVtYmVyKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBpc1RjcFBvcnRCb3VuZChwb3J0KS50aGVuKGlzQm91bmQgPT4ge1xuICAgIGlmICghaXNCb3VuZCkge1xuICAgICAgaWYgKHRpbWVvdXQgPD0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RpbWVvdXQgd2FpdGluZyBmb3Igc2VydmVyIHRvIHN0YXJ0Jyk7XG4gICAgICB9XG4gICAgICBjb25zdCB3YWl0ID0gTWF0aC5taW4odGltZW91dCwgNTAwKTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHNldFRpbWVvdXQocmVzLCB3YWl0KSlcbiAgICAgICAgICAudGhlbigoKSA9PiB3YWl0Rm9yU2VydmVyKHBvcnQsIHRpbWVvdXQgLSB3YWl0KSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cblxuLy8gUmV0dXJuIHR5cGUgZnJvbSBydW5TZXJ2ZXIgZnVuY3Rpb25cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmVyU3BlYyB7XG4gIC8vIFBvcnQgbnVtYmVyIHRoYXQgdGhlIHNlcnZlciBpcyBydW5uaW5nIG9uXG4gIHBvcnQ6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSdW5zIHRoZSBzcGVjaWZpZWQgc2VydmVyIGJpbmFyeSBmcm9tIGEgZ2l2ZW4gd29ya3NwYWNlIGFuZCB3YWl0cyBmb3IgdGhlIHNlcnZlclxuICogYmVpbmcgcmVhZHkuIFRoZSBzZXJ2ZXIgYmluYXJ5IHdpbGwgYmUgcmVzb2x2ZWQgZnJvbSB0aGUgQmF6ZWwgcnVuZmlsZXMuIE5vdGUgdGhhdFxuICogdGhlIHNlcnZlciB3aWxsIGJlIGxhdW5jaGVkIHdpdGggYSByYW5kb20gZnJlZSBwb3J0IGluIG9yZGVyIHRvIHN1cHBvcnQgdGVzdCBjb25jdXJyZW5jeVxuICogd2l0aCBCYXplbC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1blNlcnZlcihcbiAgICB3b3Jrc3BhY2U6IHN0cmluZywgc2VydmVyVGFyZ2V0OiBzdHJpbmcsIHBvcnRGbGFnOiBzdHJpbmcsIHNlcnZlckFyZ3M6IHN0cmluZ1tdLFxuICAgIHRpbWVvdXQgPSA1MDAwKTogUHJvbWlzZTxTZXJ2ZXJTcGVjPiB7XG4gIGNvbnN0IHNlcnZlclBhdGggPSBydW5maWxlcy5yZXNvbHZlKGAke3dvcmtzcGFjZX0vJHtzZXJ2ZXJUYXJnZXR9YCk7XG4gIGNvbnN0IHBvcnQgPSBhd2FpdCBmaW5kRnJlZVRjcFBvcnQoKTtcblxuICAvLyBTdGFydCB0aGUgQmF6ZWwgc2VydmVyIGJpbmFyeSB3aXRoIGEgcmFuZG9tIGZyZWUgVENQIHBvcnQuXG4gIGNvbnN0IHNlcnZlclByb2Nlc3MgPSBjaGlsZF9wcm9jZXNzLnNwYXduKFxuICAgICAgc2VydmVyUGF0aCwgc2VydmVyQXJncy5jb25jYXQoW3BvcnRGbGFnLCBwb3J0LnRvU3RyaW5nKCldKSwge3N0ZGlvOiAnaW5oZXJpdCd9KTtcblxuICAvLyBJbiBjYXNlIHRoZSBwcm9jZXNzIGV4aXRlZCB3aXRoIGFuIGVycm9yLCB3ZSB3YW50IHRvIHByb3BhZ2F0ZSB0aGUgZXJyb3IuXG4gIHNlcnZlclByb2Nlc3Mub24oJ2V4aXQnLCBleGl0Q29kZSA9PiB7XG4gICAgaWYgKGV4aXRDb2RlICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNlcnZlciBleGl0ZWQgd2l0aCBlcnJvciBjb2RlOiAke2V4aXRDb2RlfWApO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gV2FpdCBmb3IgdGhlIHNlcnZlciB0byBiZSBib3VuZCB0byB0aGUgZ2l2ZW4gcG9ydC5cbiAgYXdhaXQgd2FpdEZvclNlcnZlcihwb3J0LCB0aW1lb3V0KTtcblxuICByZXR1cm4ge3BvcnR9O1xufVxuIl19