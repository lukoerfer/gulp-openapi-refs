# Gulp OpenAPI Refs Plugin
Gulp plugin to resolve `$ref` elements in OpenAPI (f.k.a. Swagger) specifications

## Motivation
When working with OpenAPI specifications, an increasing complexity can often be tackled by using `$ref` elements to link to other documents and resources. However, some tools or publishing strategies require a single document, so all the references need to be resolved. The popular [`json-refs` package](https://github.com/whitlockjc/json-refs) does a great job doing so, but for automation purposes, an integration into a build tool like Gulp is favorable.

NPM lists various similar packages like this one, but either they are not well maintained or they do not follow the Gulp style (e.g. access files by path inside the `Vinyl` stream).

## Installation
Since the plugin is available on NPM, it can be installed as a development dependency:

```
npm install gulp-openapi-refs --save-dev
```

## Usage
Once the plugin is installed as a development dependency, it can be imported via `require` and used in a [`Vinyl`](https://gulpjs.com/docs/en/api/vinyl) stream:

``` javascript
var { src, dest } = required('gulp'); 
var resolveRefs = require('gulp-openapi-refs');

function myTask() {
    return src('src/**/*')
        .pipe(resolveRefs())
        .pipe(dest('resolved'));
}
```

This plugin does **not** support Vinyl *streaming*.
Both JSON and YAML are supported as input formats, but the output format is always JSON. If required, another Gulp plugin can be used to convert the output to YAML.

### Possible problems
The resolution of `$ref` elements is not a pure operation, because some of the referenced files may be processed in the same stream. This must be taken care of when preprocessing the files with another plugin, because the preprocessed files will be stored in memory and therefore not be available under the registered path. One possible solution may be using an intermediate `dest()` operation in the stream, even if it may decrease performance drastically:

``` javascript

function myTask() {
    return src('src/**/*')
        .pipe(somePreprocessing())
        .pipe(dest('intermediate'))
        .pipe(resolveRefs())
        .pipe(dest('resolved'));
}
```

### Options

``` javascript
resolveRefs( [options] [, load] )
```

The plugin takes an optional argument called `options`. These options will be forwarded to the [`resolveRefs` method](https://github.com/whitlockjc/json-refs/blob/master/docs/API.md#json-refsresolverefsobj-options--promiseresolvedrefsresults) of the `json-refs` package, however, some defaults in order to improve the workflow are added. To support references to YAML documents, the `loaderOptions` property will be configured to use the `load` method mentioned below. Additionally, the properties `location` and `relativeBase` will be set individually for each processed file.

The second optional argument called `load` may be used to customize the way how both processed and referenced files are loaded. It expects a method taking a file content string and an optional file path and returning a JavaScript object. By default, the method `safeLoad` from the [`js-yaml` package](https://github.com/nodeca/js-yaml) will be used (`yaml.safeLoad(str, { filename: path }`).

## License
The software is licensed under the MIT license.
