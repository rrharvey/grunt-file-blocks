var _ = require('lodash');
var grunt = require('grunt');

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
 */
var Block = module.exports = function (name, config) {
    this.name = name;
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
    var opts = this.config.getExpandOptions();
    var maps = grunt.file.expandMapping(this.config.src, this.config.prefix, opts);
    var files = _.flatten(maps, 'src');

    var previousIdx = _.object(this.files, _.range(this.files.length));
    var currentIdx = _.object(files, _.range(files.length));
    var toRemove = findNotIn(previousIdx, currentIdx);
    var toAdd = findNotIn(currentIdx, previousIdx);

    _.remove(this.files, function (file) {
        return toRemove[file];
    });

    this.files = this.files.concat(_.keys(toAdd));
}

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
    return notIn;
}