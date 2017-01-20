const HTTP = require('http');
const queryString = require('querystring');
const ArcObject = require('arc-lib').object;

/*
 NOTE: We do not write tests against our mocks.
 Mocks must provide an interface/api that matches the class it is mocking (should also maintain return behavior). Data can be static.
 */
class HTTPClient{
    static get TYPE_JSON(){
        return 0;
    }

    static get TYPE_FORM(){
        return 1;
    }

    constructor(){
        this.hostname = 'localhost';
        this.port = 80;
        this.path = '/';
        this.headers = new ArcObject;

        this.family = undefined;
        this.localAddress = undefined;
        this.socketPath = undefined;
        this.auth = undefined;
        this.timeout = undefined;
        this.transferType = HTTPClient.TYPE_JSON;

        //Mock Status
        this.mockHEAD = this._genericResponseFactory();
        this.mockGET = this._genericResponseFactory();
        this.mockDELETE = this._genericResponseFactory();
        this.mockPOST = this._genericResponseFactory();
        this.mockPUT = this._genericResponseFactory();
        this.mockPATCH = this._genericResponseFactory();
        this.error = undefined;
    }

    //Setters
    setTransferType(_transferType){
        this.transferType = _transferType;
    }

    setHostname(_host){
        this.hostname = _host;
    }

    setFamily(_family){
        this.family = _family;
    }

    setPort(_port){
        this.port = _port;
    }

    setLocalAddress(_localAddress){
        this.localAddress = _localAddress;
    }

    setSocketPath(_socketPath){
        this.socketPath = _socketPath;
    }

    setMethod(_method){
        this.method = _method;
    }

    setPath(_path){
        this.path = _path;
    }

    setHeader(_key,_val){
        this.headers[_key] = _val;
    }

    setAuth(_auth){
        this.auth = _auth;
    }

    setTimeout(_timeout){
        this.timeout = _timeout;
    }

    setReturnStream(){
        //TODO: this. We can support streams easily, but there is no pressing need or current active use case.
    }

    setError(_E){
        this.error = _E;
    }

    //Consumers
    getRemote(){
        return this._mockRemote(this.mockGET);
    }

    headRemote(){
        return this._mockRemote(this.mockHEAD);
    }

    postRemote(_postData){
        return this._mockRemote(this.mockPOST);
    }

    putRemote(_putData){
        return this._mockRemote(this.mockPUT);
    }

    patchRemote(_patchData){
        return this._mockRemote(this.mockPATCH);
    }

    deleteRemote(){
        return this._mockRemote(this.mockDELETE);
    }

    //In our mock we have some additional methods to mock out HTTPClient
    setGETMock(_responseCode,_responseHeaders,_responseBody){
        this.mockGET.status = _responseCode || this.mockGET.status;
        this.mockGET.headers = _responseHeaders || this.mockGET.headers;
        this.mockGET.body = _responseBody || this.mockGET.body;
    }

    setHEADMock(_responseCode,_responseHeaders,_responseBody){
        this.mockHEAD.status = _responseCode || this.mockHEAD.status;
        this.mockHEAD.headers = _responseHeaders || this.mockHEAD.headers;
        this.mockHEAD.body = _responseBody || this.mockHEAD.body;
    }

    setPOSTMock(_responseCode,_responseHeaders,_responseBody){
        this.mockPOST.status = _responseCode || this.mockPOST.status;
        this.mockPOST.headers = _responseHeaders || this.mockPOST.headers;
        this.mockPOST.body = _responseBody || this.mockPOST.body;
    }

    setPUTMock(_responseCode,_responseHeaders,_responseBody){
        this.mockPUT.status = _responseCode || this.mockPUT.status;
        this.mockPUT.headers = _responseHeaders || this.mockPUT.headers;
        this.mockPUT.body = _responseBody || this.mockPUT.body;
    }

    setPATCHMock(_responseCode,_responseHeaders,_responseBody){
        this.mockPATCH.status = _responseCode || this.mockPATCH.status;
        this.mockPATCH.headers = _responseHeaders || this.mockPATCH.headers;
        this.mockPATCH.body = _responseBody || this.mockPATCH.body;
    }

    setDELETEMock(_responseCode,_responseHeaders,_responseBody){
        this.mockDELETE.status = _responseCode || this.mockDELETE.status;
        this.mockDELETE.headers = _responseHeaders || this.mockDELETE.headers;
        this.mockDELETE.body = _responseBody || this.mockDELETE.body;
    }

    _checkError(){
        if(this.error){
            throw this.error;
        }
    }

    _mockRemote(_response){
        return new Promise((_resolve,_reject)=>{
            if(this.error){
                return _reject(this.error);
            }
            var response = [_response.status,_response.headers,_response.body];
            if(_response.status < 200 || _response.status >= 300){
                return _reject(response);
            }
            _resolve(response);
        });
    }

    _genericResponseFactory(){
        return {
            status:200,
            headers:{},
            body:''
        }
    }
}

module.exports = HTTPClient;