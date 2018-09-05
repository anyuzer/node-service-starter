const crypto = require('crypto');
const { is, ArcHash } = require('arc-lib');

class SymmetricKeyCrypto {
    static get CIPHER() { return 'AES-256-CBC'; }

    static encrypt(_key, _plainText) {
        const currentKey = ArcHash.sha256(_key + ArcHash.sha256('somesecretkey'));

        const plainText = (is(_plainText) === 'object' ? JSON.stringify(_plainText) : String(_plainText));
        const cipher = crypto.createCipher(SymmetricKeyCrypto.CIPHER, currentKey);
        let encrypted = cipher.update(plainText, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    static decrypt(_key, _cipherText) {
        let decryptKey = ArcHash.sha256(_key + ArcHash.sha256('somesecretkey'));
        const decrypted = SymmetricKeyCrypto._attemptDecrypt(decryptKey, _cipherText);
        if (decrypted) {
            return decrypted;
        }
        decryptKey = ArcHash.sha256(_key + ArcHash.sha256('somesecretkey'));
        return SymmetricKeyCrypto._attemptDecrypt(decryptKey, _cipherText);
    }

    static _attemptDecrypt(_key, _cipherText) {
        try {
            const decipher = crypto.createDecipher(SymmetricKeyCrypto.CIPHER, _key);
            let decrypted = decipher.update(_cipherText, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return SymmetricKeyCrypto._attemptParse(decrypted);
        } catch (_Error) {
            return false;
        }
    }

    static _attemptParse(_decrypted) {
        try {
            return JSON.parse(_decrypted);
        } catch (_Error) {
            return _decrypted;
        }
    }
}

module.exports = SymmetricKeyCrypto;