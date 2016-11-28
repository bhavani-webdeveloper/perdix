var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var chalk = require('chalk');
var useref = require('gulp-useref');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

var buildDirectory = "www";


gulp.task('bower', function () {
    var bowerJson = require('./bower.json');
    process.chdir('dev-www/');
    gulp.src(['./index.html', './view.html', './customer-search.html'])
        .pipe(wiredep({
            bowerJson: bowerJson,
            directory: 'bower_components',
            onFileUpdated: function(filePath){
                console.log(chalk.green.bold("Updated: ") + chalk.black(filePath));
            }
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('clean', function(){
    return del([
            buildDirectory + "/**/*"
        ])
})

gulp.task('fonts', function(){
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {}))
        .pipe($.print())
        .pipe(gulp.dest(buildDirectory + '/fonts'));
})

gulp.task('assets', function(){
    return gulp.src([
        'dev-www/img/**/*',
        'dev-www/modules/**/*.' + '+(json|html)',
        'dev-www/process/**/*.' + '+(json|html|css)',
        'dev-www/css/fonts/**/*',
        'dev-www/js/vendor/renderjson.js',
        'dev-www/js/themeswitch.js',
        'dev-www/js/index.js',
        'dev-www/app_manifest.json'
        ], {base: 'dev-www/'})
        .pipe(gulp.dest(buildDirectory));
})

gulp.task('cordovaAssets', function(){
    return gulp.src(['config.xml', 'hooks/**/*'], {base: './'})
        .pipe(gulp.dest('dist'))
})

gulp.task('html', function(){
    return gulp.src('dev-www/index.html')
        .pipe($.useref())
        .pipe($.if('*.js', $.rev()))
        .pipe($.if('*.css', $.rev()))
        .pipe($.revReplace())
        .pipe($.print())
        .pipe(gulp.dest(buildDirectory))
})

gulp.task('build', ['html', 'assets', 'fonts']);

