# Karma rules for Bazel

The Karma rules run karma tests with Bazel.


## Installation

Add the `@bazel/karma` npm package to your `devDependencies` in `package.json`.

Your `WORKSPACE` should declare a `yarn_install` or `npm_install` rule named `npm`.
It should then install the rules found in the npm packages using the `install_bazel_dependencies' function.
See https://github.com/bazelbuild/rules_nodejs/#quickstart

This causes the `@bazel/karma` package to be installed as a Bazel workspace named `npm_bazel_karma`.

Now add this to your `WORKSPACE` to install the Karma dependencies:

```python
# Fetch transitive Bazel dependencies of npm_bazel_karma
load("@npm_bazel_karma//:package.bzl", "npm_bazel_karma_dependencies")
npm_bazel_karma_dependencies()
```

This installs the `io_bazel_rules_webtesting` repository, if you haven't installed it earlier.

Finally, configure the rules_webtesting:

```python
# Set up web testing, choose browsers we can test on
load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

load("@io_bazel_rules_webtesting//web/versioned:browsers-0.3.2.bzl", "browser_repositories")

browser_repositories(
    chromium = True,
    firefox = True,
)
```


## Installing with self-managed dependencies

If you didn't use the `yarn_install` or `npm_install` rule to create an `npm` workspace, you'll have to declare a rule in your root `BUILD.bazel` file to execute karma:

```python
# Create a karma rule to use in ts_web_test_suite karma
# attribute when using self-managed dependencies
nodejs_binary(
    name = "karma/karma",
    entry_point = "//:node_modules/karma/bin/karma",
    # Point bazel to your node_modules to find the entry point
    node_modules = ["//:node_modules"],
)
```

[name]: https://bazel.build/docs/build-ref.html#name
[label]: https://bazel.build/docs/build-ref.html#labels
[labels]: https://bazel.build/docs/build-ref.html#labels


## karma_web_test

Runs unit tests in a browser with Karma.

When executed under `bazel test`, this uses a headless browser for speed.
This is also because `bazel test` allows multiple targets to be tested together,
and we don't want to open a Chrome window on your machine for each one. Also,
under `bazel test` the test will execute and immediately terminate.

Running under `ibazel test` gives you a "watch mode" for your tests. The rule is
optimized for this case - the test runner server will stay running and just
re-serve the up-to-date JavaScript source bundle.

To debug a single test target, run it with `bazel run` instead. This will open a
browser window on your computer. Also you can use any other browser by opening
the URL printed when the test starts up. The test will remain running until you
cancel the `bazel run` command.

This rule will use your system Chrome by default. In the default case, your
environment must specify CHROME_BIN so that the rule will know which Chrome binary to run.
Other `browsers` and `customLaunchers` may be set using the a base Karma configuration
specified in the `config_file` attribute.



### Usage

```
karma_web_test(srcs, deps, data, configuration_env_vars, bootstrap, runtime_deps, static_files, config_file, tags, peer_deps, kwargs)
```



#### `srcs`
      
A list of JavaScript test files

Defaults to `[]`



#### `deps`
      
Other targets which produce JavaScript such as `ts_library`

Defaults to `[]`



#### `data`
      
Runtime dependencies

Defaults to `[]`



#### `configuration_env_vars`
      
Pass these configuration environment variables to the resulting binary.
    Chooses a subset of the configuration environment variables (taken from ctx.var), which also
    includes anything specified via the --define flag.
    Note, this can lead to different outputs produced by this rule.

Defaults to `[]`



#### `bootstrap`
      
JavaScript files to include *before* the module loader (require.js).
    For example, you can include Reflect,js for TypeScript decorator metadata reflection,
    or UMD bundles for third-party libraries.

Defaults to `[]`



#### `runtime_deps`
      
Dependencies which should be loaded after the module loader but before the srcs and deps.
    These should be a list of targets which produce JavaScript such as `ts_library`.
    The files will be loaded in the same order they are declared by that rule.

Defaults to `[]`



#### `static_files`
      
Arbitrary files which are available to be served on request.
    Files are served at:
    `/base/<WORKSPACE_NAME>/<path-to-file>`, e.g.
    `/base/npm_bazel_typescript/examples/testing/static_script.js`

Defaults to `[]`



#### `config_file`
      
User supplied Karma configuration file. Bazel will override
    certain attributes of this configuration file. Attributes that are
    overridden will be outputted to the test log.

Defaults to `None`



#### `tags`
      
Standard Bazel tags, this macro adds tags for ibazel support

Defaults to `[]`



#### `peer_deps`
      
list of peer npm deps required by karma_web_test

Defaults to `["@npm//@bazel/karma", "@npm//jasmine-core", "@npm//karma", "@npm//karma-chrome-launcher", "@npm//karma-firefox-launcher", "@npm//karma-jasmine", "@npm//karma-requirejs", "@npm//karma-sourcemap-loader", "@npm//requirejs", "@npm//tmp"]`



#### `kwargs`
      
Passed through to `karma_web_test`






## karma_web_test_suite

Defines a test_suite of web_test targets that wrap a karma_web_test target.

This macro accepts all parameters in karma_web_test and adds additional parameters
for the suite. See karma_web_test docs for all karma_web_test.

The wrapping macro is `web_test_suite` which comes from rules_websting:
https://github.com/bazelbuild/rules_webtesting/blob/master/web/web.bzl.



### Usage

```
karma_web_test_suite(name, browsers, web_test_data, wrapped_test_tags, kwargs)
```



#### `name`
      
The base name of the test




#### `browsers`
      
A sequence of labels specifying the browsers to use.

Defaults to `None`



#### `web_test_data`
      
Data dependencies for the wrapoer web_test targets.

Defaults to `[]`



#### `wrapped_test_tags`
      
A list of test tag strings to use for the wrapped
  karma_web_test target.

Defaults to `["manual", "noci"]`



#### `kwargs`
      
Arguments for the wrapped karma_web_test target.




