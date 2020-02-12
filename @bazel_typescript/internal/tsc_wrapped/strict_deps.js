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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path = require("path");
    const ts = require("typescript");
    /** The TypeScript diagnostic code for "Cannot find module ...". */
    exports.TS_ERR_CANNOT_FIND_MODULE = 2307;
    /**
     * The strict_deps plugin checks the imports of the compiled modules.
     *
     * It implements strict deps, i.e. enforces that each file in
     * `config.compilationTargetSrc` only imports from files in
     * `config.allowedStrictDeps`.
     *
     * This is used to implement strict dependency checking -
     * source files in a build target may only import sources of their immediate
     * dependencies, but not sources of their transitive dependencies.
     *
     * strict_deps also makes sure that no imports ends in '.ts'. TypeScript
     * allows imports including the file extension, but our runtime loading support
     * fails with it.
     *
     * strict_deps currently does not check ambient/global definitions.
     */
    class Plugin {
        constructor(program, config) {
            this.program = program;
            this.config = config;
            this.name = 'strictDeps';
        }
        getDiagnostics(sourceFile) {
            return checkModuleDeps(sourceFile, this.program.getTypeChecker(), this.config.allowedStrictDeps, this.config.rootDir);
        }
    }
    exports.Plugin = Plugin;
    // Exported for testing
    function checkModuleDeps(sf, tc, allowedDeps, rootDir) {
        function stripExt(fn) {
            return fn.replace(/(\.d)?\.tsx?$/, '');
        }
        const allowedMap = {};
        for (const d of allowedDeps)
            allowedMap[stripExt(d)] = true;
        const result = [];
        for (const stmt of sf.statements) {
            if (stmt.kind !== ts.SyntaxKind.ImportDeclaration &&
                stmt.kind !== ts.SyntaxKind.ExportDeclaration) {
                continue;
            }
            const id = stmt;
            const modSpec = id.moduleSpecifier;
            if (!modSpec)
                continue; // E.g. a bare "export {x};"
            const sym = tc.getSymbolAtLocation(modSpec);
            if (!sym || !sym.declarations || sym.declarations.length < 1) {
                continue;
            }
            const declFileNames = sym.declarations.map(decl => decl.getSourceFile().fileName);
            if (declFileNames.find(declFileName => !!allowedMap[stripExt(declFileName)])) {
                continue;
            }
            const importNames = declFileNames.map(declFileName => path.posix.relative(rootDir, declFileName));
            const extraDeclarationLocationsMessage = (importNames.length < 2) ?
                '' :
                `(It is also declared in ${importNames.slice(1).join(', ')}) `;
            result.push({
                file: sf,
                start: modSpec.getStart(),
                length: modSpec.getEnd() - modSpec.getStart(),
                messageText: `transitive dependency on ${importNames[0]} not allowed. ` +
                    extraDeclarationLocationsMessage +
                    `Please add the BUILD target to your rule's deps.`,
                category: ts.DiagnosticCategory.Error,
                // semantics are close enough, needs taze.
                code: exports.TS_ERR_CANNOT_FIND_MODULE,
            });
        }
        return result;
    }
    exports.checkModuleDeps = checkModuleDeps;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaWN0X2RlcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9leHRlcm5hbC9idWlsZF9iYXplbF9ydWxlc190eXBlc2NyaXB0L2ludGVybmFsL3RzY193cmFwcGVkL3N0cmljdF9kZXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7Ozs7Ozs7Ozs7O0lBRUgsNkJBQTZCO0lBQzdCLGlDQUFpQztJQVdqQyxtRUFBbUU7SUFDdEQsUUFBQSx5QkFBeUIsR0FBRyxJQUFJLENBQUM7SUFFOUM7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDSCxNQUFhLE1BQU07UUFDakIsWUFDcUIsT0FBbUIsRUFDbkIsTUFBOEI7WUFEOUIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtZQUNuQixXQUFNLEdBQU4sTUFBTSxDQUF3QjtZQUUxQyxTQUFJLEdBQUcsWUFBWSxDQUFDO1FBRnlCLENBQUM7UUFJdkQsY0FBYyxDQUFDLFVBQXlCO1lBQ3RDLE9BQU8sZUFBZSxDQUNsQixVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFELENBQUM7S0FDRjtJQVpELHdCQVlDO0lBRUQsdUJBQXVCO0lBQ3ZCLFNBQWdCLGVBQWUsQ0FDM0IsRUFBaUIsRUFBRSxFQUFrQixFQUFFLFdBQXFCLEVBQzVELE9BQWU7UUFDakIsU0FBUyxRQUFRLENBQUMsRUFBVTtZQUMxQixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFDRCxNQUFNLFVBQVUsR0FBa0MsRUFBRSxDQUFDO1FBQ3JELEtBQUssTUFBTSxDQUFDLElBQUksV0FBVztZQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFNUQsTUFBTSxNQUFNLEdBQW9CLEVBQUUsQ0FBQztRQUNuQyxLQUFLLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUU7WUFDaEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCO2dCQUM3QyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ2pELFNBQVM7YUFDVjtZQUNELE1BQU0sRUFBRSxHQUFHLElBQW1ELENBQUM7WUFDL0QsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGVBQWUsQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTztnQkFBRSxTQUFTLENBQUUsNEJBQTRCO1lBRXJELE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzVELFNBQVM7YUFDVjtZQUNELE1BQU0sYUFBYSxHQUNmLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLElBQUksYUFBYSxDQUFDLElBQUksQ0FDZCxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDN0QsU0FBUzthQUNWO1lBQ0QsTUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FDakMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUVoRSxNQUFNLGdDQUFnQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxFQUFFLENBQUMsQ0FBQztnQkFDSiwyQkFBMkIsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNuRSxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNWLElBQUksRUFBRSxFQUFFO2dCQUNSLEtBQUssRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUN6QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQzdDLFdBQVcsRUFBRSw0QkFBNEIsV0FBVyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7b0JBQ25FLGdDQUFnQztvQkFDaEMsa0RBQWtEO2dCQUN0RCxRQUFRLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQUs7Z0JBQ3JDLDBDQUEwQztnQkFDMUMsSUFBSSxFQUFFLGlDQUF5QjthQUNoQyxDQUFDLENBQUM7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFoREQsMENBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgVGhlIEJhemVsIEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0ICogYXMgcGVyZlRyYWNlIGZyb20gJy4vcGVyZl90cmFjZSc7XG5pbXBvcnQgKiBhcyBwbHVnaW5BcGkgZnJvbSAnLi9wbHVnaW5fYXBpJztcblxuZXhwb3J0IGludGVyZmFjZSBTdHJpY3REZXBzUGx1Z2luQ29uZmlnIHtcbiAgY29tcGlsYXRpb25UYXJnZXRTcmM6IHN0cmluZ1tdO1xuICBhbGxvd2VkU3RyaWN0RGVwczogc3RyaW5nW107XG4gIHJvb3REaXI6IHN0cmluZztcbn1cblxuLyoqIFRoZSBUeXBlU2NyaXB0IGRpYWdub3N0aWMgY29kZSBmb3IgXCJDYW5ub3QgZmluZCBtb2R1bGUgLi4uXCIuICovXG5leHBvcnQgY29uc3QgVFNfRVJSX0NBTk5PVF9GSU5EX01PRFVMRSA9IDIzMDc7XG5cbi8qKlxuICogVGhlIHN0cmljdF9kZXBzIHBsdWdpbiBjaGVja3MgdGhlIGltcG9ydHMgb2YgdGhlIGNvbXBpbGVkIG1vZHVsZXMuXG4gKlxuICogSXQgaW1wbGVtZW50cyBzdHJpY3QgZGVwcywgaS5lLiBlbmZvcmNlcyB0aGF0IGVhY2ggZmlsZSBpblxuICogYGNvbmZpZy5jb21waWxhdGlvblRhcmdldFNyY2Agb25seSBpbXBvcnRzIGZyb20gZmlsZXMgaW5cbiAqIGBjb25maWcuYWxsb3dlZFN0cmljdERlcHNgLlxuICpcbiAqIFRoaXMgaXMgdXNlZCB0byBpbXBsZW1lbnQgc3RyaWN0IGRlcGVuZGVuY3kgY2hlY2tpbmcgLVxuICogc291cmNlIGZpbGVzIGluIGEgYnVpbGQgdGFyZ2V0IG1heSBvbmx5IGltcG9ydCBzb3VyY2VzIG9mIHRoZWlyIGltbWVkaWF0ZVxuICogZGVwZW5kZW5jaWVzLCBidXQgbm90IHNvdXJjZXMgb2YgdGhlaXIgdHJhbnNpdGl2ZSBkZXBlbmRlbmNpZXMuXG4gKlxuICogc3RyaWN0X2RlcHMgYWxzbyBtYWtlcyBzdXJlIHRoYXQgbm8gaW1wb3J0cyBlbmRzIGluICcudHMnLiBUeXBlU2NyaXB0XG4gKiBhbGxvd3MgaW1wb3J0cyBpbmNsdWRpbmcgdGhlIGZpbGUgZXh0ZW5zaW9uLCBidXQgb3VyIHJ1bnRpbWUgbG9hZGluZyBzdXBwb3J0XG4gKiBmYWlscyB3aXRoIGl0LlxuICpcbiAqIHN0cmljdF9kZXBzIGN1cnJlbnRseSBkb2VzIG5vdCBjaGVjayBhbWJpZW50L2dsb2JhbCBkZWZpbml0aW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsdWdpbiBpbXBsZW1lbnRzIHBsdWdpbkFwaS5EaWFnbm9zdGljUGx1Z2luIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IHByb2dyYW06IHRzLlByb2dyYW0sXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZzogU3RyaWN0RGVwc1BsdWdpbkNvbmZpZykge31cblxuICByZWFkb25seSBuYW1lID0gJ3N0cmljdERlcHMnO1xuXG4gIGdldERpYWdub3N0aWNzKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpIHtcbiAgICByZXR1cm4gY2hlY2tNb2R1bGVEZXBzKFxuICAgICAgICBzb3VyY2VGaWxlLCB0aGlzLnByb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKSxcbiAgICAgICAgdGhpcy5jb25maWcuYWxsb3dlZFN0cmljdERlcHMsIHRoaXMuY29uZmlnLnJvb3REaXIpO1xuICB9XG59XG5cbi8vIEV4cG9ydGVkIGZvciB0ZXN0aW5nXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tNb2R1bGVEZXBzKFxuICAgIHNmOiB0cy5Tb3VyY2VGaWxlLCB0YzogdHMuVHlwZUNoZWNrZXIsIGFsbG93ZWREZXBzOiBzdHJpbmdbXSxcbiAgICByb290RGlyOiBzdHJpbmcpOiB0cy5EaWFnbm9zdGljW10ge1xuICBmdW5jdGlvbiBzdHJpcEV4dChmbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGZuLnJlcGxhY2UoLyhcXC5kKT9cXC50c3g/JC8sICcnKTtcbiAgfVxuICBjb25zdCBhbGxvd2VkTWFwOiB7W2ZpbGVOYW1lOiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuICBmb3IgKGNvbnN0IGQgb2YgYWxsb3dlZERlcHMpIGFsbG93ZWRNYXBbc3RyaXBFeHQoZCldID0gdHJ1ZTtcblxuICBjb25zdCByZXN1bHQ6IHRzLkRpYWdub3N0aWNbXSA9IFtdO1xuICBmb3IgKGNvbnN0IHN0bXQgb2Ygc2Yuc3RhdGVtZW50cykge1xuICAgIGlmIChzdG10LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb24gJiZcbiAgICAgICAgc3RtdC5raW5kICE9PSB0cy5TeW50YXhLaW5kLkV4cG9ydERlY2xhcmF0aW9uKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBzdG10IGFzIHRzLkltcG9ydERlY2xhcmF0aW9uIHwgdHMuRXhwb3J0RGVjbGFyYXRpb247XG4gICAgY29uc3QgbW9kU3BlYyA9IGlkLm1vZHVsZVNwZWNpZmllcjtcbiAgICBpZiAoIW1vZFNwZWMpIGNvbnRpbnVlOyAgLy8gRS5nLiBhIGJhcmUgXCJleHBvcnQge3h9O1wiXG5cbiAgICBjb25zdCBzeW0gPSB0Yy5nZXRTeW1ib2xBdExvY2F0aW9uKG1vZFNwZWMpO1xuICAgIGlmICghc3ltIHx8ICFzeW0uZGVjbGFyYXRpb25zIHx8IHN5bS5kZWNsYXJhdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGRlY2xGaWxlTmFtZXMgPVxuICAgICAgICBzeW0uZGVjbGFyYXRpb25zLm1hcChkZWNsID0+IGRlY2wuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKTtcbiAgICBpZiAoZGVjbEZpbGVOYW1lcy5maW5kKFxuICAgICAgICAgICAgZGVjbEZpbGVOYW1lID0+ICEhYWxsb3dlZE1hcFtzdHJpcEV4dChkZWNsRmlsZU5hbWUpXSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCBpbXBvcnROYW1lcyA9IGRlY2xGaWxlTmFtZXMubWFwKFxuICAgICAgICBkZWNsRmlsZU5hbWUgPT4gcGF0aC5wb3NpeC5yZWxhdGl2ZShyb290RGlyLCBkZWNsRmlsZU5hbWUpKTtcblxuICAgIGNvbnN0IGV4dHJhRGVjbGFyYXRpb25Mb2NhdGlvbnNNZXNzYWdlID0gKGltcG9ydE5hbWVzLmxlbmd0aCA8IDIpID9cbiAgICAgICAgJycgOlxuICAgICAgICBgKEl0IGlzIGFsc28gZGVjbGFyZWQgaW4gJHtpbXBvcnROYW1lcy5zbGljZSgxKS5qb2luKCcsICcpfSkgYDtcbiAgICByZXN1bHQucHVzaCh7XG4gICAgICBmaWxlOiBzZixcbiAgICAgIHN0YXJ0OiBtb2RTcGVjLmdldFN0YXJ0KCksXG4gICAgICBsZW5ndGg6IG1vZFNwZWMuZ2V0RW5kKCkgLSBtb2RTcGVjLmdldFN0YXJ0KCksXG4gICAgICBtZXNzYWdlVGV4dDogYHRyYW5zaXRpdmUgZGVwZW5kZW5jeSBvbiAke2ltcG9ydE5hbWVzWzBdfSBub3QgYWxsb3dlZC4gYCArXG4gICAgICAgICAgZXh0cmFEZWNsYXJhdGlvbkxvY2F0aW9uc01lc3NhZ2UgK1xuICAgICAgICAgIGBQbGVhc2UgYWRkIHRoZSBCVUlMRCB0YXJnZXQgdG8geW91ciBydWxlJ3MgZGVwcy5gLFxuICAgICAgY2F0ZWdvcnk6IHRzLkRpYWdub3N0aWNDYXRlZ29yeS5FcnJvcixcbiAgICAgIC8vIHNlbWFudGljcyBhcmUgY2xvc2UgZW5vdWdoLCBuZWVkcyB0YXplLlxuICAgICAgY29kZTogVFNfRVJSX0NBTk5PVF9GSU5EX01PRFVMRSxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19