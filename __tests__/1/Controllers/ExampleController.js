const ExampleController = require('../../../src/1/Controllers/ExampleController');
const ExampleModel = require('../../../src/1/Models/ExampleModel');
const ExpressRouter = require('express').Router;
const ArcObject = require('arc-lib').object;
const MockClient = require('../../../src/Mocks/HTTPClient');

describe('V1 Example Controller Class',()=>{
    var TestController = new ExampleController(new ExampleModel,new MockClient);

    it('should be instanceOf ExampleController',()=>{
        expect(TestController).toBeInstanceOf(ExampleController);
    });

    it('should return an object that has the same API as express.Router',()=>{
        var ExampleRouter = new ExpressRouter;
        expect(ArcObject.duckInstanceOf(ExpressRouter,TestController.getRouter())).toBe(true);
    });
});
