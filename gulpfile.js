var gulp = require("gulp");
var autoprefixer = require("gulp-autoprefixer"); // add css prefixes
var bootlint  = require('gulp-bootlint');  //bootstrap lint
var cleanCSS = require("gulp-clean-css"); // minify css
var concat = require("gulp-concat"); //concatenate files
var del = require('del');  //delete files note this is an npm module
var plumber = require("gulp-plumber"); // gulp error handling
var plumberNotifier = require("gulp-plumber-notifier"); // gulp error notification
var rename = require("gulp-rename");  //rename files
var uglify = require("gulp-uglify"); // minify js



/*=========================================
=====     Begin CSS processing        =====
===========================================*/
/* 01 Delete files before processing current files */
gulp.task("css-delete-build", function () {
  console.log("css task 01: css-delete-build");
  return del([
    // here we use a globbing pattern to delete everything inside the `build` folder
    'build/css/**/*',
  ]);
});


// 02 CSS autoprefix
// input         : "css/*.css"
// output folder : "build/css/01-autoprefix"
// dependency on : "css-delete-build"
gulp.task("css-autoprefix", function(){
    console.log("css task 02: css-autoprefix");
    gulp.src("css/*.css")
    .pipe(plumber())
    .pipe(plumberNotifier())
    .pipe(autoprefixer({
        browsers: ["last 4 versions"],
        cascade: false
    }))
    .pipe(gulp.dest("build/css/01-autoprefix"));
});

// 03 CSS Concatenate
// input folder:  "build/css/01-autoprefix"
// output folder: "build/css/02-concatenate/"
// Need to figureout bootstrap carousel when I use the minified version of the file the glyphs don't show up
gulp.task("css-concat", function() {
  console.log("css task 03: css-concat");
  return gulp.src
	([ "build/css/01-autoprefix/bootstrap-theme-3.3.7.min.css"
   , "build/css/01-autoprefix/fonts.css"
   , "build/css/01-autoprefix/navbar.css"
   , "build/css/01-autoprefix/common-content.css"
   , "build/css/01-autoprefix/resume.css"
   , "build/css/01-autoprefix/responsive.css"
   , "build/css/01-autoprefix/net.css"
   , "build/css/01-autoprefix/contact.css"
   , "build/css/01-autoprefix/styles.css"
   , "build/css/01-autoprefix/viewports.css"   ])
    .pipe(plumber())
    .pipe(plumberNotifier())
    .pipe(concat("css-concat.css"))
    .pipe(gulp.dest("build/css/02-concatenate/"));
});


// 04 CSS Minify
// input:  "build/css/02-concatenate/*.css"
// output: "build/css/03-minify"
//minify converted scss => css files
gulp.task("css-minify", function() {
  console.log("css task 04: css-minify");
    return gulp.src("build/css/02-concatenate/*.css")
        .pipe(plumber())
        .pipe(plumberNotifier())
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest("build/css/03-minify/"));
});


// 05 rename via css file and
// move file to output directory asset/css
gulp.task("css-rename", function() {
  console.log("css task 05: css-rename");
  return gulp.src("build/css/03-minify/css-concat.css")
   .pipe(rename("site.css"))
   .pipe(gulp.dest("assets/css/"));
});


/*=========================================
=====        CSS Processing           =====
===========================================
1.  "css-delete-build"
2.  "css-autoprefix"
3.  "css-concat"
4.  "css-minify"
5.  "css-rename"
===========================================
=====       End CSS processing        =====
=========================================*/
