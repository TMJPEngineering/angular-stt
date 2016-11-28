'use strict';

var express = require('express'),
    app = express(),
    http = require('http'),
    expressBrowserify = require('express-browserify');

require('dotenv').load({ silent: true });

// VIEWS
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/env.js', express.static(__dirname + '/env.js'));
app.use('/public', express.static(__dirname + '/modules'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

require('./config/lib/stt')(app);
require('./config/lib/express')(app);
require('./config/lib/security')(app);

var port = process.env.NODE_PORT;

app.listen(port);
console.log('Node development server started on http://localhost:' + port);
