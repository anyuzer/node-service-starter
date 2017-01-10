/* I want a CLI override for these values */
const fs = require('fs');

/*
 NOTE: We do not write tests against our config (though we could).
 Our config should provide static data types, but can potentially have override methodology (CLI, json files, etc)
 */
class Config{
    static getHost(){
        return '127.0.0.1';
    }

    static getPort(){
        return 8799;
    }

    static getSecureHost(){
        return '127.0.0.1';
    }

    static getSecurePort(){
        return 9799;
    }

    static getTLSOptions(){
        return {
            key:fs.readFileSync(TLS_PATH+'/certs/server.key'),
            cert:fs.readFileSync(TLS_PATH+'/certs/server.crt')
        }
    }
}

module.exports = Config;