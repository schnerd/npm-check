'use strict';

var pkgJson = require('../package.json');
var npmSatisfy = require('./index');
var output = require('./output');
var program = require('commander');
var _ = require('lodash');

process.title = pkgJson.name;

program
    .version(pkgJson.version)
    .usage('[options]')
    .option('-p, --production', 'Ignore devDependencies.')
    .option('-d, --dir [path]', 'Directory to check, default is current directory.')
    .option('-c, --color', 'Force color output.')
    .option('--debug', 'Debug output.')
    .parse(process.argv);

var options = {
    ignoreDev: program.production,
    debug: program.debug,
    path: program.dir || process.cwd()
};

npmSatisfy(options)
    .catch(function (err) {
        console.log('[npm-satisfy]', err.stack || err);
        process.exit(1);
    })
    .done(function () {
        console.log('[npm-satisfy]', 'All dependencies satisfied');
    });
