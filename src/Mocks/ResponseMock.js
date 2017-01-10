/*
 NOTE: We do not write tests against our mocks.
 Mocks must provide an interface/api that matches the class it is mocking (should also maintain return behavior). Data can be static.
 */
class ResponseMock{
    constructor(){
        this.statusCode;
        this.responseBody;
    }

    sendStatus(_code){
        this.statusCode = _code;
        return this;
    }

    status(_code){
        this.statusCode = _code;
        return this;
    }

    send(_responseBody){
        this.responseBody = _responseBody;
    }

    getStatus(){
        return this.statusCode;
    }

    getResponseBody(){
        return this.responseBody;
    }

    reset(){
        this.statusCode = undefined;
        this.responseBody = undefined;
    }
}
module.exports = ResponseMock;