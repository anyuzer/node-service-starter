const ExpressRouter = require('express').Router;
const MethodEndpoint = require('./ExampleEndpoints/MethodEndpoint');
const ProxyEndpoint = require('./ExampleEndpoints/ProxyEndpoint');
const HTTPClient = require('../../Adapters/HTTPClient');

/*
A higher level resource controller. We explicitly own responsibility spaces in the API, in this case we own the ExampleEndpoints.
Required shared models are injected in from the initializing class, which maintains testability and flexibility.
 */
class ExampleController{
    constructor(_ExampleModel,_ProxyClient){
        this.ExampleModel = _ExampleModel;
        this.MethodEndpoint = new MethodEndpoint(_ExampleModel);
        this.ProxyEndpoint = new ProxyEndpoint(_ProxyClient);
    }
    
    getRouter(){
        var Router = new ExpressRouter;
        Router.get('/proxy',this.ProxyEndpoint.fetchExample.bind(this.ProxyEndpoint));

        Router.get('/',this.MethodEndpoint.catchGet.bind(this.MethodEndpoint));
        Router.post('/',this.MethodEndpoint.catchPost.bind(this.MethodEndpoint));
        Router.delete('/',this.MethodEndpoint.catchDelete.bind(this.MethodEndpoint));
        Router.patch('/',this.MethodEndpoint.catchPatch.bind(this.MethodEndpoint));
        Router.put('/',this.MethodEndpoint.catchPatch.bind(this.MethodEndpoint));
        Router.get('/stats',this.MethodEndpoint.returnStats.bind(this.MethodEndpoint));
        return Router;
    }
}

module.exports = ExampleController;