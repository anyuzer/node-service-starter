/*
An example of a ProxyEndpoint, as well as making a downstream request.
Both HTTPClient is injected, as is request/response, ensuring testability with Mocks
 */
class ProxyEndpoint{
    constructor(_HTTPClient){
        this.HTTPClient = _HTTPClient;
        this.HTTPClient.setHostname('www.example.com');
    }
    
    fetchExample(_request,_response){
        this.HTTPClient.getRemote().then((_clientResponse)=>{
            var [statusCode,headers,body] = _clientResponse;
            _response.status(statusCode).send(body);
        });
    }
}

module.exports = ProxyEndpoint;