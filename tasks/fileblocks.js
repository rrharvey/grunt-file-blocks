'use strict';

/*
 * grunt-file-blocks
 * https://github.com/rrharvey/grunt-file-blocks
 *
 * Copyright (c) 2013 Ryan Harvey
 * Licensed under the MIT license.
 */

var File = require('../lib/file');
var FileProcessor = require('../lib/fileprocessor');
var BlockConfig = require('../lib/blockconfig');
var grunt = require('grunt');
var _ = require('lodash');

module.exports = function (grunt) {
    var TASKNAME = 'fileblocks';

    /**
     * Normalize and return block configurations from the Gruntfile.
     * @param {Object[]|Object.<string, object>} blocks - The block configurations from the Gruntfile.
     * @returns {BlockConfig[]}
     */
    var getConfigs = function (data, options) {
        var configs = [];

        if (_.isArray(data)) {
            _(data).forEach(function (block) {
                configs.push(new BlockConfig(block.name, block, options));
            });
        } else if (_.isPlainObject(data)) {
            _.forOwn(data, function (value, name) {
                configs.push(new BlockConfig(name, value, options));
            });
        } else {
            grunt.warn('Block configuration must be an array or object.');
        }

        return configs;
    };

    /**
     * Validate the source-destination file mapping.
     * @param {Object} A source-destination file mapping.
     */
    var validateFile = function (file) {
        if (file.src.length > 1) {
            var ignored = file.src.splice(1);
            grunt.log.errorlns('Expected a single source file. Ignoring ' + ignored.join(', ') + '.');
        }

        if (!file.src[0]) {
            grunt.warn('Source files not found for pattern "' + file.orig.src[0] + '".');
        }

        if (!grunt.file.exists(file.src[0])) {
            grunt.warn('Source file ' + file.src[0] + ' not found.');
        }
    };

    grunt.registerMultiTask(TASKNAME, 'Prepares a block in a file by inserting or removing a line (script tag, link, or reference) for each file matching a specified pattern.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var defaultOptions = {
            removeBlock: false,
            removeAnchors: false,
            removeFiles: false,
            rebuild: false,
            templates: {
                'js': '<script src="${file}"></script>',
                'css': '<link href="${file}" rel="stylesheet" />',
                'ref': '/// <reference path="${file}" />',
                'raw': '${file}'
            },
            templatesFn: {}
        };

        var options = _.merge(defaultOptions, this.options());

        this.files.forEach(function (file) {
            validateFile(file);
            var srcPath = file.src[0];
            var destPath = file.dest;

            if (!!!file.blocks){
                grunt.warn('No blocks configured for ' + srcPath);
            }

            // There are blocks are defined
            var targetOpts = _.clone(options);
            _.merge(targetOpts, file.options);
            var configs = getConfigs(file.blocks, targetOpts);

            if (configs.length === 0){
                grunt.warn('No blocks configured for ' + srcPath);
            }

            var srcFile = new File(srcPath).load();
            var processor = new FileProcessor(srcFile);
            var blocks = processor.getBlocks(configs);

            grunt.log.debug('Source file before processing.');
            grunt.log.debug(srcFile.content);

            blocks.forEach(function (block) {

                if (block.config.rebuild) {
                    block.rebuildFiles();
                } else {
                    block.updateFiles();
                }

                processor.processBlock(block);
            });

            grunt.log.debug('Source file after processing.');
            grunt.log.debug(srcFile.content);

            var updatedBlocks = blocks.filter(function (block) {
                return block.changed;
            });

            if (updatedBlocks.length > 0) {
                srcFile.save(destPath);
            }
        });
    });
};
