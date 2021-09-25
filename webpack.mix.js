const mix = require('laravel-mix');

mix.js('assets/js/main.js', 'web')
    .sass('assets/scss/main.scss', '')
    .copyDirectory('assets/static', 'web')
    .setPublicPath('web')
    .sourceMaps()
    .version()
    .disableSuccessNotifications()
    .browserSync({
        proxy: 'localhost:8000',
        files: ['templates/**/*', 'web/*.css', 'web/*.js'],
        open: false,
    });