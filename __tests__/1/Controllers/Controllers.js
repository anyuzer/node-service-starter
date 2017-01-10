const Controllers = require('../../../src/1/Controllers/Controllers');
const ExpressRouter = require('express').Router;
const ArcObject = require('arc-lib').object;

describe('V1 Controllers Class',()=>{
    var TestControllers = new Controllers;
    it('should be instanceOf Controllers',()=>{
        expect(TestControllers).toBeInstanceOf(Controllers);
    });

    it('should return an object that has the same API as express.Router',()=>{
        var ExampleRouter = new ExpressRouter;
        expect(ArcObject.duckInstanceOf(ExpressRouter,TestControllers.getRouter())).toBe(true);
    });
});
