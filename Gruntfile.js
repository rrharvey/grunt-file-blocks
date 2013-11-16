/*
 * grunt-file-blocks
 * https://github.com/rrharvey/grunt-file-blocks
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
        fileblocks: {
            options: {
                removeBlock: false,
                removeAnchors: false
            },
            dev: {
                files: [
                    {
                        src: ['tmp/sample_dev.html'],
                        blocks: [
                            { name: 'styles', src: 'test/fixtures/css/*.css' },
                            { name: 'app', src: ['test/fixtures/js/script1.js', 'test/fixtures/js/script2.js'], prefix: '~/' }
                        ]
                    },
                    {
                        src: 'test/fixtures/sample.js',
                        dest: 'tmp/sample_dev.js',
                        blocks: {
                            'references': { src: 'test/fixtures/js/*.js' }
                        }
                    }
                ]
            },
            dist: {
                options: {
                    removeAnchors: true
                },
                src: 'test/fixtures/sample.html',
                dest: 'tmp/sample_dist.html',
                blocks: [
                    { name: 'styles', src: ['test/fixtures/css/*.css'] },
                    { name: 'app', src: ['test/fixtures/js/script1.js', 'test/fixtures/js/script2.js'], prefix: '~/' },
                    { name: 'reload', removeBlock: true }
                ]
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
