/**
 * @fileoverview Checker contains all the information we need to perform source
 * file AST traversals and report errors.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "typescript", "./failure"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const failure_1 = require("./failure");
    /**
     * Tsetse rules use on() and addFailureAtNode() for rule implementations.
     * Rules can get a ts.TypeChecker from checker.typeChecker so typed rules are
     * possible. Compiler uses execute() to run the Tsetse check.
     */
    class Checker {
        constructor(program) {
            /**
             * nodeHandlersMap contains node to handlers mapping for all enabled rules.
             */
            this.nodeHandlersMap = new Map();
            this.failures = [];
            // currentCode will be set before invoking any handler functions so the value
            // initialized here is never used.
            this.currentCode = 0;
            // Avoid the cost for each rule to create a new TypeChecker.
            this.typeChecker = program.getTypeChecker();
        }
        /**
         * This doesn't run any checks yet. Instead, it registers `handlerFunction` on
         * `nodeKind` node in `nodeHandlersMap` map. After all rules register their
         * handlers, the source file AST will be traversed.
         */
        on(nodeKind, handlerFunction, code) {
            const newHandler = { handlerFunction, code };
            const registeredHandlers = this.nodeHandlersMap.get(nodeKind);
            if (registeredHandlers === undefined) {
                this.nodeHandlersMap.set(nodeKind, [newHandler]);
            }
            else {
                registeredHandlers.push(newHandler);
            }
        }
        /**
         * Add a failure with a span. addFailure() is currently private because
         * `addFailureAtNode` is preferred.
         */
        addFailure(start, end, failureText, fix) {
            if (!this.currentSourceFile) {
                throw new Error('Source file not defined');
            }
            if (start >= end || end > this.currentSourceFile.end || start < 0) {
                // Since only addFailureAtNode() is exposed for now this shouldn't happen.
                throw new Error(`Invalid start and end position: [${start}, ${end}]` +
                    ` in file ${this.currentSourceFile.fileName}.`);
            }
            const failure = new failure_1.Failure(this.currentSourceFile, start, end, failureText, this.currentCode, fix);
            this.failures.push(failure);
        }
        addFailureAtNode(node, failureText, fix) {
            // node.getStart() takes a sourceFile as argument whereas node.getEnd()
            // doesn't need it.
            this.addFailure(node.getStart(this.currentSourceFile), node.getEnd(), failureText, fix);
        }
        /**
         * Walk `sourceFile`, invoking registered handlers with Checker as the first
         * argument and current node as the second argument. Return failures if there
         * are any.
         */
        execute(sourceFile) {
            const thisChecker = this;
            this.currentSourceFile = sourceFile;
            this.failures = [];
            run(sourceFile);
            return this.failures;
            function run(node) {
                const handlers = thisChecker.nodeHandlersMap.get(node.kind);
                if (handlers !== undefined) {
                    for (const handler of handlers) {
                        thisChecker.currentCode = handler.code;
                        handler.handlerFunction(thisChecker, node);
                    }
                }
                ts.forEachChild(node, run);
            }
        }
    }
    exports.Checker = Checker;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2V4dGVybmFsL2J1aWxkX2JhemVsX3J1bGVzX3R5cGVzY3JpcHQvaW50ZXJuYWwvdHNldHNlL2NoZWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOzs7Ozs7Ozs7Ozs7SUFFSCxpQ0FBaUM7SUFDakMsdUNBQXVDO0lBWXZDOzs7O09BSUc7SUFDSCxNQUFhLE9BQU87UUFlbEIsWUFBWSxPQUFtQjtZQWQvQjs7ZUFFRztZQUNLLG9CQUFlLEdBQUcsSUFBSSxHQUFHLEVBQTRCLENBQUM7WUFDdEQsYUFBUSxHQUFjLEVBQUUsQ0FBQztZQUVqQyw2RUFBNkU7WUFDN0Usa0NBQWtDO1lBQzFCLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1lBT3RCLDREQUE0RDtZQUM1RCxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM5QyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILEVBQUUsQ0FDRSxRQUFtQixFQUFFLGVBQW9ELEVBQ3pFLElBQVk7WUFDZCxNQUFNLFVBQVUsR0FBWSxFQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUNwRCxNQUFNLGtCQUFrQixHQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2QyxJQUFJLGtCQUFrQixLQUFLLFNBQVMsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUNsRDtpQkFBTTtnQkFDTCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDckM7UUFDSCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0ssVUFBVSxDQUNkLEtBQWEsRUFBRSxHQUFXLEVBQUUsV0FBbUIsRUFBRSxHQUFTO1lBQzVELElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQzthQUM1QztZQUNELElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO2dCQUNqRSwwRUFBMEU7Z0JBQzFFLE1BQU0sSUFBSSxLQUFLLENBQ1gsb0NBQW9DLEtBQUssS0FBSyxHQUFHLEdBQUc7b0JBQ3BELFlBQVksSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7YUFDckQ7WUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFFRCxnQkFBZ0IsQ0FBQyxJQUFhLEVBQUUsV0FBbUIsRUFBRSxHQUFTO1lBQzVELHVFQUF1RTtZQUN2RSxtQkFBbUI7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FDWCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUUsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxPQUFPLENBQUMsVUFBeUI7WUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUM7WUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbkIsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUVyQixTQUFTLEdBQUcsQ0FBQyxJQUFhO2dCQUN4QixNQUFNLFFBQVEsR0FDVixXQUFXLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtvQkFDMUIsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7d0JBQzlCLFdBQVcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzt3QkFDdkMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQzVDO2lCQUNGO2dCQUNELEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFDSCxDQUFDO0tBQ0Y7SUExRkQsMEJBMEZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENoZWNrZXIgY29udGFpbnMgYWxsIHRoZSBpbmZvcm1hdGlvbiB3ZSBuZWVkIHRvIHBlcmZvcm0gc291cmNlXG4gKiBmaWxlIEFTVCB0cmF2ZXJzYWxzIGFuZCByZXBvcnQgZXJyb3JzLlxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtGYWlsdXJlLCBGaXh9IGZyb20gJy4vZmFpbHVyZSc7XG5cblxuLyoqXG4gKiBBIEhhbmRsZXIgY29udGFpbnMgYSBoYW5kbGVyIGZ1bmN0aW9uIGFuZCBpdHMgY29ycmVzcG9uZGluZyBlcnJvciBjb2RlIHNvXG4gKiB3aGVuIHRoZSBoYW5kbGVyIGZ1bmN0aW9uIGlzIHRyaWdnZXJlZCB3ZSBrbm93IHdoaWNoIHJ1bGUgaXMgdmlvbGF0ZWQuXG4gKi9cbmludGVyZmFjZSBIYW5kbGVyIHtcbiAgaGFuZGxlckZ1bmN0aW9uKGNoZWNrZXI6IENoZWNrZXIsIG5vZGU6IHRzLk5vZGUpOiB2b2lkO1xuICBjb2RlOiBudW1iZXI7XG59XG5cbi8qKlxuICogVHNldHNlIHJ1bGVzIHVzZSBvbigpIGFuZCBhZGRGYWlsdXJlQXROb2RlKCkgZm9yIHJ1bGUgaW1wbGVtZW50YXRpb25zLlxuICogUnVsZXMgY2FuIGdldCBhIHRzLlR5cGVDaGVja2VyIGZyb20gY2hlY2tlci50eXBlQ2hlY2tlciBzbyB0eXBlZCBydWxlcyBhcmVcbiAqIHBvc3NpYmxlLiBDb21waWxlciB1c2VzIGV4ZWN1dGUoKSB0byBydW4gdGhlIFRzZXRzZSBjaGVjay5cbiAqL1xuZXhwb3J0IGNsYXNzIENoZWNrZXIge1xuICAvKipcbiAgICogbm9kZUhhbmRsZXJzTWFwIGNvbnRhaW5zIG5vZGUgdG8gaGFuZGxlcnMgbWFwcGluZyBmb3IgYWxsIGVuYWJsZWQgcnVsZXMuXG4gICAqL1xuICBwcml2YXRlIG5vZGVIYW5kbGVyc01hcCA9IG5ldyBNYXA8dHMuU3ludGF4S2luZCwgSGFuZGxlcltdPigpO1xuICBwcml2YXRlIGZhaWx1cmVzOiBGYWlsdXJlW10gPSBbXTtcbiAgcHJpdmF0ZSBjdXJyZW50U291cmNlRmlsZTogdHMuU291cmNlRmlsZXx1bmRlZmluZWQ7XG4gIC8vIGN1cnJlbnRDb2RlIHdpbGwgYmUgc2V0IGJlZm9yZSBpbnZva2luZyBhbnkgaGFuZGxlciBmdW5jdGlvbnMgc28gdGhlIHZhbHVlXG4gIC8vIGluaXRpYWxpemVkIGhlcmUgaXMgbmV2ZXIgdXNlZC5cbiAgcHJpdmF0ZSBjdXJyZW50Q29kZSA9IDA7XG4gIC8qKlxuICAgKiBBbGxvdyB0eXBlZCBydWxlcyB2aWEgdHlwZUNoZWNrZXIuXG4gICAqL1xuICB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXI7XG5cbiAgY29uc3RydWN0b3IocHJvZ3JhbTogdHMuUHJvZ3JhbSkge1xuICAgIC8vIEF2b2lkIHRoZSBjb3N0IGZvciBlYWNoIHJ1bGUgdG8gY3JlYXRlIGEgbmV3IFR5cGVDaGVja2VyLlxuICAgIHRoaXMudHlwZUNoZWNrZXIgPSBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBkb2Vzbid0IHJ1biBhbnkgY2hlY2tzIHlldC4gSW5zdGVhZCwgaXQgcmVnaXN0ZXJzIGBoYW5kbGVyRnVuY3Rpb25gIG9uXG4gICAqIGBub2RlS2luZGAgbm9kZSBpbiBgbm9kZUhhbmRsZXJzTWFwYCBtYXAuIEFmdGVyIGFsbCBydWxlcyByZWdpc3RlciB0aGVpclxuICAgKiBoYW5kbGVycywgdGhlIHNvdXJjZSBmaWxlIEFTVCB3aWxsIGJlIHRyYXZlcnNlZC5cbiAgICovXG4gIG9uPFQgZXh0ZW5kcyB0cy5Ob2RlPihcbiAgICAgIG5vZGVLaW5kOiBUWydraW5kJ10sIGhhbmRsZXJGdW5jdGlvbjogKGNoZWNrZXI6IENoZWNrZXIsIG5vZGU6IFQpID0+IHZvaWQsXG4gICAgICBjb2RlOiBudW1iZXIpIHtcbiAgICBjb25zdCBuZXdIYW5kbGVyOiBIYW5kbGVyID0ge2hhbmRsZXJGdW5jdGlvbiwgY29kZX07XG4gICAgY29uc3QgcmVnaXN0ZXJlZEhhbmRsZXJzOiBIYW5kbGVyW118dW5kZWZpbmVkID1cbiAgICAgICAgdGhpcy5ub2RlSGFuZGxlcnNNYXAuZ2V0KG5vZGVLaW5kKTtcbiAgICBpZiAocmVnaXN0ZXJlZEhhbmRsZXJzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMubm9kZUhhbmRsZXJzTWFwLnNldChub2RlS2luZCwgW25ld0hhbmRsZXJdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVnaXN0ZXJlZEhhbmRsZXJzLnB1c2gobmV3SGFuZGxlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGZhaWx1cmUgd2l0aCBhIHNwYW4uIGFkZEZhaWx1cmUoKSBpcyBjdXJyZW50bHkgcHJpdmF0ZSBiZWNhdXNlXG4gICAqIGBhZGRGYWlsdXJlQXROb2RlYCBpcyBwcmVmZXJyZWQuXG4gICAqL1xuICBwcml2YXRlIGFkZEZhaWx1cmUoXG4gICAgICBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZmFpbHVyZVRleHQ6IHN0cmluZywgZml4PzogRml4KSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRTb3VyY2VGaWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvdXJjZSBmaWxlIG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuICAgIGlmIChzdGFydCA+PSBlbmQgfHwgZW5kID4gdGhpcy5jdXJyZW50U291cmNlRmlsZS5lbmQgfHwgc3RhcnQgPCAwKSB7XG4gICAgICAvLyBTaW5jZSBvbmx5IGFkZEZhaWx1cmVBdE5vZGUoKSBpcyBleHBvc2VkIGZvciBub3cgdGhpcyBzaG91bGRuJ3QgaGFwcGVuLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBJbnZhbGlkIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb246IFske3N0YXJ0fSwgJHtlbmR9XWAgK1xuICAgICAgICAgIGAgaW4gZmlsZSAke3RoaXMuY3VycmVudFNvdXJjZUZpbGUuZmlsZU5hbWV9LmApO1xuICAgIH1cblxuICAgIGNvbnN0IGZhaWx1cmUgPSBuZXcgRmFpbHVyZShcbiAgICAgICAgdGhpcy5jdXJyZW50U291cmNlRmlsZSwgc3RhcnQsIGVuZCwgZmFpbHVyZVRleHQsIHRoaXMuY3VycmVudENvZGUsIGZpeCk7XG4gICAgdGhpcy5mYWlsdXJlcy5wdXNoKGZhaWx1cmUpO1xuICB9XG5cbiAgYWRkRmFpbHVyZUF0Tm9kZShub2RlOiB0cy5Ob2RlLCBmYWlsdXJlVGV4dDogc3RyaW5nLCBmaXg/OiBGaXgpIHtcbiAgICAvLyBub2RlLmdldFN0YXJ0KCkgdGFrZXMgYSBzb3VyY2VGaWxlIGFzIGFyZ3VtZW50IHdoZXJlYXMgbm9kZS5nZXRFbmQoKVxuICAgIC8vIGRvZXNuJ3QgbmVlZCBpdC5cbiAgICB0aGlzLmFkZEZhaWx1cmUoXG4gICAgICAgIG5vZGUuZ2V0U3RhcnQodGhpcy5jdXJyZW50U291cmNlRmlsZSksIG5vZGUuZ2V0RW5kKCksIGZhaWx1cmVUZXh0LCBmaXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhbGsgYHNvdXJjZUZpbGVgLCBpbnZva2luZyByZWdpc3RlcmVkIGhhbmRsZXJzIHdpdGggQ2hlY2tlciBhcyB0aGUgZmlyc3RcbiAgICogYXJndW1lbnQgYW5kIGN1cnJlbnQgbm9kZSBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50LiBSZXR1cm4gZmFpbHVyZXMgaWYgdGhlcmVcbiAgICogYXJlIGFueS5cbiAgICovXG4gIGV4ZWN1dGUoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IEZhaWx1cmVbXSB7XG4gICAgY29uc3QgdGhpc0NoZWNrZXIgPSB0aGlzO1xuICAgIHRoaXMuY3VycmVudFNvdXJjZUZpbGUgPSBzb3VyY2VGaWxlO1xuICAgIHRoaXMuZmFpbHVyZXMgPSBbXTtcbiAgICBydW4oc291cmNlRmlsZSk7XG4gICAgcmV0dXJuIHRoaXMuZmFpbHVyZXM7XG5cbiAgICBmdW5jdGlvbiBydW4obm9kZTogdHMuTm9kZSkge1xuICAgICAgY29uc3QgaGFuZGxlcnM6IEhhbmRsZXJbXXx1bmRlZmluZWQgPVxuICAgICAgICAgIHRoaXNDaGVja2VyLm5vZGVIYW5kbGVyc01hcC5nZXQobm9kZS5raW5kKTtcbiAgICAgIGlmIChoYW5kbGVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGZvciAoY29uc3QgaGFuZGxlciBvZiBoYW5kbGVycykge1xuICAgICAgICAgIHRoaXNDaGVja2VyLmN1cnJlbnRDb2RlID0gaGFuZGxlci5jb2RlO1xuICAgICAgICAgIGhhbmRsZXIuaGFuZGxlckZ1bmN0aW9uKHRoaXNDaGVja2VyLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIHJ1bik7XG4gICAgfVxuICB9XG59XG4iXX0=