const crypto = require('crypto');

/*
 NOTE: We do not test spaces that we do not own. Adapters are excluded from testing.
 Adapters abstract and wrap ownership spaces we don't own. They allow our app to use concepts required by the app without tightly coupling to the underlying functionality.
 */
class Hash{
    static md5(_string){
        var hmac = crypto.createHmac('md5','');
        hmac.update(_string);
        return hmac.digest('hex');
    }

    static sha256(_string,_key){
        var hmac = crypto.createHmac('sha256','');
        hmac.update(_string);
        return hmac.digest('hex');
    }
}

module.exports = Hash;