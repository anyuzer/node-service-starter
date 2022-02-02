const { is } = require('arc-lib');
const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2"
});

const TABLE_PREFIX = `PrefixYourTables`;

class DynamoDB {
    constructor() {
        this.AWSClient = new AWS.DynamoDB.DocumentClient();
        this.testTable = `${TABLE_PREFIX}Test`; //In Dynamo, this would be PrefixYourTableTest
    }

    //The simplest, get a single item by id
    async getExample(_recordId) {
        const params = {
            TableName: this.testTable,
            Key: { "recordId": _recordId }
        };
        const response = await this._get(params);
        return response.Item;
    }

    //More complex, get an index of items. This uses query.
    async getExampleByIndex(_index) {
        const params = {
            TableName: this.testTable,
            IndexName: 'indexName-index',
            KeyConditionExpression: 'indexName = :indexName',
            ExpressionAttributeValues: {
                ":indexName": _index
            }
        };

        return this._allQuery(params);
    }

    //In certain cases, it's not feasible to get all of our records (due to say memory limitations)
    //In this case, get by page (using scan)
    async getExamplePage(_lastEvalKey) {
        let params = {
            TableName: this.testTable,
        };
        if(_lastEvalKey) {
            params = {...params, ExclusiveStartKey: _lastEvalKey}
        }
        const response = await this._scan(params);
        return [response.Items, response.LastEvaluatedKey];
    }

    //This is like an upsert. If it doesn't exist, it will create the record, otherwise it will update it
    async putExample(_exampleRecord) {
        const params = {
            TableName: this.testTable,
            Item: _exampleRecord
        };
        return this._put(this._pruneInvalidAttributes(params));
    }

    //And of course delete
    async deleteExample(_recordId) {
        const params = {
            TableName: this.testTable,
            Key: { "recordId": _recordId }
        };
        return this._delete(params);
    }

    //Promisfy and streamline core Dynamo API
    async _batchWrite(_params) {
        return new Promise((_resolve, _reject) => {
            this.AWSClient.batchWrite(_params, (_err, _data) => {
                if(_err) {
                    return _reject(_err);
                }
                return _resolve(_data);
            });
        });
    }

    async _put(_params) {
        return new Promise((_resolve, _reject) => {
            this.AWSClient.put(_params, (_err, _data) => {
                if(_err){
                    return _reject(_err);
                }
                return _resolve(_data);
            });
        });
    }

    async _get(_params) {
        return new Promise((_resolve, _reject) => {
            this.AWSClient.get(_params, (_err, _data) => {
                if(_err){
                    return _reject(_err);
                }
                return _resolve(_data);
            });
        })
    }

    async _scan(_params) {
        return new Promise((_resolve, _reject) => {
            this.AWSClient.scan(_params, (_err, _data) => {
                if(_err){
                    return _reject(_err);
                }
                return _resolve(_data);
            });
        })
    }

    async _delete(_params) {
        return new Promise((_resolve, _reject) => {
            this.AWSClient.delete(_params, (_err, _data) => {
                if(_err){
                    return _reject(_err);
                }
                return _resolve(_data);
            });
        })
    }

    async _allQuery(params) {
        //We do a query
        let response = await this._query(params);

        //If there's a LastEvaluatedKey we'll build an array of items
        if(response.LastEvaluatedKey) {
            let allItems = [];
            while(response && response.LastEvaluatedKey) {
                allItems = allItems.concat(response.Items);
                response = await this._query({
                    ...params,
                    ExclusiveStartKey: response.LastEvaluatedKey
                });
            }
            allItems = allItems.concat(response.Items);
            return allItems;
        }

        //Otherwise there was no pagination, return our items
        return response.Items;
    }

    async _query(_params) {
        return new Promise((_resolve, _reject) => {
            this.AWSClient.query(_params, (_err, _data) => {
                if(_err){
                    return _reject(_err);
                }
                return _resolve(_data);
            });
        })
    }

    _pruneInvalidAttributes(_obj) {
        if(is(_obj) !== 'object') {
            return _obj;
        }
        const keys = Object.keys(_obj);
        keys.forEach((_key) => {
            if(_obj[_key] === ''){
                delete _obj[_key];
            } else if(is(_obj[_key]) === 'object') {
                _obj[_key] = this._pruneInvalidAttributes(_obj[_key]);
            } else if(is(_obj[_key]) === 'array') {
                _obj[_key] = _obj[_key].map(_val => this._pruneInvalidAttributes(_val))
            }
        });
        return _obj;
    }
}

module.exports = new DynamoDB();