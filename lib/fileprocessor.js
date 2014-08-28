'use strict';

var Block = require('./block');
var grunt = require('grunt');
var _ = require('lodash');

var fileReplace = { file: '([^\"]+)' };

var startExp = /(?:<!--|\/\*|\/\/)\s*fileblock:(\w+)\s+(.*?)\s*(?:-->|\*\/)/;
var endExp = /(?:<!--|\/\*|\/\/)\s*endfileblock\s*(?:-->|\*\/)/;
var EOL = '\n';

/**
 * Returns a block configuration for the block with a matching name.
 * @param {string} name - The name of the block.
 * @returns {BlockConfig}
 */
var findConfig = function (configs, name) {
    return _.find(configs, function (n) {
        return n.name === name;
    });
};

/**
 * Convert the template into a RegExp that can capture the file name.
 * @param {string} template
 * @returns {RegExp} A regular expression that can capture the file name.
 */
var getRegExp = function (template) {
    var pattern = _.template(template, fileReplace);
    pattern = pattern.replace(/\//g, '\\/');
    pattern = pattern.replace(/\s+/g, '\\s*');
    pattern = '\\s*' + pattern + '\\s*';
    return new RegExp(pattern);
};

/**
 * Parse the file name from the line if it exists.
 * @param {string} line - A line from the file.
 * @param {Block} block - The replacement block object.
 * @returns {string} The file name if it exists.
 */
var getFileName = function (line, block) {
    if (!block.template) {
        return;
    }

    var regex = getRegExp(block.template);
    var match = regex.exec(line);
    return match ? match[1] : match;
};

/**
 * Processes the content of a File.
 * @param {File}        file    - The file to process.
 */
var FileProcessor = module.exports = function (file) {
    this.file = file;
};

/**
 * Find replacement blocks in the file.
 * @param {BlockConfig[]} configs - An array of block configurations.
 * @returns {Block[]} An array of Block objects.
 */
FileProcessor.prototype.getBlocks = function (configs) {
    var lines = this.file.content.split(/\n/),
        line,
        blocks = [],
        block;

    for (var i = 0; i < lines.length; i++) {
        line = lines[i];

        var start = line.match(startExp);
        if (start) {
            var name = start[2],
                config = findConfig(configs, name);

            block = new Block(name, config);
            block.startAnchor = start[0];
            block.type = start[1];
            //block.template = defaultTemplates[block.type];
            block.indent = (line.match(/^\s*/) || [])[0];

            if (config) {
                block.template = config.template || config.templates[block.type];

                // Custom template fn
                if(typeof config.templatesFn[block.type] === 'function') {
                  block.templateFn = config.templatesFn[block.type];
                }

                block.config = config;
                blocks.push(block);
            } else {
                grunt.verbose.writeln('Found block "' + name + '" that is not defined for this target.');
            }
        }

        if (block) {
            block.lines.push(line);
            var file = getFileName(line, block);
            if (file) {
                block.files.push(file);
            }
        }

        var end = line.match(endExp);
        if (end) {
            if (!block) {
                grunt.warn('Found endfileblock comment without a matching build comment.');
            }

            block.endAnchor = end[0];
            block = null;
        }
    }

    if (block) {
        grunt.warn('Block "' + block.name + '" does not have an endfileblock comment.');
    }

    return blocks;
};

/**
 * Process a replacement block.
 * @param {Block} block
 */
FileProcessor.prototype.processBlock = function (block) {
    var config = block.config,
        indent = block.indent,
        originalContent = block.lines.join(EOL);

    if (block.config.removeBlock) {
        this.replace(originalContent, '');
        return;
    }

    if (!block.template) {
        return;
    }

    var lines = [];
    if (!config.removeAnchors) {
        lines.push(indent + block.startAnchor);
    }

    block.files.forEach(function (file) {

        // Custom template function
        if(block.templateFn) {
          file = block.templateFn.call(this, file);
        }

        var line = _.template(block.template, { 'file': file } );
        lines.push(indent + line);
    });

    if (!config.removeAnchors) {
        lines.push(indent + block.endAnchor);
    }

    this.replace(originalContent, lines.join(EOL));
};

/**
 * Replace a portion of the file contents.
 * @param {string} original - The string to replace.
 * @param {string} replacement - The new text.
 */
FileProcessor.prototype.replace = function (original, replacement) {
    if (!!this.file.content) {
        this.file.content = this.file.content.replace(original, replacement);
    }
};