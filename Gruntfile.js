module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		frontendConfig: {
			srcWebroot: './src/files',
			webroot: './out'
		},

		frontend: {
			main: {
				css: {
					src: './src/files/css',
					dest: './out/c'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-frontend');


	// Default task.
	grunt.registerTask('default', ['frontend']);
};