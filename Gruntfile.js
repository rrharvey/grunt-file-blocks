/*
 * grunt-html-prep
 * https://github.com/happyharv/grunt-html-prep
 *
 * Copyright (c) 2013 Ryan Harvey
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
              'Gruntfile.js',
              'tasks/*.js',
              '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Configuration to be run (and then tested).
        htmlprep: {
            options: {
                removeBlock: false,
                removeAnchors: false
            },
            dev: {
                html: 'test/fixtures/sample.html',
                blocks: {
                    'app.js': { src: 'test/fixtures/js/*.js' },
                    'styles.css': { src: ['test/fixtures/css/*.css', 'test/fixtures/*.css'] }
                },
                options: {
                    removeAnchors: false,
                    removeBlock: false
                }
            },
            dist: {
                html: 'test/fixtures/sample.html',
                blocks: {
                    'app.js': { src: 'test/fixtures/js/*.js' },
                    'styles.css': { src: ['test/fixtures/css/*.css', 'test/fixtures/*.css'] },
                    'reload': { removeBlock: true }
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('debug', ['clean', 'htmlprep']);

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'htmlprep', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
