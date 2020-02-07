let gulp = require('gulp')
let sass = require('gulp-sass')
let pug = require('gulp-pug')
let server = require('browser-sync').create()
let cleanCSS = require('gulp-clean-css');

function reload(done) {
  server.reload()
  done()
}

function serve(done) {
  server.init({
    server: {
      baseDir: './build',
      routes: {
        '/public' : 'public',
        '/images': 'public/images'
      }
    }
  })
  done()
}

gulp.task('minify-css', () => {
  return gulp.src('build/styles/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/styles'));
});

// Style
function style(cb) {
  return (
    gulp.src('src/styles/**/*.scss')
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(gulp.dest('build/styles'))
  )
}

// Template
function template(cb) {
  return (
    gulp.src('src/templates/*.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('build'))
  )
}

function watch() {
  gulp.watch('src/styles/**/*.scss', gulp.series(style, reload))
  gulp.watch('src/templates/**/*.pug', gulp.series(template, reload))
}

exports.style = style
exports.template = template
exports.serve = serve
exports.dev = gulp.series(style, template, serve, watch)
