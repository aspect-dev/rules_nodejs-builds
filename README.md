# Snapshot build of rules_nodejs

+ DATE                     : Thu 18 Mar 2021 17:03:30 PDT
+ CI                       : false
+ SYSTEM                   : Darwin Kernel Version 19.6.0: Tue Jan 12 22:13:05 PST 2021; root:xnu-6153.141.16~1/RELEASE_X86_64
+ BUILD_VERSION            : 3.2.2
+ BUILD_BRANCH             : snapshot_builds
+ GIT_SHA                  : 24db1bb4d8ff983d63ff6ea9f1249038c3b8496b
+ GIT_SHORT_SHA            : 24db1bb4
+ GIT_COMMIT_MSG           : 24db1bb4 build: add snapshot build support
+ GIT_COMMITTER_USER_NAME  : Greg Magolan
+ GIT_COMMITTER_USER_EMAIL : greg.magolan@robinhood.com
+ GIT_BRANCH               : snapshot_builds

## build_bazel_rules_nodejs
Add the following to your WORKSPACE to use the build_bazel_rules_nodejs snapshot build:
```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "6a8e8458018e88ccbc65ad17e949e381ade87a6c42f26bf9da962c0dc4eabfa5",
    urls = ["https://github.com/aspect-dev/rules_nodejs-builds/raw/3.2.2+24db1bb4/build_bazel_rules_nodejs-snapshot_builds-snapshot.tar.gz"],
)
```

## @bazel/worker
Add the following to your package.json to use the @bazel/worker snapshot build:
```
"@bazel/worker": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.2.2+24db1bb4/@bazel_worker-snapshot_builds-snapshot.tar.gz"
```

## @bazel/typescript
Add the following to your package.json to use the @bazel/typescript snapshot build:
```
"@bazel/typescript": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.2.2+24db1bb4/@bazel_typescript-snapshot_builds-snapshot.tar.gz"
```

## @bazel/terser
Add the following to your package.json to use the @bazel/terser snapshot build:
```
"@bazel/terser": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.2.2+24db1bb4/@bazel_terser-snapshot_builds-snapshot.tar.gz"
```

## @bazel/rollup
Add the following to your package.json to use the @bazel/rollup snapshot build:
```
"@bazel/rollup": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.2.2+24db1bb4/@bazel_rollup-snapshot_builds-snapshot.tar.gz"
```

## @bazel/protractor
Add the following to your package.json to use the @bazel/protractor snapshot build:
```
"@bazel/protractor": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.2.2+24db1bb4/@bazel_protractor-snapshot_builds-snapshot.tar.gz"
```

## @bazel/labs
Add the following to your package.json to use the @bazel/labs snapshot build:
```
"@bazel/labs": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.2.2+24db1bb4/@bazel_labs-snapshot_builds-snapshot.tar.gz"
```

## @bazel/jasmine
Add the following to your package.json to use the @bazel/jasmine snapshot build:
```
"@bazel/jasmine": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.2.2+24db1bb4/@bazel_jasmine-snapshot_builds-snapshot.tar.gz"
```

## @bazel/create
Add the following to your package.json to use the @bazel/create snapshot build:
```
"@bazel/create": "https://github.com/aspect-dev/rules_nodejs-builds/raw/3.2.2+24db1bb4/@bazel_create-snapshot_builds-snapshot.tar.gz"
```
