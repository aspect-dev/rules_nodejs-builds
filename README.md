# Snapshot build of rules_nodejs

+ DATE                     : Tue  7 Apr 2020 10:29:41 PDT
+ CI                       : false
+ SYSTEM                   : Darwin Kernel Version 19.4.0: Wed Mar  4 22:28:40 PST 2020; root:xnu-6153.101.6~15/RELEASE_X86_64
+ BUILD_VERSION            : 1.5.0
+ BUILD_BRANCH             : labs
+ GIT_SHA                  : 1361843f068db9597b2129e0f80b298bfc1517af
+ GIT_SHORT_SHA            : 1361843f
+ GIT_COMMIT_MSG           : 1361843f fix(builtin): fix npm_version_check.js when running outside of bazel
+ GIT_COMMITTER_USER_NAME  : Greg Magolan
+ GIT_COMMITTER_USER_EMAIL : gmagolan@gmail.com
+ GIT_BRANCH               : labs

## build_bazel_rules_nodejs
Add the following to your WORKSPACE to use the build_bazel_rules_nodejs snapshot build:
```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "7b96a7ce4d40e57d629b435eb948d17037d0c346d5b27aecc55078291b75699b",
    urls = ["https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/build_bazel_rules_nodejs-labs-snapshot.tar.gz"],
)
```

## @bazel/worker
Add the following to your package.json to use the @bazel/worker snapshot build:
```
"@bazel/worker": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_worker-labs-snapshot.tar.gz"
```

## @bazel/typescript
Add the following to your package.json to use the @bazel/typescript snapshot build:
```
"@bazel/typescript": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_typescript-labs-snapshot.tar.gz"
```

## @bazel/terser
Add the following to your package.json to use the @bazel/terser snapshot build:
```
"@bazel/terser": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_terser-labs-snapshot.tar.gz"
```

## @bazel/rollup
Add the following to your package.json to use the @bazel/rollup snapshot build:
```
"@bazel/rollup": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_rollup-labs-snapshot.tar.gz"
```

## @bazel/protractor
Add the following to your package.json to use the @bazel/protractor snapshot build:
```
"@bazel/protractor": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_protractor-labs-snapshot.tar.gz"
```

## @bazel/labs
Add the following to your package.json to use the @bazel/labs snapshot build:
```
"@bazel/labs": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_labs-labs-snapshot.tar.gz"
```

## @bazel/karma
Add the following to your package.json to use the @bazel/karma snapshot build:
```
"@bazel/karma": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_karma-labs-snapshot.tar.gz"
```

## @bazel/jasmine
Add the following to your package.json to use the @bazel/jasmine snapshot build:
```
"@bazel/jasmine": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_jasmine-labs-snapshot.tar.gz"
```

## @bazel/hide-bazel-files
Add the following to your package.json to use the @bazel/hide-bazel-files snapshot build:
```
"@bazel/hide-bazel-files": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_hide-bazel-files-labs-snapshot.tar.gz"
```

## @bazel/create
Add the following to your package.json to use the @bazel/create snapshot build:
```
"@bazel/create": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+1361843f/@bazel_create-labs-snapshot.tar.gz"
```
