# Snapshot build of rules_nodejs

+ DATE                     : Fri  5 Feb 2021 11:17:38 PST
+ CI                       : false
+ SYSTEM                   : Darwin Kernel Version 19.6.0: Tue Nov 10 00:10:30 PST 2020; root:xnu-6153.141.10~1/RELEASE_X86_64
+ BUILD_VERSION            : 3.1.0
+ BUILD_BRANCH             : snapshot_builds
+ GIT_SHA                  : 94646e3c98905acc72c02fe60c5c84be52e61826
+ GIT_SHORT_SHA            : 94646e3c
+ GIT_COMMIT_MSG           : 94646e3c build: add snapshot build support
+ GIT_COMMITTER_USER_NAME  : Greg Magolan
+ GIT_COMMITTER_USER_EMAIL : greg.magolan@robinhood.com
+ GIT_BRANCH               : snapshot_builds

## build_bazel_rules_nodejs
Add the following to your WORKSPACE to use the build_bazel_rules_nodejs snapshot build:
```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "63dc8401ab773819f315c369ece50b0aac22ee979a06d1e700c5dbdab406c25d",
    urls = ["https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+94646e3c/build_bazel_rules_nodejs-snapshot_builds-snapshot.tar.gz"],
)
```

## @bazel/worker
Add the following to your package.json to use the @bazel/worker snapshot build:
```
"@bazel/worker": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+94646e3c/@bazel_worker-snapshot_builds-snapshot.tar.gz"
```

## @bazel/typescript
Add the following to your package.json to use the @bazel/typescript snapshot build:
```
"@bazel/typescript": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+94646e3c/@bazel_typescript-snapshot_builds-snapshot.tar.gz"
```

## @bazel/terser
Add the following to your package.json to use the @bazel/terser snapshot build:
```
"@bazel/terser": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+94646e3c/@bazel_terser-snapshot_builds-snapshot.tar.gz"
```

## @bazel/rollup
Add the following to your package.json to use the @bazel/rollup snapshot build:
```
"@bazel/rollup": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+94646e3c/@bazel_rollup-snapshot_builds-snapshot.tar.gz"
```

## @bazel/protractor
Add the following to your package.json to use the @bazel/protractor snapshot build:
```
"@bazel/protractor": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+94646e3c/@bazel_protractor-snapshot_builds-snapshot.tar.gz"
```

## @bazel/labs
Add the following to your package.json to use the @bazel/labs snapshot build:
```
"@bazel/labs": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+94646e3c/@bazel_labs-snapshot_builds-snapshot.tar.gz"
```

## @bazel/jasmine
Add the following to your package.json to use the @bazel/jasmine snapshot build:
```
"@bazel/jasmine": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+94646e3c/@bazel_jasmine-snapshot_builds-snapshot.tar.gz"
```

## @bazel/create
Add the following to your package.json to use the @bazel/create snapshot build:
```
"@bazel/create": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.1.0+94646e3c/@bazel_create-snapshot_builds-snapshot.tar.gz"
```
