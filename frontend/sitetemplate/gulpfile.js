const gulp        = require('gulp');
const gulpRename  = require('gulp-rename');
const gulpMustache = require('gulp-mustache');
const sass        = require('gulp-sass')(require('sass'));
const fs          = require('fs');
const path        = require('path');
const browserSync = require('browser-sync').create();
// const cleanCss = require('gulp-clean-css');
// const minify = require('gulp-minify');

/**
 * Load all .mustache files from a directory RECURSIVELY as a partials map.
 * Key = relative path without extension, e.g. "pages/about_full"
 *       or "public/common/header"
 * @param {string} baseDir  - root partials directory (e.g. './src/partials')
 * @param {string} [prefix] - internal recursion prefix (leave empty on first call)
 * @returns {Object}
 */
function loadPartials(baseDir, prefix) {
    const partials = {};
    prefix = prefix || '';

    if (!fs.existsSync(baseDir)) return partials;

    fs.readdirSync(baseDir).forEach(entry => {
        const fullPath = path.join(baseDir, entry);
        const stat     = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recurse into subdirectory, building the key prefix
            const nested = loadPartials(fullPath, prefix ? `${prefix}/${entry}` : entry);
            Object.assign(partials, nested);

        } else if (entry.endsWith('.mustache')) {
            const name = entry.replace(/\.mustache$/, '');
            // Key used in {{> partials/public/common/header}} etc.
            // We expose TWO keys so both short and full paths resolve:
            //   "header"                        (legacy / short)
            //   "partials/public/common/header" (full path used in templates)
            const shortKey = name;
            const fullKey  = prefix ? `${prefix}/${name}` : name;

            const content = fs.readFileSync(fullPath, 'utf8');

            // Full key (preferred — matches {{> partials/public/common/header}})
            partials[`partials/${fullKey}`] = content;

            // Short key as fallback (matches {{> header}})
            if (!partials[shortKey]) {
                partials[shortKey] = content;
            }
        }
    });

    return partials;
}

function mergeData(base, specific) {
    if (Array.isArray(base) || Array.isArray(specific)) {
        return specific !== undefined ? specific : base;
    }

    if (base && specific && typeof base === 'object' && typeof specific === 'object') {
        const result = Object.assign({}, base);
        Object.keys(specific).forEach(key => {
            result[key] = mergeData(base[key], specific[key]);
        });
        return result;
    }

    return specific !== undefined ? specific : base;
}

/**
 * Resolve the data file for a given page mustache.
 * Rules (in order):
 *   1. src/data/<pageName>.json   → page-specific data
 *   2. src/data/home.json         → fallback
 *
 * @param {string} pageName  - filename without extension (e.g. "about", "contact")
 * @returns {Object}
 */
function loadData(pageName) {
    const specific = path.resolve(`./src/data/${pageName}.json`);
    const fallback = path.resolve('./src/data/home.json');
    const baseData = JSON.parse(fs.readFileSync(fallback, 'utf8'));

    if (fs.existsSync(specific)) {
        console.log(`[mustache] ${pageName}.mustache  →  data/${pageName}.json`);
        const pageData = JSON.parse(fs.readFileSync(specific, 'utf8'));
        return mergeData(baseData, pageData);
    }

    console.log(`[mustache] ${pageName}.mustache  →  data/home.json  (fallback)`);
    return baseData;
}

// ──────────────────────────────────────────────────────────────
// SITE TEMPLATE — Mustache + data + partials
// Renders each src/*.mustache → build/<page>.html
// Each page uses its own data/<page>.json (fallback: home.json)
// ──────────────────────────────────────────────────────────────
gulp.task('compile:mustache', function(done) {
    const partials = loadPartials('./src/partials');
    const srcDir   = './src';
    const buildDir = './build';

    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
    fs.readdirSync(buildDir)
        .filter(file => file.endsWith('.html'))
        .forEach(file => fs.unlinkSync(path.join(buildDir, file)));

    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.mustache'));

    files.forEach(file => {
        const pageName = file.replace(/\.mustache$/, '');
        const data     = loadData(pageName);
        const tmpl     = fs.readFileSync(path.join(srcDir, file), 'utf8');

        // gulp-mustache works as a stream transform; for per-file data we use
        // the mustache library directly (already installed as a peer dependency).
        const Mustache = require('mustache');
        const html     = Mustache.render(tmpl, data, partials);

        fs.writeFileSync(path.join(buildDir, `${pageName}.html`), html, 'utf8');
        console.log(`[mustache] built → build/${pageName}.html`);
    });

    done();
});




