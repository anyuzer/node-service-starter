/* eslint no-console: 0 */
/* Disable ESLint no-console as this file only runs on server side */
const BodyParser = require('body-parser');
const Express = require('express');

const HTTP = require('http');
const Controllers = require('./1/Controllers/Controllers');
const Config = require('./Config/Config');

/*
NOTE: We do not write tests against our Main. Main is our application entry, and builds out our application.
 */
class Main {
    static Run() {
        // Our application
        const App = new Main();

        // Middlware is order specific. In this case, we use a promise chain to allow setup to be appropriate async
        App.bindSecurityMiddleware()
            .then(App.bindAuthMiddleware.bind(App))
            .then(App.bindAppParsingMiddleware.bind(App))
            .then(App.bindApplicationMiddleware.bind(App))
            .then(App.bindErrorMiddleware.bind(App))
            .then(App.startServer.bind(App))
            .catch((e) => {
                console.log(e);
            });
    }

    constructor() {
        this.express = new Express();
        this.express.disable('x-powered-by');

        console.log(`Application started with ${Config.getEnvironment()} config`);
        this.Server = HTTP.createServer(this.express);
    }

    bindSecurityMiddleware() {
        // If I need to handle any top level security concerns. For example, not having http enabled, but catching non TLS requests and redirecting to the correct SecureServer
        console.log('Security middleware bound...');
        return Promise.resolve(true);
    }

    bindAuthMiddleware() {
        // I do sessionID, authentication and cookie management
        console.log('Auth middleware bound...');
        return Promise.resolve(true);
    }

    bindAppParsingMiddleware() {
        // In the case of request transformation prior to the application
        this.express.use(BodyParser.json());
        this.express.use(BodyParser.urlencoded({ extended: true }));

        console.log('Parsing middleware bound...');
        return Promise.resolve(true);
    }

    bindApplicationMiddleware() {
        const Controller = new Controllers();
        this.express.use('/v1', Controller.getRouter());
        console.log('Application middleware bound...');
        return Promise.resolve(true);
    }

    bindErrorMiddleware() {
        // Some low generics
        this.express.use(this._generic404Handler);
        this.express.use(this._generic500Handler);
        console.log('Error middleware bound...');
        return Promise.resolve(true);
    }

    startServer() {
        this.Server.listen(Config.getHTTPConfig().port, Config.getHTTPConfig().host);
        console.log(`Started on port ${Config.getHTTPConfig().port}`);
    }


    _generic404Handler(_request, _response, _next) {
        _response.status(404).end("Could not resolve API: Not Found");
    }

    _generic500Handler(_error, _request, _response, _next) {
        console.log(_error.stack);
        _response.status(500).end(`${_error.message} - Could not resolve API: Error`);
    }

    toString() {
        return `[object ${this.constructor.name}]`;
    }
}

module.exports = Main;