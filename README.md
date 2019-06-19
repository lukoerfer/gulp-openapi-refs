# Gulp OpenAPI Refs Plugin
Gulp plugin to resolve `$ref` elements in OpenAPI (f.k.a. Swagger) specifications

## Motivation
When working with OpenAPI specifications, an increasing complexity can often be tackled by using `$ref` elements to link to other documents and resources. However, some tools or publishing strategies require a single document, so all the references need to be resolved. The brilliant [package `json-refs`](https://github.com/whitlockjc/json-refs) does a great job doing so, but for automation purposes, an integration into a build tool like Gulp is favorable.

NPM lists various similar packages like this one, but either they are abandoned or they do not follow the Gulp style (e.g. accessing files by path inside the `Vinyl` stream).

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

The plugin does **not** support streaming, only buffer Vinyls can be handled.

### Possible problems
The resolution of `$ref` elements is not a pure operation, because some of the referenced files may be processed in the same stream. This must be taken care of when preprocessing the files with another plugin, because the preprocessed files will be stored in memory and therefore not available under the given path. One possible solution may be using an intermediate `dest()` operation in the stream, even if it will decrease performance:

``` javascript

function myTask() {
    return src('src/**/*')
        .pipe(somePreprocessing())
        .pipe(dest('intermediate'))
        .pipe(resolveRefs())
        .pipe(dest('resolved'));
}
```

## License
The software is licensed under the MIT license.
