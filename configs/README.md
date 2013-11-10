# Routing

The server handles simple routing via routes specified in `configs/routes.json`. The key of each first level object in the JSON file represents the route, and the value are the route options.

    "route": {
        "controller": "...",
        "config": {
            ...
        },
        "assets": {
            ...
        }
    }

Routes that are not specified in `routes.json` will be shown the 404 error page.

## Assets
A controller can specify the assets that it wants to load via an `assets` object. The `assets` object has three valid types of assets to load: [`css`, `js`, `blob`]. Each type is an array of files to load. The file is an object that has a `location` and `value`, which represent the location to place the file (`top` or `bottom`) and file name respectively.

    "assets": {
        "css": [
            "location": "top",
            "value": "css/style.css"
        ],
        "js": [
            "location": "bottom",
            "value": "js/file.js"
        ],
        "blob": [
            "location": "top",
            "value": "<script src='js/file.js'></script>"
        ]
    }