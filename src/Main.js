const HTTPServer = require('./Adapters/HTTPServer');
const V1Controller = require('./1/Controllers/Controllers');
const Config = require('./Config');
const BodyParser = require('body-parser');
const Express = require('express');
const path = require('path');

/*
NOTE: We do not write tests against our Main. Main is our application entry, and builds out our application.
 */
class Main{
    static Run(){
        //Our application
        var App = new Main();

        //Middlware is order specific. In this case, we use a promise chain to allow setup to be appropriate async
        App.bindSecurityMiddleware()
            .then(App.bindAuthMiddleware.bind(App))
            .then(App.bindStaticMiddleware.bind(App))
            .then(App.bindAppParsingMiddleware.bind(App))
            .then(App.bindApplicationMiddleware.bind(App))
            .then(App.bindErrorMiddleware.bind(App));
    }

    constructor(){
        //A non TLS server
        this.Server = new HTTPServer;
        this.Server.setHost(Config.getHost());
        this.Server.setPort(Config.getPort());
        this.Server.setAttemptLimit(5);
        this.Server.start();

        //A TLS server
        //NOTE: This is only an example. In production scalable environments HTTPS is better handled at the load balancer
        // this.SecureServer = new HTTPServer;
        // this.SecureServer.setHost(Config.getSecureHost());
        // this.SecureServer.setPort(Config.getSecurePort());
        // this.SecureServer.setTLSOptions(Config.getTLSOptions());
        // this.SecureServer.setAttemptLimit(5);
        // this.SecureServer.start();
    }

    startAPI(_version){
        switch(_version){
            case 1: return new Promise(this._startV1.bind(this));
        }
    }
    
    _startV1(_resolve,_reject){
        var Controller = new V1Controller;
        console.log('Binding V1 API...');
        this.Server.catchRequest().use('/v1',Controller.getRouter());
        //this.SecureServer.catchRequest().use('/v1',Controller.getRouter());
        _resolve();
    }

    bindSecurityMiddleware(){
        //If I need to handle any top level security concerns. For example, not having http enabled, but catching non TLS requests and redirecting to the correct SecureServer
        return Promise.resolve(true);
    }

    bindAuthMiddleware(){
        //I do sessionID, authentication and cookie management
        return Promise.resolve(true);
    }

    bindStaticMiddleware(){
        //I am a static fileserver. I can be below our dynamic requests, as a fallout scenario (lets me overwrite static content with dynamic controllers) or above (check static first)
        //this.Server.catchRequest().use(Express.static(STATIC_PATH));
        return Promise.resolve(true);
    }

    bindAppParsingMiddleware(){
        //In the case of request transformation prior to the application
        this.Server.catchRequest().use(BodyParser.json());
        this.Server.catchRequest().use(BodyParser.urlencoded({extended:true}));

        //this.SecureServer.catchRequest().use(BodyParser.json());
        //this.SecureServer.catchRequest().use(BodyParser.urlencoded({extended:true}));
        return Promise.resolve(true);
    }

    bindApplicationMiddleware(){
        return Promise.all([this.startAPI(1)])
    }

    bindErrorMiddleware(){
        //Some low generics
        this.Server.attachMiddleware(this._generic404Handler);
        this.Server.attachMiddleware(this._generic500Handler);
        //this.SecureServer.attachMiddleware(this._generic404Handler);
        //this.SecureServer.attachMiddleware(this._generic500Handler);
        return Promise.resolve(true);
    }

    _generic404Handler(_request,_response,_next){
        _response.status(404).end("Could not resolve API: Not Found");
    }

    _generic500Handler(_error,_request,_response,_next){
        console.log(_error.stack);
        _response.status(500).end(_error.message+" - Could not resolve API: Error")
    }

    toString(){
        return '[object '+this.constructor.name+']';
    }
}

module.exports = Main;