const http = require('http');

//External dependencies
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const cors = require('@koa/cors');

//Internal
const KoaRouter = require('./Middleware/KoaRouter.js');
const SessionHandler = require("./Middleware/SessionHandler.js");

const Controllers = require("./Controllers/Controllers.js");
const Config = require("./Config/Config.js");

//We don't test our Main, as it's intended only as an entrance to our application
class Main {
    static Run() {
        // Our application
        const App = new Main();
        App.initRemote()
            .then(App.bindSecurityMiddleware.bind(App))
            .then(App.bindAuthMiddleware.bind(App))
            .then(App.bindStaticMiddleware.bind(App))
            .then(App.bindAppParsingMiddleware.bind(App))
            .then(App.bindApplicationMiddleware.bind(App))
            .then(App.bindErrorMiddleware.bind(App))
            .then(App.startServer.bind(App));
    }

    constructor() {
        this.app = new Koa();
        this.app.use(bodyparser());
        this.app.use(cors({ origin: "*" }));
        this.Router = new KoaRouter;

        console.log(`Application started with ${Config.getEnvironment()} config`);
    }

    initRemote() {
        //If we need to fetch any remote configs / data / etc on boot
        return Promise.resolve(true);
    }


    bindSecurityMiddleware() {
        // If I need to handle any top level security concerns. For example, not having http enabled, but catching non TLS requests and redirecting to the correct SecureServer
        console.log('Security middleware bound...');
        return Promise.resolve(true);
    }

    bindAuthMiddleware() {
        // I do sessionID, authentication and cookie management
        console.log('Auth middleware bound...');
        this.app.use((new SessionHandler).intercept);
        return Promise.resolve(true);
    }

    bindStaticMiddleware() {
        console.log('Static middleware bound...');
        // this.StaticServer.addRoute('/images/**path[/]', { pathToStatic: ['images', 'path'], maxAge: (86400 * 365) });
        // this.app.use(this.StaticServer.intercept);
        return Promise.resolve(true);
    }

    bindAppParsingMiddleware() {
        // In the case of request transformation prior to the application
        console.log('Parsing middleware bound...');
        return Promise.resolve(true);
    }

    bindApplicationMiddleware() {
        const Controller = new Controllers();
        this.Router.all(`/api/v1`, Controller.getRouter());
        this.app.use(this.Router.intercept);
        console.log(`Application middleware bound... '/api/v1`);
        return Promise.resolve(true);
    }

    bindErrorMiddleware() {
        // Some low generics
        console.log('Error middleware bound...');
        return Promise.resolve(true);
    }

    startServer() {
        this.Server = http.createServer(this.app.callback());
        this.Server.listen(
            Config.getHTTPConfig().port,
            Config.getHTTPConfig().host
        );
        console.log(`Started on port ${Config.getHTTPConfig().port}`);
    }
}

module.exports = Main;