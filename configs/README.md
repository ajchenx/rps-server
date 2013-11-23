# Routing

The server handles simple routing via routes specified in `configs/routes.json`. The key of each first level object in the JSON file represents the route, and the value are the route options.

```json
"route": {
    "controller": "...",
    "config": {
        ...
    },
    "assets": {
        ...
    },
    "nav": ...
}
```

Routes that are not specified in `routes.json` will be shown the 404 error page.

## Assets

A controller can specify the assets that it wants to load via an `assets` object. The `assets` object has three valid types of assets to load: [`css`, `js`, `blob`]. Each type is an array of files to load. The file is an object that has a `location` and `value`, which represent the location to place the file (`top` or `bottom`) and file name respectively.

```json
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
```

## Navigation Bar

There is a navigation bar that spans the top of the page. The entries for this nav bar are listed in `nav.json`, which looks like the following:

```json
[
    {
        "id": "home",
        "enabled": true,
        "title": "Home"
    },
    {
        "id": "about",
        "enabled": true,
        "title": "About"
    }
    ...
]
```

The nav items will be displayed on the page with the specified string `title` in the order listed in this json file and if `enabled` is true. 

A page can specify the `nav` item that it corresponds to with the `nav` entry in `routes.json`. The string in `nav` must match the `id` of the nav entry. If no `id` is specified, then `nav` is compared to the `title` property.