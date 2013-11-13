'use strict';

/*
 * grunt-html-prep
 * https://github.com/happyharv/grunt-html-prep
 *
 * Copyright (c) 2013 Ryan Harvey
 * Licensed under the MIT license.
 */

var File = require('../lib/file');
var FileProcessor = require('../lib/fileprocessor');
var BlockConfig = require('../lib/blockconfig');
var grunt = require('grunt');
var _ = require('lodash');

var validateHtmlFile = function (filename) {
    if (!filename) {
        grunt.warn('Html file must be specified using the "html" property.');
    }

    if (!grunt.file.exists(filename)) {
        grunt.warn('Html file "' + filename + '" not found.');
    }

    return filename;
};

module.exports = function (grunt) {
    var TASKNAME = 'htmlprep';

    /**
     * Normalize and return block configurations from the Gruntfile.
     * @param {Object.<string, object>} blocks - The blocks configuration object from the Gruntfile.
     * @returns {BlockConfig[]} 
     */
    var getConfigs = function (data, options) {
        var configs = [];
        _.forOwn(data, function (value, name) {
            configs.push(new BlockConfig(name, value, options));
        });
        return configs;
    };
    
    grunt.registerMultiTask('htmlprep', 'Prepares HTML files by inserting or removing elements.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            removeBlock: false,
            removeAnchors: false
        });
        
        var htmlFileName = validateHtmlFile(this.data.html);

        var file = new File(htmlFileName);
        file.read();

        var configs = getConfigs(this.data.blocks || [], options);

        var processor = new FileProcessor(file);
        var blocks = processor.getBlocks(configs);

        grunt.log.debug(file.content);

        blocks.forEach(function (block) {
            block.updateFiles();
            processor.processBlock(block);
        });

        grunt.log.debug(file.content);

        file.save(this.data.dest);
    });
};
