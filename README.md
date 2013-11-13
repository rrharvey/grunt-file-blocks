# Warning

> This plugin is not ready for production use.

# grunt-html-prep

> Prepares HTML files by inserting or removing elements. Script elements and style sheet links
may be added to an HTML file by placing comment elements that serve as an anchor for insertion. Blocks may 
be also be removed.

This plugin is designed for Grunt 0.4 and newer.

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
In your project's Gruntfile, add a property named `htmlprep` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  htmlprep: {
    dev: {
      html: 'index.html',
      blocks: {
        'app.js': { src: 'app/{,*/}*.js },
        'styles.css': { src: 'app/styles/*.css' }
      }
    },
    dist: {
      html: 'index.html',
      blocks: {
        'app.js': { src: 'app/{,*/}*.js },
        'styles.css': { src: 'app/styles/*.css' },
        'reload': { removeBlock: true }
      },
	  options: {
        dest: 'dist',
        removeAnchors: true
      }
    }
  },
})
```

### Options

All options may be specified at the block, target or task level.

#### options.dest
Type: `String`
Default value: `''`

A destination path prefix for matched files.

#### options.removeAnchors
Type: `Boolean`
Default value: `false`

If true, the HTML comment elements that serve as a block anchor are removed
during processing.

#### options.removeBlock
Type: `Boolean`
Default value: `false`

If true, the entire block, including comment anchors, is removed during 
processing.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
