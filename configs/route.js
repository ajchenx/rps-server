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
     * Initializes the embeds on the response object so that they can be passsed
     * to the views.
     * @param {http.ServerResponse} res  the response object
     */
    function initializeEmbeds(res) {
        res.locals.embeds = {
            top: {
                css: [],
                js: [],
                blob: []
            },
            bottom: {
                css: [],
                js: [],
                blob: []
            }
        };
    }

    /**
     * Iterates through each of the routes specified in routes.json and dispatches
     * those routes to the appController for handling.
     */
    Object.keys(routes).forEach(function (route) {
        app.get(route, function (req, res) {

            // set up page embeds
            initializeEmbeds(res);

            appController(req, res, routes[route]);
        });
    });

    /**
     * Error handler route. All pages not specified in the routes.json should
     * fall into this route and display the error page.
     */
    app.get('*', function (req, res) {
        console.log('Accessing unspecified route');

        initializeEmbeds(res);
        appController(req, res);
    });
};
