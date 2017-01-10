/*
An example of a simple endpoint class. In this case we have individual resolution methods intended for each method of REST. 
The request/response is injected though, keeping these classes individually testable using Mocks.
 */
class MethodEndpoint{
    constructor(_ExampleModel){
        this.ExampleModel = _ExampleModel;
    }

    catchGet(_request,_response){
        _response.status(200).send({
            GET:this.ExampleModel.incrementGET()
        });
    }

    catchPost(_request,_response){
        _response.status(200).send({
            POST:this.ExampleModel.incrementPOST()
        });
    }
    
    catchPut(_request,_response){
        _response.status(200).send({
            PUT:this.ExampleModel.incrementPUT()
        });
    }
    
    catchPatch(_request,_response){
        _response.status(200).send({
            PATCH:this.ExampleModel.incrementPATCH()
        });
    }

    catchDelete(_request,_response){
        _response.status(200).send({
            DELETE:this.ExampleModel.incrementDELETE()
        });
    }

    returnStats(_request,_response){
        _response.status(200).send(this.ExampleModel.flatten());
    }
}

module.exports = MethodEndpoint;