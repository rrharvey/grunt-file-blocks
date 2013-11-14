# grunt-html-prep

Prepares HTML files by inserting or removing content. Replacement blocks are identified by placing HTML comment elements that identify the beginning and end of the block.

> This plugin is designed for Grunt 0.4 and newer.

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install /path/to/grunt-html-prep --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html-prep');
```

## The "htmlprep" task

### Overview
Replacement blocks are identified in the source HTML file by using comment elements. 
These comments serve as anchors that mark the beginning and end of the block. 
Script or link tags will be inserted or removed inside the block for each file that is found 
using file matching patterns. Tags are therefore synchronized with matching files. Blocks may 
also be removed from the HTML file. This is useful for handling debug-only scripts.

### Blocks

#### Block HTML Syntax

```html
<!-- build:<type>(alternate search path) name -->
... script / link elements, etc.
<!-- endbuild -->
```
 
__type__: `js`, `css`, or `other`

__alternate search path__: (optional) This is unused by the __htmlprep__ task. 

__name__: The block name.  

#### Example Blocks

```html
<!-- build:other reload -->
    <script src="//localhost:35729/livereload.js"></script>
<!-- endbuild -->
    
<!-- build:css styles -->
<!-- endbuild -->

<!-- build:js app -->
<script src="js/services/myService.js"></script>
<script src="js/controllers/mainCtrl.js"></script>
<script src="js/controllers/anotherCtrl.js"></script>
<script src="js/app.js"></script>
<!-- endbuild -->
```

#### Block Templates
Each matching file name is applied to a template based on the block type. The resulting string is added as a line in the block.

##### Block Type
__js__: `<script src="<%= file %>"></script>`

__css__ : `<link href="<%= file %>" rel="stylesheet" />`

__other__: _none_, block content will not be modified

#### Existing Tags in Blocks
If a line is found inside the block that matches the block type template, the file name will be parsed from the content. 
Existing file names will be compared with those found using the file matching patterns. 
Files that no longer exist will be removed from the block. 
New files that are found will be added to the bottom of the list of tags. 
Existing tags will remain in the same relative position. This allows you to manually set the order of existing script or style sheet tags and
maintain that order over subsequent runs.

### Task Configuration

In order to complete the configuration the blocks must be added to the task configuration.

```js
grunt.initConfig({
  htmlprep: {
    options: {
      removeBlock: false,
      removeAnchors: false
    },
    dev: {
      html: 'index.html',
      blocks: {
        'app': { src: 'app/{,*/}*.js },
        'styles': { src: 'app/styles/*.css' }
      }
    },
    dist: {
      html: 'index.html',
      dest: 'dist/index.html',
      blocks: {
        'app': { src: 'app/{,*/}*.js },
        'styles': { src: 'app/styles/*.css' },
        'reload': { removeBlock: true }
      },
      options: {
        removeAnchors: true
      }
    }
  },
})
```

### Options

All options may be specified at the task, target or block level.

#### removeAnchors
Type: `Boolean`
Default value: `false`

If true, the HTML comment elements that serve as a block anchor are removed
during processing.

#### removeBlock
Type: `Boolean`
Default value: `false`

If true, the entire block, including comment anchors, is removed during 
processing.

### Target Properties
#### html
Type: `String`

Specifies the name of the source html file.

#### dest (optional)
Type: `String`

Specifies the name of the destination file. If this property is omitted the source file will be modified in place.

#### blocks
Type: `Object`

A blocks configuration object.

### Block Configuration

A block configuration specifies file matching patterns. The configuration may also override options from the task or target.

#### Property Names (Keys)
Must match the name of a block in the HTML file.

#### src
Type: `String|String[]`
File [globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) used to find source files.

#### prefix
Type: `String`
A prefix that will be added to each matched file name.

i.e. prefix: '~/' Adds a tilde slash path resolver for ASP.NET MVC sites.

### Advanced Block Configuration Properties
The *cwd*, *flatten*, *ext*, *rename*, and *matchBase* options may be added to a block configuration object in order to [build the files list dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
