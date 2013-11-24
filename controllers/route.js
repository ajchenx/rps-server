/*jslint node:true, nomen:true, plusplus:true*/
/*global Object*/

'use strict';

var path = require('path'),
    root = path.resolve(__dirname, '..'),
    appController = require('./app.js'),
    routesConfig = require(path.join(root, 'configs/routes.json'));

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
     * Delegate the specified route to the app controller for processing.
     * @param {String} route  the route to process
     */
    function delegateRoute(route) {
        console.log('delegating route!');
        app.get(route, function (req, res, next) {
            appController(req, res, routesConfig[route], next);
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
     * fall into this route. This function passes an error object with an
     * accompanying error message to the app controller for rendering.
     */
    app.get('*', function (req, res, next) {
        appController(req, res, {
            error: {
                message: 'Accessing unspecified route'
            }
        }, next);
    });
};
