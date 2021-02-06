# Snapshot build of rules_nodejs

+ DATE                     : Fri  5 Feb 2021 16:39:16 PST
+ CI                       : false
+ SYSTEM                   : Darwin Kernel Version 19.6.0: Tue Nov 10 00:10:30 PST 2020; root:xnu-6153.141.10~1/RELEASE_X86_64
+ BUILD_VERSION            : 3.1.0
+ BUILD_BRANCH             : snapshot_builds
+ GIT_SHA                  : 2f3b2d90b2877c55466c3acbf92259fe77d76ac1
+ GIT_SHORT_SHA            : 2f3b2d90
+ GIT_COMMIT_MSG           : 2f3b2d90 build: add snapshot build support
+ GIT_COMMITTER_USER_NAME  : Greg Magolan
+ GIT_COMMITTER_USER_EMAIL : greg.magolan@robinhood.com
+ GIT_BRANCH               : snapshot_builds

## build_bazel_rules_nodejs
Add the following to your WORKSPACE to use the build_bazel_rules_nodejs snapshot build:
```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "360305d8d229a17cda2796fa399e898b29ebcf03c3408b8dda6a05b114dd5fbd",
    urls = ["https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+2f3b2d90/build_bazel_rules_nodejs-snapshot_builds-snapshot.tar.gz"],
)
```

## @bazel/worker
Add the following to your package.json to use the @bazel/worker snapshot build:
```
"@bazel/worker": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+2f3b2d90/@bazel_worker-snapshot_builds-snapshot.tar.gz"
```

## @bazel/typescript
Add the following to your package.json to use the @bazel/typescript snapshot build:
```
"@bazel/typescript": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+2f3b2d90/@bazel_typescript-snapshot_builds-snapshot.tar.gz"
```

## @bazel/terser
Add the following to your package.json to use the @bazel/terser snapshot build:
```
"@bazel/terser": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+2f3b2d90/@bazel_terser-snapshot_builds-snapshot.tar.gz"
```

## @bazel/rollup
Add the following to your package.json to use the @bazel/rollup snapshot build:
```
"@bazel/rollup": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+2f3b2d90/@bazel_rollup-snapshot_builds-snapshot.tar.gz"
```

## @bazel/protractor
Add the following to your package.json to use the @bazel/protractor snapshot build:
```
"@bazel/protractor": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+2f3b2d90/@bazel_protractor-snapshot_builds-snapshot.tar.gz"
```

## @bazel/labs
Add the following to your package.json to use the @bazel/labs snapshot build:
```
"@bazel/labs": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+2f3b2d90/@bazel_labs-snapshot_builds-snapshot.tar.gz"
```

## @bazel/jasmine
Add the following to your package.json to use the @bazel/jasmine snapshot build:
```
"@bazel/jasmine": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+2f3b2d90/@bazel_jasmine-snapshot_builds-snapshot.tar.gz"
```

## @bazel/create
Add the following to your package.json to use the @bazel/create snapshot build:
```
"@bazel/create": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+2f3b2d90/@bazel_create-snapshot_builds-snapshot.tar.gz"
```
