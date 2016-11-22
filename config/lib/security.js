'use strict';

var csrf = require('csurf'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet');

module.exports = function(app) {
    app.use(helmet());
    var secret = Math.random().toString(36).substring(7);
    app.use(cookieParser(secret));
    var csrfProtection = csrf({ cookie: true });
    app.use(csrfProtection);
};
