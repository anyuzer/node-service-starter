const { ArcObject } = require('arc-lib');
const requestMock = require('./requestMock.json');
const responseMock = require('./responseMock.json');

class CtxMock{
    static basicHEAD(_targetUrl) {
        return CtxMock._contextFactory('HEAD', _targetUrl)
    }

    static basicGET(_targetUrl) {
        return CtxMock._contextFactory('GET', _targetUrl)
    }

    static basicPOST(_targetUrl) {
        return CtxMock._contextFactory('POST', _targetUrl)
    }

    static basicPUT(_targetUrl) {
        return CtxMock._contextFactory('PUT', _targetUrl);
    }

    static basicPATCH(_targetUrl) {
        return CtxMock._contextFactory('PATCH', _targetUrl);
    }

    static basicDELETE(_targetUrl) {
        return CtxMock._contextFactory('DELETE', _targetUrl)
    }

    static _contextFactory(_method, _url) {
        const ctx = {
            request: ArcObject.copy(requestMock),
            response: ArcObject.copy(responseMock)
        }
        ctx.request.method = _method;
        ctx.request.url = _url;
        return ctx;
    }
}

module.exports = CtxMock;