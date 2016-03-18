/**
 * Created by nbugash on 03/03/16.
 */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jsFiles = ['*.js', 'server/*.js', 'chrome-plugin/js/*.js', 'chrome-plugin/js/plugin/*.js'];

gulp.task('styles', function () {
	return gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {
			verbose: true
		}))
		.pipe(jscs());
});

gulp.task('inject validate', function () {
	var wiredep = require('wiredep').stream;
	var inject = require('gulp-inject');

	var injectSrc = gulp.src(['./chrome-plugin/css/validate/*.css', './chrome-plugin/js/validate/*.js'], { read: false });
	var injectOptions = {
		ignorePath: 'chrome-plugin'
	};
	var options = {
		bowerJson: require('./bower.json'),
		directory: './chrome-plugin/vendor'
	};

	return gulp.src('./chrome-plugin/validate.html')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./chrome-plugin'));
});

gulp.task('inject plugin', function () {
	var wiredep = require('wiredep').stream;
	var inject = require('gulp-inject');

	var injectSrc = gulp.src(['./chrome-plugin/css/plugin/*.css', './chrome-plugin/js/plugin/*.js'], { read: false });
	var injectOptions = {
		ignorePath: 'chrome-plugin'
	};
	var options = {
		bowerJson: require('./bower.json'),
		directory: './chrome-plugin/vendor'
	};

	return gulp.src('./chrome-plugin/plugin.html')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./chrome-plugin'));
});


gulp.task('inject cookies', function () {
	var wiredep = require('wiredep').stream;
	var inject = require('gulp-inject');

	var injectSrc = gulp.src(['./chrome-plugin/css/cookies/*.css', './chrome-plugin/js/cookies/*.js'], {read: false});
	var injectOptions = {
		ignorePath: 'chrome-plugin'
	};
	var options = {
		bowerJson: require('./bower.json'),
		directory: './chrome-plugin/vendor'
	};

	return gulp.src('./chrome-plugin/cookies.html')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./chrome-plugin'));
});