/*jslint node:true*/

'use strict';

var q = require('q');

module.exports = function (req, res) {
    var deferred = q.defer();

    res.render('index', {}, function (err, markup) {
        if (err) {
            deferred.reject();
        }

        deferred.resolve(markup);
    });

    return deferred.promise;
};
