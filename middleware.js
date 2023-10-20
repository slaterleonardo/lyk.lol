const express = require('express');
const path = require('path');

function appMiddleware(app) {
    app.use(express.urlencoded({ extended: false }))
    app.use((req, res, next) => {
        res.locals = {
            site_key: env.RECAPTCHA_MODE === 'TEST' ? env.RECAPTCHA_SITE_KEY_TEST : env.RECAPTCHA_SITE_KEY,
        };

        next();
    })

    app.use(express.static(path.join(__dirname, 'assets')));
    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'ejs');  
}

module.exports = appMiddleware;