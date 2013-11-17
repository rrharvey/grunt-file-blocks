# grunt-file-blocks

Prepares regions (blocks) in a file by inserting or removing a line (script tag, link, or reference) for each file matching a specified pattern.

> This plugin is designed for Grunt 0.4 and newer.

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install /path/to/grunt-file-blocks --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-file-blocks');
```

## The "fileblocks" task

### Overview
Replacement blocks are identified in the source file by using comments.
These comments serve as anchors that mark the beginning and end of the block. 
Script tags, links, or reference tags will be inserted or removed inside the block for each file that is found 
using file matching patterns. These elements are therefore synchronized with matching files. Blocks may 
also be removed from the HTML file. This is useful for handling debug-only scripts.

#### Block Syntax
```html
<!-- fileblock:<type> name -->
... script / link elements, etc.
<!-- endfileblock -->
```

```js
/* fileblock:<type> name -->
... JavaScript or TypeScript references.
/* endfilebock */
```
 
__type__: `js`, `css`, `ref`, or `other`

__name__: The block name.  

#### Example Blocks

```html
<!-- fileblock:other reload -->
    <script src="//localhost:35729/livereload.js"></script>
<!-- fileblock -->
    
<!-- fileblock:css styles -->
<!-- fileblock -->

<!-- fileblock:js app -->
<script src="js/services/myService.js"></script>
<script src="js/controllers/mainCtrl.js"></script>
<script src="js/controllers/anotherCtrl.js"></script>
<script src="js/app.js"></script>
<!-- fileblock -->
```

```js  
/* fileblock:libs */
/// <reference path="libs/somedependency.js" />
/* endfileblock */
```

### Existing Tags in Blocks
If a line is found inside the block that matches the block type template, the file name will be parsed from the content. Existing file names will be compared with those found using the file matching patterns. Files that no longer exist will be removed from the block if the *removeFiles* option is true. New files that are found will be added to the bottom of the list. Existing tags will remain in the same relative position. This allows you to manually change the order of existing scripts or style sheets.

#### Block Templates
Each matching file name is applied to a template based on the block type. The resulting string is added as a line in the block.

#### Block Type
__js__: `<script src="<%= file %>"></script>`

__css__ : `<link href="<%= file %>" rel="stylesheet" />`

__ref__ : `///<reference path="<%= file %>" />`

__other__: _none, no content will be inserted_

In order to complete the configuration the blocks must be added to the task configuration.

```js
grunt.initConfig({
  htmlprep: {
    options: {
      removeBlock: false,
      removeAnchors: false,
      removeFiles: false,
      prefix: ''
    },
    dev: {
      /* options may be placed here  */
      files: [
          {
              /* options may be placed here */
              src: 'index.html',
              blocks: {
                  'styles': { src: 'app/styles/*.css' /* options may be placed here */},
                  'app': { src: 'app/{,*/}*.js' }
              }
          },
          {
              src: 'app/app.ts',
              blocks: {
                  'references': { src: 'app/ts/*.ts' },
                  'libs': { src: 'typings/*.d.ts', cwd: 'libs', prefix: '../libs' }
              }
          }
      ]
    },
    dist: {
      options: {
        removeAnchors: true
      },
      src: 'index.html',
      dest: 'dist/index.html',
      blocks: {
        'app': { src: 'app/{,*/}*.js' },
        'styles': { src: 'app/styles/*.css' },
        'reload': { removeBlock: true }
      }
    }
  },
})
```

### Options

All options may be specified at the task, target, source file, or block level.

#### removeAnchors
Type: `Boolean`
Default value: `false`

If true the comments that serve as a block anchor are removed
during processing.

#### removeBlock
Type: `Boolean`
Default value: `false`

If true the entire block, including comment anchors, is removed during 
processing.

#### removeFiles
Type: `Boolean`
Default value: `false`

If true, existing tags that no longer have a matching file will be removed during processing.

#### prefix
Type: `String`
Default value: `undefined`

A prefix that will be added to the patch of every matched file before it is inserted into a block.

i.e. prefix: '~/' Adds a tilde slash path resolver for ASP.NET MVC sites.

### Target Properties
#### src
Type: `String`

Specifies the name of the file that will be modified. The task expects this property to match a single file. If you would like to process more than one file per target you
must use a files array (see below) property.

#### dest (optional)
Type: `String`

Specifies the name of the destination file. If this property is omitted the source file will be modified in place.

#### blocks
Type: `Object`

A blocks configuration object.

__-- OR --__

#### files
Type: `Object[]`

This property may be used to specify multiple source files. Each object in the array should specify the three target properties above.

### Blocks Configuration Object

A block configuration specifies file matching patterns. The configuration may also override options from the task or target.

#### Property Names (Keys)
Must match the name of a block in the source file.

#### src
Type: `String|String[]`
File [globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) used to find source files.

### Advanced Block Configuration Properties
The *cwd*, *flatten*, *ext*, *rename*, and *matchBase* options may be added to a block configuration object in order to [build the files list dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

