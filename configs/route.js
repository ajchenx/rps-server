/*jslint node:true, nomen:true*/
/*global Object*/

'use strict';

var path = require('path'),
    root = path.resolve(__dirname, '..'),
    appController = require(path.join(root, 'controllers/app.js')),
    routes = require('./routes.json');

/**
 * Route handler for the specified application. This function will set up the
 * routes specified in the file configs/routes.json.
 * @example
 *     "route": {
 *          "controller": "...",
 *          "config": {
 *              ...
 *          }
 *      }
 * @param {Object} app  the express application object
 */
module.exports = function (app) {

    /**
     * Iterates through each of the routes specified in routes.json and dispatches
     * those routes to the appController for handling.
     */
    Object.keys(routes).forEach(function (route) {
        app.get(route, function (req, res) {

            // set up page embeds
            res.locals.embeds = {
                top: {
                    css: [],
                    js: []
                },
                bottom: {
                    css: [],
                    js: []
                }
            };

            appController(req, res, routes[route]);
        });
    });
};
