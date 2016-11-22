var express = require('express'),
    app = express(),
    http = require('http'),
    expressBrowserify = require('express-browserify');

require('dotenv').load({ silent: true });

// VIEWS
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/js/stt.js', expressBrowserify('modules/stt/index.module.js'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

require('./config/lib/stt')(app);
require('./config/lib/express')(app);
require('./config/lib/security')(app);

app.listen(4000);
console.log('Node development server started on http://localhost:4000');
