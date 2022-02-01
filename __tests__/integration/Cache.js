const Config = require('../../src/Config/Config');

//This will test our Cache adapter around Redis (when the test runs, can it appropriately access Redis. Does our abstraction logic work as intended?
describe('Cache integration tests',()=>{
    it('should be running on a development environment', async () => {
        expect(Config.getEnvironment()).toBe('development');



    })
});
