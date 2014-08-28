# grunt-file-blocks

Replacement [blocks](https://github.com/rrharvey/grunt-file-blocks/wiki/Blocks) are identified in a [source file](https://github.com/rrharvey/grunt-file-blocks/wiki/Source-Files) by using comments.
These comments serve as anchors that mark the beginning and end of the block. 
Script tags, links, reference tags, or other custom content will be inserted or removed inside the block for each file that is found 
using file matching patterns. The block content is therefore synchronized with matching files. Blocks may 
also be removed from the source file. This is useful for handling debug-only content.

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-file-blocks --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-file-blocks');
```

> This plugin is designed for Grunt 0.4 and newer.

## Using the "fileblocks" Task

Follow these steps to use the task. For more details see the [wiki](https://github.com/rrharvey/grunt-file-blocks/wiki).

1. Add block anchors to a source file.
2. Define source files in the Grunfile.js task configuration.
3. Define blocks for each source file.
4. Specify the options that are required for your project.

### Add Block Anchors

Comments define the beginning and end of a [block](https://github.com/rrharvey/grunt-file-blocks/wiki/Blocks) in a [source file](https://github.com/rrharvey/grunt-file-blocks/wiki/Source-Files).


#### Block Syntax
```html
<!-- fileblock:<template> <name> -->
... script / link elements, etc.
<!-- endfileblock -->
```

```js
/* fileblock:<template> <name> */
... JavaScript or TypeScript references.
/* endfilebock */
```
   
#### Example Blocks

```html
<!-- fileblock:other reload -->
    <script src="//localhost:35729/livereload.js"></script>
<!-- endffileblock -->
    
<!-- fileblock:css styles -->
<!-- endfileblock -->

<!-- fileblock:js app -->
<script src="js/services/myService.js"></script>
<script src="js/controllers/mainCtrl.js"></script>
<script src="js/controllers/anotherCtrl.js"></script>
<script src="js/app.js"></script>
<!-- endfileblock -->
```

```js  
/* fileblock:libs */
/// <reference path="libs/somedependency.ts" />
/* endfileblock */
```

### Configure Source Files

One or more [source files](https://github.com/rrharvey/grunt-file-blocks/wiki/Source-Files) must be configured for each Grunt target.

```js
grunt.initConfig({
  fileblocks: {
    dist: {
      /* Configure a single source file */
      src: 'index.html',
      blocks: { /* block definitions */ }
    }
    dev: {
      /* or multiple source files per target. */
      files: [
        { src: 'index.html', blocks: {} }
        { src: 'app/app.ts', blocks: {} }
      ]
    }
  }
})
```

### Define Blocks

Add [block](https://github.com/rrharvey/grunt-file-blocks/wiki/Blocks) configurations for each source file.

```js
/* The blocks object for a source file in the Gruntfile.js configuration file. */
blocks: {
  'libs': { src: 'libs/*.js' },
  'app': { src: 'app/js/*.js' }
}
```

### Configure Options

Configuration [options](https://github.com/rrharvey/grunt-file-blocks/wiki/Options) may be specified to suit your needs. Options can be specified at multiple levels allowing for a great deal of flexibility. 

```js
fileblocks: {
  /* Task options */
  options: {
    templates: {
      md: '+ ${file}' // Add a custom template
    },
    templatesFn: {
      js: function (file) {
        return file.substring(3);
      }
    }
  }
  dist: {
    /* Target options */
    options: {
      removeAnchors: true
    },
    src: 'index.html'
    blocks: { /* block definitions */ }
  },
  dev: {
    files: [
      {
        /* Source file options */
        options: {
          prefix: '~/' 
        },
        src: 'index.html',
        blocks: {
          'libs': { src: '*.js', cwd: 'libs', /* Block options */ prefix: '../libs' }
        }
      },
    ]
  }
}
```

### Existing Lines in Blocks
Blocks can be processed in two ways.

1. Rebuild the block every time using the "rebuild" option.
2. Add and optionally remove lines using the following rules.

If a line is found inside the block that matches the block type template, the file name will be parsed from the content. Existing file names will be compared with those found using the file matching patterns. Files that no longer exist will be removed from the block if the *removeFiles* option is true. New files that are found will be added to the bottom of the list. Existing tags will remain in the same relative position. This allows you to manually change the order of existing scripts or style sheets.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
