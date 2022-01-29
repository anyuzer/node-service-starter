const developmentConfig = require('./development.js');
const stagingConfig = require('./staging.js');
const productionConfig = require('./production.js');

//We also don't test our configs
class Config {
  constructor(_environment) {
    this.setEnvironment(_environment);
  }

    // Public
  setEnvironment(_environment) {
    this.environment = _environment.toLowerCase();
    this._setConfigObj(this._loadConfig(this.environment));
  }

  getEnvironment() {
    return this.environment;
  }

  getBodyParserConfig() {
    return this.configObj.bodyParser;
  }

  getHTTPConfig() {
    return this.configObj.http;
  }

  getHTTPSConfig() {
    return this.configObj.http;
  }

    // Private
  _setConfigObj(_configObj) {
    this.configObj = _configObj;
  }

  _loadConfig(_environment) {
    switch (_environment) {
      case 'development':
        return developmentConfig;
      case 'staging':
        return stagingConfig;
      default:
        return productionConfig;
    }
  }
}

module.exports = new Config(process.env.NODE_ENV || '');