# Middleware

This folder holds the application middleware.

## Embeds

This middleware is responsible for initializing the `embeds` object on the `response.locals` object so that controller functions can easily push assets to this object without having to check if it already exists (and subsequently create them if they do not).

## Error

Error handling middleware. This middleware is intended to be used after all routes and middleware have been declared. Calling `next(err)` with `err` being an error object will invoke this middleware. If the `err` object has a message, this message will be logged.

```javascript
err = {
    message: 'Error message'
}
```