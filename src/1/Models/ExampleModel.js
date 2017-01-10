/* A loose example of a simple Model */
class ExampleModel{
    constructor(){
        this.DELETE = 0;
        this.POST = 0;
        this.GET = 0;
        this.PUT = 0;
        this.PATCH = 0;
    }

    incrementDELETE(){
        this.DELETE++;
        return this.DELETE;
    }

    incrementPOST(){
        this.POST++;
        return this.POST;
    }

    incrementGET(){
        this.GET++;
        return this.GET;
    }

    incrementPUT(){
        this.PUT++;
        return this.PUT;
    }

    incrementPATCH(){
        this.PATCH++;
        return this.PATCH;
    }

    flatten(){
        return {
            DELETE:this.DELETE,
            POST:this.POST,
            GET:this.GET,
            PUT:this.PUT,
            PATCH:this.PATCH
        };
    }
}

module.exports = ExampleModel;