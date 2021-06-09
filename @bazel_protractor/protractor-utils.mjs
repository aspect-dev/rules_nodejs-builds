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
const runfiles = require(process.env['BAZEL_NODE_RUNFILES_HELPER']);
import * as child_process from 'child_process';
import * as net from 'net';
export function isTcpPortFree(port) {
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
export function isTcpPortBound(port) {
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
export function findFreeTcpPort() {
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
export function waitForServer(port, timeout) {
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
/**
 * Runs the specified server binary from a given workspace and waits for the server
 * being ready. The server binary will be resolved from the Bazel runfiles. Note that
 * the server will be launched with a random free port in order to support test concurrency
 * with Bazel.
 */
export function runServer(workspace, serverTarget, portFlag, serverArgs, timeout = 5000) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdHJhY3Rvci11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3Byb3RyYWN0b3IvcHJvdHJhY3Rvci11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7QUFFSCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBRSxDQUFDLENBQUM7QUFDckUsT0FBTyxLQUFLLGFBQWEsTUFBTSxlQUFlLENBQUM7QUFDL0MsT0FBTyxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFFM0IsTUFBTSxVQUFVLGFBQWEsQ0FBQyxJQUFZO0lBQ3hDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUN2QixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLElBQVk7SUFDekMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxNQUFNLE1BQU0sR0FBRyxJ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Q0FBQyxDQUFDO1FBRUgscURBQXFEO1FBQ3JELE1BQU0sYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVuQyxPQUFPLEVBQUMsSUFBSSxFQUFDLENBQUM7SUFDaEIsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgVGhlIEJhemVsIEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmNvbnN0IHJ1bmZpbGVzID0gcmVxdWlyZShwcm9jZXNzLmVudlsnQkFaRUxfTk9ERV9SVU5GSUxFU19IRUxQRVInXSEpO1xuaW1wb3J0ICogYXMgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCAqIGFzIG5ldCBmcm9tICduZXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNUY3BQb3J0RnJlZShwb3J0OiBudW1iZXIpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBzZXJ2ZXIgPSBuZXQuY3JlYXRlU2VydmVyKCk7XG4gICAgc2VydmVyLm9uKCdlcnJvcicsIChlKSA9PiB7XG4gICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICB9KTtcbiAgICBzZXJ2ZXIub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICB9KTtcbiAgICBzZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IHtcbiAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGNwUG9ydEJvdW5kKHBvcnQ6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBuZXQuU29ja2V0KCk7XG4gICAgY2xpZW50Lm9uY2UoJ2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICByZXNvbHZlKHRydWUpO1xuICAgIH0pO1xuICAgIGNsaWVudC5vbmNlKCdlcnJvcicsIChlKSA9PiB7XG4gICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICB9KTtcbiAgICBjbGllbnQuY29ubmVjdChwb3J0KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5kRnJlZVRjcFBvcnQoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgY29uc3QgcmFuZ2UgPSB7XG4gICAgbWluOiAzMjc2OCxcbiAgICBtYXg6IDYwMDAwLFxuICB9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgbGV0IHBvcnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAocmFuZ2UubWF4IC0gcmFuZ2UubWluKSArIHJhbmdlLm1pbik7XG4gICAgaWYgKGF3YWl0IGlzVGNwUG9ydEZyZWUocG9ydCkpIHtcbiAgICAgIHJldHVybiBwb3J0O1xuICAgIH1cbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGEgZnJlZSBwb3J0Jyk7XG59XG5cbi8vIEludGVyZmFjZSBmb3IgY29uZmlnIHBhcmFtZXRlciBvZiB0aGUgcHJvdHJhY3Rvcl93ZWJfdGVzdF9zdWl0ZSBvblByZXBhcmUgZnVuY3Rpb25cbmV4cG9ydCBpbnRlcmZhY2UgT25QcmVwYXJlQ29uZmlnIHtcbiAgLy8gVGhlIHdvcmtzcGFjZSBuYW1lXG4gIHdvcmtzcGFjZTogc3RyaW5nO1xuXG4gIC8vIFRoZSBzZXJ2ZXIgYmluYXJ5IHRvIHJ1blxuICBzZXJ2ZXI6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRGb3JTZXJ2ZXIocG9ydDogbnVtYmVyLCB0aW1lb3V0OiBudW1iZXIpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgcmV0dXJuIGlzVGNwUG9ydEJvdW5kKHBvcnQpLnRoZW4oaXNCb3VuZCA9PiB7XG4gICAgaWYgKCFpc0JvdW5kKSB7XG4gICAgICBpZiAodGltZW91dCA8PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGltZW91dCB3YWl0aW5nIGZvciBzZXJ2ZXIgdG8gc3RhcnQnKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHdhaXQgPSBNYXRoLm1pbih0aW1lb3V0LCA1MDApO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4gc2V0VGltZW91dChyZXMsIHdhaXQpKVxuICAgICAgICAgIC50aGVuKCgpID0+IHdhaXRGb3JTZXJ2ZXIocG9ydCwgdGltZW91dCAtIHdhaXQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG4vLyBSZXR1cm4gdHlwZSBmcm9tIHJ1blNlcnZlciBmdW5jdGlvblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2ZXJTcGVjIHtcbiAgLy8gUG9ydCBudW1iZXIgdGhhdCB0aGUgc2VydmVyIGlzIHJ1bm5pbmcgb25cbiAgcG9ydDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJ1bnMgdGhlIHNwZWNpZmllZCBzZXJ2ZXIgYmluYXJ5IGZyb20gYSBnaXZlbiB3b3Jrc3BhY2UgYW5kIHdhaXRzIGZvciB0aGUgc2VydmVyXG4gKiBiZWluZyByZWFkeS4gVGhlIHNlcnZlciBiaW5hcnkgd2lsbCBiZSByZXNvbHZlZCBmcm9tIHRoZSBCYXplbCBydW5maWxlcy4gTm90ZSB0aGF0XG4gKiB0aGUgc2VydmVyIHdpbGwgYmUgbGF1bmNoZWQgd2l0aCBhIHJhbmRvbSBmcmVlIHBvcnQgaW4gb3JkZXIgdG8gc3VwcG9ydCB0ZXN0IGNvbmN1cnJlbmN5XG4gKiB3aXRoIEJhemVsLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuU2VydmVyKFxuICAgIHdvcmtzcGFjZTogc3RyaW5nLCBzZXJ2ZXJUYXJnZXQ6IHN0cmluZywgcG9ydEZsYWc6IHN0cmluZywgc2VydmVyQXJnczogc3RyaW5nW10sXG4gICAgdGltZW91dCA9IDUwMDApOiBQcm9taXNlPFNlcnZlclNwZWM+IHtcbiAgY29uc3Qgc2VydmVyUGF0aCA9IHJ1bmZpbGVzLnJlc29sdmUoYCR7d29ya3NwYWNlfS8ke3NlcnZlclRhcmdldH1gKTtcbiAgY29uc3QgcG9ydCA9IGF3YWl0IGZpbmRGcmVlVGNwUG9ydCgpO1xuXG4gIC8vIFN0YXJ0IHRoZSBCYXplbCBzZXJ2ZXIgYmluYXJ5IHdpdGggYSByYW5kb20gZnJlZSBUQ1AgcG9ydC5cbiAgY29uc3Qgc2VydmVyUHJvY2VzcyA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oXG4gICAgICBzZXJ2ZXJQYXRoLCBzZXJ2ZXJBcmdzLmNvbmNhdChbcG9ydEZsYWcsIHBvcnQudG9TdHJpbmcoKV0pLCB7c3RkaW86ICdpbmhlcml0J30pO1xuXG4gIC8vIEluIGNhc2UgdGhlIHByb2Nlc3MgZXhpdGVkIHdpdGggYW4gZXJyb3IsIHdlIHdhbnQgdG8gcHJvcGFnYXRlIHRoZSBlcnJvci5cbiAgc2VydmVyUHJvY2Vzcy5vbignZXhpdCcsIGV4aXRDb2RlID0+IHtcbiAgICBpZiAoZXhpdENvZGUgIT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2VydmVyIGV4aXRlZCB3aXRoIGVycm9yIGNvZGU6ICR7ZXhpdENvZGV9YCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBXYWl0IGZvciB0aGUgc2VydmVyIHRvIGJlIGJvdW5kIHRvIHRoZSBnaXZlbiBwb3J0LlxuICBhd2FpdCB3YWl0Rm9yU2VydmVyKHBvcnQsIHRpbWVvdXQpO1xuXG4gIHJldHVybiB7cG9ydH07XG59XG4iXX0=