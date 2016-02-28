'use strict';

var processData = require('./process-data');
var readPackageJson = require('./util/read-package-json');
var path = require('path');
var q = require('q');
var _ = require('lodash');

function npmSatisfy(options) {
    options = _.extend({}, options);

    options.path = options.path || process.cwd();

    if (options.debug) {
        console.log({options: options});
    }

    options.packageJson = readPackageJson(path.join(options.path, 'package.json'));

    if (options.packageJson['npm-satisfy'] && options.packageJson['npm-satisfy'].error) {
        return q.resolve();
    }

    var data = processData(options);
    console.log(data);
    return q.resolve(data);
}

module.exports = npmSatisfy;
