const Hash = require('../Adapters/Hash');
const ArcEvents = require('arc-lib').events;

/*
Utilities tend to be pure business logic that provide functionality via combined models/adapters or utilities.
This utility is included, but is primarily used for orchestration in services acting as a funnel from a downstream source of truth.
In these cases it is efficient to set up a service handling the traffic load, responding from memory and polling the downstream models for updates.
 */
class RemotePoll{
    static get STATUS_STOPPED(){
        return 0;
    }

    static get STATUS_ACTIVE(){
        return 1;
    }

    constructor(_HTTPClient){
        //Our Client Adatper
        this.HTTPClient = _HTTPClient;

        //Basic state
        this.status = RemotePoll.STATUS_STOPPED;
        this.events = new ArcEvents;
        this.consecutiveFailures = 0;
        this.totalFailures = 0;
        this.failureThreshold = 1;
        this.useETag = true;
        this.pollingValue = undefined;
    }

    //Get
    getInterval(){
        return this.interval;
    }

    getStatus(){
        return this.status;
    }

    getUseETag(){
        return this.useETag;
    }

    getFailureThreshold(){
        return this.failureThreshold;
    }

    //Set
    setInterval(_interval){
        this.interval = _interval;
        return true;
    }

    setUseETag(_bool){
        this.useETag = _bool;
        return true;
    }

    setFailureThreshold(_threshold){
        this.failureThreshold = _threshold || 1;
    }

    //Utilities
    start(){
        this._clearExistingPoll();
        this.status = RemotePoll.STATUS_ACTIVE;
        this.pollId = setInterval(this._triggerPoll.bind(this),this.interval);
        this._triggerPoll();
    }

    stop(){
        this._clearExistingPoll();
        this.status = RemotePoll.STATUS_STOPPED;
    }

    on(_event,_listener){
        this.events.on(_event,_listener);
    }

    //Private
    _triggerPoll(){
        var promise = (this.useETag ? this.HTTPClient.headRemote() : this.HTTPClient.getRemote());
        promise.then(this._handleResponse.bind(this),this._handleNon200.bind(this));
    }

    _handleResponse(_response){
        var [status,headers,body] = _response;
        var checkVal = (this.useETag ? headers.etag : Hash.md5(body));
        if(checkVal !== this.pollingValue){
            this.pollingValue = checkVal;
            this.events.emit('change');
        }
    }

    _handleNon200(_response){
        this.totalFailures++;
        this.consecutiveFailures++;
        if(this.consecutiveFailures >= this.failureThreshold){
            this.consecutiveFailures = 0;
            this.stop();
            this.events.emit('error');
        }
    }

    _clearExistingPoll(){
        if(this.pollId !== undefined){
            clearInterval(this.pollId);
        }
    }
}

module.exports = RemotePoll;