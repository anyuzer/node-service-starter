const { ArcHash } = require('arc-lib');
const ExampleModel = require('../../src/Models/ExampleModel.js');

describe('Example Model',() => {
    it('should be an instance of ExampleModel',async ()=>{
        const TestModel = new ExampleModel;
        expect(TestModel).toBeInstanceOf(ExampleModel);
    });

    it('should serialize default data', async () => {
        const TestModel = new ExampleModel;
        expect(ArcHash.md5(TestModel.serialize())).toMatch(ArcHash.md5({fieldString:'defaultValue',fieldNumber:0}));
    })

    it('should accept and set a string on fieldString', async () => {
        const TestModel = new ExampleModel;
        TestModel.setFieldString('A new string');
        expect(TestModel.getFieldString()).toEqual('A new string');
    })

    it('should accept and set a number on fieldNumber', async () => {
        const TestModel = new ExampleModel;
        TestModel.setFieldNumber(5);
        expect(TestModel.getFieldNumber()).toEqual(5);
    })

    it('should deserialize a full raw data object into the model', async () => {
        const TestModel = new ExampleModel({fieldString:'test',fieldNumber:11});
        expect(TestModel.getFieldNumber()).toEqual(11);
        expect(TestModel.getFieldString()).toEqual('test');
    })

    it('should deserialize a partial raw data object with default values', async () => {
        const TestModel = new ExampleModel({});
        expect(TestModel.getFieldNumber()).toEqual(0);
        expect(TestModel.getFieldString()).toEqual('defaultValue');
    })

    it('should throw a typeError if wrong type is attempted to be set on fields', async () => {
        expect(() => { new ExampleModel('wrong type'); }).toThrow('Expected object, received: string');

        expect(() => {
            const TestModel = new ExampleModel();
            TestModel.setFieldString(0);
        }).toThrow('Expected string, received: number');

        expect(() => {
            const TestModel = new ExampleModel();
            TestModel.setFieldNumber([]);
        }).toThrow('Expected number, received: array');
    });
});
