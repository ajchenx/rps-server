/*jslint node:true, nomen:true*/

'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    root = path.resolve(__dirname),
    app = express(),
    server;

// set dust as the rendering engine
app.engine('dust', cons.dust);
app.set('view engine', 'dust');

app.set('port', process.env.PORT || 3000);

// define application middleware
app.use(express.static(path.join(root, 'public')));
app.use(express.json());
app.use(express.urlencoded());

// set up application routes
require(path.join(root, 'configs/route.js'))(app);

server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = server;
