const Router = require('express').Router;
const ExampleController = require('./ExampleController');
const ExampleModel = require('../Models/ExampleModel');
const ExampleModelMock = require('../../Mocks/1/Models/ExampleModel');

/*
An example of our top level controller. This controller is responsible for initializing and aggregating
the major route scopes and binding them without tightly coupling with the underlying routing.
*/
class Controllers{
    constructor(){
        //Our versioned proxy router
        this.BaseRouter = new Router;

        //A Mock Controller (we can use our real Controller and classes, simply by passing mock Models)
        this.MockExampleController = new ExampleController(new ExampleModelMock);
        
        //An Example Model
        this.ExampleModel = new ExampleModel;

        //And our controller
        this.ExampleController = new ExampleController(this.ExampleModel);
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