const { v4 } = require('uuid');

class SessionHandler {
    constructor() {
        this.session = undefined;
    }

    async intercept(_ctx, _next) {
        if (_ctx.request.headers['x-session']) {
            _ctx.request.session = { id: _ctx.request.headers['x-session'] };
            return _next();
        }
        if (_ctx.request.headers.cookie) {
            const id = _ctx.request.headers.cookie.match(/id=([^;| ]*)/);
            if (id && id[1]) {
                _ctx.request.session = { id: id[1] };
                return _next();
            }
        }
        const id = v4();
        _ctx.cookies.set('id', id);
        _ctx.request.session = { id };
        return _next();
    }
}

module.exports = SessionHandler;