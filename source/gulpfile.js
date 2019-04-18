var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var chalk = require('chalk');
var useref = require('gulp-useref');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');
var argv = require('yargs').argv;
var ts = require('gulp-typescript');
var merge = require('merge2');
var babel = require("gulp-babel");
var $ = gulpLoadPlugins();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var ifElse = require('gulp-if-else');
const mysql = require('mysql');

// var bowerInstall = new Promise(function(resolve,reject){
//     var data = exec('rm -rf dev-www/bower_components ; bower install');
//     data.stdout.on('data',function(data){
//         console.log(data);
//     })
//     data.on('exit', function(code) {
//         resolve('success');
//     });
// })

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
    return del(
        [
            buildDirectory + "/**/*",
            'dev-www/process/config/**/*'
        ]
    )
})

gulp.task('fonts', function(){
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {}))
        .pipe($.print())
        .pipe(gulp.dest(buildDirectory + '/fonts'));
})

gulp.task('assets', ['ts:scripts', 'ts:perdixConfig'], function(){
    var src = [];
    if(argv.segam) {
        src = [
            'dev-www/img/**/*',
            'dev-www/resources/**/*',
            'dev-www/modules/**/*.' + '+(json|html)',
            'dev-www/process/**/*.' + '+(json|html|css)',
            'dev-www/process/config/**/*',
            'dev-www/process/pages/definitions/**/*',
            'dev-www/css/fonts/**/*',
            'dev-www/js/vendor/**/*',
            'dev-www/js/themeswitch.js',
            'dev-www/js/require.js',
            'dev-www/js/index.js',
            'dev-www/tsjs/**/*',
            'dev-www/app_manifest.json'
            ];
    } else {
        src = [
            'dev-www/img/**/*',
            'dev-www/modules/**/*.' + '+(json|html)',
            'dev-www/process/**/*.' + '+(json|html|css)',
            'dev-www/process/config/**/*',
            'dev-www/process/pages/definitions/**/*',
            'dev-www/css/fonts/**/*',
            'dev-www/js/vendor/**/*',
            'dev-www/js/themeswitch.js',
            'dev-www/js/require.js',
            'dev-www/js/index.js',
            'dev-www/tsjs/**/*',
            'dev-www/app_manifest.json'
            ];
    }
    return gulp.src(src , {base: 'dev-www/'})
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
        .pipe($.if(argv.siteCode == 'onholdfortemporary', $.if('*.js', babel({
            "sourceType": "script",
            "presets": [
                ["@babel/preset-env", {
                    "loose": true,
                    "modules": false
                }]
            ],
            "plugins": [
                "transform-es2015-template-literals"
            ]
        }))))
        .pipe($.print())
        .pipe(gulp.dest(buildDirectory))
})

gulp.task('androidManifestUpgrade', function(){
    var version = argv.version;
    var bundleId = argv.bundleId;
    var appName = argv.appName;

    return gulp.src(['./config.xml'])
        .pipe($.print())
        .pipe($.if(argv.apkRequired == 'true',$.cheerio({
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
        })))
        .pipe(gulp.dest("./"));
});

gulp.task('updateLegacyURLInIndex', function(){
    var legacySystemUrl = argv.legacySystemUrl;
    return gulp.src(['./dev-www/integration.html'])
        .pipe($.if(argv.perdix7 == 'true',$.cheerio({
            run: function($, file){
                $("#i7iframe").attr("src",legacySystemUrl)
            }
        })))
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
        .pipe($.if(argv.apkRequired =='true',$.jsonModify({
            key: "version",
            value: versionString
        })))
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

gulp.task('clean:tsPerdixConfig', function(){
    return del(['./dev-www/process/config/**/*']);
})

gulp.task('ts:perdixConfig', ['clean:tsPerdixConfig'], function(){
    return gulp.src('../configuration/ui-process-config/' + argv.siteCode + '/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            module: 'AMD',
            moduleResolution:'node',
            target: "es5",
            experimentalDecorators: true
        }))
        .pipe(gulp.dest('./dev-www/process/config'));
})

gulp.task("clean:tsScripts", function(){
    return del(['./dev-www/tsjs/**/*']);
})
gulp.task('ts:scripts', ['clean:tsScripts'], function() {
    return gulp.src('./dev-www/ts/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            module: 'AMD',
            moduleResolution:'node',
            target: "es5",
            experimentalDecorators: true
        }))
        .pipe(gulp.dest('./dev-www/tsjs'));
});

