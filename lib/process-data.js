'use strict';

var modulesOfPackage = require('./util/modules-of-package');
var readPackageJson = require('./util/read-package-json');
var _ = require('lodash');
var semver = require('semver');
var semverDiff = require('semver-diff');
var q = require('q');
var path = require('path');
var globby = require('globby');

function processModule(moduleName, packageJson, options) {
    var dir = options.path;
    var projectPackageJson = readPackageJson(path.join(dir, 'node_modules', moduleName, 'package.json'));
    var isPrivate = projectPackageJson.private;

    if (isPrivate) {
        return false;
    }

    var packageJsonVersion = packageJson.dependencies[moduleName] ||
        packageJson.devDependencies[moduleName] ||
        packageJson.installed[moduleName];
    var installedVersion = projectPackageJson.version;

    return {
        // info
        moduleName: moduleName,

        // versions
        installed: installedVersion,
        isInstalled: !!installedVersion,
        notInstalled: !installedVersion,
        packageJson: packageJsonVersion,

        // private
        isPrivate: isPrivate,

        // meta
        devDependency: _.has(packageJson.devDependencies, moduleName),
        usedInScripts: _.findKey(packageJson.scripts, function (script) {
            return script.indexOf(moduleName) !== -1;
        }),
        mismatch: semver.validRange(packageJsonVersion) &&
            semver.valid(installedVersion) &&
            !semver.satisfies(installedVersion, packageJsonVersion),
        semverValidRange: semver.validRange(packageJsonVersion),
        semverValid: semver.valid(installedVersion)
    };
}

function processData(options) {
    var projectPackageJson = options.packageJson;

    var nodeModulesPath = _.endsWith(options.path, 'node_modules') ? options.path :
        path.join(options.path, 'node_modules');

    var installedPackages = options.global ? globby.sync(path.resolve(nodeModulesPath, '{*/package.json,@*/*/package.json}')) : false;

    projectPackageJson.installed = _(installedPackages)
        .map(function (pkgPath) {
            var pkg = readPackageJson(path.resolve(options.path, pkgPath));
            return [pkg.name, pkg.version];
        })
        .zipObject()
        .valueOf();

    var results = _.map(modulesOfPackage(projectPackageJson, options), function (moduleName) {
        return processModule(moduleName, projectPackageJson, options);
    });

    return _(results).compact().indexBy('moduleName').valueOf();
}

module.exports = processData;
