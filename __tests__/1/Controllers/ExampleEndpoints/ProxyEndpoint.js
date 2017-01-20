const ProxyEndpoint = require('../../../../src/1/Controllers/ExampleEndpoints/ProxyEndpoint');
const ResponseMock = require('../../../../__mocks__/ResponseMock');
const RequestMock = require('../../../../__mocks__/RequestMock');
const NextMock = require('../../../../__mocks__/NextMock');
const HTTPClient = require('../../../../__mocks__/HTTPClient');

describe('V1 Example Proxy Endpoint',()=>{
    var response,request,next,TestEndpoint,TestClient;
    TestClient = new HTTPClient;
    TestClient.setGETMock(200,{},'An expected response');
    TestEndpoint = new ProxyEndpoint(TestClient);

    it('should be an instance of ProxyEndpoint',()=>{
        expect(TestEndpoint).toBeInstanceOf(ProxyEndpoint);
    });

    it('should proxy the status and fetched body to response',()=>{
        response = new ResponseMock;
        request = new RequestMock;
        TestEndpoint.fetchExample(request,response);

        //All endpoints are fundamentally asynchronous, as response is normally an object waiting to have data written to the requesting socket. In this case we can force Jest to wait for the next tick before evaluating the response
        setTimeout(()=>{
            expect(response.getStatus()).toBe(200);
            expect(response.getResponseBody()).toEqual('An expected response');
        },0);
    });
    
    it('should propogate an error to our next handler',()=>{
        var E = new Error('Test');
        TestClient.setError(E);

        response = new ResponseMock;
        request = new RequestMock;
        next = new NextMock;

        TestEndpoint.fetchExample(request,response,next.spy());

        //All endpoints are fundamentally asynchronous, as response is normally an object waiting to have data written to the requesting socket. In this case we can force Jest to wait for the next tick before evaluating the response
        setTimeout(()=>{
            expect(next.data).toBe(E);
        },0);
    });
    
});