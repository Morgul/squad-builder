//----------------------------------------------------------------------------------------------------------------------
// Card Crimes Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            js: ['client/**/*.js'],
            less: ['client/less/**/*.less', 'client/**/*.less']
        },
        less: {
            main: {
                options: {
                    paths: ['node_modules/bootstrap/less'],
                    compress: true
                },
                files: {
                    'client/css/squad-builder.min.css': ['<%= project.less %>']
                }
            }
        },
        clean: ["dist"],
        watch: {
            less: {
                files: ['<%= project.less %>'],
                tasks: ['less'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Setup the build task.
    grunt.registerTask('build', ['clean', 'less']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------
