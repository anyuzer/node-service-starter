const { is, ArcHash } = require('arc-lib');

const Config = require('../../src/Config/Config');
const Cache = require('../../src/Adapters/Cache');

const sleep = (_for) => {
    return new Promise(resolve => setTimeout(resolve, _for));
}

//This will test our Cache adapter around Redis (when the test runs, can it appropriately access Redis. Does our abstraction logic work as intended?
describe('Cache integration tests',()=>{
    it('should return a valid redis config', async () => {
        const redisConfig = Config.getRedisConfig();
        expect(redisConfig.host).toBeTruthy();
        expect(is(redisConfig.port)).toBe("number");
        expect(is(redisConfig.expirySeconds)).toBe("number");
    })

    it('should successfully connect to redis and gracefully quit from redis', async () => {
        await Cache.connect();
        expect(Cache.isConnected()).toBe(true);
        await Cache.quit();
        expect(Cache.isConnected()).toBe(false);
    })

    it('should successfully connect to redis and forcibly disconnect from redis', async () => {
        await Cache.connect();
        expect(Cache.isConnected()).toBe(true);
        await Cache.disconnect();
        expect(Cache.isConnected()).toBe(false);
    })

    it('should successfully set and get a key prefix when not connected', async () => {
        await Cache.setPrefix('INTEGRATION_TESTS');
        expect(Cache.getPrefix()).toBe('INTEGRATION_TESTS');
    })

    it('should gracefully disconnect from redis, set a new prefix, and reconnect', async () => {
        //Connect with previous config
        await Cache.connect();

        //Now set new config
        await Cache.setPrefix('INTEGRATION_TESTS2');

        //Expect us to be reconnected
        expect(Cache.isConnected()).toBe(true);

        //Cleanup
        await Cache.disconnect();
    })

    it('should successfully store, retrieve and delete a scalar value on the correct key', async () => {
        await Cache.connect();
        const testKey = 'integrationTest_setScalar';
        const testVal = 99;

        //Set and check it
        await Cache.setScalarToCache(testKey, testVal);
        expect(await Cache.getScalarFromCache(testKey)).toBe('99'); //Redis will return this as a string.

        //Delete it
        await Cache.deleteFromCache(testKey);
        expect(await Cache.getScalarFromCache(testKey)).toBeFalsy();

        await Cache.disconnect();
    })

    it('should successfully store, retrieve and delete a JSON value on the correct key', async () => {
        await Cache.connect();

        const testKey = 'integrationTest_setJSON';
        const testVal = [1,2,{a:"b"}];

        //Set and check it
        await Cache.setJSONToCache(testKey, testVal);
        expect(ArcHash.md5(await Cache.getJSONFromCache(testKey))).toBe(ArcHash.md5(testVal));

        await Cache.deleteFromCache(testKey);
        await Cache.disconnect();
    })

    it('should return false, if a JSON parse error occurs', async () => {
        await Cache.connect();

        const testKey = 'integrationTest_setScalar';
        const testVal = 'notJSON';

        //Set and check it
        await Cache.setScalarToCache(testKey, testVal);
        expect(await Cache.getJSONFromCache(testKey)).toBeFalsy();

        await Cache.deleteFromCache(testKey);
        await Cache.disconnect();
    })

    it('should set and get a new default expiry', async () => {
        Cache.setExpirySeconds(1);
        expect(Cache.getExpirySeconds()).toBe(1);

        Cache.setExpirySeconds(86400); //Set it back
    })

    it('should use a customExpiry, and the key/val should successfully expire', async () => {
        await Cache.connect();
        const testKey = 'integrationTest_setScalar';
        const testVal = 'expired';

        //Set it, let it expire, check it
        await Cache.setScalarToCache(testKey, testVal, 1);
        await sleep(2000);
        expect(await Cache.getScalarFromCache(testKey)).toBeFalsy();

        await Cache.disconnect();
    });

    it('should use a customExpiry, and then update the expiry on get', async () => {
        await Cache.connect();
        const testKey = 'integrationTest_setScalar';
        const testVal = 'expiryUpdated';

        //Set it, wait, get the value and update expiry
        await Cache.setScalarToCache(testKey, testVal, 10);

        //Update it from 10 to 20
        await Cache.getScalarFromCache(testKey,20);
        expect(await Cache.getTTL(testKey)).toBeGreaterThan(10);

        //Update it using the default expiry
        await Cache.getScalarFromCache(testKey,true);
        expect(await Cache.getTTL(testKey)).toBeGreaterThan(20);

        await Cache.disconnect();
    });

    it('should not try to reconnect if connect is called twice', async () => {
        expect(await Cache.connect()).toBe(true);
        expect(await Cache.connect()).toBe(false);
        await Cache.disconnect();
    })

    it('should throw an error when no connection exists', async () => {
        await expect(Cache.getScalarFromCache('fail')).rejects.toThrow('Not connected to Redis Client.');
    })
});
