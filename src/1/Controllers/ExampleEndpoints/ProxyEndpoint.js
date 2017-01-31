/*
An example of a ProxyEndpoint, as well as making a downstream request.
Both HTTPClient is injected, as is request/response, ensuring testability with Mocks
 */
class ProxyEndpoint{
    constructor(_HTTPClient){
        this.HTTPClient = _HTTPClient;
        this.HTTPClient.setHostname('www.example.com');
    }

    fetchExample(_request,_response,_next){
        var promise = this.HTTPClient.getRemote(_next).then((_remoteResponse)=>{
            this._resolveResponse(_remoteResponse,_response);
        });

        //In event that our remote request fails, we need to catch the async error, and propogate it to next which advances the middleware manually (to our error handling middleware)
        return this._catchErrors(promise,_next);
    }

    _resolveResponse(_remoteResponse,_requestedResponse){
        var [statusCode,headers,body] = _remoteResponse;
        _requestedResponse.status(statusCode).send(body);
    }

    //This is a generic catch all errors and resolve a 500 to the browser.
    _catchErrors(_promise,_next){
        return _promise.catch((_E)=>{
            _next(_E);
        });
    }
}

module.exports = ProxyEndpoint;