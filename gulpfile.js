var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var gzip = require('gulp-gzip');
var htmlTransform = require('html-transform');
var rewriteUrl = htmlTransform.rewriteUrl;
var stringifyDom = htmlTransform.stringifyDom;

var srcOptions = {base: './'};
var outPath = './out';
var production = process.argv.indexOf('--production') !== -1;

gulp.task('css', function() {
	return gulp.src('./css/*.css', srcOptions)
		.pipe(minifyCSS({processImport: true}))
		.pipe(gulp.dest(outPath))
});

gulp.task('html', ['static'], function(next) {
	return gulp.src('./out/**/*.html')
		.pipe(rewriteUrl(function(url, file, ctx) {
			if (ctx.stats) {
				url = '/-/' + ctx.stats.hash + url;
			}
			return url;
		}))
		.pipe(stringifyDom('xhtml'))
		.pipe(gulp.dest('./out'));
});

gulp.task('full', ['html'], function() {
	return gulp.src('./out/**/*.{html,css,js,ico}')
		.pipe(gzip({
			threshold: '1kb',
			gzipOptions: {level: 7}
		}))
		.pipe(gulp.dest(outPath));
});

gulp.task('watch', function() {
	jsBundler.watch({sourceMap: true, uglify: false});
	gulp.watch('./css/**/*.css', ['css']);
});

gulp.task('static', ['css']);
gulp.task('default', ['static']);
