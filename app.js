/*jslint node:true, nomen:true*/

'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    root = path.resolve(__dirname),
    error = require(path.resolve(root, 'lib/middleware/error.js')),
    embeds = require(path.resolve(root, 'lib/middleware/embeds.js')),
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
app.use(embeds);

// set up application routes
require(path.join(root, 'controllers/route.js'))(app);

// error handling middleware
app.use(error);

server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = server;
