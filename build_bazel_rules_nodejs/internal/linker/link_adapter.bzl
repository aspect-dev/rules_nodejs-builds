# Copyright 2017 The Bazel Authors. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""link_adapter is used to add a LinkablePackageInfo to a target that doesn't
provide one or modify the package_path of a target which provides LinkablePackageInfo.

The rule will not allow you to change the package_name of target that already
provides a LinkablePackageInfo. If a target already provides a package_name, the
package_name set here must match.
"""

load(
    "//:providers.bzl",
    "DeclarationInfo",
    "ExternalNpmPackageInfo",
    "JSModuleInfo",
    "JSNamedModuleInfo",
    "LinkablePackageInfo",
)

_ATTRS = {
    "deps": attr.label_list(
        mandatory = True,
    ),
    "package_name": attr.string(
        mandatory = True,
    ),
    "package_path": attr.string(),
}

def _impl(ctx):
    if len(ctx.attr.deps) != 1:
        fail("Expected a single linkable dependency")

    link_target = ctx.attr.deps[0]

    if ExternalNpmPackageInfo in link_target:
        fail("3rd party linkable dependency with ExternalNpmPackageInfo not adaptable")

    if LinkablePackageInfo in link_target:
        if link_target[LinkablePackageInfo].package_name != ctx.attr.package_name:
            fail("Expected linkable dependency package_name to match adapter package_name")

    providers = [
        LinkablePackageInfo(
            package_name = ctx.attr.package_name,
            package_path = ctx.attr.package_path,
            path = link_target[LinkablePackageInfo].path,
            files = link_target[LinkablePackageInfo].files,
        ),
    ]

    # Forward other providers that linkable targets such as link_target may provide
    # See js_library rule which provides all of these for example.
    if DeclarationInfo in link_target:
        providers.append(link_target[DeclarationInfo])
    if JSModuleInfo in link_target:
        providers.append(link_target[JSModuleInfo])
    if JSNamedModuleInfo in link_target:
        providers.append(link_target[JSNamedModuleInfo])
    if DefaultInfo in link_target:
        providers.append(link_target[DefaultInfo])

    return providers

_link_adapter = rule(
    implementation = _impl,
    attrs = _ATTRS,
)

def link_adapter(name, target, package_name, package_path = "", **kwargs):
    """Groups JavaScript code so that it can be depended on like an npm package.

    Args:
        name: The name for the target
        target: The target adapt
        package_name: The name it will be imported by
            If package_name is set on target this must match the taget's package_name.
        package_path: The directory in the workspace to link to
            "" will link to root of the workspace.
        **kwargs: used for undocumented legacy features
    """
    _link_adapter(
        name = name,
        # pass to rule as deps so aspects can walk still walk the deps tree through this rule
        deps = [target],
        package_name = package_name,
        package_path = package_path,
    )
