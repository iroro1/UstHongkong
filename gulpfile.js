"use strict";

var gulp = require("gulp"),
  browserSync = require("browser-sync"),
  del = require("del"),
  uglify = require("gulp-uglify"),
  usemin = require("gulp-usemin"),
  rev = require("gulp-rev"),
  cleanCss = require("gulp-clean-css"),
  flatmap = require("gulp-flatmap"),
  imagemin = require("gulp-imagemin"),
  htmlmin = require("gulp-htmlmin");

gulp.task("browserSync", () => {
  var files = ["./*.html", "./css/*.css", "./img/*.{png,jpg,gif}", "./js/*.js"];

  browserSync.init(files, {
    server: {
      baseDir: "./"
    }
  });
});

gulp.task("clean", () => {
  return del(["dist"]);
});
gulp.task("copyfonts", () => {
  gulp
    .src("./node_modules/fonts/**/*.{ttf,woff,eof,svg}*")
    .pipe(gulp.dest("./dist/fonts"));
});
gulp.task("imagemin", () => {
  return gulp
    .src("img/*.{png,jpg,gif}")
    .pipe(
      imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
    )
    .pipe(gulp.dest("dist/img"));
});
gulp.task("usemin", () => {
  return gulp
    .src("./*.html")
    .pipe(
      flatmap((stream, file) => {
        return stream.pipe(
          usemin({
            css: [rev],
            html: [
              () => {
                htmlmin({
                  collapseWhiteSpace: true
                });
              }
            ],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [cleanCss(), "concat"]
          })
        );
      })
    )
    .pipe(gulp.dest("dist/"));
});

gulp.task("build", ["clean"], () => {
  gulp.start("copyfonts", "imagemin", "usemin");
});
