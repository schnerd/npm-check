## npm-satisfy

Checks to see if your node_modules satisfy the dependencies defined in package.json

This is a forked and simplified version of the awesome npm-satisfy. If you want the ability to update to the latest package, find unused packages, and much more, consider using npm-satisfy.

### On the command line

This is how you should use `npm-satisfy`.

#### Install


```bash
$ npm install -g npm-satisfy
```

#### Use

```bash
$ npm-satisfy
```

#### Options

```
$ npm-satisfy --help

  Usage: npm-satisfy [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -p, --production   Ignore devDependencies.
```

##### -p, --production

By default `npm-satisfy` will look at packages listed as `dependencies` and `devDependencies`.

This option will let it ignore outdated and unused checks for packages listed as `devDependencies`.


### API

The API is here in case you want to wrap this with your CI toolset.

```js
var npmSatisfy = require('npm-satisfy');

npmSatisfy(options)
  .then(result);
```

#### `npmSatisfy(options)` returns `promise`

##### options

###### ignoreDev `boolean`

* default is `false`

Ignore `devDependencies`.

###### path `string`

* default is `cwd`

Override where `npm-satisfy` checks.

#####`result`

`object of module names : data`

`data` looks like this:

Versions

* installed: version in node_modules.
* packageJson: version or range in package.json.
* devDependency: Is this a devDependency?
* usedInScripts: Is this used in the scripts section of package.json?
* mismatch: Is the version installed not match the range in package.json?
* semverValidRange: Is the package.json range valid?
* semverValid: Is the installed version valid semver?

### License
Copyright (c) 2015 Dylan Greene, contributors.
Modified work Copyright (c) David Schnurr

Released under the [MIT license](https://tldrlegal.com/license/mit-license).

Screenshots are [CC BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) (Attribution-ShareAlike).
