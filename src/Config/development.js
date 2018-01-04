const fs = require('fs');

const tlsKey = (fs.existsSync(`${global.TLS_PATH}/certs/server.key`) ? fs.readFileSync(`${global.TLS_PATH}/certs/server.key`) : undefined);
const tlsCert = (fs.existsSync(`${global.TLS_PATH}/certs/server.crt`) ? fs.readFileSync(`${global.TLS_PATH}/certs/server.crt`) : undefined);

module.exports = {
  bodyParser: {
    limit: '100kb'
  },
  http: {
    host: '127.0.0.1',
    port: 8799
  },
  https: {
    host: '127.0.0.1',
    port: 9799
  },
  tls: {
    key: tlsKey,
    cert: tlsCert
  }
};
