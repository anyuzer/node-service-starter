/*
 NOTE: We do not write tests against our mocks.
 Mocks must provide an interface/api that matches the class it is mocking (should also maintain return behavior). Data can be static.
 */
class RequestMock{
    constructor(){
        this.params = {};
        this.body;
    }

    setParams(_params){
        this.params = _params;
    }

    setBody(_body){
        this.body = _body;
    }

    reset(){
        this.params = {};
        this.body = undefined;
    }
}
module.exports = RequestMock;