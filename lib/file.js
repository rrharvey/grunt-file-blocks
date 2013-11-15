'use strict';

var EOL = '\n';
var grunt = require('grunt');

/**
 * Handles parsing and text replacements in an HTML file.
 * 
 * @param {string} fileName - The path and name of the file.
 * @property {string} fileName  - The path and name of the file.
 * @property {string} content   - The text content of the file.
 */
var File = module.exports = function (fileName) {
    this.fileName = fileName;
};

/**
 * Load the contents of the file and normalize line feeds.
 * @returns {File} A reference to this file.
 */
File.prototype.load = function () {
    this.content = grunt.file.read(this.fileName).replace(/\r\n/g, EOL);
    return this;
};

/**
 * Save the contents of the file to disk.
 * @param {string} fileName - An alternate location in which to save the file.
 */
File.prototype.save = function (fileName) {
    var content = grunt.util.normalizelf(this.content);
    grunt.file.write(fileName ? fileName : this.fileName, content);
};