var express = require('express'),
    app = express(),
    http = require('http'),
    vcapServices = require('vcap_services'),
    watson = require('watson-developer-cloud'),
    extend = require('util')._extend,
    csrf = require('csurf'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    expressBrowserify = require('express-browserify');

require('dotenv').load({silent: true});

// STT
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

// VIEWS
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/js/stt.js', expressBrowserify('modules/stt/index.module.js'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

// EXPRESS
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
app.use(bodyParser.json({limit: '1mb'}));

// SECURITY
app.use(helmet());
var secret = Math.random().toString(36).substring(7);
app.use(cookieParser(secret));
var csrfProtection = csrf({cookie: true});
app.use(csrfProtection);

app.listen(4000);
console.log('Node development server started on http://localhost:4000');
