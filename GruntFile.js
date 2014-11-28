/**
 * Created by ioan on 27.11.2014.
 */

// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function - do grunt-related things in here
module.exports = function(grunt) {

    // Load all grunt modules automagically:
    // make sure you have run npm install so our app can find them
    require('load-grunt-tasks')(grunt);

    // 1. All configuration goes here
    grunt.initConfig({

        // get the configuration info from package.json
        // this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            build: {
                cwd: 'source',
                src: ['**'],
                dest: 'build',
                expand: true
            }
        },

        clean: {
            build: {
                src: [ 'build' ]
            },

            stylesheets: {
                src: [ 'css/build' ]
            },

            scripts: {
                src: [ 'js/build' ]
            },
        },

        autoprefixer: {
            build: {
                expand: true,
                cwd: 'css',
                src: [ '**/*.css' ],
                dest: 'css'
            }
        },

        // Concatenation of all CSS and JS files:
        concat: {
            // 2. Configuration for concatinating files goes here.
            scripts: {
                src: [
                    'js/vendor/*.js', // All JS in the vendor folder
                    'js/plugins.js',  // This specific file
                    'js/main.js'  // This specific file
                ],
                dest: 'js/build/production.js'

                //'build/application.js': [ 'build/**/*.js' ]
            },

            stylesheets: {
                src: [
                    'css/normalize.css',
                    'css/main.css',
                ],
                dest: 'css/build/production.css'

                //'css/build/production.css': [ 'cs/**/*.css'
            }
        },

        // CSS Min, for compressing and concatenating vendor CSS scripts:
        cssmin: {
            build: {
                files: {
                    'css/build/production.min.css': [ 'css/build/**/*.css' ]
                }

                /*src: 'css/build/production.css',
                dest: 'css/build/production.min.css'*/

                /*files: {
                    'tmp/vendor.css' : [
                        'vendor/one/style.css',
                        'vendor/two/style.css',
                    ]
                }*/
            }
        },

        // Uglify, for compressing and concatenating JS scripts (own and vendor):
        uglify: {
            build: {
                options: {
                    mangle: false
                },
                src: 'js/build/production.js',
                dest: 'js/build/production.min.js'

                /*files: {
                    'public/path/to/theme/build/scripts.js' : [
                        'vendor/one/script.js',
                        'vendor/two/script.js',
                        'path/to/theme/js/global.js'
                    ]
                }*/
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.{png,jpg,gif}', '!img/build/**/*.{png,jpg,gif}'],
                    dest: 'img/build/'
                }]
            }
        },

        // Replace parts in some files:
        processhtml: {
            build: {
                files: {
                    'index.html' : ['index.html']
                    /*'path/to/theme/file.php' : ['path/to/theme/file.php']*/
                }
            }
        },

        // Watcher configuration:
        watch: {
            options: {
                livereload: true,
            },

            stylesheets: {
                files: ['css/*.css', '!css/build/**/*.css'],
                tasks: ['stylesheets'],
                options: {
                    spawn: false,
                },
            },

            scripts: {
                files: ['js/*.js', '!js/build/**/*.js'],
                tasks: ['scripts'],
                options: {
                    spawn: false,
                },
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    // make sure you have run npm install so our app can find these
    /*/grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');*/

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask(
        'stylesheets',
        'Compiles the stylesheets.',
        [ 'autoprefixer', 'concat:stylesheets', 'cssmin' ]
    );

    grunt.registerTask(
        'scripts',
        'Compiles the javascript files.',
        [ 'concat:scripts', 'uglify' ]
    );

    grunt.registerTask(
        'build',
        'Build project',
        [ 'clean', 'stylesheets', 'scripts', 'imagemin' ]
    );

    grunt.registerTask(
        'default',
        [ 'build', 'watch' ]
    );
};
