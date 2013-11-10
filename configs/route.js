/*jslint node:true, nomen:true, plusplus:true*/
/*global Object*/

'use strict';

var path = require('path'),
    root = path.resolve(__dirname, '..'),
    appController = require(path.join(root, 'controllers/app.js')),
    routesConfig = require('./routes.json');

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
    var i, routes;

    /**
     * Initializes the embeds on the response object so that they can be passsed
     * to the views.
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
     * Delegate the specified route to the app controller for processing.
     * @param {String} route  the route to process
     */
    function delegateRoute(route) {
        app.get(route, function (req, res) {
            initializeEmbeds(res);
            appController(req, res, routesConfig[route]);
        });
    }

    /**
     * Iterates through each of the routes specified in routes.json and dispatches
     * those routes to the appController for handling.
     * Object.keys + native for-loop offers better performance than for ... in
     * loop and Array.forEach on Object.keys:
     *      http://jsperf.com/for-in-versus-object-keys-foreach/6
     */
    routes = Object.keys(routesConfig);
    for (i = 0; i < routes.length; ++i) {
        delegateRoute(routes[i]);
    }

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
