const ExampleModel = require('../../../../src/1/Models/ExampleModel');
const MethodEndpoint = require('../../../../src/1/Controllers/ExampleEndpoints/MethodEndpoint');
const ResponseMock = require('../../../../__mocks__/ResponseMock');
const RequestMock = require('../../../../__mocks__/RequestMock');

describe('V1 Example Method Endpoint',()=>{
    var response,request,TestModel,TestEndpoint;
    TestModel = new ExampleModel();
    TestEndpoint = new MethodEndpoint(TestModel);

    it('should be an instance of MethodEndpoint',()=>{
        expect(TestEndpoint).toBeInstanceOf(MethodEndpoint);
    });

    it('should return number of times endpoint has been accessed by DELETE',()=>{
        response = new ResponseMock;
        request = new RequestMock;
        TestEndpoint.catchDelete(request,response);
        expect(response.getStatus()).toBe(200);
        expect(response.getResponseBody()).toEqual({
            DELETE:1
        });
    });

    it('should return number of times endpoint has been accessed by GET',()=>{
        response = new ResponseMock;
        request = new RequestMock;
        TestEndpoint.catchGet(request,response);
        expect(response.getStatus()).toBe(200);
        expect(response.getResponseBody()).toEqual({
            GET:1
        });
    });

    it('should return number of times endpoint has been accessed by POST',()=>{
        response = new ResponseMock;
        request = new RequestMock;
        TestEndpoint.catchPost(request,response);
        expect(response.getStatus()).toBe(200);
        expect(response.getResponseBody()).toEqual({
            POST:1
        });
    });

    it('should return number of times endpoint has been accessed by PUT',()=>{
        response = new ResponseMock;
        request = new RequestMock;
        TestEndpoint.catchPut(request,response);
        expect(response.getStatus()).toBe(200);
        expect(response.getResponseBody()).toEqual({
            PUT:1
        });
    });

    it('should return number of times endpoint has been accessed by PATCH',()=>{
        response = new ResponseMock;
        request = new RequestMock;
        TestEndpoint.catchPatch(request,response);
        expect(response.getStatus()).toBe(200);
        expect(response.getResponseBody()).toEqual({
            PATCH:1
        });
    });

    it('should return the stats of all example methods accessed',()=>{
        response = new ResponseMock;
        request = new RequestMock;
        TestEndpoint.returnStats(request,response);
        expect(response.getStatus()).toBe(200);
        expect(response.getResponseBody()).toEqual({
            DELETE:1,
            POST:1,
            GET:1,
            PUT:1,
            PATCH:1
        });
    });
});