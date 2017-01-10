/*
NOTE: We do not write tests against our mocks.
Mocks must provide an interface/api that matches the class it is mocking (should also maintain return behavior). Data can be static.
 */
class ExampleModel{
    constructor(){}

    incrementDELETE(){
        return 1;
    }

    incrementPOST(){
        return 1;
    }

    incrementGET(){
        return 1;
    }

    incrementPUT(){
        return 1;
    }

    incrementPATCH(){
        return 1;
    }

    flatten(){
        return {
            DELETE:1,
            POST:1,
            GET:1,
            PUT:1,
            PATCH:1
        };
    }
}

module.exports = ExampleModel;