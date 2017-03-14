var gulp = require('gulp');
var gls = require('gulp-live-server');
var connect = require('gulp-connect');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var dest = 'build';

gulp.task('bowerjs', function() {
    gulp.src(plugins.mainBowerFiles({
        paths: {
            bowerDirectory: './bower_components',
            bowerJson: 'bower.json'
        }
    }))
        .pipe(plugins.filter('**/*.js'))
        .pipe(plugins.concat('main.js'))
        //.pipe(plugins.uglify({mangle:false}))
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('bowercss', function() {
    gulp.src(plugins.mainBowerFiles({
        paths: {
            bowerDirectory: './bower_components',
            bowerJson: 'bower.json'
        }
    }))
        .pipe(plugins.filter('**/*.css'))
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest('dist/public/css'));

});

gulp.task('html', function(){
    gulp.src(['src/client/**/*.html','src/client/index.html'] )
        .pipe(gulp.dest('dist/public/'));
});

gulp.task('lib', function(){
    //used to copy all external js libraries not included in bower
    gulp.src('src/client/js/*.js')
        .pipe(plugins.concat('lib.js'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/lib'));
    gulp.src('src/client/lib/css/*.js')
        .pipe(plugins.concat('lib.css'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/lib'))
});

gulp.task('img', function(){
    gulp.src(['src/client/img/*'])
        .pipe(gulp.dest('dist/public/img'))
    gulp.src(['src/client/img/bg/*'])
        .pipe(gulp.dest('dist/public/img/bg'))

});

gulp.task('config', function(){
    //used to copy any necessary configuration files
    gulp.src(['src/client/configuration/**/*.json'])
        .pipe(gulp.dest('dist/public/configuration'));

});

gulp.task('css', function(){
    //all site css is referenced in this folder.  Copies to build directory
    gulp.src(['src/client/css/*'])
        .pipe(gulp.dest('dist/public/css'))
});

gulp.task('clean', function(){
    //cleans all contents from the dist directory
    gulp.src('dist')
        .pipe(plugins.clean())
});

gulp.task('lint', function(){
    //using default stylish linter
    gulp.src(['src/client/app/*.js', 'src/client/app/**/*.js'])
        .pipe(plugins.jslint())
        .pipe(plugins.jslint.reporter( 'stylish' ))
});

gulp.task('hint', function(){
    //uses default js hint
    gulp.src(['src/client/app/*.js', 'src/client/app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter( 'default' ))
});

gulp.task('modules', function(){
    //combines all angular controllers, directives, services and modules into a single js file called modules.js.  Concats in order.
    gulp.src(['src/client/app/app.js',
        'src/client/router.js',
        'src/client/models/*.js',
        'src/client/services/*/js',
        'src/client/app/**/*.js',
        'src/client/app/**/**/*.js'])
        .pipe(plugins.concat('modules.js'))
        .pipe(plugins.uglify({mangle: false}))
        .pipe(gulp.dest('dist/public/js'))
});
gulp.task('server', function(){
    //used to copy server elements from the source directory along with index.js
    gulp.src(['src/server/**/*.js'])
        .pipe(gulp.dest('dist/server'));
    gulp.src(['src/index.js'])
        .pipe(gulp.dest('dist'))
});


gulp.task('build', ['bowerjs','bowercss', 'html', 'modules', 'server', 'lib', 'css', 'img', 'config', 'webserver'], function(){
    console.log("building")
});

gulp.task('webserver', function() {
    var server = gls.new('./dist/index.js');
    return server.start();
});

gulp.task('default', ['build'], function(){
    plugins.watch(['src/client/app/**/*.js', 'src/client/app/**/*.html', 'src/client/app/**/*.css', 'src/client/app/*.js'],['build'])
});
