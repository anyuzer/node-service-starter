const { ArcRouter, ArcObject } = require('arc-lib');

class KoaRouter {
    constructor() {
        this.routers = {};
        this.maps = {};
        this.intercept = this.intercept.bind(this);
    }

    //Our core method that accepts incoming requests and routes them
    async intercept(_ctx, _next) {
        let routeData = { match: false };
        switch (_ctx.request.method.toLowerCase()) {
            case 'head': routeData = this._travel('head', _ctx); break;
            case 'get': routeData = this._travel('get', _ctx); break;
            case 'post': routeData = this._travel('post', _ctx); break;
            case 'put': routeData = this._travel('put', _ctx); break;
            case 'patch': routeData = this._travel('patch', _ctx); break;
            case 'delete': routeData = this._travel('delete', _ctx); break;
        }

        if (routeData.match) {
            _ctx.request.route = routeData;
            await routeData.match(_ctx, _next, routeData);
        }
        await _next();
    }

    //Our binding methods which allow us to bind routes to request types
    all(_route, _f) {
        ['get', 'head', 'post', 'put', 'patch', 'delete'].forEach((_val) => {
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

    delete(_route, _f) {
        this._bindPathsToMap('delete', _route, _f);
    }

    //Private
    _bindPathsToMap(_method, _path, _f) {
        if (_f instanceof KoaRouter) {
            if (!_f.maps[_method]) {
                return;
            }
            this._initRouter(_method);
            _f.maps[_method].forEach((_subCall, _subPath) => {
                _path = (_path === '/' ? '' : _path);
                _subPath = (_subPath === '/' ? '' : _subPath);

                this.maps[_method][`${_path}${_subPath}`] = _subCall;
            });
            return this.routers[_method].setMap(this.maps[_method]);
        }
        this._initRouter(_method);
        this.maps[_method][_path] = _f;
        return this.routers[_method].setMap(this.maps[_method]);
    }

    _initRouter(_method) {
        if (!this.routers[_method]) {
            this.routers[_method] = new ArcRouter;
            this.routers[_method].setCaptureQuery(true);
            this.maps[_method] = new ArcObject;
        }
    }

    _travel(_method, _ctx) {
        if (this.routers[_method]) {
            return this.routers[_method].travel(_ctx.request.url);
        }
        return { match: false };
    }
}

module.exports = KoaRouter;