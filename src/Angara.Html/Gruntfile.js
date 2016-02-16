var path = require('path');

module.exports = function (grunt) {

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: './.Web',
                    layout: 'byComponent',
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false
                }
            }
        },
        ts: {
            show: {
                src: ['Scripts/*.ts'],
                outDir: 'Scripts',
                options: {
                    additionalFlags: '--module amd'
                }
            }
        },
        copy: {
            styles: {
                expand: true,
                cwd: './Scripts/',
                src: '*.css',
                dest: './.Web/'
            },
            scripts: {
                expand: true,
                cwd: './Scripts/',
                src: ['*.js'],
                dest: './.Web/'
            },
            'angara.serializationjs': {
                expand: true,
                cwd: './bower_components/angara.serializationjs/dist/',
                src: '*.umd.*',
                dest: './.Web/angara.serializationjs/'

            }
        },
        compress: {
            main: {
                options: {
                    archive: 'web.zip',
                    pretty: true
                },
                expand: true,
                cwd: '.Web/',
                src: ['**/*'],
                dest: '/'
            }
        },
        tsd: {
            refresh: {
                options: {
                    // execute a command
                    command: 'reinstall',

                    //optional: always get from HEAD
                    latest: true,

                    // specify config file
                    config: 'tsd.json',

                    // experimental: options to pass to tsd.API
                    opts: {
                        // props from tsd.Options
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-tsd');
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask('prepareWeb', ['bower', 'tsd', 'copy:angara.serializationjs', 'ts', 'copy:styles', 'copy:scripts', 'compress']);
    grunt.registerTask('default', ['prepareWeb']);
};