const ExampleModel = require('../../Models/ExampleModel');

class ExampleEndpoint{
    constructor() {
        this.getItems = this.getItems.bind(this);
        this.getItem = this.getItem.bind(this);
        this.postItem = this.postItem.bind(this);
    }

    //We get our items from wherever (Database / Cache / etc) and serialize for the wire
    async getItems(_ctx, _next) {
        _ctx.response.status = 200;
        _ctx.response.body = this._getItems().map(Model => Model.serialize());
    }

    async getItem(_ctx, _next) {
        let item;
        this._getItems().forEach((_item) => {
            if(item) {
                return;
            }
            if(_item.getFieldString() === _ctx.request.route.id) {
                item = _item;
            }
        })

        if(item) {
            _ctx.response.status = 200;
            _ctx.response.body = item.serialize();
            return;
        }
        _ctx.response.status = 404;
        _ctx.response.body = {message:'Not found'};
    }

    //Faux post. Add the raw data to a model. If it validates, post it
    async postItem(_ctx, _next) {
        try {
            const newItem = _ctx.request.body;
            _ctx.response.status = 200;
            _ctx.response.body = (new ExampleModel(newItem)).serialize();
        } catch (e) {
            //Otherwise, log the data and the real error
            console.log(e.message);
            console.log(_ctx.request.body)

            //500 and decide the appropriate message to return (less for public, more for API, most for internal devs)
            _ctx.response.status = 500;
            _ctx.response.body = {message: 'Failed to add item. An error occurred.'};
        }
    }

    //Just mock out a quick array of faux items
    _getItems() {
        return [[0,'zero'],[1,'one'],[2,'two']].map(([num,string]) => {
            return new ExampleModel({fieldString:string,fieldNumber:num})
        })
    }
}

module.exports = ExampleEndpoint;