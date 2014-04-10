var _ = require('lodash');
var grunt = require('grunt');

/**
 * Find keys that exist in the specified object that don't exist
 * in the other object.
 */
var findNotIn = function (obj, other) {
    var notIn = {};
    for (var key in obj) {
        if (other[key] === undefined) {
            notIn[key] = true;
        }
    }
    return _.keys(notIn);
};

/**
 * Represents a replacement block in a file. The contents of the block can be modified or the
 * entire block may be removed.
 *
 * @constructor
 *
 * @param{string}           name            - The name of the block.
 * @param {BlockConfig}     config          - The block configuration.
 *
 * @property {string}       name            - The name of the block.
 * @property {BlockConfig}  config          - The block configuration.
 * @property {string}       startAnchor     - The HTML comment that marks the beginning of the block.
 * @property {string}       endAnchor       - The HTML comment that marks the end of the block.
 * @property {string}       type            - Identifies the type of block. e.g. 'js', 'css', 'other'
 * @property {string}       template        - A Lo-Dash template string that determines the content that will be
 *                                            placed in the block for each matching file.
 * @property {string}       indent          - A string that matches the indention of the line at the starting anchor.
 * @property {string[]}     lines           - Each line, including anchors, of the block before processing.
 * @property {string[]}     files           - An array of file names for the block.
 * @property {boolean}      changed         - Set to true if lines were added or removed after calling updateFiles().
 */
var Block = module.exports = function (name, config) {
    this.name = name;
    this.changed = false;
    this.config = config;
    this.type = 'other';
    this.lines = [];
    this.files = [];
};

/**
 * Finds new files for the block using the matching patterns in the configuration.
 * Files that were already in the file but are not found now are removed.
 * Files that aren't already in the block are added at the end of the files array.
 */
Block.prototype.updateFiles = function () {
		var srcFiles = this.config.src.length ? this.config.src : this.files;
    var maps = grunt.file.expandMapping(srcFiles, this.config.prefix, this.config);
    var files = _.flatten(maps, 'dest');

    var previousIdx = _.object(this.files, _.range(this.files.length));
    var currentIdx = _.object(files, _.range(files.length));
    var toRemove = this.config.removeFiles ? findNotIn(previousIdx, currentIdx) : [];
    var toAdd = findNotIn(currentIdx, previousIdx);

    toRemove.forEach(function (file) {
        grunt.verbose.writeln('Removing line for file "' + file + '".');
    });

    toAdd.forEach(function (file) {
        grunt.verbose.writeln('Adding line for file "' + file + '".');
    });

    _.remove(this.files, function (file) {
        var index = _.findIndex(toRemove, function (f) {
            return f === file;
        });
        return index > -1;
    });

    this.files = this.files.concat(toAdd);
    this.changed = (toRemove.length + toAdd.length > 0) || this.config.removeAnchors || this.config.removeBlock;
};

Block.prototype.rebuildFiles = function () {
    var maps = grunt.file.expandMapping(this.config.src, this.config.prefix, this.config);
    this.files = _.flatten(maps, 'dest');
    this.changed = true;
};
