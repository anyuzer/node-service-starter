const ExampleModel = require('../../../src/1/Models/ExampleModel');

describe('Example Model',function(){
    var TestModel = new ExampleModel;
    it('should be an instance of ExampleModel',()=>{
        expect(TestModel).toBeInstanceOf(ExampleModel);
    });

    it('incrementDELETE should increase the DELETE counter by 1',()=>{
        expect(TestModel.incrementDELETE()).toBe(1);
        expect(TestModel.incrementDELETE()).toBe(2);
    });

    it('incrementGET should increase the GET counter by 1',()=>{
        expect(TestModel.incrementGET()).toBe(1);
        expect(TestModel.incrementGET()).toBe(2);
    });

    it('incrementPOST should increase the POST counter by 1',()=>{
        expect(TestModel.incrementPOST()).toBe(1);
        expect(TestModel.incrementPOST()).toBe(2);
    });

    it('incrementPUT should increase the PUT counter by 1',()=>{
        expect(TestModel.incrementPUT()).toBe(1);
        expect(TestModel.incrementPUT()).toBe(2);
    });

    it('incrementPATCH should increase the GET counter by 1',()=>{
        expect(TestModel.incrementPATCH()).toBe(1);
        expect(TestModel.incrementPATCH()).toBe(2);
    });

    it('flatten should return all property data in a new object',()=>{
        expect(TestModel.flatten()).toEqual({
            DELETE:2,
            POST:2,
            GET:2,
            PUT:2,
            PATCH:2
        });
    });
});
