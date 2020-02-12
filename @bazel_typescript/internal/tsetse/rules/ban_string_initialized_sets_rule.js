/**
 * @fileoverview Bans `new Set(<string>)` since it is a potential source of bugs
 * due to strings also implementing `Iterable<string>`.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "typescript", "../error_code", "../rule"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const error_code_1 = require("../error_code");
    const rule_1 = require("../rule");
    const errorMsg = 'Value passed to Set constructor is a string. This will' +
        ' create a Set of the characters of the string, rather than a Set' +
        ' containing the string. To make a Set of the string, pass an array' +
        ' containing the string. To make a Set of the characters, use \'as\' to ' +
        ' create an Iterable<string>, eg: new Set(myStr as Iterable<string>).';
    class Rule extends rule_1.AbstractRule {
        constructor() {
            super(...arguments);
            this.ruleName = 'ban-string-initialized-sets';
            this.code = error_code_1.ErrorCode.BAN_STRING_INITIALIZED_SETS;
        }
        register(checker) {
            checker.on(ts.SyntaxKind.NewExpression, checkNewExpression, this.code);
        }
    }
    exports.Rule = Rule;
    function checkNewExpression(checker, node) {
        const typeChecker = checker.typeChecker;
        // Check that it's a Set which is being constructed
        const ctorTypeSymbol = typeChecker.getTypeAtLocation(node.expression).getSymbol();
        if (!ctorTypeSymbol || ctorTypeSymbol.getEscapedName() !== 'SetConstructor') {
            return;
        }
        const isES2015SetCtor = ctorTypeSymbol.declarations.some((decl) => {
            return sourceFileIsStdLib(decl.getSourceFile());
        });
        if (!isES2015SetCtor)
            return;
        // If there's no arguments provided, then it's not a string so bail out.
        if (!node.arguments || node.arguments.length !== 1)
            return;
        // Check the type of the first argument, expanding union & intersection types
        const arg = node.arguments[0];
        const argType = typeChecker.getTypeAtLocation(arg);
        const allTypes = argType.isUnionOrIntersection() ? argType.types : [argType];
        // Checks if the type (or any of the union/intersection types) are either
        // strings or string literals.
        const typeContainsString = allTypes.some((tsType) => {
            return (tsType.getFlags() & ts.TypeFlags.StringLike) !== 0;
        });
        if (!typeContainsString)
            return;
        checker.addFailureAtNode(arg, errorMsg);
    }
    function sourceFileIsStdLib(sourceFile) {
        return /lib\.es2015\.(collection|iterable)\.d\.ts$/.test(sourceFile.fileName);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFuX3N0cmluZ19pbml0aWFsaXplZF9zZXRzX3J1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9leHRlcm5hbC9idWlsZF9iYXplbF9ydWxlc190eXBlc2NyaXB0L2ludGVybmFsL3RzZXRzZS9ydWxlcy9iYW5fc3RyaW5nX2luaXRpYWxpemVkX3NldHNfcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7Ozs7Ozs7Ozs7OztJQUVILGlDQUFpQztJQUdqQyw4Q0FBd0M7SUFDeEMsa0NBQXFDO0lBRXJDLE1BQU0sUUFBUSxHQUFHLHdEQUF3RDtRQUNyRSxrRUFBa0U7UUFDbEUsb0VBQW9FO1FBQ3BFLHlFQUF5RTtRQUN6RSxzRUFBc0UsQ0FBQztJQUUzRSxNQUFhLElBQUssU0FBUSxtQkFBWTtRQUF0Qzs7WUFDVyxhQUFRLEdBQUcsNkJBQTZCLENBQUM7WUFDekMsU0FBSSxHQUFHLHNCQUFTLENBQUMsMkJBQTJCLENBQUM7UUFLeEQsQ0FBQztRQUhDLFFBQVEsQ0FBQyxPQUFnQjtZQUN2QixPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RSxDQUFDO0tBQ0Y7SUFQRCxvQkFPQztJQUVELFNBQVMsa0JBQWtCLENBQUMsT0FBZ0IsRUFBRSxJQUFzQjtRQUNsRSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBRXhDLG1EQUFtRDtRQUNuRCxNQUFNLGNBQWMsR0FDaEIsV0FBVyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUUvRCxJQUFJLENBQUMsY0FBYyxJQUFJLGNBQWMsQ0FBQyxjQUFjLEVBQUUsS0FBSyxnQkFBZ0IsRUFBRTtZQUMzRSxPQUFPO1NBQ1I7UUFDRCxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2hFLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZTtZQUFFLE9BQU87UUFFN0Isd0VBQXdFO1FBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUM7WUFBRSxPQUFPO1FBRTNELDZFQUE2RTtRQUM3RSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3RSx5RUFBeUU7UUFDekUsOEJBQThCO1FBQzlCLE1BQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2xELE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0JBQWtCO1lBQUUsT0FBTztRQUVoQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxTQUFTLGtCQUFrQixDQUFDLFVBQXlCO1FBQ25ELE9BQU8sNENBQTRDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEJhbnMgYG5ldyBTZXQoPHN0cmluZz4pYCBzaW5jZSBpdCBpcyBhIHBvdGVudGlhbCBzb3VyY2Ugb2YgYnVnc1xuICogZHVlIHRvIHN0cmluZ3MgYWxzbyBpbXBsZW1lbnRpbmcgYEl0ZXJhYmxlPHN0cmluZz5gLlxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge0NoZWNrZXJ9IGZyb20gJy4uL2NoZWNrZXInO1xuaW1wb3J0IHtFcnJvckNvZGV9IGZyb20gJy4uL2Vycm9yX2NvZGUnO1xuaW1wb3J0IHtBYnN0cmFjdFJ1bGV9IGZyb20gJy4uL3J1bGUnO1xuXG5jb25zdCBlcnJvck1zZyA9ICdWYWx1ZSBwYXNzZWQgdG8gU2V0IGNvbnN0cnVjdG9yIGlzIGEgc3RyaW5nLiBUaGlzIHdpbGwnICtcbiAgICAnIGNyZWF0ZSBhIFNldCBvZiB0aGUgY2hhcmFjdGVycyBvZiB0aGUgc3RyaW5nLCByYXRoZXIgdGhhbiBhIFNldCcgK1xuICAgICcgY29udGFpbmluZyB0aGUgc3RyaW5nLiBUbyBtYWtlIGEgU2V0IG9mIHRoZSBzdHJpbmcsIHBhc3MgYW4gYXJyYXknICtcbiAgICAnIGNvbnRhaW5pbmcgdGhlIHN0cmluZy4gVG8gbWFrZSBhIFNldCBvZiB0aGUgY2hhcmFjdGVycywgdXNlIFxcJ2FzXFwnIHRvICcgK1xuICAgICcgY3JlYXRlIGFuIEl0ZXJhYmxlPHN0cmluZz4sIGVnOiBuZXcgU2V0KG15U3RyIGFzIEl0ZXJhYmxlPHN0cmluZz4pLic7XG5cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgQWJzdHJhY3RSdWxlIHtcbiAgcmVhZG9ubHkgcnVsZU5hbWUgPSAnYmFuLXN0cmluZy1pbml0aWFsaXplZC1zZXRzJztcbiAgcmVhZG9ubHkgY29kZSA9IEVycm9yQ29kZS5CQU5fU1RSSU5HX0lOSVRJQUxJWkVEX1NFVFM7XG5cbiAgcmVnaXN0ZXIoY2hlY2tlcjogQ2hlY2tlcikge1xuICAgIGNoZWNrZXIub24odHMuU3ludGF4S2luZC5OZXdFeHByZXNzaW9uLCBjaGVja05ld0V4cHJlc3Npb24sIHRoaXMuY29kZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tOZXdFeHByZXNzaW9uKGNoZWNrZXI6IENoZWNrZXIsIG5vZGU6IHRzLk5ld0V4cHJlc3Npb24pIHtcbiAgY29uc3QgdHlwZUNoZWNrZXIgPSBjaGVja2VyLnR5cGVDaGVja2VyO1xuXG4gIC8vIENoZWNrIHRoYXQgaXQncyBhIFNldCB3aGljaCBpcyBiZWluZyBjb25zdHJ1Y3RlZFxuICBjb25zdCBjdG9yVHlwZVN5bWJvbCA9XG4gICAgICB0eXBlQ2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihub2RlLmV4cHJlc3Npb24pLmdldFN5bWJvbCgpO1xuXG4gIGlmICghY3RvclR5cGVTeW1ib2wgfHwgY3RvclR5cGVTeW1ib2wuZ2V0RXNjYXBlZE5hbWUoKSAhPT0gJ1NldENvbnN0cnVjdG9yJykge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBpc0VTMjAxNVNldEN0b3IgPSBjdG9yVHlwZVN5bWJvbC5kZWNsYXJhdGlvbnMuc29tZSgoZGVjbCkgPT4ge1xuICAgIHJldHVybiBzb3VyY2VGaWxlSXNTdGRMaWIoZGVjbC5nZXRTb3VyY2VGaWxlKCkpO1xuICB9KTtcbiAgaWYgKCFpc0VTMjAxNVNldEN0b3IpIHJldHVybjtcblxuICAvLyBJZiB0aGVyZSdzIG5vIGFyZ3VtZW50cyBwcm92aWRlZCwgdGhlbiBpdCdzIG5vdCBhIHN0cmluZyBzbyBiYWlsIG91dC5cbiAgaWYgKCFub2RlLmFyZ3VtZW50cyB8fCBub2RlLmFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHJldHVybjtcblxuICAvLyBDaGVjayB0aGUgdHlwZSBvZiB0aGUgZmlyc3QgYXJndW1lbnQsIGV4cGFuZGluZyB1bmlvbiAmIGludGVyc2VjdGlvbiB0eXBlc1xuICBjb25zdCBhcmcgPSBub2RlLmFyZ3VtZW50c1swXTtcbiAgY29uc3QgYXJnVHlwZSA9IHR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKGFyZyk7XG4gIGNvbnN0IGFsbFR5cGVzID0gYXJnVHlwZS5pc1VuaW9uT3JJbnRlcnNlY3Rpb24oKSA/IGFyZ1R5cGUudHlwZXMgOiBbYXJnVHlwZV07XG5cbiAgLy8gQ2hlY2tzIGlmIHRoZSB0eXBlIChvciBhbnkgb2YgdGhlIHVuaW9uL2ludGVyc2VjdGlvbiB0eXBlcykgYXJlIGVpdGhlclxuICAvLyBzdHJpbmdzIG9yIHN0cmluZyBsaXRlcmFscy5cbiAgY29uc3QgdHlwZUNvbnRhaW5zU3RyaW5nID0gYWxsVHlwZXMuc29tZSgodHNUeXBlKSA9PiB7XG4gICAgcmV0dXJuICh0c1R5cGUuZ2V0RmxhZ3MoKSAmIHRzLlR5cGVGbGFncy5TdHJpbmdMaWtlKSAhPT0gMDtcbiAgfSk7XG5cbiAgaWYgKCF0eXBlQ29udGFpbnNTdHJpbmcpIHJldHVybjtcblxuICBjaGVja2VyLmFkZEZhaWx1cmVBdE5vZGUoYXJnLCBlcnJvck1zZyk7XG59XG5cbmZ1bmN0aW9uIHNvdXJjZUZpbGVJc1N0ZExpYihzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKSB7XG4gIHJldHVybiAvbGliXFwuZXMyMDE1XFwuKGNvbGxlY3Rpb258aXRlcmFibGUpXFwuZFxcLnRzJC8udGVzdChzb3VyY2VGaWxlLmZpbGVOYW1lKTtcbn1cbiJdfQ==