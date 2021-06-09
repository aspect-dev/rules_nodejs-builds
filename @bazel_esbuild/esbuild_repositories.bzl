"""
Helper macro for fetching esbuild versions
"""

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@build_bazel_rules_nodejs//:index.bzl", "npm_install")
load(":esbuild_packages.bzl", "ESBUILD_PACKAGES")

def _maybe(repo_rule, name, **kwargs):
    if name not in native.existing_rules():
        repo_rule(name = name, **kwargs)

def esbuild_repositories(name = ""):
    """Helper for fetching and setting up the esbuild versions and toolchains

    Args:
        name: currently unused
    """

    for name, meta in ESBUILD_PACKAGES.platforms.items():
        _maybe(
            http_archive,
            name = "esbuild_%s" % name,
            urls = meta.urls,
            strip_prefix = "package",
            build_file_content = """exports_files(["%s"])""" % meta.binary_path,
            sha256 = meta.sha,
        )

        toolchain_label = Label("//@bazel/esbuild/toolchain:esbuild_%s_toolchain" % name)
        native.register_toolchains("@%s//%s:%s" % (toolchain_label.workspace_name, toolchain_label.package, toolchain_label.name))

    pkg_label = Label("//@bazel/esbuild/toolchain:package.json")
    npm_install(
        name = "esbuild_npm",
        package_json = pkg_label,
        package_lock_json = Label("//@bazel/esbuild/toolchain:package-lock.json"),
        args = [
            # Install is run with ignore scripts so that esbuild's postinstall script does not run,
            # as we never use the downloaded binary anyway and instead set 'ESBUILD_BINARY_PATH' to the toolchains path.
            # This allows us to deal with --platform
            "--ignore-scripts",
        ],
        symlink_node_modules = False,
        package_path = "external/" + pkg_label.workspace_name + "/@bazel/esbuild",
    )