var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var chalk = require('chalk');
var useref = require('gulp-useref');
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


gulp.task('fonts', function(){
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {}))
        .pipe($.print())
        .pipe(gulp.dest('www/fonts'));
})

gulp.task('assets', function(){
    return gulp.src([
        'dev-www/img/**/*',
        'dev-www/modules/**/*.' + '+(json|html)',
        'dev-www/process/**/*.' + '+(json|html)',
        'dev-www/css/fonts/**/*',
        'dev-www/js/vendor/renderjson.js',
        'dev-www/js/themeswitch.js',
        'dev-www/js/index.js',
        'dev-www/app_manifest.json'
        ], {base: 'dev-www/'})
        .pipe(gulp.dest('www/'));
})

gulp.task('cordovaAssets', function(){
    return gulp.src(['config.xml', 'hooks/**/*'], {base: './'})
        .pipe(gulp.dest('dist'))
})

gulp.task('html', function(){
    return gulp.src('dev-www/index.html')
        .pipe($.useref())
        .pipe($.print())
        .pipe(gulp.dest('www/'))
})

gulp.task('build', ['html', 'assets', 'fonts']);
