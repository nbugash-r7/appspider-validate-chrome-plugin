var path = require('path');
var codePoints = require('./codepoints');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        copy: {
            toDist: {
                files: [
                    {src: ['images/**'], dest: 'dist/'},
                    {src: ['js/legacy/**'], dest: 'dist/', expand: true, cwd: './'},
                    {src: ['locales/**'], dest: 'dist/', expand: true, cwd: './'},
                    {src: ['dist/fonts/**'], dest: 'dist/', expand: true, cwd: './'},

                ]
            },
            wrapFiles: {
                files: [
                    {src: ['js/jsapp/src/wrap/*'], dest: 'temp/wrap/', cwd: './'}
                ]
            }
        },
        webfont: {
            icons: {
                src: 'src/svgs/*.svg',
                // Place output fonts into vendors directory for fonts to be served up from server due
                // to server path re-write logic.
                dest: 'dist/fonts',
                // Place output css in sass directory as a sass partial for integration into sass compilation.
                destCss: 'app/styles',
                options: {
                    font: 'rapid7',
                    rename: function (name) {
                        return path.basename(name).replace('icon-', '');
                    },
                    // Unfortunately fontforge does not currently support windows and node is flaky on sizing icons,
                    // so we are using fontforge
                    skip: require('os').platform() === 'win32',
                    // use partial convention for sass
                    stylesheet: 'scss',
                    // Match font output directory reference in sass/css file.
                    relativeFontPath: '../dist/fonts',
                    template: 'src/webfont-templates/bem.css',
                    codepoints: codePoints
                }
            }
        }
    });
};
