/**
 * @author Bilal Cinarli
 */

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass : {
            dist: {
                options: {
                    style    : 'compressed',
                    sourcemap: 'auto'
                },
                files  : {
                    './dist/uxrocket-rotator.css': './lib/uxrocket-rotator.scss'
                }
            },
            debug: {

            }
        },
        jshint: {
            files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['lib/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! UX Rocket\n * <%= pkg.name %>\n * <%= pkg.description %>\n * <%= pkg.author %> \n * Build: <%= grunt.template.today("dd-mm-yyyy") %>\n */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            },
            js: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint']
            }
        }
    });

    // Load the plugin that provides the "sass" task.
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Load the plugin that provides the "js" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load the plugin that provides the "watch" task.
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['watch', 'sass', 'jshint', 'concat', 'uglify']);
};