'use strict';

var vcapServices = require('vcap_services'),
    watson = require('watson-developer-cloud'),
    extend = require('util')._extend;

module.exports = function(app) {
    var config = extend({
        version: process.env.STT_VERSION,
        url: process.env.STT_HTTPS,
        username: process.env.STT_USERNAME,
        password: process.env.STT_PASSWORD
    }, vcapServices.getCredentials('speech_to_text'));
    var authService = watson.authorization(config);

    /* Get token using your credentials */
    app.post('/api/token', function(req, res, next) {
        authService.getToken({ url: config.url }, function(err, token) {
            if (err)
                next(err);
            else
                res.send(token);
        });
    });
};
