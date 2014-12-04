/**
 * Created by ioan on 27.11.2014.
 */

// Our wrapper function - required by grunt and its plugins
module.exports = function(grunt) {

    // Load all grunt modules automatically: make sure you have run npm install so our app can find them
    require('load-grunt-tasks')(grunt);

    // Some constants for various paths and files to be used by the task configurations
    var BUILD_DIR = 'build/';
    var BUILD_DIR_JS = BUILD_DIR + 'js/';
    var BUILD_DIR_CSS = BUILD_DIR + 'css/';
    var BUILD_DIR_IMG = BUILD_DIR + 'img/';

    var BUILD_FILE_JS = BUILD_DIR_JS + 'app.js';
    var BUILD_FILE_JS_MIN = BUILD_DIR_JS + 'app.min.js';
    var BUILD_FILE_CSS = BUILD_DIR_CSS + 'style.css';
    var BUILD_FILE_CSS_MIN = BUILD_DIR_CSS + 'style.min.css';

    var BUILD_FILE_PROCESS = BUILD_DIR + 'index.html';

    var SRC_DIR = 'src/';
    var SRC_DIR_JS = SRC_DIR + 'js/';
    var SRC_DIR_CSS = SRC_DIR + 'css/';
    var SRC_DIR_IMG = SRC_DIR + 'img/';
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
                src: [ BUILD_DIR_CSS + '**/*.css', '!' + BUILD_FILE_CSS, '!' + BUILD_FILE_CSS_MIN ]
            },

            scripts: {
                src: [ BUILD_DIR_JS + '**/*.js', '!' +  BUILD_FILE_JS, '!' + BUILD_FILE_JS_MIN ]
            },

            images: {
                src: [ BUILD_DIR_IMG ]
            }
        },

        // Copy files into build directory
        copy: {
            build: {
                cwd: SRC_DIR,
                src: ['**', '!index.html.dist'],
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
                    BUILD_DIR_JS + 'vendor/*.js', // All JS in the vendor folder
                    BUILD_DIR_JS + 'plugins.js',  // This specific file
                    BUILD_DIR_JS + 'main.js'  // This specific file
                ],
                dest: BUILD_FILE_JS
            },

            stylesheets: {
                src: [
                    BUILD_DIR_CSS + 'normalize.css',
                    BUILD_DIR_CSS + 'main.css',
                ],
                dest: BUILD_FILE_CSS
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
            build: ['GruntFile.js', BUILD_DIR_JS + 'main.js']
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
                dest: BUILD_FILE_JS_MIN

                // files: { BUILD_FILE_JS_MIN: [ BUILD_DIR_JS + '*.js' ] }
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: BUILD_DIR_IMG,
                    src: [ '**/*.{png,jpg,gif}' ],
                    dest: BUILD_DIR_IMG
                }]
            }
        },

        // Replace parts in some files:
        processhtml: {
            build: {
                files: {
                    'build/index.html' : [ 'build/index.html' ]
                }
            }
        },

        // Watcher configuration:
        watch: {
            stylesheets: {
                files: [ SRC_DIR_CSS + '**/*.css' ],
                tasks: [ 'stylesheets' ],
                options: {
                    spawn: false
                }
            },

            scripts: {
                files: [ SRC_DIR_JS + '**/*.js' ],
                tasks: ['scripts'],
                options: {
                    spawn: false
                }
            },

            images: {
                files: [ SRC_DIR_IMG + '**/*.{png,jpg,gif}' ],
                tasks: ['imagemin'],
                options: {
                    spawn: false,
                }
            },

            copy: {
                files: [ SRC_DIR + '**' ],
                tasks: [ 'copy' ]
            }
        }
    });

    grunt.registerTask('stylesheets', 'Compiles the stylesheets.',
        [ 'autoprefixer', 'concat:stylesheets', 'cssmin', 'clean:stylesheets' ]
    );

    grunt.registerTask('scripts', 'Compiles the javascript files.',
        [ 'jshint', 'concat:scripts', 'uglify', 'clean:scripts' ]
    );

    grunt.registerTask('build', 'Run production configuration',
        [ 'clean:build', 'copy:build', 'stylesheets', 'scripts', 'imagemin', 'processhtml' ]
    );

    grunt.registerTask('default',
        [ 'build', 'watch' ]
    );
};
