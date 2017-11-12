var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var chalk = require('chalk');
var useref = require('gulp-useref');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');
var argv = require('yargs').argv;
var ts = require('gulp-typescript');
var merge = require('merge2');
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
    gulp.src(['./index.html'])
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
        'dev-www/process/pages/definitions/**/*',
        'dev-www/css/fonts/**/*',
        'dev-www/js/vendor/renderjson.js',
        'dev-www/js/themeswitch.js',
        'dev-www/js/require.js',
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
    gulp.src(['!dev-www/index.html', 'dev-www/*.+(json|js|html)']).pipe(gulp.dest(buildDirectory));
    return gulp.src('dev-www/index.html')
        .pipe($.inject(gulp.src('dev-www/css/irf-custom.' + argv.siteCode + '.css'), {relative: true}))
        .pipe($.inject(gulp.src('dev-www/js/irf-config.' + argv.siteCode + '.js'), {relative: true}))
        .pipe($.useref())
        .pipe($.if('*.js', $.rev()))
        .pipe($.if('*.css', $.rev()))
        .pipe($.revReplace())
        .pipe($.print())
        .pipe(gulp.dest(buildDirectory))
})

gulp.task('androidManifestUpgrade', function(){
    var version = argv.version;
    var bundleId = argv.bundleId;
    var appName = argv.appName;

    return gulp.src(['./config.xml'])
        .pipe($.print())
        .pipe($.cheerio({
            run: function($, file){
                console.log("Updating version to " + version);
                console.log("Updating bundleId to " + bundleId);
                console.log("Updating name to " + appName);
                $("widget").attr("version", version);
                $("widget").attr("id", bundleId);
                $("widget>name").text(appName);
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(gulp.dest("./"));
});

gulp.task('updateLegacyURLInIndex', function(){
    var legacySystemUrl = argv.legacySystemUrl;
    return gulp.src(['./dev-www/integration.html'])
        .pipe($.cheerio({
            run: function($, file){
                console.log(file);
                $("#i7iframe").attr("src",legacySystemUrl)
            }
        }))
        .pipe(gulp.dest("./dev-www/"))
})

gulp.task('updateLegacyURLInConfig', function(){
    var legacySystemUrl = argv.legacySystemUrl;
    return gulp.src(['./config.xml'])
        .pipe($.cheerio({
            run: function($, file){
                $("content").attr("src", legacySystemUrl);
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(gulp.dest("./"));
})

gulp.task('appManifestUpdate', function(){
    var versionPostfix = argv.versionPostFix || 'perdix';
    var version = argv.version;
    var versionString = "v" + version + "-" + versionPostfix;
    var sql = "update `global_settings` set `value` = '" + versionString + "' where `name` = 'cordova.latest_apk_version';";
    console.log("SQL to update version is ::: " + sql);
    return gulp.src(['./dev-www/app_manifest.json'])
        .pipe($.jsonModify({
            key: "version",
            value: versionString
        }))
        .pipe(gulp.dest('./dev-www/'));
})

gulp.task('generateBuildMetaFile', function(){
    var versionPostfix = argv.versionPostfix;
    var version = argv.version;
    var environment = argv.environment;
    var svnRevision = argv.svnRevision;
    var svnURL = argv.svnURL;
    var appName = argv.appName;
    var bundleId = argv.bundleId;
    var currTime = new Date();
    var str = version + "\t" + appName + "\t" + bundleId + "\t" + currTime.toISOString() + "\t" + svnURL + "\t" + svnRevision;
    return gulp.file('VERSION', str, {src: true})
})


var tsProject = ts.createProject({
    declaration: true,
    out: 'dev-www/domain/run.js'
});

gulp.task('ts:scripts', function() {
    // var tsResult = gulp.src('dev-www/domain/entites/*.ts')
    //     .pipe(tsProject());

    // return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
    //     tsResult.dts.pipe(gulp.dest('dev-www/domain')),
    //     tsResult.js.pipe(gulp.dest('dev-www/domain/js'))
    // ]);
    return gulp.src('./dev-www/domain/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            module: 'AMD',

            experimentalDecorators: true
        }))
        .pipe(gulp.dest('./dev-www/domain/js'));
});

gulp.task('watch', ['ts:scripts'], function() {
    gulp.watch('dev-www/domain/**/*.ts', ['ts:scripts']);
});

gulp.task('build', ['html', 'assets', 'fonts']);

