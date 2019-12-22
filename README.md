# Gulp OpenAPI Refs Plugin

Gulp plugin to resolve `$ref` elements in OpenAPI (f.k.a. Swagger) specifications

## Motivation
When working with OpenAPI specifications, an increasing complexity can often be tackled by using `$ref` elements to link to other documents and resources. However, some tools or publishing strategies require a single document, so all the references need to be resolved. The popular [`json-refs` package](https://github.com/whitlockjc/json-refs) does a great job doing so, but for automation purposes, an integration into a build tool like Gulp is favorable.

NPM lists various similar packages like this one, but either they are not well maintained or they do not follow the Gulp style (e.g. access files by path inside the `Vinyl` stream).

## Installation
Since the plugin is available on [NPM](https://www.npmjs.com/package/gulp-openapi-refs), it can easily be installed (preferably as a development dependency):

```
npm install gulp-openapi-refs [--save-dev]
```

## Usage
Once the plugin is installed, it can be imported into a Gulp script and used in a Gulp file stream:

``` javascript
var { src, dest } = required('gulp'); 
var resolveRefs = require('gulp-openapi-refs');

function myTask() {
    return src('src/**/*')
        .pipe(resolveRefs())
        .pipe(dest('resolved'));
}
```

This plugin does **not** support Vinyls with streamed content (`src('...', { buffer: false })`), only buffer content can be processed.
Both JSON and YAML are supported as input formats to support references from JSON to YAML and vice-versa, but the output format is always JSON. For consistence, the extension of the output files will be changed to `.json`, too. If required, another Gulp plugin must be used to convert the output files back to YAML.

### Options

``` javascript
resolveRefs( [options [, load]] )
```

#### `options`
This object will be forwarded to the [`resolveRefs` method](https://github.com/whitlockjc/json-refs/blob/master/docs/API.md#json-refsresolverefsobj-options--promiseresolvedrefsresults) of the `json-refs` package, after applying the following implicit defaults:

* The property `loaderOptions` will be configured to use a custom `load` method (see parameter `load` below).
* The properties `location` and `relativeBase` will be set individually for each processed file, as long as they are not defined explicitly.
* The property `filter` will be configured to only resolve external references (`filter: ['remote', 'relative']`).

#### `load`
This function will be used to load both processed and referenced files. It must be a function that takes a file content string `str` as well as an optional file path `path` and returns an object parsed from the content string. By default, the method `safeLoad` from the [`js-yaml` package](https://github.com/nodeca/js-yaml) will be used in the following form: `(str, path = null) => yaml.safeLoad(str, { filename: path })`.

## License
The software is licensed under the [MIT license](https://github.com/lukoerfer/gulp-openapi-refs/blob/master/LICENSE).
