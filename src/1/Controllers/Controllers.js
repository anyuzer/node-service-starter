const KoaRouter = require('../../Middleware/KoaRouter');
const ExampleEndpoint = require('./Endpoints/ExampleEndpoint');

class Controllers{
    constructor(){
        this.BaseRouter = new KoaRouter();
        this.ExampleEndpoint = new ExampleEndpoint();
    }

    getRouter(){
        this.BaseRouter.get('/',this.ExampleEndpoint.getSomething.bind(this.ExampleEndpoint));
        return this.BaseRouter;
    }
}

module.exports = Controllers;