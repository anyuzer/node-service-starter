const ProxyEndpoint = require('../../../../src/1/Controllers/ExampleEndpoints/ProxyEndpoint');
const ResponseMock = require('../../../../src/Mocks/ResponseMock');
const RequestMock = require('../../../../src/Mocks/RequestMock');
const HTTPClient = require('../../../../src/Mocks/HTTPClient');

describe('V1 Example Proxy Endpoint',()=>{
    var response,request,TestEndpoint,TestClient;
    TestClient = new HTTPClient;
    TestEndpoint = new ProxyEndpoint(TestClient);
    TestClient.setGETMock(200,{},'An expected response');

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
});