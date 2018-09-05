const { ArcRouter, ArcObject } = require('arc-lib');

class KoaRouter {
    constructor() {
        this.routers = {};
        this.maps = {};
        this.intercept = this.intercept.bind(this);
    }

    all(_route, _f) {
        ['get', 'head', 'post', 'put', 'patch'].forEach((_val) => {
            this._bindPathsToMap(_val, _route, _f);
        });
    }

    get(_route, _f) {
        this._bindPathsToMap('get', _route, _f);
    }

    head(_route, _f) {
        this._bindPathsToMap('head', _route, _f);
    }

    post(_route, _f) {
        this._bindPathsToMap('post', _route, _f);
    }

    put(_route, _f) {
        this._bindPathsToMap('put', _route, _f);
    }

    patch(_route, _f) {
        this._bindPathsToMap('patch', _route, _f);
    }

    _bindPathsToMap(_method, _path, _f) {
        this._initRouter(_method);
        if (_f instanceof KoaRouter) {
            if (!_f.maps[_method]) {
                return;
            }
            _f.maps[_method].forEach((_subCall, _subPath) => {
                _path = (_path === '/' ? '' : _path);
                _subPath = (_subPath === '/' ? '' : _subPath);
                this.maps[_method][`${_path}${_subPath}`] = _subCall;
            });
            return this.routers[_method].setMap(this.maps[_method]);
        }
        this.maps[_method][_path] = _f;
        return this.routers[_method].setMap(this.maps[_method]);
    }

    _initRouter(_method) {
        if (!this.routers[_method]) {
            this.routers[_method] = new ArcRouter;
            this.maps[_method] = new ArcObject;
        }
    }

    _travel(_method, _ctx) {
        if (this.routers[_method]) {
            return this.routers[_method].travel(_ctx.request.path);
        }
        return { match: false };
    }

    async intercept(_ctx, _next) {
        let routeData = { match: false };
        switch (_ctx.request.method.toLowerCase()) {
            case 'get': routeData = this._travel('get', _ctx); break;
            case 'head': routeData = this._travel('head', _ctx); break;
            case 'post': routeData = this._travel('post', _ctx); break;
            case 'put': routeData = this._travel('put', _ctx); break;
            case 'patch': routeData = this._travel('patch', _ctx); break;
        }

        if (routeData.match) {
            _ctx.request.routeData = routeData;
            await routeData.match(_ctx, _next, routeData);
        }
        await _next();
    }
}

module.exports = KoaRouter;