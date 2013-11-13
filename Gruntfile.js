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
              'lib/*.js',
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

        copy: {
            dev: {
                src: 'test/fixtures/sample.html',
                dest: 'tmp/sample_dev.html'
            }
        },

        // Configuration to be run (and then tested).
        htmlprep: {
            options: {
                removeBlock: false,
                removeAnchors: false
            },
            dev: {
                html: 'tmp/sample_dev.html',
                blocks: {
                    'app.js': { src: 'test/fixtures/js/*.js', prefix: '~/' },
                    'styles.css': { src: ['test/fixtures/css/*.css', 'test/fixtures/*.css'] },
                    'reload': {}
                },
                options: {
                    removeAnchors: false,
                    removeBlock: false
                }
            },
            dist: {
                html: 'test/fixtures/sample.html',
                dest: 'tmp/sample_dist.html',
                blocks: {
                    'app.js': { src: 'test/fixtures/js/*.js' },
                    'styles.css': { src: ['test/fixtures/css/*.css', 'test/fixtures/*.css'] },
                    'reload': { removeBlock: true }
                },
                options: {
                    removeAnchors: true
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
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'htmlprep', 'nodeunit']);

    grunt.registerTask('default', ['clean', 'copy', 'htmlprep']);
};
