module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        mochaTest: {
            src: ['src/*.spec.js'],
            options: {
                reporter: 'spec'
            }
        },
        jshint: {
            options: {
                globals: {
                    jQuery: true,
                    expect: true
                },
                force: true,
                mocha: true,
                node: true,
                browser: true,
                expr: true
            },
            files: ['src/**/*.js', 'test/**/*.js']
        }
    });

    grunt.registerTask('default', ['mochaTest']);

};