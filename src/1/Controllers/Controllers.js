const Router = require('express').Router;
const ExampleController = require('./ExampleController');
const ExampleModel = require('../Models/ExampleModel');
const HTTPClient = require('../../Adapters/HTTPClient');

const HTTPClientMock = require('../../../__mocks__/HTTPClient');
const ExampleModelMock = require('../../../__mocks__/1/Models/ExampleModel');

/*
An example of our top level controller. This controller is responsible for initializing and aggregating
the major route scopes and binding them without tightly coupling with the underlying routing.
*/
class Controllers{
    constructor(){
        //Our versioned proxy router
        this.BaseRouter = new Router;

        //A Mock Controller (we can use our real Controller and classes, simply by passing mock Models)
        let MockProxyClient = new HTTPClientMock;
        MockProxyClient.setGETMock(200,{},'EXAMPLE MOCK');
        this.MockExampleController = new ExampleController(new ExampleModelMock,MockProxyClient);

        //And our controller
        this.ExampleController = new ExampleController(new ExampleModel,new HTTPClient);
    }

    getRouter(){
        //Bind a mock
        this.BaseRouter.use('/mock/example',this.MockExampleController.getRouter());

        //And a real
        this.BaseRouter.use('/example',this.ExampleController.getRouter());

        //Should return an Express.Router
        return this.BaseRouter;
    }
}

module.exports = Controllers;