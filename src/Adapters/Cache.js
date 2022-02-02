const { createClient } = require('redis');
const { is } = require('arc-lib');
const Config = require('../Config/Config.js');

//Our adapters are non owned, we use Integration tests to cover these.
class Cache {
    constructor() {
        this.config = Config.getRedisConfig();
        this.connected = false;
        this.prefix = '';
        this.expirySeconds = this.config.expirySeconds;

        this.client = this._clientFactory();
    }

    getPrefix() {
        return this.prefix;
    }

    async setPrefix(_prefix) {
        let reconnect = false;

        //If we're previously connected, lets disconnect
        if(this.connected) {
            await this.quit();
            reconnect = true;
        }

        //Update our prefix, reconfigure our client
        this.prefix = _prefix;
        this.client = this._clientFactory();

        //And reconnect if we were previously connected
        if(reconnect) {
            await this.connect();
        }
    }

    getExpirySeconds() {
        return this.expirySeconds;
    }

    setExpirySeconds(_seconds) {
        this.expirySeconds = _seconds;
    }

    async connect() {
        if(!this.connected) {
            await this.client.connect();
            return true;
        }
        return false;
    }

    async disconnect() {
        this._checkConnection();
        await this.client.disconnect();
    }

    async quit() {
        this._checkConnection();
        await this.client.quit();
    }

    isConnected() {
        return this.connected;
    }

    //Redis does offer a RedisJSON module now which can make these redundant
    async getJSONFromCache(_key, _updateExpiry) {
        this._checkConnection();
        return this._getFromRedis(_key, true, _updateExpiry);
    }

    async setJSONToCache(_key, _json, _customExpiryInSeconds) {
        this._checkConnection();
        return this._setToRedis(_key, JSON.stringify(_json), _customExpiryInSeconds);
    }

    async getScalarFromCache(_key, _updateExpiry) {
        this._checkConnection();
        return this._getFromRedis(_key, false, _updateExpiry);
    }

    async setScalarToCache(_key, _val, _customExpiryInSeconds) {
        this._checkConnection();
        return this._setToRedis(_key, _val, _customExpiryInSeconds);
    }

    async deleteFromCache(_key) {
        this._checkConnection();
        return this.client.del(_key);
    }

    async updateExpire(_key, _customTTL) {
        this._checkConnection();
        return this.client.expire(_key, is(_customTTL) === 'number' ? _customTTL : this.getExpirySeconds());
    }

    async getTTL(_key) {
        this._checkConnection();
        return this.client.ttl(_key);
    }

    // Private
    async _getFromRedis(_key, _jsonParse, _updateExpiry) {
        let cacheVal =  await this.client.get(_key);
        if(_jsonParse && cacheVal) {
            try {
                cacheVal = JSON.parse(cacheVal)
            } catch (e) {
                //This is probably bad behavior, but I don't think I generally care if I get garbage back from the cache
                return false;
            }
        }

        if(cacheVal && _updateExpiry) {
            //We don't wait for this because if we're using our Cache right, this succeeding is optional
            this.updateExpire(_key, _updateExpiry);
        }

        return cacheVal;
    }

    _setToRedis(_key, _val, _expiryInSeconds) {
        return this.client.set(_key, _val, { EX: _expiryInSeconds || this.getExpirySeconds() });
    }

    _checkConnection(){
        if(!this.connected) {
            throw new Error('Not connected to Redis Client.');
        }
    }

    _clientFactory() {
        const client = createClient({...this.config, prefix: this.getPrefix()});
        client.on('ready', () => {
            console.log('Redis successfully connected.');
            this.connected = true;
        });

        client.on('end', () => {
            console.log('Redis successfully disconnected.');
            this.connected = false;
        })
        return client;
    }
}

module.exports = new Cache();