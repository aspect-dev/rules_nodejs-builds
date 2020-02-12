/**
 * @fileoverview Bans 'export' of mutable variables.
 * It is illegal to mutate them, so you might as well use 'const'.
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
    class Rule extends rule_1.AbstractRule {
        constructor() {
            super(...arguments);
            this.ruleName = 'ban-mutable-exports';
            this.code = error_code_1.ErrorCode.BAN_MUTABLE_EXPORTS;
        }
        register(checker) {
            // Strategy: take all the exports of the file, then look at whether
            // they're const or not.  This is simpler than the alternative of
            // trying to match all the various kinds of 'export' syntax, such
            // as 'export var ...', 'export {...}', 'export default ...'.
            checker.on(ts.SyntaxKind.SourceFile, checkFile, this.code);
        }
    }
    exports.Rule = Rule;
    function checkFile(checker, file) {
        // Allow in d.ts files, which are modelling external JS that doesn't
        // follow our rules.
        if (file.fileName.endsWith('.d.ts')) {
            return;
        }
        const sym = checker.typeChecker.getSymbolAtLocation(file);
        if (!sym)
            return;
        const exports = checker.typeChecker.getExportsOfModule(sym);
        for (const exp of exports) {
            // In the case of
            //   let x = 3; export {x};
            // The exported symbol is the latter x, but we must dealias to
            // the former to judge whether it's const or not.
            let sym = exp;
            if (sym.flags & ts.SymbolFlags.Alias) {
                sym = checker.typeChecker.getAliasedSymbol(exp);
            }
            const decl = sym.valueDeclaration;
            if (!decl)
                continue; // Skip e.g. type declarations.
            if (decl.getSourceFile() !== file) {
                // Reexports are best warned about in the original file
                continue;
            }
            if (!ts.isVariableDeclaration(decl) && !ts.isBindingElement(decl)) {
                // Skip e.g. class declarations.
                continue;
            }
            const isConst = (ts.getCombinedNodeFlags(decl) & ts.NodeFlags.Const) !== 0;
            if (!isConst) {
                // Note: show the failure at the exported symbol's declaration site,
                // not the dealiased 'sym', so that the error message shows at the
                // 'export' statement and not the variable declaration.
                checker.addFailureAtNode(exp.declarations[0], `Exports must be const.`);
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFuX211dGFibGVfZXhwb3J0c19ydWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vZXh0ZXJuYWwvYnVpbGRfYmF6ZWxfcnVsZXNfdHlwZXNjcmlwdC9pbnRlcm5hbC90c2V0c2UvcnVsZXMvYmFuX211dGFibGVfZXhwb3J0c19ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRzs7Ozs7Ozs7Ozs7O0lBRUgsaUNBQWlDO0lBR2pDLDhDQUF3QztJQUN4QyxrQ0FBcUM7SUFFckMsTUFBYSxJQUFLLFNBQVEsbUJBQVk7UUFBdEM7O1lBQ1csYUFBUSxHQUFHLHFCQUFxQixDQUFDO1lBQ2pDLFNBQUksR0FBRyxzQkFBUyxDQUFDLG1CQUFtQixDQUFDO1FBU2hELENBQUM7UUFQQyxRQUFRLENBQUMsT0FBZ0I7WUFDdkIsbUVBQW1FO1lBQ25FLGlFQUFpRTtZQUNqRSxpRUFBaUU7WUFDakUsNkRBQTZEO1lBQzdELE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RCxDQUFDO0tBQ0Y7SUFYRCxvQkFXQztJQUVELFNBQVMsU0FBUyxDQUFDLE9BQWdCLEVBQUUsSUFBbUI7UUFDdEQsb0VBQW9FO1FBQ3BFLG9CQUFvQjtRQUNwQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ25DLE9BQU87U0FDUjtRQUNELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLEdBQUc7WUFBRSxPQUFPO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUQsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUU7WUFDekIsaUJBQWlCO1lBQ2pCLDJCQUEyQjtZQUMzQiw4REFBOEQ7WUFDOUQsaURBQWlEO1lBQ2pELElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNkLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRTtnQkFDcEMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakQ7WUFDRCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7WUFDbEMsSUFBSSxDQUFDLElBQUk7Z0JBQUUsU0FBUyxDQUFFLCtCQUErQjtZQUVyRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ2pDLHVEQUF1RDtnQkFDdkQsU0FBUzthQUNWO1lBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDakUsZ0NBQWdDO2dCQUNoQyxTQUFTO2FBQ1Y7WUFFRCxNQUFNLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLG9FQUFvRTtnQkFDcEUsa0VBQWtFO2dCQUNsRSx1REFBdUQ7Z0JBQ3ZELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FDcEIsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFDbkIsd0JBQXdCLENBQUMsQ0FBQzthQUMvQjtTQUNGO0lBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVvdmVydmlldyBCYW5zICdleHBvcnQnIG9mIG11dGFibGUgdmFyaWFibGVzLlxuICogSXQgaXMgaWxsZWdhbCB0byBtdXRhdGUgdGhlbSwgc28geW91IG1pZ2h0IGFzIHdlbGwgdXNlICdjb25zdCcuXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Q2hlY2tlcn0gZnJvbSAnLi4vY2hlY2tlcic7XG5pbXBvcnQge0Vycm9yQ29kZX0gZnJvbSAnLi4vZXJyb3JfY29kZSc7XG5pbXBvcnQge0Fic3RyYWN0UnVsZX0gZnJvbSAnLi4vcnVsZSc7XG5cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgQWJzdHJhY3RSdWxlIHtcbiAgcmVhZG9ubHkgcnVsZU5hbWUgPSAnYmFuLW11dGFibGUtZXhwb3J0cyc7XG4gIHJlYWRvbmx5IGNvZGUgPSBFcnJvckNvZGUuQkFOX01VVEFCTEVfRVhQT1JUUztcblxuICByZWdpc3RlcihjaGVja2VyOiBDaGVja2VyKSB7XG4gICAgLy8gU3RyYXRlZ3k6IHRha2UgYWxsIHRoZSBleHBvcnRzIG9mIHRoZSBmaWxlLCB0aGVuIGxvb2sgYXQgd2hldGhlclxuICAgIC8vIHRoZXkncmUgY29uc3Qgb3Igbm90LiAgVGhpcyBpcyBzaW1wbGVyIHRoYW4gdGhlIGFsdGVybmF0aXZlIG9mXG4gICAgLy8gdHJ5aW5nIHRvIG1hdGNoIGFsbCB0aGUgdmFyaW91cyBraW5kcyBvZiAnZXhwb3J0JyBzeW50YXgsIHN1Y2hcbiAgICAvLyBhcyAnZXhwb3J0IHZhciAuLi4nLCAnZXhwb3J0IHsuLi59JywgJ2V4cG9ydCBkZWZhdWx0IC4uLicuXG4gICAgY2hlY2tlci5vbih0cy5TeW50YXhLaW5kLlNvdXJjZUZpbGUsIGNoZWNrRmlsZSwgdGhpcy5jb2RlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0ZpbGUoY2hlY2tlcjogQ2hlY2tlciwgZmlsZTogdHMuU291cmNlRmlsZSkge1xuICAvLyBBbGxvdyBpbiBkLnRzIGZpbGVzLCB3aGljaCBhcmUgbW9kZWxsaW5nIGV4dGVybmFsIEpTIHRoYXQgZG9lc24ndFxuICAvLyBmb2xsb3cgb3VyIHJ1bGVzLlxuICBpZiAoZmlsZS5maWxlTmFtZS5lbmRzV2l0aCgnLmQudHMnKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBzeW0gPSBjaGVja2VyLnR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24oZmlsZSk7XG4gIGlmICghc3ltKSByZXR1cm47XG4gIGNvbnN0IGV4cG9ydHMgPSBjaGVja2VyLnR5cGVDaGVja2VyLmdldEV4cG9ydHNPZk1vZHVsZShzeW0pO1xuICBmb3IgKGNvbnN0IGV4cCBvZiBleHBvcnRzKSB7XG4gICAgLy8gSW4gdGhlIGNhc2Ugb2ZcbiAgICAvLyAgIGxldCB4ID0gMzsgZXhwb3J0IHt4fTtcbiAgICAvLyBUaGUgZXhwb3J0ZWQgc3ltYm9sIGlzIHRoZSBsYXR0ZXIgeCwgYnV0IHdlIG11c3QgZGVhbGlhcyB0b1xuICAgIC8vIHRoZSBmb3JtZXIgdG8ganVkZ2Ugd2hldGhlciBpdCdzIGNvbnN0IG9yIG5vdC5cbiAgICBsZXQgc3ltID0gZXhwO1xuICAgIGlmIChzeW0uZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykge1xuICAgICAgc3ltID0gY2hlY2tlci50eXBlQ2hlY2tlci5nZXRBbGlhc2VkU3ltYm9sKGV4cCk7XG4gICAgfVxuICAgIGNvbnN0IGRlY2wgPSBzeW0udmFsdWVEZWNsYXJhdGlvbjtcbiAgICBpZiAoIWRlY2wpIGNvbnRpbnVlOyAgLy8gU2tpcCBlLmcuIHR5cGUgZGVjbGFyYXRpb25zLlxuXG4gICAgaWYgKGRlY2wuZ2V0U291cmNlRmlsZSgpICE9PSBmaWxlKSB7XG4gICAgICAvLyBSZWV4cG9ydHMgYXJlIGJlc3Qgd2FybmVkIGFib3V0IGluIHRoZSBvcmlnaW5hbCBmaWxlXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoIXRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsKSAmJiAhdHMuaXNCaW5kaW5nRWxlbWVudChkZWNsKSkge1xuICAgICAgLy8gU2tpcCBlLmcuIGNsYXNzIGRlY2xhcmF0aW9ucy5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGlzQ29uc3QgPSAodHMuZ2V0Q29tYmluZWROb2RlRmxhZ3MoZGVjbCkgJiB0cy5Ob2RlRmxhZ3MuQ29uc3QpICE9PSAwO1xuICAgIGlmICghaXNDb25zdCkge1xuICAgICAgLy8gTm90ZTogc2hvdyB0aGUgZmFpbHVyZSBhdCB0aGUgZXhwb3J0ZWQgc3ltYm9sJ3MgZGVjbGFyYXRpb24gc2l0ZSxcbiAgICAgIC8vIG5vdCB0aGUgZGVhbGlhc2VkICdzeW0nLCBzbyB0aGF0IHRoZSBlcnJvciBtZXNzYWdlIHNob3dzIGF0IHRoZVxuICAgICAgLy8gJ2V4cG9ydCcgc3RhdGVtZW50IGFuZCBub3QgdGhlIHZhcmlhYmxlIGRlY2xhcmF0aW9uLlxuICAgICAgY2hlY2tlci5hZGRGYWlsdXJlQXROb2RlKFxuICAgICAgICAgIGV4cC5kZWNsYXJhdGlvbnNbMF0sXG4gICAgICAgICAgYEV4cG9ydHMgbXVzdCBiZSBjb25zdC5gKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==