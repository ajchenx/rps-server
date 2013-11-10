/*jslint node:true, nomen:true, plusplus:true*/

'use strict';

var path = require('path'),
    async = require('async'),
    _ = require('lodash'),
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
        res.render('error');
    }

    function loadAsset(embeds, files, type) {
        var i, file, location, value;

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
                embeds[location][type] = value;
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

            // traverse and load assets from assets.json
            _.forEach(assetsConfig, function (files, type) {
                loadAsset(embeds, files, type);
            });

            // load any assets required by the controller
            if (controllerAssets) {
                _.forEach(controllerAssets, function (files, type) {
                    loadAsset(embeds, files, type);
                });
            }

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
