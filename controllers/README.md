# Controllers

The name specified as the `controller` corresponds to the its matching file in the `controllers` directory. Each controller will receive the `req` and `res` object as well as the `config` that is specified in `routes.json`.

The controller is responsible for returning its associated markup. The expected way for the controller to do this is via [promises](http://promises-aplus.github.io/promises-spec/). This server utilizes Kris Kowal's [Q](https://github.com/kriskowal/q) package to achieve this functionality. Below is an example of how to accomplish this:

```javascript
var q = require('q');

module.exports = function (req, res) {
    var deferred = q.defer();

    res.render('view', {}, function (err, markup) {
        if (err) {
            deferred.reject({
                message: 'Rendering failure'
            });
        }

        deferred.resolve(markup);
    });

    return deferred.promise;
};
```