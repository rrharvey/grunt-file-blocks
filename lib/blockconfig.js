'use strict';

var _ = require('lodash');

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
 * @property {boolean}          removeFiles     - If true then remove existing lines for files that are no longer found.
 * @property {string|string[]}  src             - Globbing patterns for matching files that will be inserted into the block.
 * @property {string}           prefix          - A prefix that will be added to all matched file paths.
 * @property {string}           cwd             - Patterns will be matched relative to this path, and all returned filepaths will also be relative to this path.
 * @property {boolean}          flatten         - Remove the path component from all matched src files.
 * @property {string}           ext             - Remove anything after (and including) the first "." in the destination path, then append this value.
 * @property {boolean}          matchBase       - Patterns without slashes will match just the basename part. Eg. this makes *.js work like ** /*.js.
 * @property {function}         rename          - If specified, this function will be responsible for returning the final dest filepath. 
 * @property {string}           template        - An optional template that was specified on the block directly.
 * @property {Object<string, string>} templates - The resolved templates. This the final merge of the default templates and those specified
 *                                                at the task, target, and file levels.
 */
var BlockConfig = module.exports = function (name, data, options) {
    this.name = name;

    applyDefaults(this, options);

    // Copy configuration properties from the configuration data.
    _.assign(this, data);

    // Normalize file matching patterns into an array.
    this.src = [];
    if (data.src) {
        if (_.isArray(data.src)) {
            this.src = this.src.concat(data.src);
        }
        else if (_.isPlainObject(data.src)) {
            this.src.push(_.values(data.src));
        } else {
            this.src.push(data.src);
        }
    }
};
