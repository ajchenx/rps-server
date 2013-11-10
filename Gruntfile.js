/*jslint node:true*/

module.exports = function (grunt) {
    'use strict';

    // project configuration.
    grunt.initConfig({
        compass: {
            dist: {
                options: {
                    sassDir: 'styles',
                    cssDir: 'public/css',
                    environment: 'production'
                }
            }
        },
        jslint: {
            server: {
                src: [
                    'app.js',
                    'lib/*.js',
                    'configs/**/*.js'
                ],
                directives: {
                    node: true,
                    todo: true,
                    nomen: true,
                    predef: [
                        'Object'
                    ]
                }
            },
            client: {
                src: [
                    'public/**/*.js'
                ],
                directives: {
                    browser: true,
                    plusplus: true
                }
            }
        },
        watch: {
            compass: {
                files: ['styles/**/*.scss'],
                tasks: ['compass']
            },
        }
    });

    // load all grunt-* dependenies specified in the package.json
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // default task
    grunt.registerTask('default', ['compass']);

};
