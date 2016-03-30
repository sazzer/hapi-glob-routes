# Hapi Glob Routes
Hapi Plugin to automatically add routes based on a filesystem glob.

# Usage

Register the plugin with the server as follows:
```
server.register({
    register: require('hapi-glob-routes'),
    options: {
        files: path.join(__dirname, '/routes/**/*.route.js')
    }
}, function(err) {
});
```

This will then find every module that matches the provided filesystem glob, and treat any exports from those modules with a name of "routes" as a route definition to be passed to "server.route". For example, the following file:
```
import Joi from 'joi';

export const routes = {
    method: 'GET',
    path: '/api/debug/ping',
    config: {
        id: 'ping',
        tags: ['api', 'debug'],
        description: 'Debug handler to get a response back from the server',
        response: {
            schema: Joi.object({
                ping: Joi.string().description('Always the value "Pong"').example('Pong').required()
            }).description('The Ping response').required()
        },
        handler: function(request, reply) {
            const result = {
                ping: 'Pong'
            };
            return reply(result);
        }
    }
};
```

is a module that exposes a value called "routes". This then gets picked up and passed to server.route() by the hapi-glob-routes module automatically.

Note that because this passes through to server.route(), the exported value can be anything acceptable to that function. This means that a single module can expose multiple routes simply by exporting an array instead of a single definition.

Also note that even though the above example module is in ES6, there is no requirement for that. As long as the module has an exported value with the name "routes" that can be passed to server.route() then it doesn't matter what Javascript dialect it is written in.