gulp.task('fontawesome:css', function () {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/css/all.min.css').pipe(gulp.dest('build/css/fontawesome'));
});
gulp.task('fontawesome:js', function () {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/js/all.min.js').pipe(gulp.dest('build/js/fontawesome'));
});
gulp.task('fontawesome:webfonts', function () {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/**').pipe(gulp.dest('build/css/webfonts'));
});

gulp.task('fontawesome', gulp.series('fontawesome:css', 'fontawesome:js', 'fontawesome:webfonts'));


// bootstrap
gulp.task('bootstrap:css', function() {
    return gulp
        .src(['./node_modules/bootstrap/dist/css/bootstrap.min.css',
            './node_modules/bootstrap/dist/css/bootstrap.min.css.map',
            './node_modules/bootstrap-icons/font/bootstrap-icons.min.css'
        ])
        .pipe(gulp.dest('./build/css/bootstrap'))
        .pipe(gulp.src('./node_modules/bootstrap-icons/font/fonts/*.*'))
        .pipe(gulp.dest('./build/css/bootstrap/fonts'));
});

gulp.task('bootstrap:js', function() {
    return gulp
        .src(['./node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js.map'])
        .pipe(gulp.dest('./build/js/bootstrap'));
});

gulp.task('bootstrap', gulp.series('bootstrap:css', 'bootstrap:js'));

// // ──────────────────────────────────────────────────────────────
// // SITE TEMPLATE — Mustache + data + partials
// // Renders src/index.mustache → build/index.html
// // ──────────────────────────────────────────────────────────────
// gulp.task('compile:mustache', function() {
//     // Load context data from JSON
//     const data     = JSON.parse(fs.readFileSync('./src/data/home.json', 'utf8'));
//     // Load all partials from src/partials/
//     const partials = loadPartials('./src/partials');
//
//     return gulp
//         .src(['./src/*.mustache'])          // only root-level .mustache files
//         .pipe(gulpMustache(data, {}, partials))
//         .pipe(gulpRename({ extname: '.html' }))
//         .pipe(gulp.dest('./build'));
// });

// Copy CSS assets to build
gulp.task('copy:css', function() {
    return gulp
        .src('./src/assets/css/**/*')
        .pipe(gulp.dest('./build/assets/css'));
});

// Copy JS assets to build
gulp.task('copy:js', function() {
    return gulp
        .src('./src/assets/js/**/*')
        .pipe(gulp.dest('./build/assets/js'));
});

gulp.task('copy:images', function() {
    const imagesBuildDir = './build/assets/images';
    if (fs.existsSync(imagesBuildDir)) {
        fs.rmSync(imagesBuildDir, { recursive: true, force: true });
    }
    return gulp
        .src('./src/assets/images/**/*.*')
        .pipe(gulp.dest('./build/assets/images'));
});

// Copy images/fonts to build (if added later)
gulp.task('copy:assets', gulp.parallel('copy:css', 'copy:js', 'copy:images'));

// Legacy sass task (kept for backward compatibility)
gulp.task('compile:sass', function () {
    if (!fs.existsSync('./assets/css/style.scss')) {
        return Promise.resolve(); // skip if file doesn't exist
    }
    return gulp
        .src('./assets/css/style.scss')
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(gulpRename({ suffix: ".min", extname: '.css' }))
        .pipe(gulp.dest('./build/css'));
});

// Watch task — rebuilds on any change
gulp.task('watch', function() {
    gulp.watch('./src/**/*.mustache', gulp.series('compile:mustache'));
    gulp.watch('./src/data/**/*.json', gulp.series('compile:mustache'));
    gulp.watch('./src/assets/css/**/*', gulp.series('copy:css'));
    gulp.watch('./src/assets/js/**/*', gulp.series('copy:js'));
    gulp.watch('./src/assets/images/**/*', gulp.series('copy:images'));
});

// BrowserSync server
gulp.task('serve', function(done) {
    browserSync.init({
        server: { baseDir: './build' },
        port: 3000,
        open: true,
        notify: false
    });
    done();
});

// BrowserSync reload helpers
function reloadBrowser(done) { browserSync.reload(); done(); }
function injectCss() {
    return gulp.src('./build/assets/css/**/*.css').pipe(browserSync.stream());
}

// Watch task com hot reload
gulp.task('watch:hot', function() {
    // HTML: re-compile mustache → full reload
    gulp.watch(
        ['./src/**/*.mustache', './src/data/**/*.json'],
        gulp.series('compile:mustache', reloadBrowser)
    );
    // CSS: copy → inject sem reload
    gulp.watch(
        './src/assets/css/**/*',
        gulp.series('copy:css', injectCss)
    );
    // JS: copy → full reload
    gulp.watch(
        './src/assets/js/**/*',
        gulp.series('copy:js', reloadBrowser)
    );
    // Images: copy → full reload
    gulp.watch(
        './src/assets/images/**/*',
        gulp.series('copy:images', reloadBrowser)
    );
});

gulp.task('default', gulp.series('compile:mustache', 'copy:assets', 'serve', 'watch:hot'));

// Full compile (no watch)
gulp.task('compile', gulp.series('compile:mustache', 'copy:assets'));

// Generate all the build content (includes legacy Bootstrap/FA tasks)
gulp.task('build', gulp.series('copy:images', 'fontawesome', 'compile', 'bootstrap'));
