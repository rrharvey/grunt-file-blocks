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
                src: 'spec/fixtures/sample.html',
                dest: 'tmp/sample_dev.html'
            }
        },

        // Configuration to be run (and then tested).
        fileblocks: {
            options: {
                removeBlock: false,
                removeAnchors: false,
                removeFiles: false,
                prefix: ''
            },
            dev: {
                options: {
                    prefix: '!!!'
                },
                files: [
                    {
                        options: {
                            prefix: ''
                        },
                        src: ['tmp/sample_dev.html'],
                        blocks: [
                            { name: 'styles', src: 'spec/fixtures/css/*.css' },
                            { name: 'app', src: ['spec/fixtures/js/script1.js', 'spec/fixtures/js/script2.js'], prefix: '~/' }
                        ]
                    },
                    {
                        src: 'spec/fixtures/sample.js',
                        dest: 'tmp/sample_dev.js',
                        blocks: {
                            'references': { src: 'spec/fixtures/js/*.js' }
                        }
                    }
                ]
            },
            dist: {
                options: {
                    removeAnchors: true
                },
                src: 'spec/fixtures/sample.html',
                dest: 'tmp/sample_dist.html',
                blocks: [
                    { name: 'styles', src: ['spec/fixtures/css/*.css'] },
                    { name: 'app', src: ['spec/fixtures/js/script1.js', 'spec/fixtures/js/script2.js'], prefix: '~/' },
                    { name: 'reload', removeBlock: true }
                ]
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('test', ['clean', 'copy', 'fileblocks', 'jasmine_node']);

    grunt.registerTask('default', ['test']);
};
