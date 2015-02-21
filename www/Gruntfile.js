module.exports = function(grunt)
{
	grunt.initConfig({

		ngtemplates:
		{
			default: {
				src: "partials/**/*.html",
				dest: "js/partials.js",
				options: {
					module: "jotc-partials",
					prefix: "jotc/",
					standalone: true
				}
			}
		},

		wiredep: {
			default: {
				src: [ "index.html" ]
			}
		},
		
		less: {
			default: {
				files: {
					"style/main.css": "style/main.less"
				}
			}
		},
		
		watch: {
			partials: {
				files: "partials/**/*.html",
				tasks: [ "ngtemplates" ]
			},
			less: {
				files: "style/**/*.less",
				tasks: [ "less" ]
			},
			css: {
				files: "style/main.css",
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask("default", [ "wiredep", "less", "ngtemplates" ]);
};