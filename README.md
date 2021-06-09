# Snapshot build of rules_nodejs

+ DATE                     : Wed  9 Jun 2021 06:47:11 PDT
+ CI                       : false
+ SYSTEM                   : Darwin Kernel Version 19.6.0: Thu May  6 00:48:39 PDT 2021; root:xnu-6153.141.33~1/RELEASE_X86_64
+ BUILD_VERSION            : 3.5.1
+ BUILD_BRANCH             : snapshot_builds_4.x
+ GIT_SHA                  : af7353df31a75b0f272ced93d053dc03848cbe20
+ GIT_SHORT_SHA            : af7353df
+ GIT_COMMIT_MSG           : af7353df build: add snapshot build support
+ GIT_COMMITTER_USER_NAME  : Greg Magolan
+ GIT_COMMITTER_USER_EMAIL : greg.magolan@robinhood.com
+ GIT_BRANCH               : snapshot_builds_4.x

## build_bazel_rules_nodejs
Add the following to your WORKSPACE to use the build_bazel_rules_nodejs snapshot build:
```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "106d764e69367834127e9d41ad748dfa045631f362f95bf6e4dbbb127c89bd8d",
    urls = ["https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/build_bazel_rules_nodejs-snapshot_builds_4.x-snapshot.tar.gz"],
)
```

## @bazel/worker
Add the following to your package.json to use the @bazel/worker snapshot build:
```
"@bazel/worker": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_worker-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/typescript
Add the following to your package.json to use the @bazel/typescript snapshot build:
```
"@bazel/typescript": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_typescript-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/terser
Add the following to your package.json to use the @bazel/terser snapshot build:
```
"@bazel/terser": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_terser-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/runfiles
Add the following to your package.json to use the @bazel/runfiles snapshot build:
```
"@bazel/runfiles": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_runfiles-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/rollup
Add the following to your package.json to use the @bazel/rollup snapshot build:
```
"@bazel/rollup": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_rollup-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/protractor
Add the following to your package.json to use the @bazel/protractor snapshot build:
```
"@bazel/protractor": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_protractor-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/labs
Add the following to your package.json to use the @bazel/labs snapshot build:
```
"@bazel/labs": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_labs-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/jasmine
Add the following to your package.json to use the @bazel/jasmine snapshot build:
```
"@bazel/jasmine": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_jasmine-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/esbuild
Add the following to your package.json to use the @bazel/esbuild snapshot build:
```
"@bazel/esbuild": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_esbuild-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/cypress
Add the following to your package.json to use the @bazel/cypress snapshot build:
```
"@bazel/cypress": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_cypress-snapshot_builds_4.x-snapshot.tar.gz"
```

## @bazel/create
Add the following to your package.json to use the @bazel/create snapshot build:
```
"@bazel/create": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+af7353df/@bazel_create-snapshot_builds_4.x-snapshot.tar.gz"
```
