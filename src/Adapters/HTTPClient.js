const HTTP = require('http');
const queryString = require('querystring');
const { ArcObject } = require('arc-lib');

/*
NOTE: We do not test spaces that we do not own. Adapters are excluded from testing.
Adapters abstract and wrap ownership spaces we don't own. They allow our app to use concepts required by the app without tightly coupling to the underlying functionality.
 */
class HTTPClient{
    static get TYPE_JSON(){
        return 0;
    }

    static get TYPE_FORM(){
        return 1;
    }

    constructor(){
        this.hostname = 'localhost';
        this.port = 80;
        this.path = '/';
        this.headers = new ArcObject;

        this.family = undefined;
        this.localAddress = undefined;
        this.socketPath = undefined;
        this.auth = undefined;
        this.timeout = undefined;
        this.transferType = HTTPClient.TYPE_JSON;
    }

    //Setters
    setTransferType(_transferType){
        this.transferType = _transferType;
    }

    setHostname(_host){
        this.hostname = _host;
    }

    setFamily(_family){
        this.family = _family;
    }

    setPort(_port){
        this.port = _port;
    }

    setLocalAddress(_localAddress){
        this.localAddress = _localAddress;
    }

    setSocketPath(_socketPath){
        this.socketPath = _socketPath;
    }

    setMethod(_method){
        this.method = _method;
    }

    setPath(_path){
        this.path = _path;
    }

    setHeader(_key,_val){
        this.headers[_key] = _val;
    }

    setAuth(_auth){
        this.auth = _auth;
    }

    setTimeout(_timeout){
        this.timeout = _timeout;
    }

    setReturnStream(){
        //TODO: this. We can support streams easily, but there is no pressing need or current active use case.
    }

    //Consumers
    getRemote(){
        return new Promise(this._performGETRequest.bind(this));
    }

    headRemote(){
        return new Promise(this._performHEADRequest.bind(this));
    }

    postRemote(_postData){
        return new Promise(function(_resolve,_reject){
            this._performPOSTRequest(_resolve,_reject,_postData);
        }.bind(this));
    }

    putRemote(_putData){
        return new Promise(function(_resolve,_reject){
            this._performPUTRequest(_resolve,_reject,_putData);
        }.bind(this));
    }

    patchRemote(_patchData){
        return new Promise(function(_resolve,_reject){
            this._performPATCHRequest(_resolve,_reject,_patchData);
        }.bind(this));
    }

    deleteRemote(){
        return new Promise(this._performDELETERequest.bind(this));
    }

    //Private
    _performHEADRequest(_resolve,_reject){
        var options,request;
        options = this._buildOptions();
        options.method = 'HEAD';

        this._callRemote(_resolve,_reject,options);
    }
    
    _performGETRequest(_resolve,_reject){
        var options,request;
        options = this._buildOptions();
        options.method = 'GET';

        this._callRemote(_resolve,_reject,options);
    }
    
    _performPOSTRequest(_resolve,_reject,_postData){
        var options;
        options = this._buildOptions();
        options.method = 'POST';

        var [encodedStr,contentType,contentLength] = this._encodeObj(_postData);
        options.headers['Content-Type'] = contentType;
        options.headers['Content-Length'] = contentLength;

        this._callRemote(_resolve,_reject,options,encodedStr);
    }
    
    _performPATCHRequest(_resolve,_reject,_patchData){
        var options;
        options = this._buildOptions();
        options.method = 'PATCH';

        var [encodedStr,contentType,contentLength] = this._encodeObj(_patchData);
        options.headers['Content-Type'] = contentType;
        options.headers['Content-Length'] = contentLength;

        this._callRemote(_resolve,_reject,options,encodedStr);
    }

    _performPUTRequest(_resolve,_reject,_putData){
        var options;
        options = this._buildOptions();
        options.method = 'PUT';

        var [encodedStr,contentType,contentLength] = this._encodeObj(_patchData);
        options.headers['Content-Type'] = contentType;
        options.headers['Content-Length'] = contentLength;

        this._callRemote(_resolve,_reject,options,encodedStr);
    }
    
    _performDELETERequest(_resolve,_reject){
        var options;
        options = this._buildOptions();
        options.method = 'DELETE';
        this._callRemote(_resolve,_reject,options);
    }
    
    _buildOptions(){
        var options = {};
        options.hostname = this.hostname;
        options.port = this.port;
        options.method = this.method;
        options.path = this.path;
        options.headers = (this.headers.count() ? this.headers : {});
        if(this.family !== undefined){
            options.family = this.family;
        }
        if(this.localAddress !== undefined){
            options.localAddress = this.localAddress;
        }
        if(this.socketPath !== undefined){
            options.socketPath = this.socketPath;
        }
        if(this.auth !== undefined){
            options.auth = this.auth;
        }
        if(this.timeout !== undefined){
            options.timeout = this.timeout;
        }
        return options;
    }

    //We are going to assume a safe request (therefore a trusted/safe response)
    _callRemote(_resolve,_reject,_options,_body){
        var request = HTTP.request(_options,function(_response){
            this._handleRequestLifeCycle(_response,_resolve,_reject);
        }.bind(this));
        request.on('error',_reject);
        if(_body !== undefined){
            request.write(_body);
        }
        request.end();
    }

    _handleRequestLifeCycle(_response,_resolve,_reject){
        if(_response.statusCode < 200 || _response.statusCode >= 300){
            _reject([_response.statusCode,_response.headers]);
        }

        var body = '';
        _response.on('data',function(_chunk){
            body += _chunk;
        });

        _response.on('end',function(){
            _resolve([_response.statusCode,_response.headers,body]);
        });
    }

    _encodeObj(_obj){
        if(this.transferType === HTTPClient.TYPE_FORM){
            return this._translateObjectToFormEncoded(_obj);
        }
        return this._translateObjecToJSONEncoded(_obj);
    }

    _translateObjectToFormEncoded(_obj){
        var encodedStr = queryString.stringify(_obj || {});
        return [encodedStr,'application/x-www-form-urlencoded',Buffer.byteLength(encodedStr)];
    }

    _translateObjecToJSONEncoded(_obj){
        var encodedStr = JSON.stringify((_obj || {}));
        return [encodedStr,'application/json',Buffer.byteLength(encodedStr)];
    }
}

module.exports = HTTPClient;