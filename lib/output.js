'use strict';

var chalk = require('chalk');
var _ = require('lodash');
var table = require('text-table');
var emoji = require('node-emoji');

function uppercaseFirstLetter(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function render(moduleName, data) {
    var rows = [];

    var status = _([
        data.isInstalled ? '' : chalk.bgGreen.white.bold(' ' + emoji.get('worried') + '  MISSING! ') + ' In package.json but not installed.',
        data.mismatch && !data.bump ? chalk.bgRed.yellow.bold(' ' + emoji.get('interrobang') + '  MISMATCH ') + ' Installed version does not match package.json. ' + data.installed + ' ≠ ' + data.packageJson : '',
        data.error ? chalk.bgRed.white.bold(' ' + emoji.get('no_entry') + '  NPM ERR! ') + ' ' + chalk.red(data.error) : ''
    ])
    .flatten()
    .compact()
    .valueOf();

    if (!status.length) {
        return false;
    }

    rows.push([
        chalk.yellow(moduleName),
        status.shift()
    ]);

    while (status.length) {
        rows.push([' ', status.shift()]);
    }

    rows.push([
        ' '
    ]);

    return rows;
}

function outputConsole(modules, options) {
    if (options.debug) {
        console.log(modules);
    }

    if (_.isUndefined(modules)) {
        return;
    }

    var rows = _(modules).reduce(function (acc, data, moduleName) {
        return acc.concat(render(moduleName, data));
    }, []);

    rows = _(rows)
        .compact()
        .valueOf();

    if (rows.length) {
        var t = table(rows, {
            stringLength: function (s) {
                return chalk.stripColor(s).length;
            }
        });

        console.log('');
        console.log(t);
    } else {
        console.log(emoji.get('heart') + '  Your modules look ' + chalk.bold('amazing') + '. Keep up the great work.' + emoji.get('heart'));
    }
}

module.exports = outputConsole;
