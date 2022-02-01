const KoaRouter = require('../../../src/Middleware/KoaRouter');
const CtxMock = require('../../../__mocks__/CtxMock');
const NextMock = require('../../../__mocks__/NextMock');

describe('KoaRouter Class', ()=>{
    it('should be instanceOf KoaRouter',()=>{
        const TestRouter = new KoaRouter();
        expect(TestRouter).toBeInstanceOf(KoaRouter);
    });

    it('should bind a function to an ArcRouter style path, and fire appropriately on an incoming GET request, but not for a non GET request', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        let matchCounter = 0;
        TestRouter.get('/test-get', () => {
            matchCounter++;
        });

        await TestRouter.intercept(CtxMock.basicGET('/test-get'), next.spy)
        await TestRouter.intercept(CtxMock.basicPOST('/test-get'), next.spy)

        expect(matchCounter).toBe(1);
    })

    it('should bind a function to an ArcRouter style path, and fire appropriately on an incoming HEAD request, but not for a non HEAD request', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        let matchCounter = 0;
        TestRouter.head('/test-head', () => {
            matchCounter++;
        });

        await TestRouter.intercept(CtxMock.basicHEAD('/test-head'), next.spy)
        await TestRouter.intercept(CtxMock.basicPOST('/test-head'), next.spy)

        expect(matchCounter).toBe(1);
    })

    it('should bind a function to an ArcRouter style path, and fire appropriately on an incoming POST request, but not for a non POST request', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        let matchCounter = 0;
        TestRouter.post('/test-post', () => {
            matchCounter++;
        });

        await TestRouter.intercept(CtxMock.basicPOST('/test-post'), next.spy)
        await TestRouter.intercept(CtxMock.basicGET('/test-post'), next.spy)

        expect(matchCounter).toBe(1);
    })

    it('should bind a function to an ArcRouter style path, and fire appropriately on an incoming PUT request, but not for a non PUT request', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        let matchCounter = 0;
        TestRouter.put('/test-put', () => {
            matchCounter++;
        });

        await TestRouter.intercept(CtxMock.basicPUT('/test-put'), next.spy)
        await TestRouter.intercept(CtxMock.basicGET('/test-put'), next.spy)

        expect(matchCounter).toBe(1);
    })

    it('should bind a function to an ArcRouter style path, and fire appropriately on an incoming PATCH request, but not for a non PATCH request', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        let matchCounter = 0;
        TestRouter.patch('/test-patch', () => {
            matchCounter++;
        });

        await TestRouter.intercept(CtxMock.basicPATCH('/test-patch'), next.spy)
        await TestRouter.intercept(CtxMock.basicGET('/test-put'), next.spy)

        expect(matchCounter).toBe(1);
    })

    it('should bind a function to an ArcRouter style path, and fire appropriately on an incoming DELETE request, but not for a non DELETE request', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        let matchCounter = 0;
        TestRouter.delete('/test-delete', () => {
            matchCounter++;
        });

        await TestRouter.intercept(CtxMock.basicDELETE('/test-delete'), next.spy)
        await TestRouter.intercept(CtxMock.basicGET('/test-delete'), next.spy)
        expect(matchCounter).toBe(1);
    })

    it('should bind a function to an ArcRouter style path, and fire appropriately on ALL incoming requests', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        let matchCounter = 0;

        TestRouter.all('/test-all', () => {
            matchCounter++;
        });

        await TestRouter.intercept(CtxMock.basicHEAD('/test-all'), next.spy);
        await TestRouter.intercept(CtxMock.basicGET('/test-all'), next.spy);
        await TestRouter.intercept(CtxMock.basicPOST('/test-all'), next.spy);
        await TestRouter.intercept(CtxMock.basicPUT('/test-all'), next.spy);
        await TestRouter.intercept(CtxMock.basicPATCH('/test-all'), next.spy);
        await TestRouter.intercept(CtxMock.basicDELETE('/test-all'), next.spy);

        expect(matchCounter).toBe(6);
    })

    it('should accept a KoaRouter as a target, and check nested routes appropriately', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        const SubRouter = new KoaRouter();

        let matchCounter = 0;
        SubRouter.get('/get', () => {
            matchCounter++;
        });

        TestRouter.all('/test', SubRouter);

        await TestRouter.intercept(CtxMock.basicPOST('/test/post'), next.spy);
        await TestRouter.intercept(CtxMock.basicPOST('/test/get'), next.spy);
        await TestRouter.intercept(CtxMock.basicGET(''), next.spy);
        await TestRouter.intercept(CtxMock.basicGET('/'), next.spy);
        await TestRouter.intercept(CtxMock.basicGET('/test'), next.spy);
        await TestRouter.intercept(CtxMock.basicGET('/test/'), next.spy);
        await TestRouter.intercept(CtxMock.basicGET('/test/get'), next.spy);

        expect(matchCounter).toBe(1);
    })

    it('should accept a KoaRouter as a target on a root empty path, and resolve the empty path appropriately', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        const SubRouter = new KoaRouter();

        let matchCounter = 0;
        SubRouter.get('/get', () => {
            matchCounter++;
        });

        TestRouter.get('/', SubRouter);

        await TestRouter.intercept(CtxMock.basicPOST('/get'), next.spy);
        await TestRouter.intercept(CtxMock.basicGET('/get'), next.spy);
        expect(matchCounter).toBe(1);
    })

    it('should accept a KoaRouter with an empty target on a root path, and resolve the empty path appropriately', async () => {
        const next = new NextMock();
        const TestRouter = new KoaRouter();
        const SubRouter = new KoaRouter();

        let matchCounter = 0;
        SubRouter.get('/', () => {
            matchCounter++;
        });

        TestRouter.get('/get', SubRouter);

        await TestRouter.intercept(CtxMock.basicPOST('/get'), next.spy);
        await TestRouter.intercept(CtxMock.basicGET('/get'), next.spy);
        expect(matchCounter).toBe(1);
    })
});
