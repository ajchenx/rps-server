/*jslint node:true, unparam:true*/
// req/next are ununsed but required by middleware signature

'use strict';

/**
 * Error handling middleware. This middleware is intended to be used at the end
 * of all middlewares, and will be called whenever a route invokes next(err)
 * where "err" is the error object. The "message" parameteter within this error
 * object will be logged.
 * @param {Ojbect} err  the error object
 * @param {http.ServerRequest} req   the request object
 * @param {http.ServerResponse} res  the response object
 * @param {Function} next            function to invoke the next middleware
 */
module.exports = function (err, req, res, next) {
    if (err.message) {
        console.log('[error] ' + err.message);
    } else {
        console.log('[error] Unknown error');
    }

    res.locals.embeds.top.css.push('css/error.css');
    res.render('error');
};
