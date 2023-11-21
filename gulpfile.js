import pkg from 'gulp';
const { src, dest, watch, series, parallel } = pkg;

//THIS IS THE BEST,  probaj sutra opet nppm initi, obrissal si browesr sync

// Local URL for your site
var localproxy = 'http://mysite.test';

// scss
import gulpif from 'gulp-if';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import cleanCss from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';

// const autoprefixer = require( 'autoprefixer' );

// image optimisation
import imagemin from 'gulp-imagemin';

// javascript
import webpack from 'webpack-stream';

// clean up script so production is fresh
import { deleteAsync } from 'del';

// browser-sync server
// import browser from 'browser-sync';
// const server = browser.create();

// dev/production
// const yargs = require('yargs');
import yargs from 'yargs';
const args = yargs(process.argv).argv;
const PRODUCTION = args.prod;

export const styles = (done) => {
  src(['src/scss/styles.scss']) //
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
    .pipe(gulpif(PRODUCTION, cleanCss({ compatibility: 'ie8' })))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest('dist/css'));

  done();
};

export const images = (done) => {
  return src('src/images/**/*.{jpg,jpeg,png,svg,gif,webp}').pipe(imagemin()).pipe(dest('dist/images'));
};

export const scripts = (done) => {
  return src('src/js/app.js')
    .pipe(
      webpack({
        mode: PRODUCTION ? 'production' : 'development',
        devtool: !PRODUCTION ? 'inline-source-map' : false,
        output: {
          filename: 'app.js',
        },
      })
    )
    .pipe(dest('dist/js'));
};

export const copy = (done) => {
  return src(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*']).pipe(dest('dist'));
};

export const clean = () => {
  return deleteAsync(['assets']);
};

// run our server, watch for changes, and reload if they occur
// export const serve = (done) => {
//   server.init({
//     proxy: localproxy,
//   });
//   done();
// };
// export const reload = (done) => {
//   server.reload();
//   done();
// };

export const watchForChanges = (done) => {
  watch('src/scss/**/*.scss', series(styles));
  watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images));
  watch('src/js/**/*.js', series(scripts));
};

export const dev = series(parallel(styles, images, scripts, copy), watchForChanges);
export const build = series(clean, parallel(styles, images, scripts, copy));
export default dev;
