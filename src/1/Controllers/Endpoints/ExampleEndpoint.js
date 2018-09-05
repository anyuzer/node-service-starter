const serialize = require('serialize-javascript');

class ExampleEndpoint{
    async getSomething(_ctx, _next) {
        try{
            _ctx.response.status = 200;
            _ctx.response.body = ["OK"];
        }
        catch(_e){
            console.log(_e);
        }
    }
}

module.exports = ExampleEndpoint;