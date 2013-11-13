/*
 * grunt-html-prep
 * https://github.com/happyharv/grunt-html-prep
 *
 * Copyright (c) 2013 Ryan Harvey
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {
    var TASKNAME = 'htmlprep';
    var EOL = '\n';
    var _ = require('lodash');
    var path = require('path');

    var applyDefaults = _.partialRight(_.assign, function (a, b) {
        return typeof a === 'undefined' ? b : a;
    });

    var normalizeBlockConfigs = function (configs, options) {
        _.forOwn(configs, function (c, name) {

            grunt.verbose.writeln();
            grunt.verbose.writeln('Processing htmlprep configuration for "' + name + '"');

            applyDefaults(c, options);

            var opt = { filter: 'isFile' };
            _.extend(opt, _.pick(c, 'cwd', 'flatten', 'ext', 'rename', 'matchBase'));

            var src = [];
            if (c.src) {
                if (_.isObject(c.src)) {
                    src.push(_.values(c.src));
                } else {
                    src.push(c.src);
                }
            }

            c.files = grunt.file.expandMapping(src, c.dest, opt);

            _.flatten(c.files, 'src').forEach(function (f) {
                grunt.verbose.writeln('Found input file "' + f + '"');
            });
        });

        return configs;
    };

    var validateHtmlFile = function (filename) {
        if (!filename) {
            grunt.warn('Html file must be specified using the "html" property.');
        }

        if (!grunt.file.exists(filename)) {
            grunt.warn('Html file "' + filename + '" not found.');
        }

        return filename;
    }

    var findBlocks = function (lines, blocks) {
        var startExp = /<!--\s*build:(\w+)(?:\(([^\)]+)\))?\s*([^\s]+)\s*-->/;
        var endExp = /<!--\s*endbuild\s*-->/;
        var currentBlock;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            var startAnchor = line.match(startExp);
            if (startAnchor) {
                currentBlock = blocks[startAnchor[3]];

                if (!currentBlock) {
                    grunt.verbose.writeln('Found block "' + startAnchor[3] + '" that is not defined for this target.');
                    currentBlock = {};
                }

                currentBlock.name = startAnchor[3];
                currentBlock.startAnchor = startAnchor[0];
                currentBlock.type = startAnchor[1];
                currentBlock.startAnchorLine = i;
                currentBlock.indent = (line.match(/^\s*/) || [])[0];
                currentBlock.lines = [];
            }

            if (currentBlock) {
                currentBlock.lines.push(line);
            }

            var endAnchor = line.match(endExp);
            if (endAnchor) {
                if (!currentBlock) {
                    grunt.warn('Found endbuild comment without a matching build comment.');
                }

                currentBlock.endAnchor = endAnchor[0];
                currentBlock.endAnchorLine = i;
                currentBlock = null;
            }
        }

        if (currentBlock) {
            grunt.warn('Block "' + currentBlock.name + '" does not have an endbuild comment.');
        }
    }

    var processBlockContent = function (block) {
        var templates = {
            js: '<script src="<%= file %>"></script>',
            css: '<link href="<%= file %>" rel="stylesheet" />'
        }, indent = block.indent;

        block.contentOrig = block.lines.join(EOL);

        if (block.removeBlock) {
            block.contentNew = '';
            return block;
        }

        var template = templates[block.type];
        if (!template) {
            return block;
        }

        var newLines = [];
        if (!block.removeAnchors) {
            newLines.push(indent + block.startAnchor);
        }

        var files = _.flatten(block.files, 'dest');
        files.forEach(function (f) {
            newLines.push(indent + grunt.template.process(template, { data: { file: f } }));
        });

        if (!block.removeAnchors) {
            newLines.push(indent + block.endAnchor);
        }

        block.contentNew = newLines.join(EOL);
    }

    grunt.registerMultiTask(TASKNAME, 'Prepares HTML files by inserting or removing elements.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            removeBlock: false,
            removeAnchors: false
        });

        var htmlFileName = validateHtmlFile(this.data.html);
        var blocks = normalizeBlockConfigs(this.data.blocks || [], options);
        var content = grunt.file.read(htmlFileName).replace(/\r\n/g, EOL);
        var lines = content.split(/\n/);
        findBlocks(lines, blocks);

        _.forOwn(blocks, function (block, blockName) {
            processBlockContent(block);

            grunt.log.ok('Processed block "' + blockName + '".');
            content = content.replace(block.contentOrig, block.contentNew);
        })

        content = grunt.util.normalizelf(content);
        var outputFileName = path.join('tmp', htmlFileName);
        grunt.log.ok('Writing file ' + outputFileName);
        grunt.file.write(outputFileName, content);
    });

};
