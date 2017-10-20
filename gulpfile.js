var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		bourbon        = require('node-bourbon'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify");
		smartgrid      = require('smart-grid');
		gcmq           = require('gulp-group-css-media-queries');

// Скрипты проекта
gulp.task('scripts', function() {
	return gulp.src([
		'js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: ''
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('sass', function() {
	return gulp.src('sass/**/*.sass')
	.pipe(sass({
		includePaths: bourbon.includePaths
	}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(gcmq())
	.pipe(cleanCSS())
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'scripts', 'browser-sync'], function() {
	gulp.watch('sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'js/common.js'], ['scripts']);
	gulp.watch('*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function() {

	var buildFiles = gulp.src([
		'*.html',
		'.htaccess',
		]).pipe(gulp.dest(''));

	var buildCss = gulp.src([
		'css/main.min.css',
		]).pipe(gulp.dest('./css'));

	var buildJs = gulp.src([
		'js/scripts.min.js',
		]).pipe(gulp.dest('./js'));

	var buildFonts = gulp.src([
		'fonts/**/*',
		]).pipe(gulp.dest('./fonts'));

});

// gulp.task('deploy', function() {

// 	var conn = ftp.create({
// 		host:      'hostname.com',
// 		user:      'username',
// 		password:  'userpassword',
// 		parallel:  10,
// 		log: gutil.log
// 	});

// 	var globs = [
// 	'dist/**',
// 	'dist/.htaccess',
// 	];
// 	return gulp.src(globs, {buffer: false})
// 	.pipe(conn.dest('/path/to/folder/on/server'));

// });

gulp.task('removedist', function() { return del.sync(); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
