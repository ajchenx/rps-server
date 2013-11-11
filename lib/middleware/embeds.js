/*jslint node:true, unparam:true*/
// req are ununsed but required by middleware signature

'use strict';

/**
 * Embeds middleware. This middleware initializes the embeds on the response
 * object so that they can be passsed to the views.
 */
module.exports = function (req, res, next) {
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

    next();
};
