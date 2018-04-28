var path = require('path');

module.exports = function (grunt) {

    var distPath = "dist/";
    var htmlPath = "src/Angara.Html/";

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
                src: [htmlPath+'Scripts/*.ts'],
                outDir: htmlPath+'Scripts',
                options: {
                    additionalFlags: '--module amd'
                }
            }
        },
        clean: {
            web: [htmlPath+'./.Web/'],
            dist: [distPath]
        },
        copy: {
            deps: {
                expand: true,
                cwd: './node_modules',
                src: [
                    'angara.serializationjs/dist/*.umd.*',
                    'angara.chartjs/dist/*',
                    'angara.tablejs/dist/**/*',
                    'datatables.net-dt/media/css/jquery.dataTables.css',
                    'datatables.net-dt/media/images/*.png',
                    'datatables.net-dt/media/js/jquery.dataTables.js',
                    'interactive-data-display/dist/**/*',
                    'domReady/domReady.js',
                    'jquery/dist/*',
                    'rx/dist/rx.lite.js',
                    'rx/dist/rx.lite.min.js',
                    'rx/dist/rx.lite.map',
                    'require-css/*.js',
                    'jquery-ui/jquery-ui.*js',
                    'jqueryui/jquery-ui.*js',
                    'modernizr/modernizr.*js',
                    'svg.js/dist/*.min.js',
                    'require-css/css.min.js',
                    'file-saver/FileSaver.min.js',
                    'jquery-mousewheel/jquery.mousewheel.js',
                    'requirejs/require.js'
                ],
                dest: htmlPath+'./.Web/'
            },
            styles: {
                expand: true,
                cwd: htmlPath+'./Scripts/',
                src: '*.css',
                dest: htmlPath+'./.Web/'
            },
            scripts: {
                expand: true,
                cwd: htmlPath+'./Scripts/',
                src: ['*.js'],
                dest: htmlPath+'./.Web/'
            },
            dist_scripts: {
                expand: true,
                cwd: htmlPath+'./Scripts/',
                src: ['Angara.Show.js', 'Primitive.js', 'Record.js', 'Seq.js'],
                dest: distPath
            },
            dist_styles: {
                expand: true,
                cwd: htmlPath+'./Scripts/',
                src: ['*.css'],
                dest: distPath
            }
        },
        compress: {
            main: {
                options: {
                    archive: htmlPath+'web.zip',
                    pretty: true
                },
                expand: true,
                cwd: htmlPath+'.Web/',
                src: ['**/*'],
                dest: "."
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

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-tsd');
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask('angara_html_dist', ['clean:dist', 'copy:dist_scripts', 'copy:dist_styles']);
    grunt.registerTask('angara_html', ['clean:web', 'copy:deps', 'tsd', 'ts', 'copy:scripts', 'copy:styles', 'compress', 'angara_html_dist']);
    grunt.registerTask('default', ['angara_html']);
};