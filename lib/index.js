var requireGlob = require('require-glob');

/**
 * Register the plugin with a server
 * @param {Server} server The server to register with
 * @param {Object} options The plugin options to register with
 * @param {Function} next The next function when we're finished registering
 */
function register(server, options, next) {
    var routesGlob = options.files;
    server.log(['routes'], 'Loading routes from ' + routesGlob);
    requireGlob(routesGlob, {
        keygen: function(options, fileObj) {
            return fileObj.path;
        }
    }).then(function(modules) {
        Object.keys(modules)
            .map((k) => modules[k])
            .filter((module) => 'routes' in module)
            .map((module) => module.routes)
            .forEach((routes) => {
                server.route(routes);
            });
        next();
    }).catch(function(err) {
        next(err);
    });
}

register.attributes = {
    name: 'hapi-glob-routes',
    version: '0.0.1'
};

exports.register = register;
