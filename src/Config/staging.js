const fs = require('fs');

const tlsKey = (fs.existsSync(`${global.TLS_PATH}/certs/server.key`) ? fs.readFileSync(`${global.TLS_PATH}/certs/server.key`) : undefined);
const tlsCert = (fs.existsSync(`${global.TLS_PATH}/certs/server.crt`) ? fs.readFileSync(`${global.TLS_PATH}/certs/server.crt`) : undefined);

module.exports = {
  bodyParser: {
    limit: '100kb'
  },
  http: {
    host: '0.0.0.0',
    port: 8799
  },
  https: {
    host: '0.0.0.0',
    port: 9799
  },
  tls: {
    key: tlsKey,
    cert: tlsCert
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    expirySeconds: 86400 // One day
  }
};
