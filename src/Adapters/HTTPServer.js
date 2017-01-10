const HTTP = require('http');
const HTTPS = require('https');
const Express = require('express');
const is = require('arc-lib').is;

/*
 NOTE: We do not test spaces that we do not own. Adapters are excluded from testing.
 Adapters abstract and wrap ownership spaces we don't own. They allow our app to use concepts required by the app without tightly coupling to the underlying functionality.
 */
class HTTPServer {
    constructor() {
        //Our ports to listen on
        this.hostname = '0.0.0.0';
        this.servicePort = 80;
        this.attempts = 0;
        this.attemptLimit = 0;

        this.tls = false;
        this.tlsOptions = {};

        //Our app dependencies
        this.express = Express();
    }

    setTLSOptions(_tlsOptions){
        if(_tlsOptions.key && _tlsOptions.cert){
            this.tls = true;
            this.tlsOptions = _tlsOptions;
        }
    }

    attachMiddleware(_callback){
        this.express.use(_callback);
    }

    catchRequest(){
        return this.express;
    }

    setAttemptLimit(_attemptLimit){
        this.attemptLimit = _attemptLimit;
    }

    setPort(_port){
        if(is(_port) !== 'number'){
            throw TypeError('HTTPServer.setPort requires _port to be a valid number');
        }
        this.servicePort = _port;
    }

    setHost(_host){
        if(is(_host) !== 'string'){
            throw TypeError('HTTPServer.setHost requires _host to be a valid string');
        }
        this.hostname = _host;
    }

    start(){
        return (this.tls ? this._startHttps() : this._startHttp());
    }

    _startHttps(){
        this.http = HTTPS.createServer(this.tlsOptions,this.express);
        if(this.attemptLimit){
            this.http.on('error',this._retryStart.bind(this));
        }
        this.attempts++;
        this.http.listen(this.servicePort,this.hostname);
        console.log('HTTPS Listening On: '+this.servicePort);
    }

    _startHttp(){
        this.http = HTTP.createServer(this.express);
        if(this.attemptLimit){
            this.http.on('error',this._retryStart.bind(this));
        }
        this.attempts++;
        this.http.listen(this.servicePort,this.hostname);
        console.log('HTTP Listening On: '+this.servicePort);
    }

    _retryStart(error){
        if(this.attempts >= this.attemptLimit){
            throw error;
        }
        setTimeout(this.start.bind(this),2500);
    }

    toString(){
        return '[object '+this.constructor.name+']';
    }
}

module.exports = HTTPServer;