gulp.task('watch', ['ts:scripts', 'ts:perdixConfig'], function() {
    gulp.watch('dev-www/ts/**/*.ts', ['ts:scripts']);
    gulp.watch('../configuration/ui-process-config/**/*.ts', ['ts:perdixConfig'])
});

gulp.task("resources", function(){
     return gulp.src('dev-www/resources/')
        .pipe(gulp.dest(buildDirectory + '/resources')); 
})
gulp.task('build', ['html', 'assets', 'fonts']);

gulp.task('bower-check',function(){
    ifElse(argv.bower == 'true', function () {
        var bowerInstall = execSync('bower cache clean irf-elements ; bower uninstall irf-elements angular-data-table ; bower install');
        // bowerInstall.stdout.on('data',function(data){
        //     console.log(data);
        // })
        // bowerInstall.stderr.on('err',function(err){
        //     console.log(err);
        // });
        console.log(bowerInstall.toString());
    }, function () {
        exec('grep -o \'irf-common-elements#trunk\' bower.json', function (err, stdout, stderr) {
            var temp = stdout.replace('\n', '').replace('\r', '').toString();
            ifElse(temp == 'irf-common-elements#trunk', function () {
                var bowerInstall = execSync('bower install')
                // bowerInstall.stdout.on('data', function (data) {
                //     console.log(data.toString());
                // bowerInstall.stderr.on('err',function(err){
                //     console.log(err);
                // })
                console.log(bowerInstall.toString());
            }, function () {
                console.log('Skipping bower install...')
            })
        })
    })
})
gulp.task('npm-install',function(){
    makeItWork.then(function(){
        var npmInstall = exec('rm -rf node_modules ; npm install');
        npmInstall.stdout.on('data',function(data){
        console.log(data);
    })
    npmInstall.stderr.on('err',function(err){
        console.log(err);
    })
    // console.log(npmInstall.toString());
    })
    
    
})
gulp.task('prepareAndroid',['appManifestUpdate','androidManifestUpgrade'],function(){
    console.log(argv.apkRequired);
    ifElse(argv.apkRequired == 'true',function(){
        console.log(argv.apkRequired);
        execsync('cp ../../build/env_config/perdix-client__irf-env.js ./www/js/irf-env.js ; rm -rf platforms/ ; rm -rf plugins/ ')
        execsync('ls build.json',function(err,stdout,stderr){
            if (err || stderr)
                return
            exec('rm build.json');
        
        })
        var prepAnd = execsync('cordova platform add android'+argv.CdvAndVersion+ ' ;  mv ../../build/env_config/build-signing.properties ./platforms/android/'+argv.buildMode+'-signing.properties ; mv ../../build/env_config/release-key.keystore ./platforms/android/release-key.keystore ; cordova prepare android ; cordova build android --'+argv.buildMode+' ;  mv source/platforms/android/build/outputs/apk/'+argv.buildMode+'/android-'+argv.buildMode+'.apk generated/'+argv.apkFileName);
        // prepAnd.stdout.on('data',function(data){
        //     console.log(data);
        // })
        // prepAnd.stderr.on('err',function(err){
        //     console.log(err);
        // })
        console.log(preAnd.toString());
    },function(){})
    return true;
})
gulp.task('preparePerdix7',['updateLegacyURLInIndex'],function(){
    ifElse(argv.perdix7 == 'true',function(){
       var result = execSync('cp www/index.html www/index8.html ; cp www/integration.html www/index.html && echo "Peridx & Integration is Success..."' ); 
       console.log(result.toString());
    },function(){})
})
gulp.task('prepareManagement',function(){
    ifElse(argv.cleanManagement == 'true',function(){
        var prepManagement = execSync('cd ../configuration/management/server-ext && rm -rf vendor/ && composer install --ignore-platform-reqs && cd ../../../ && echo "Composer Install is Successfull..."');
        // prepManagement.stdout.on('data',function(data){
        //     console.log(data);
        // })
        // prepManagement.stderr.on('err',function(err){
        //     console.log(err);
        // })
        console.log(prepManagement.toString());
    },function(){
        var prepManagement = execSync('cd ../configuration/management/server-ext && composer install --ignore-platform-reqs && cd ../../../ && pwd && echo "Composer Install is Successfull..."');
        // prepManagement.stdout.on('data',function(data){
        //     console.log(data);
        // })
        // prepManagement.stderr.on('err',function(err){
        //     console.log(err);
        // })
        console.log(prepManagement.toString());
    })  
    return true;
})
gulp.task('prepareRest',['prepareManagement'],function(){
    exec('cd .. && mkdir generated ; cp configuration/"Process Definition JSONs"/Active/'+argv.processJsonDir+'/*.json generated/json ; cp -R configuration/management generated/',function(err,stdout,stderr){
        if (stderr){
            console.log('Error copying Process Json');
            console.log(stderr);
            return;
        }
        if (err){
            console.log(err)
            return;
        }
        if (stdout)
            console.log(stdout);
        console.log('Successfully copied Process json...');
    })
    exec('ls -d ../configuration/smsTemplate/'+argv.smsTemplateDir,function(err,stdout,stderr){
      
        if (stderr){
            console.log('Sms Template dir is not available, Hence Skipping ...')
            console.log(stderr);
            return
        }
        if (err){
            console.log(err);
            return
        }
        exec('cp -R ../configuration/smsTemplate/'+argv.smsTemplateDir+'/smsTemplate.txt ../generated/',function(err,stdout,stderr){
            if (stderr){
                console.log(stderr);
                return
            }
            if (err){
                console.log(err);
                return
            }
        })
    })
    exec('ls -d ../configuration/perdix-server-scripts/'+argv.perdixGroovyDir,function(err,stdout,stderr){
        if (stderr){
            console.log('Groovy Dir is not available, Hence Skipping ...')
            console.log(stderr);
            return
        };
        if (err){
            console.log(err);
            return
        }
        exec('cp -R ../configuration/perdix-server-scripts/'+argv.perdixGroovyDir+' ../generated/perdix-server-scripts',function(err,stdout,stderr){
            if (err){
                console.log(err);
                return
            }
            if (stderr){
                console.log(stderr);
                return
            }
        })
    })
    exec('ls -d ../configuration/awaazde/'+argv.confDirName,function(err,stdout,stderr){
        if (stderr){
            console.log('Awaazde dir is not available, Hence Skipping ...');
            console.log(stderr);
            return
        };
        if (err){
            console.log(err);
            return
        }
        exec('cp -R ../configuration/awaazde/'+argv.confDirName+' ../generated/awaazde',function(err,stdout,stderr){
            if (err){
                console.log(err);
                return
            }
            if (stderr){
                console.log(stderr);
                return
            }
        })
    })
})
gulp.task('prepareConfig',['prepareRest'],function(){
    var prepConfig = exec('cd .. && mv ../build/env_config/perdix-client__irf-env.js generated/perdix-client/js/irf-env.js ; mv ../build/env_config/scoring__ConfigureDbs.php generated/management/scoring/includes/ConfigureDbs.php ; mv ../build/env_config/scoring__db.php generated/management/scoring/includes/db.php ; mv ../build/env_config/user-management__init.php generated/management/user-management/_init.php ; mv ../build/env_config/server-ext__env.env generated/management/server-ext/.env');
    prepConfig.stdout.on('data',function(data){
        console.log(data);
    })
    prepConfig.stderr.on('err',function(err){
        console.log(err);
    })
})
gulp.task('generateZip',['prepareConfig'],function(){
    var generateZip = exec('cd .. && cd generated ; tar -czf build.tar.gz * ; cd .. ; mv generated/build.tar.gz target/');
    generateZip.stdout.on('data',function(data){
        console.log(data);
    })
    generateZip.stderr.on('err',function(err){
        console.log(err);
    })
});
gulp.task('updateApkVersion',function(){
    var connection = mysql.createConnection({
        host:'sit.perdix.co.in',
        user:'ruser',
        password:'pass@123',
        database:'sit_kgfs_financialForms'
    })
    connection.connect();
    connection.query('select * from customer limit 1',function(err,results,fields){
        if (err) throw err;
        console.log(results);
    })
    return true;
});
gulp.task('pacakage',['clean','npm-install','build','prepareAndroid','preparePerdix7','generateZip','updateApkversion'],function(){

})

gulp.task('test',['npm-install','build'],function(){
})