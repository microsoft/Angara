var path = require('path');

module.exports = function (grunt) {

    grunt.initConfig({
        bower: {
            install: {
                options: {                   
                    install: true,
                    copy: false,
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
        clean: {
            web: ['./.Web/']
        },
        copy: {
            bower: {
              expand: true,
              cwd: './bower_components',
              src: '**/*',
              dest: './.Web/'  
            },
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-tsd');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-preen');
    grunt.registerTask('prepareWeb', ['bower', 'preen', 'clean:web', 'copy:bower', 'tsd', 'ts', 'copy:scripts', 'copy:styles', 'compress']);
    grunt.registerTask('default', ['prepareWeb']);
};