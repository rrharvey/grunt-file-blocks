'use strict';

var _ = require('lodash');
var expandProps = ['cwd', 'flatten', 'ext', 'rename', 'matchBase'];

var applyDefaults = _.partialRight(_.assign, function (a, b) {
    return typeof a === 'undefined' ? b : a;
});

/**
 * Configuration for a replacement block.
 * @constructor
 * @param {string}              name            - The block's name.
 * @param {object}              data            - Configuration data from Grunfile.js.
 * @param {object}              options         - Default options from the Grunt target or task.
 * @property {boolean}          removeBlock     - If true the entire block, including HTML comment anchors, will be removed.
 * @property {boolean}          removeAnchors   - If true the HTML comment anchors will be removed.
 * @property {string|string[]}  src             - Globbing patterns for matching files that will be inserted into the block.
 * @property {string}           prefix          - A prefix that will be added to all matched file paths.
 * @property {string}           cwd             - Patterns will be matched relative to this path, and all returned filepaths will also be relative to this path.
 * @property {boolean}          flatten         - Remove the path component from all matched src files.
 * @property {string}           ext             - Remove anything after (and including) the first "." in the destination path, then append this value.
 * @property {boolean}          matchBase       - Patterns without slashes will match just the basename part. Eg. this makes *.js work like ** /*.js.
 * @property {function}         rename          - If specified, this function will be responsible for returning the final dest filepath. 
 */
var BlockConfig = module.exports = function (name, data, options) {
    this.name = name;

    applyDefaults(this, options);

    // Copy configuration properties from the configuration data.
    _.assign(this, data);

    // Normalize file matching patterns into an array.
    this.src = [];
    if (data.src) {
        if (_.isObject(data.src)) {
            this.src.push(_.values(data.src));
        } else {
            this.src.push(data.src);
        }
    }
};

/**
 * Get configuration options for grunt.file.expand.
 * @returns {object}
 */
BlockConfig.prototype.getExpandOptions = function () {
    var opts = { filter: 'isFile' };
    _.extend(opts, _.pick(this, expandProps));
    return opts;
}
