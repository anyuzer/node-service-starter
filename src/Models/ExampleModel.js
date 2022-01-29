const { is } = require('arc-lib');

class ExampleModel{
    constructor(_data) {
        this.fieldString = 'defaultValue';
        this.fieldNumber = 0;
        if(_data) {
            this._deserialize(_data);
        }
    }

    getFieldString() {
        return this.fieldString;
    }

    getFieldNumber() {
        return this.fieldNumber;
    }

    setFieldString(_unknown) {
        if(is(_unknown) !== 'string') {
            throw new TypeError(`Expected string, received: ${is(_unknown)}`)
        }
        this.fieldString = _unknown;
    }

    setFieldNumber(_unknown) {
        if(is(_unknown) !== 'number') {
            throw new TypeError(`Expected number, received: ${is(_unknown)}`)
        }
        this.fieldNumber = _unknown;
    }

    serialize() {
        return {
            fieldString: this.fieldString,
            fieldNumber: this.fieldNumber
        }
    }

    //Don't test methods that aren't intended as public directly
    _deserialize(_rawObj) {
        if(is(_rawObj) !== 'object') {
            throw new TypeError(`Expected object, received: ${is(_rawObj)}`)
        }

        this.setFieldString(_rawObj.fieldString === undefined ? 'defaultValue' : _rawObj.fieldString);
        this.setFieldNumber(_rawObj.fieldNumber === undefined ? 0 : _rawObj.fieldNumber);
    }
}

module.exports = ExampleModel;