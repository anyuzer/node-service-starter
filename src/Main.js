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
    static async Run() {
        // Our application
        const App = new Main();
        await App.initRemote();
        await App.bindSecurityMiddleware();
        await App.bindAuthMiddleware();
        await App.bindStaticMiddleware();
        await App.bindAppParsingMiddleware();
        await App.bindApplicationMiddleware();
        await App.bindErrorMiddleware();
        App.startServer();
    }

    constructor() {
        this.app = new Koa();
        this.app.use(bodyparser());
        this.app.use(cors({ origin: "*" }));
        this.Router = new KoaRouter;

        console.log(`Application started with ${Config.getEnvironment()} config`);
    }

    async initRemote() {
        // If we need to fetch any remote configs / data / etc on boot
        console.log('Initializing remote...')
        return true;
    }

    async bindSecurityMiddleware() {
        // If there's high level security checks we want to do, to prevent malicious requests
        console.log('Security middleware bound...');
        return Promise.resolve(true);
    }

    async bindAuthMiddleware() {
        // Authentication can be useful here
        console.log('Auth middleware bound...');
        this.app.use((new SessionHandler).intercept);
        return true;
    }

    async bindStaticMiddleware() {
        console.log('Static middleware bound...');
        // this.StaticServer.addRoute('/images/**path[/]', { pathToStatic: ['images', 'path'], maxAge: (86400 * 365) });
        // this.app.use(this.StaticServer.intercept);
        return true;
    }

    async bindAppParsingMiddleware() {
        // In the case of request transformation prior to the application
        console.log('Parsing middleware bound...');
        return true;
    }

    async bindApplicationMiddleware() {
        const Controller = new Controllers();
        this.Router.all(`/api/v1`, Controller.getRouter());
        this.app.use(this.Router.intercept);
        console.log(`Application middleware bound... '/api/v1`);
        return true;
    }

    async bindErrorMiddleware() {
        // Some low generics
        console.log('Error middleware bound...');
        return true;
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

Main.Run();