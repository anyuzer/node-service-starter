const RemotePoll = require('../../src/Utilities/RemotePoll');
const HTTPClient = require('../../__mocks__/HTTPClient');
const Hash = require('../../src/Adapters/Hash');

describe('Example RemotePoll',function(){
    var MockClient = new HTTPClient;
    var TestPoll = new RemotePoll(MockClient);
    it('should be an instance of RemotePoll',()=>{
        expect(TestPoll).toBeInstanceOf(RemotePoll);
    });

    it('should set/get a polling interval in milliseconds',()=>{
        expect(TestPoll.setInterval(250)).toBe(true);
        expect(TestPoll.getInterval()).toBe(250);
    });
    
    it('should set/get whether or not the poll should rely on an etag header',()=>{
        TestPoll.setUseETag(true);
        expect(TestPoll.getUseETag()).toBe(true);
    });

    it('should set/get the threshold for remote failures before an error event is emitted and the poll is stopped',()=>{
        TestPoll.setFailureThreshold(5);
        expect(TestPoll.getFailureThreshold()).toBe(5);
    });

    it('a failure threshold cannot be set to 0, or false, in this event it is transformed to 1',()=>{
        TestPoll.setFailureThreshold(false);
        expect(TestPoll.getFailureThreshold()).toBe(1);
    });

    it('should return the current status of the Poll (stopped in this case)',()=>{
        expect(TestPoll.getStatus()).toBe(RemotePoll.STATUS_STOPPED);
    });

    it('should return the current status of the Poll (active in this case)',()=>{
        TestPoll.start();
        expect(TestPoll.getStatus()).toBe(RemotePoll.STATUS_ACTIVE);
        TestPoll.stop();
    });


    //Reset it
    it('should start the poll, perform a GET request and immediately receive a change event (as expected on the first request)',()=>{
        let MockClient = new HTTPClient();
        let TestPoll = new RemotePoll(MockClient);
        TestPoll.setUseETag(false);
        MockClient.setGETMock(200,{etag:'example'},'some content');
        let change = jest.fn();
        TestPoll.on('change',change);
        TestPoll.start();
        setTimeout(()=>{
            expect(change).toHaveBeenCalled();
            TestPoll.stop();
        },0);
    });

    it('should start the poll, perform a HEAD request and immediately receive a change event (as expected on the first request)',()=>{
        let MockClient = new HTTPClient();
        let TestPoll = new RemotePoll(MockClient);
        MockClient.setHEADMock(200,{etag:'example'},'some content');
        let change = jest.fn();
        TestPoll.on('change',change);
        TestPoll.start();
        setTimeout(()=>{
            expect(change).toHaveBeenCalled();
            TestPoll.stop();
        },0);
    });

    it('should start the poll, perform a GET request surpass error threshold and fire the error event)',()=>{
        let MockClient = new HTTPClient();
        let TestPoll = new RemotePoll(MockClient);
        TestPoll.setUseETag(false);
        TestPoll.setFailureThreshold(1);

        MockClient.setGETMock(500,{etag:'example'},'some content');
        let error = jest.fn();
        TestPoll.on('error',error);
        TestPoll.start();
        setTimeout(()=>{
            expect(error).toHaveBeenCalled();
        },0);
    });

    it('should start the poll, perform a GET request surpass error threshold and fire the error event)',()=>{
        let MockClient = new HTTPClient();
        let TestPoll = new RemotePoll(MockClient);
        TestPoll.setUseETag(false);
        TestPoll.setFailureThreshold(10);

        MockClient.setGETMock(500,{etag:'example'},'some content');
        let error = jest.fn();
        TestPoll.on('error',error);
        TestPoll.start();
        setTimeout(()=>{
            expect(error).toHaveBeenCalled(0);
            TestPoll.stop();
        },0);
    });

});
