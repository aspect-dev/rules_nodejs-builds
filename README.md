# Snapshot build of rules_nodejs

+ DATE                     : Thu 27 May 2021 13:37:24 PDT
+ CI                       : false
+ SYSTEM                   : Darwin Kernel Version 19.6.0: Thu May  6 00:48:39 PDT 2021; root:xnu-6153.141.33~1/RELEASE_X86_64
+ BUILD_VERSION            : 3.5.1
+ BUILD_BRANCH             : snapshot_builds
+ GIT_SHA                  : 135b2fe2710e9b2df34fdf2d7af4312b627f9a0a
+ GIT_SHORT_SHA            : 135b2fe2
+ GIT_COMMIT_MSG           : 135b2fe2 build: add snapshot build support
+ GIT_COMMITTER_USER_NAME  : Greg Magolan
+ GIT_COMMITTER_USER_EMAIL : greg.magolan@robinhood.com
+ GIT_BRANCH               : snapshot_builds

## build_bazel_rules_nodejs
Add the following to your WORKSPACE to use the build_bazel_rules_nodejs snapshot build:
```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "dfb3b3775f7b848f1978d3b7483c02949d2e1108f96e749768a20db7b4a2a4f3",
    urls = ["https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/build_bazel_rules_nodejs-snapshot_builds-snapshot.tar.gz"],
)
```

## @bazel/worker
Add the following to your package.json to use the @bazel/worker snapshot build:
```
"@bazel/worker": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_worker-snapshot_builds-snapshot.tar.gz"
```

## @bazel/typescript
Add the following to your package.json to use the @bazel/typescript snapshot build:
```
"@bazel/typescript": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_typescript-snapshot_builds-snapshot.tar.gz"
```

## @bazel/terser
Add the following to your package.json to use the @bazel/terser snapshot build:
```
"@bazel/terser": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_terser-snapshot_builds-snapshot.tar.gz"
```

## @bazel/runfiles
Add the following to your package.json to use the @bazel/runfiles snapshot build:
```
"@bazel/runfiles": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_runfiles-snapshot_builds-snapshot.tar.gz"
```

## @bazel/rollup
Add the following to your package.json to use the @bazel/rollup snapshot build:
```
"@bazel/rollup": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_rollup-snapshot_builds-snapshot.tar.gz"
```

## @bazel/protractor
Add the following to your package.json to use the @bazel/protractor snapshot build:
```
"@bazel/protractor": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_protractor-snapshot_builds-snapshot.tar.gz"
```

## @bazel/labs
Add the following to your package.json to use the @bazel/labs snapshot build:
```
"@bazel/labs": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_labs-snapshot_builds-snapshot.tar.gz"
```

## @bazel/jasmine
Add the following to your package.json to use the @bazel/jasmine snapshot build:
```
"@bazel/jasmine": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_jasmine-snapshot_builds-snapshot.tar.gz"
```

## @bazel/esbuild
Add the following to your package.json to use the @bazel/esbuild snapshot build:
```
"@bazel/esbuild": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_esbuild-snapshot_builds-snapshot.tar.gz"
```

## @bazel/cypress
Add the following to your package.json to use the @bazel/cypress snapshot build:
```
"@bazel/cypress": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_cypress-snapshot_builds-snapshot.tar.gz"
```

## @bazel/create
Add the following to your package.json to use the @bazel/create snapshot build:
```
"@bazel/create": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.5.1+135b2fe2/@bazel_create-snapshot_builds-snapshot.tar.gz"
```
