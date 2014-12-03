/**
 * Created by ioan on 27.11.2014.
 */

// Our wrapper function - required by grunt and its plugins
module.exports = function(grunt) {

    // Load all grunt modules automatically: make sure you have run npm install so our app can find them
    require('load-grunt-tasks')(grunt);

    // Some constants for various paths and files to be used by the task configurations
    var BUILD_DIR = 'build/';
    var BUILD_DIR_JS = 'js/' + BUILD_DIR;
    var BUILD_DIR_CSS = 'css/' + BUILD_DIR;
    var BUILD_DIR_IMG = 'img/' + BUILD_DIR;

    var BUILD_FILE_JS = BUILD_DIR_JS + 'app.js';
    var BUILD_FILE_JS_MIN = BUILD_DIR_JS + 'app.min.js';
    var BUILD_FILE_CSS = BUILD_DIR_CSS + 'style.css';
    var BUILD_FILE_CSS_MIN = BUILD_DIR_CSS + 'style.min.css';

    var SRC_DIR = '';
    var SRC_DIR_JS = SRC_DIR + 'js/';
    var SRC_DIR_CSS = SRC_DIR + 'css/';
    var SRC_FILES_JS = SRC_DIR_JS + '*.js';
    var SRC_FILES_CSS = SRC_DIR_CSS + '*.css';

    grunt.initConfig({

        // Get the configuration info from package.json
        pkg: grunt.file.readJSON('package.json'),

        // Wipe the build directory clean
        clean: {
            build: {
                src: [ BUILD_DIR ]
            },

            stylesheets: {
                src: [ BUILD_DIR_CSS ]
            },

            scripts: {
                src: [ BUILD_DIR_JS ]
            },

            images: {
                src: [ BUILD_DIR_IMG ]
            }
        },

        // Copy files into build directory
        copy: {
            build: {
                cwd: SRC_DIR,
                src: ['**'],
                dest: BUILD_DIR,
                expand: true
            }
        },

        // Configure autoprefixing for compiled output css
        autoprefixer: {
            build: {
                expand: true,
                cwd: BUILD_DIR_CSS,
                src: [ '**/*.css' ],
                dest: BUILD_DIR_CSS
            }
        },

        // Concatenation of all CSS and JS files: this task will only concat files; useful for when in development and debugging as the file will be readable.
        // If some scripts depend upon eachother, make sure to list them here in order rather than just using the '*' wildcard.
        concat: {
            scripts: {
                src: [
                    'js/vendor/*.js', // All JS in the vendor folder
                    'js/plugins.js',  // This specific file
                    'js/main.js'  // This specific file
                ],
                dest: BUILD_FILE_JS

                // src: [BUILD_DIR_JS + '*.js'],
                // dest: BUILD_FILE_JS
            },

            stylesheets: {
                src: [
                    'css/normalize.css',
                    'css/main.css',
                ],
                dest: BUILD_FILE_CSS

                // 'css/build/style.css': [ 'cs/**/*.css']
                // OR
                // src: [BUILD_DIR_CSS + '*.css'],
                // dest: BUILD_FILE_CSS
            }
        },

        // CSS Min, for compressing and concatenating vendor CSS scripts:
        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                //files: {
                  //  BUILD_FILE_CSS: [ BUILD_FILE_CSS ]
                  // BUILD_FILE_CSS_MIN: [BUILD_DIR_CSS + '/**/*.css']
                //}

                src: BUILD_FILE_CSS,
                dest: BUILD_FILE_CSS_MIN
            }
        },

        // Configure jshint to validate js files
        jshint: {
            options: {
                reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
            },

            // when this task is run, lint the Gruntfile and all js files in src
            build: ['GruntFile.js', 'js/main.js']
        },

        // Uglify, for compressing and concatenating JS scripts (own and vendor):
        uglify: {
            build: {
                options: {
                    banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',
                    compress : true,
                    mangle: false,
                    preserveComments : false
                },
                src: BUILD_FILE_JS,
                dest: BUILD_DIR_JS + 'app.min.js'

                // files: { BUILD_FILE_JS: [BUILD_DIR_JS + '*.js'] }
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
                }
            },

            scripts: {
                files: ['js/*.js', '!js/build/**/*.js'],
                tasks: ['scripts'],
                options: {
                    spawn: false,
                }
            }
        }

    });

    grunt.registerTask(
        'stylesheets',
        'Compiles the stylesheets.',
        [ 'autoprefixer', 'concat:stylesheets', 'cssmin' ]
    );

    grunt.registerTask(
        'scripts',
        'Compiles the javascript files.',
        [ 'jshint', 'concat:scripts', 'uglify' ]
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

    // this task will only run the dev configuration
    //grunt.registerTask('dev', ['jshint:dev']);
    // only run production configuration
    //grunt.registerTask('production', ['jshint:production']);
};
