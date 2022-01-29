const KoaRouter = require('../Middleware/KoaRouter.js');
const ExampleEndpoint = require("./Endpoints/ExampleEndpoint.js");

class Controllers{
    constructor(){
        this.BaseRouter = new KoaRouter();
        this.ExampleEndpoint = new ExampleEndpoint();
    }

    getRouter(){
        //Be RESTful
        this.BaseRouter.post('/items',this.ExampleEndpoint.postItem);
        this.BaseRouter.get('/items',this.ExampleEndpoint.getItems);
        this.BaseRouter.get('/items/*id',this.ExampleEndpoint.getItem);
        return this.BaseRouter;
    }
}

module.exports = Controllers;