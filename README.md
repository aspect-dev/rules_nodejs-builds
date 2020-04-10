# Snapshot build of rules_nodejs

+ DATE                     : Fri 10 Apr 2020 15:14:31 PDT
+ CI                       : false
+ SYSTEM                   : Darwin Kernel Version 19.4.0: Wed Mar  4 22:28:40 PST 2020; root:xnu-6153.101.6~15/RELEASE_X86_64
+ BUILD_VERSION            : 1.5.0
+ BUILD_BRANCH             : labs
+ GIT_SHA                  : 0a29011a30d1f79f4d08df0353470645f04c2eea
+ GIT_SHORT_SHA            : 0a29011a
+ GIT_COMMIT_MSG           : 0a29011a fix(builtin): consider guard paths to be out paths in linker
+ GIT_COMMITTER_USER_NAME  : Greg Magolan
+ GIT_COMMITTER_USER_EMAIL : gmagolan@gmail.com
+ GIT_BRANCH               : labs

## build_bazel_rules_nodejs
Add the following to your WORKSPACE to use the build_bazel_rules_nodejs snapshot build:
```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "14c34910da26b6adc0466103845c69f92dd8f249f8f4d44dac4ad5ce86dc261e",
    urls = ["https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/build_bazel_rules_nodejs-labs-snapshot.tar.gz"],
)
```

## @bazel/worker
Add the following to your package.json to use the @bazel/worker snapshot build:
```
"@bazel/worker": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_worker-labs-snapshot.tar.gz"
```

## @bazel/typescript
Add the following to your package.json to use the @bazel/typescript snapshot build:
```
"@bazel/typescript": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_typescript-labs-snapshot.tar.gz"
```

## @bazel/terser
Add the following to your package.json to use the @bazel/terser snapshot build:
```
"@bazel/terser": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_terser-labs-snapshot.tar.gz"
```

## @bazel/rollup
Add the following to your package.json to use the @bazel/rollup snapshot build:
```
"@bazel/rollup": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_rollup-labs-snapshot.tar.gz"
```

## @bazel/protractor
Add the following to your package.json to use the @bazel/protractor snapshot build:
```
"@bazel/protractor": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_protractor-labs-snapshot.tar.gz"
```

## @bazel/labs
Add the following to your package.json to use the @bazel/labs snapshot build:
```
"@bazel/labs": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_labs-labs-snapshot.tar.gz"
```

## @bazel/karma
Add the following to your package.json to use the @bazel/karma snapshot build:
```
"@bazel/karma": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_karma-labs-snapshot.tar.gz"
```

## @bazel/jasmine
Add the following to your package.json to use the @bazel/jasmine snapshot build:
```
"@bazel/jasmine": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_jasmine-labs-snapshot.tar.gz"
```

## @bazel/hide-bazel-files
Add the following to your package.json to use the @bazel/hide-bazel-files snapshot build:
```
"@bazel/hide-bazel-files": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_hide-bazel-files-labs-snapshot.tar.gz"
```

## @bazel/create
Add the following to your package.json to use the @bazel/create snapshot build:
```
"@bazel/create": "https://github.com/aspect-dev/rules_nodejs-builds/raw/1.5.0+0a29011a/@bazel_create-labs-snapshot.tar.gz"
```
