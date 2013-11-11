/*jslint node:true, unparam:true*/
// req is ununsed but required by controller signature

'use strict';

var q = require('q');

module.exports = function (req, res) {
    var deferred = q.defer();

    res.render('index', {}, function (err, markup) {
        if (err) {
            deferred.reject({
                message: 'rendering failure'
            });
        }

        deferred.resolve(markup);
    });

    return deferred.promise;
};
