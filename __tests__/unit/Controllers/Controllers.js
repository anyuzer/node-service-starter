const { ArcHash } = require('arc-lib');

const Controllers = require('../../../src/Controllers/Controllers');
const KoaRouter = require('../../../src/Middleware/KoaRouter');
const ExampleModel = require('../../../src/Models/ExampleModel');

const CtxMock = require('../../../__mocks__/CtxMock');
const Next = require('../../../__mocks__/NextMock');

describe('Controllers Class',()=>{
    //Controllers are simple, not a ton to test here
    it('should be instanceOf Controllers',()=>{
        const TestControllers = new Controllers;
        expect(TestControllers).toBeInstanceOf(Controllers);
    });

    it('getRouter() should return an instance of KoaRouter',async ()=>{
        const TestControllers = new Controllers;
        expect(TestControllers.getRouter()).toBeInstanceOf(KoaRouter);
    });

    //But we should be able to exhaustively test our endpoints as well through our Controller
    it('should return an array of items when a GET method requests /items', async () => {
        const ctx = CtxMock.basicGET('/items');
        const next = new Next();

        const TestControllers = new Controllers;
        await TestControllers.getRouter().intercept(ctx,next.spy());

        //Now we can check our ctx status and body
        expect(ctx.response.status).toBe(200);
        expect(ctx.response.body[0].fieldString).toBe('zero');
    });

    it('should return an item when a GET method requests /item/*id and matches a successful ID', async () => {
        const ctx = CtxMock.basicGET('/items/one');
        const next = new Next();

        const TestControllers = new Controllers;
        await TestControllers.getRouter().intercept(ctx,next.spy());

        //Now we can check our ctx status and body
        expect(ctx.response.status).toBe(200);
        expect(ctx.response.body.fieldString).toBe('one');
    });

    it('should return a 404 when an itemId is not found', async () => {
        const ctx = CtxMock.basicGET('/items/twelve');
        const next = new Next();

        const TestControllers = new Controllers;
        await TestControllers.getRouter().intercept(ctx,next.spy());

        //Now we can check our ctx status and body
        expect(ctx.response.status).toBe(404);
    });

    it('should return a new item that has been posted to /item', async () => {
        const testPostModel = new ExampleModel({fieldNumber:12, fieldString: 'twelve'});

        const ctx = CtxMock.basicPOST('/items');
        ctx.request.body = testPostModel.serialize();
        const next = new Next();

        const TestControllers = new Controllers;
        await TestControllers.getRouter().intercept(ctx,next.spy());

        //Now we can check our ctx status and body
        expect(ctx.response.status).toBe(200);
        expect(ArcHash.md5(ctx.response.body)).toBe(ArcHash.md5(testPostModel.serialize()));
    });

    it('should return a 500 when invalid item data is posted', async () => {
        const ctx = CtxMock.basicPOST('/items');
        ctx.request.body = {fieldNumber:'twelve', fieldString: 12}
        const next = new Next();

        const TestControllers = new Controllers;
        await TestControllers.getRouter().intercept(ctx,next.spy());

        //Now we can check our ctx status and body
        expect(ctx.response.status).toBe(500);
    });

});
