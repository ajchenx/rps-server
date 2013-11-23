/*jslint node:true, nomen:true, plusplus:true*/

'use strict';

var path = require('path'),
    async = require('async'),
    root = path.resolve(__dirname, '..'),
    assetsConfig = require(path.resolve(root, 'configs/assets.json')),
    navConfig = require(path.resolve(root, 'configs/nav.json')),
    controllers = {
        index: require(path.resolve(root, 'controllers/index.js'))
    },
    acceptedAssetTypes = [
        'css',
        'js',
        'blob'
    ];

module.exports = function (req, res, config, next) {
    config = config || {};

    /**
     * Adds the files in the specified config to be loaded to the response object
     * so that they are visible to the view. The asset config should have a
     * structure as follows:
     * @example
     *      "assets": {
     *           "css": [
     *               ...
     *           ],
     *           "js": [
     *               ...
     *           ],
     *           "blob": [
     *               ...
     *           ],
     *       }
     * @param {Object} embeds  the locals.embeds object on the response
     * @param {Object} config  the asset config that specifies the assets to load
     */
    function loadAssets(embeds, config) {
        var i, j, types, type, files, file, location, value;

        if (!embeds || !config) {
            return;
        }

        types = Object.keys(config);

        // traverse all the asset types listed in the asset config
        for (i = 0; i < types.length; ++i) {
            type = types[i];
            files = config[type];

            // ensure that the type (e.g. css) is an accepted type
            if (acceptedAssetTypes.indexOf(type) === -1) {
                return;
            }

            // load each asset to its specified location ("top" or "bottom")
            for (j = 0; j < files.length; ++j) {
                file = files[j];
                location = file.location;
                value = file.value;

                if (typeof location === 'string' && typeof value === 'string') {
                    embeds[location][type].push(value);
                }
            }
        }
    }

    async.auto({

        /**
         * Sets up the assets to be loaded onto the page. This function will load
         * all the assets specified in assets.json.
         * @param {Function} callback  callback to be called when this function completes
         */
        assets: function (callback) {
            var embeds = res.locals.embeds,
                controllerAssets = config.assets;

            // load assets from assets.json
            loadAssets(embeds, assetsConfig);

            // load any assets required by the controller
            loadAssets(embeds, controllerAssets);

            callback();
        },

        /**
         * Initializes the nav items in the nav.json config. Nav items are
         * loaded onto the page in the order they are listed in the config and
         * are shown if the "enabled" flag is set to true.
         * @example
         *      "navItem": {
         *          "enabled": true
         *       },
         *       "navItem2": {
         *          "enabled": false
         *       }
         * @param {Function} callback  callback to be called when this function completes
         */
        loadNav: function (callback) {
            var i, navItem, nav, title,
                controllerNavEntry = config.nav,
                selected = false,
                embeds = res.locals.embeds;

            if (Array.isArray(navConfig)) {
                nav = embeds.nav = [];

                // iterate through each nav item specified in the config and add
                // it if it is enabled
                for (i = 0; i < navConfig.length; ++i) {
                    navItem = navConfig[i];

                    if (navItem.enabled && navItem.title) {
                        title = navItem.title;

                        // determine if the current nav item is 'selected' by the controller
                        selected = (controllerNavEntry === (navItem.id || title));

                        nav.push({
                            title: title,
                            selected: selected
                        });
                    }
                }
            }

            callback();
        },

        /**
         * Renders the main app template while delegating the body markup to be
         * rendered by the controller specified in config. Requires that the 'assets'
         * function be run first.
         * @param {Function} callback  callback to be called when this function completes
         */
        renderApp: ['assets', 'loadNav', function (callback) {
            var controller, data = {},
                error = config.error;

            // if route delegation passed us an error, then call the error middleware
            if (error) {
                next(error);
            } else {
                controller = config.controller && controllers[config.controller];

                if (controller) {
                    controller(req, res, config.config).then(function (markup) {
                        data.content = markup;
                        res.render('app', data);
                    }, next);
                } else {
                    next({
                        message: 'No controller specified for route'
                    });
                }
            }

            callback();
        }]
    });
};
