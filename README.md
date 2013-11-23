# rps

Rock Paper Scissors

## Installation

You will need grunt to be installed globally

    sudo npm install -g grunt-cli

### Install Compass

[Compass](http://compass-style.org/install/) is being used to compile [Sass](http://sass-lang.com).

### Build Tasks

Handled by [grunt.js](http://gruntjs.com/).

The default `grunt` task runs `compass`

Running `grunt watch` will run in the background and monitor:

 - `styles/css/*.scss` files for changes and automatically run them through compass. Outputs to `public/css`

You can run the tasks under `grunt watch` manually with the following command:

    grunt compass

### Code Quality

Javascript files should pass [jslint](http://www.jslint.com), though this is not enforced.

You can run `jslint` on your code with the following command:

    grunt jslint

## Routing Component

The server handles simple routing via routes specified in `configs/routes.json`. The key of each first level object in the JSON file represents the route, and the value are the route options.

```json
"route": {
    "controller": "...",
    "config": {
        ...
    },
    "assets": {
        ...
    }
}
````

### Controllers

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

### Views

LinkedIn's fork of [Dust.js](https://github.com/linkedin/dustjs) is used as the rendering engine.
