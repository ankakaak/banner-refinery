'use strict';
module.exports = function (grunt) {

    //Properties
    var sourceDirectory = "in";
    var buildDirectory = "build";
    var deployDirectory = "out";

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // show elapsed time at the end
    require('time-grunt')(grunt);

    // Load plugins included in this project
    grunt.loadTasks('plugins');




    grunt.initConfig({

            //Load properties
            pkg: grunt.file.readJSON('package.json'),


            /*****************************************************
             Task:
             CLEAN - Delete resources, clean folders
             */
            clean: {
                all: [buildDirectory, deployDirectory],
                css: [buildDirectory+'/app/css/**/*.css'],
                deploy: [deployDirectory]
            },


            /*****************************************************
             Task:
             SASS - Transpile stylesheets with SCSS
             */
            sass: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: sourceDirectory+'/',
                        src: ['**/*.scss'],
                        dest: buildDirectory+'/',
                        ext: '.css'
                    }]
                }
            },


            /*****************************************************
             Task:
             CSSMIN - Minify stylesheets
             */
            cssmin: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: buildDirectory+'/',
                        src: ['**/*.css'],
                        dest: buildDirectory+'/',
                        ext: '.css'
                    }]
                }
            },


            /*****************************************************
             Task:
             HTMLMIN - Minify and compress HTML files
             */
            htmlmin: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                index: {
                    files: [{
                        expand: true,
                        cwd: deployDirectory,
                        src: '**/*.html',
                        dest: deployDirectory
                    }]
                }
            },

            /*****************************************************
             Task:
             INLINE - Inlines css and JS when href'ed with ?inlineme
             */
            inline: {
                dist: {
                    options:{
                        uglify: true,
                        tag: 'inlineme'
                    },
                    files: [
                        {
                            expand: true,
                            cwd: buildDirectory + '/',
                            src: '**/*.html',
                            dest: deployDirectory,
                            filter: 'isFile'
                        }
                    ]
                }
            },

            /*****************************************************
             Task:
             MANIFEST - Generates a manifest.json in each folder in deploy directory
             */
            manifest: {

                dist: {
                    options:{
                        uglify: false,
                        dest: deployDirectory
                    }
                }

            },

            /*****************************************************
             Task:
             COPY - Copy files from one location to another
             */
            copy: {
                main: {
                    files: [
                        {
                            expand: true,
                            cwd: sourceDirectory + '/',
                            src: '**/*.html',
                            dest: buildDirectory,
                            filter: 'isFile'
                        },
                        {
                            expand: true,
                            cwd: sourceDirectory + '/',
                            src: '**/*.js',
                            dest: buildDirectory,
                            filter: 'isFile'
                        },
                        {
                            expand: true,
                            cwd: sourceDirectory + '/',
                            src: '**/*.css',
                            dest: buildDirectory,
                            filter: 'isFile'
                        }
                    ]
                },
                assets: {
                    files: [
                        {
                            expand: true,
                            cwd: sourceDirectory+'/',
                            src: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.json'],
                            dest: deployDirectory,
                            filter: 'isFile'
                        }
                    ]
                }
            },

            /*****************************************************
             Task:
             Watch - Watches sass, css, html and js files in the source directory
             */
            watch: {
                main: {
                    files: [sourceDirectory+'/**/*.html', sourceDirectory+'/**/*.js', sourceDirectory+'/**/*.css'],
                    tasks: ['default']
                },
                css: {
                    files: sourceDirectory+'/**/*.scss',
                    tasks: ['css', 'inline']
                }
            }


        }
    );




    // BUILD SASS

    grunt.registerTask('css', ['clean:css', 'sass', 'cssmin']);



    // BUILD ALL the things !

    grunt.registerTask('default', ['clean:all', 'copy:main', 'css', 'inline', 'copy:assets', 'manifest', 'htmlmin']);

};