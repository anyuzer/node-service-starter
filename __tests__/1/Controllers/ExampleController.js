const ExampleController = require('../../../src/1/Controllers/ExampleController');
const ExampleModel = require('../../../src/1/Models/ExampleModel');
const ExpressRouter = require('express').Router;
const ArcObject = require('arc-lib').object;

describe('V1 Example Controller Class',()=>{
    var TestModel = new ExampleModel;
    var TestController = new ExampleController(TestModel);

    it('should be instanceOf ExampleController',()=>{
        expect(TestController).toBeInstanceOf(ExampleController);
    });

    it('should return an object that has the same API as express.Router',()=>{
        var ExampleRouter = new ExpressRouter;
        expect(ArcObject.duckInstanceOf(ExpressRouter,TestController.getRouter())).toBe(true);
    });
});
