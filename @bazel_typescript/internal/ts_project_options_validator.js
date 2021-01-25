"use strict";
exports.__esModule = true;
var path_1 = require("path");
var ts = require("typescript");
var diagnosticsHost = {
    getCurrentDirectory: function () { return ts.sys.getCurrentDirectory(); },
    getNewLine: function () { return ts.sys.newLine; },
    // Print filenames including their relativeRoot, so they can be located on
    // disk
    getCanonicalFileName: function (f) { return f; }
};
function main(_a) {
    var tsconfigPath = _a[0], output = _a[1], target = _a[2], attrsStr = _a[3];
    // The Bazel ts_project attributes were json-encoded
    // (on Windows the quotes seem to be quoted wrong, so replace backslash with quotes :shrug:)
    var attrs = JSON.parse(attrsStr.replace(/\\/g, '"'));
    // Parse your typescript settings from the tsconfig
    // This will understand the "extends" semantics.
    var _b = ts.readConfigFile(tsconfigPath, ts.sys.readFile), config = _b.config, error = _b.error;
    if (error)
        throw new Error(tsconfigPath + ':' + ts.formatDiagnostic(error, diagnosticsHost));
    var _c = ts.parseJsonConfigFileContent(config, ts.sys, require('path').dirname(tsconfigPath)), errors = _c.errors, options = _c.options;
    // We don't pass the srcs to this action, so it can't know if the program has the right sources.
    // Diagnostics look like
    // error TS18002: The 'files' list in config file 'tsconfig.json' is empty.
    // error TS18003: No inputs were found in config file 'tsconfig.json'. Specified 'include'...
    var fatalErrors = errors.filter(function (e) { return e.code !== 18002 && e.code != 18003; });
    if (fatalErrors.length > 0)
        throw new Error(tsconfigPath + ':' + ts.formatDiagnostics(fatalErrors, diagnosticsHost));
    var failures = [];
    var buildozerCmds = [];
    function getTsOption(option) {
        if (typeof (options[option]) === 'string') {
            // Currently the only string-typed options are filepaths.
            // TypeScript will resolve these to a project path
            // so when echoing that back to the user, we need to reverse that resolution.
            // First turn //path/to/pkg:tsconfig into path/to/pkg
            var packageDir = target.substr(2, target.indexOf(':') - 2);
            return path_1.relative(packageDir, options[option]);
        }
        return options[option];
    }
    function check(option, attr) {
        attr = attr || option;
        // treat compilerOptions undefined as false
        var optionVal = getTsOption(option);
        var match = optionVal === attrs[attr] ||
            (optionVal === undefined && (attrs[attr] === false || attrs[attr] === ''));
        if (!match) {
            failures.push("attribute " + attr + "=" + attrs[attr] + " does not match compilerOptions." + option + "=" + optionVal);
            if (typeof (optionVal) === 'boolean') {
                buildozerCmds.push("set " + attr + " " + (optionVal ? 'True' : 'False'));
            }
            else if (typeof (optionVal) === 'string') {
                buildozerCmds.push("set " + attr + " \"" + optionVal + "\"");
            }
            else if (optionVal === undefined) {
                // nothing to sync
            }
            else {
                throw new Error("cannot check option " + option + " of type " + typeof (option));
            }
        }
    }
    check('allowJs', 'allow_js');
    check('declarationMap', 'declaration_map');
    check('emitDeclarationOnly', 'emit_declaration_only');
    check('sourceMap', 'source_map');
    check('composite');
    check('declaration');
    check('incremental');
    check('tsBuildInfoFile', 'ts_build_info_file');
    if (failures.length > 0) {
        console.error("ERROR: ts_project rule " + target + " was configured with attributes that don't match the tsconfig");
        failures.forEach(function (f) { return console.error(' - ' + f); });
        console.error('You can automatically fix this by running:');
        console.error("    npx @bazel/buildozer " + buildozerCmds.map(function (c) { return "'" + c + "'"; }).join(' ') + " " + target);
        console.error('Or to suppress this error, run:');
        console.error("    npx @bazel/buildozer 'set validate False' " + target);
        return 1;
    }
    // We have to write an output so that Bazel needs to execute this action.
    // Make the output change whenever the attributes changed.
    require('fs').writeFileSync(output, "\n// " + process.argv[1] + " checked attributes for " + target + "\n// allow_js:              " + attrs.allow_js + "\n// composite:             " + attrs.composite + "\n// declaration:           " + attrs.declaration + "\n// declaration_map:       " + attrs.declaration_map + "\n// incremental:           " + attrs.incremental + "\n// source_map:            " + attrs.source_map + "\n// emit_declaration_only: " + attrs.emit_declaration_only + "\n// ts_build_info_file:    " + attrs.ts_build_info_file + "\n", 'utf-8');
    return 0;
}
if (require.main === module) {
    try {
        process.exitCode = main(process.argv.slice(2));
    }
    catch (e) {
        console.error(process.argv[1], e);
    }
}
