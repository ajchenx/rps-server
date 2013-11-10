/*jslint node:true, nomen:true, plusplus:true*/

'use strict';

var path = require('path'),
    async = require('async'),
    root = path.resolve(__dirname, '..'),
    assetsConfig = require(path.resolve(root, 'configs/assets.json')),
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
     * Handles a rendering failure. This function will send the error page back
     * to the user.
     */
    function handleRenderError() {
        res.locals.embeds.top.css.push('css/error.css');
        res.render('error');
    }

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
    function loadAsset(embeds, config) {
        var i, types, type, files, file, location, value;

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
            for (i = 0; i < files.length; ++i) {
                file = files[i];
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
            loadAsset(embeds, assetsConfig);

            // load any assets required by the controller
            loadAsset(embeds, controllerAssets);

            callback();
        },

        /**
         * Renders the main app template while delegating the body markup to be
         * rendered by the controller specified in config. Requires that the 'assets'
         * function be run first.
         * @param {Function} callback  callback to be called when this function completes
         */
        renderApp: ['assets', function (callback) {
            var controller = config.controller && controllers[config.controller],
                data = {};

            if (controller) {
                controller(req, res, config.config).then(function (markup) {
                    data.content = markup;

                    res.render('app', data);
                }, handleRenderError);
            } else {
                console.log('No controller specified for route');
                handleRenderError();
            }

            callback();
        }]
    }, next);
};
