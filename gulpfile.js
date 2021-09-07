const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');                     //Плагин для конкатенации файлов, переименования
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');                      //Плагин для сжатия js
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();       //Create() написал потому что есть в документации


function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notofy: false                               //Отключить уведомление сбоку браузера что произошла синхр.
    })
}

function styles() {                                 //Название ф-ции можно на своё усмотрение
    return src('app/scss/style.scss')               //Путь к SCSS
    .pipe(scss({outputStyle: 'compressed'}))        //Есть 3, вот 2 осн.: compressed, expanded (читабельный вид)
    .pipe(concat('style.min.css'))                  //Переименование файла (вместо дефолта style.css)
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'], //Аутопрефиксы для последних 10 версий браузеров
        grid: true                                  //Добавить аутопрефиксы для гридов (было отключено)
    }))
    .pipe(dest('app/css'))                          //Путь куда будет компилироваться обычный код CSS
    .pipe(browserSync.stream())                     //Будут добавляться стили в браузер без перезагрузки (с перезагрузкой вместо stream написать надо reload)
}

function images() {                                 //Ф-ция для сжатия изображений
    return src('app/images/**/*.*')                 //Выбирать во всех папках и все форматы
    .pipe(imagemin([                                //Дальше взял с документации
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images/'))
}

function build() {                                  //Ф-ция строит минифиц. проект в папке dist (её может создать)
    return src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js',
    ], {base: 'app'})                               //Перенести структуру как в папке app (папки) 
    .pipe(dest('dist'))
}

function cleanDist() {
    return del('dist')                              //Удалить папку dist
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);          //Следит за всеми папками (**) и файлами (*) с расш. SCSS
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);  //Следит за всеми папками (**) и файлами (*) с расш. JS кроме main.min.js
    watch(['app/**/*.html']).on('change', browserSync.reload);
}

function scripts() {
    return src([                                    //Подключение JS-файлов для проекта
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))                    //Конкатинация файлов
    .pipe(uglify())                                 //Минимизация файла
    .pipe(dest('app/js'))                           //Выгрузка файла
    .pipe(browserSync.stream())                     //Перезагрузка браузера (для скриптов только перезагрузка)
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.build = build;
exports.cleanDist = cleanDist;
exports.bld = series(cleanDist, images, build);     //Выполнение поэтапно ф-ции

exports.default = parallel(styles, scripts, browsersync, watching);     //Чтобы вызвать таски одним словом gulp