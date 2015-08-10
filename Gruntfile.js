module.exports = function(grunt)
{
	grunt.initConfig({

		ngtemplates:
		{
			default: {
				src: "sections/**/*.html",
				dest: "js/partials.js",
				options: {
					module: "jotc-partials",
					prefix: "jotc/",
					standalone: true
				}
			},
			production: {
				src: "sections/**/*.html",
				dest: "js/partials.js",
				options: {
					module: "jotc-partials",
					prefix: "jotc/",
					standalone: true,
					htmlmin: {
						collapseBooleanAttributes:      true,
						collapseWhitespace:             true,
						removeAttributeQuotes:          true,
						removeComments:                 true,
						removeEmptyAttributes:          true,
						removeRedundantAttributes:      true,
						removeScriptTypeAttributes:     true,
						removeStyleLinkTypeAttributes:  true
					}
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
				files: "sections/**/*.html",
				tasks: [ "ngtemplates:default" ]
			},
			less: {
				files: [ "style/**/*.less", "sections/**/*.less" ],
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
	
	grunt.registerTask("default", [ "wiredep", "less", "ngtemplates:default" ]);
};