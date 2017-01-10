# node-service-starter [![Build Status](https://travis-ci.org/anyuzer/node-service-starter.svg?branch=master)](https://travis-ci.org/anyuzer/node-service-starter)
A thin ES6 OOP service only (non react) starter for Node.

Includes:
* Testable organized architecture
* Comments in every file
* 100% Test coverage of included code (using Jest)
* Example of versioned REST API
* Example of handling each type of REST method (GET,POST,PATCH,PUT,DELETE)
* Example of remote calling through use of a `HTTPClient`
* HTTP and HTTPS server
* Middleware hooks for Security, Authentication, Static Files, AppParsing, ErrorHandling

## Usage
Intended as a base package for a new backend Node service.
* Download as zip
* Unzip into new project
* Update `package.json` for new app
* Run `npm install`
* Modify!

## TLS
The HTTPs server is commented out by default in the Main.js. To enable it do the following:
* navigate to the /tls directory and run `./genSelfSigned.sh`
    * This requires certstrap which can be installed through your package manager
* Uncomment all of the lines referencing this.SecureServer in `/src/Main.js`
* `npm start`

## Playing
Can be played with directly from a git clone
* `npm install`
* `npm start`

## Testing
`npm test`