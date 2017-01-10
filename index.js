//Our globals
global.APP_PATH = require('path').resolve(__dirname+"/src")
global.TLS_PATH = require('path').resolve(__dirname+"/tls");

require('./src/Main').Run(); 