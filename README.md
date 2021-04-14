# Snapshot build of rules_nodejs

+ DATE                     : Wed 14 Apr 2021 07:21:45 PDT
+ CI                       : false
+ SYSTEM                   : Darwin Kernel Version 19.6.0: Tue Jan 12 22:13:05 PST 2021; root:xnu-6153.141.16~1/RELEASE_X86_64
+ BUILD_VERSION            : 3.3.0
+ BUILD_BRANCH             : snapshot_builds
+ GIT_SHA                  : 4632d71dade16618d227fe17d37b3638bee6325a
+ GIT_SHORT_SHA            : 4632d71d
+ GIT_COMMIT_MSG           : 4632d71d build: add snapshot build support
+ GIT_COMMITTER_USER_NAME  : Greg Magolan
+ GIT_COMMITTER_USER_EMAIL : greg.magolan@robinhood.com
+ GIT_BRANCH               : snapshot_builds

## build_bazel_rules_nodejs
Add the following to your WORKSPACE to use the build_bazel_rules_nodejs snapshot build:
```python
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "a47d1401100526c7b98950dc185faa4032abfb1ef1024ee9dd54d9ab77a2cc15",
    urls = ["https://github.com/aspect-dev/rules_nodejs-builds/raw/3.3.0+4632d71d/build_bazel_rules_nodejs-snapshot_builds-snapshot.tar.gz"],
)
```
