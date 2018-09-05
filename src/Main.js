/* eslint no-console: 0 */
/* Disable ESLint no-console as this file only runs on server side */
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const compress = require('koa-compress');
const cors = require('@koa/cors');
const KoaRouter = require('./Middleware/KoaRouter');
const SessionHandler = require('./Middleware/SessionHandler');
const fetch = require('cross-fetch');
const http = require('http');

const Controllers = require('./1/Controllers/Controllers');
const Config = require('./Config/Config');

class Main {
    static Run() {
        // Our application
        const App = new Main();
        App.initRemote()
            .then(App.bindSecurityMiddleware.bind(App))
            .then(App.bindAuthMiddleware.bind(App))
            .then(App.bindAppParsingMiddleware.bind(App))
            .then(App.bindApplicationMiddleware.bind(App))
            .then(App.bindErrorMiddleware.bind(App))
            .then(App.startServer.bind(App));
    }

    constructor() {
        this.app = new Koa();
        this.app.use(compress());
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

    bindAppParsingMiddleware() {
        // In the case of request transformation prior to the application
        // this.express.use(BodyParser.json());
        // this.express.use(BodyParser.urlencoded({ extended: true }));

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