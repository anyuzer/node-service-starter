const path = require('path');
global.APP_PATH = path.resolve(`${__dirname}/src`);
global.TLS_PATH = path.resolve(`${__dirname}/tls`);
global.DIST_PATH = path.resolve(`${__dirname}/dist`);

require('./src/Main').Run();