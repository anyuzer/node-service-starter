const Redis = require('redis');
const Config = require('../Config/Config');
const { ArcHash } = require('arc-lib');
const SymmetricKeyCrypto = require('./SymmetricKeyCrypto');

class Cache {
    static get EXPIRY_SECONDS() {
        return Config.getRedisConfig().expirySeconds;
    }

    static get PREFIX() {
        return `${MODULE_NAME}:`;
    }

    constructor() {
        const redisConfig = Config.getRedisConfig(); // We cann add our retry function here if/when needed
        redisConfig.prefix = Cache.PREFIX;
        this.Client = this._createRedisClient(redisConfig);
        this.Client.on('error', this._handleRedisErrors.bind(this));
        this.Client.on('connect', () => {
            console.log('Redis Connection Successful...');
        });
    }

    getObjectFromCache(_key, _updateExpiry) {
        return new Promise((_resolve, _reject) => {
            this._getFromRedis(_resolve, _reject, _key, true, _updateExpiry);
        });
    }

    setObjectToCache(_key, _obj) {
        return Promise.resolve(this._setToRedis(_key, _obj));
    }

    getScalarFromCache(_key, _updateExpiry) {
        return new Promise((_resolve, _reject) => {
            this._getFromRedis(_resolve, _reject, _key, false, _updateExpiry);
        });
    }

    setScalarToCache(_key, _val) {
        return Promise.resolve(this._setToRedis(_key, _val));
    }

    deleteFromCache(_key) {
        return Promise.resolve(this.Client.del(_key));
    }

    updateExpire(_key) {
        this.Client.expire(_key, Cache.EXPIRY_SECONDS);
    }

    getTTL(_key) {
        return new Promise((_resolve, _reject) => {
            this.Client.ttl(_key, (_err, _reply) => {
                if (_err) {
                    _reject(_err);
                }
                _resolve(_reply);
            });
        });
    }

    // Private
    _createRedisClient(_redisConfig) {
        return Redis.createClient(_redisConfig);
    }

    _getFromRedis(_resolve, _reject, _key, _jsonParse, _updateExpiry) {
        this.Client.get(ArcHash.md5(_key), (_err, _reply) => {
            if (_err) {
                _reject(_err);
            }

            if (_reply && _updateExpiry !== false) {
                this.updateExpire(ArcHash.md5(_key));
            }

            _resolve(SymmetricKeyCrypto.decrypt(_key, _reply));
        });
    }

    _setToRedis(_key, _val) {
        return this.Client.setex(ArcHash.md5(_key), Cache.EXPIRY_SECONDS, SymmetricKeyCrypto.encrypt(_key, _val));
    }

    _handleRedisErrors(_err) {
        console.log(_err.message);
    }
}

module.exports = new Cache();