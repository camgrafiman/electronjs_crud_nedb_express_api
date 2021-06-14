var express = require('express');
var nedb = require('nedb');
const path = require('path');
var expressNedbRest = require('express-nedb-rest');

// setup express app
var serverApp = express();

// create  NEDB datastore
var datastore = {};
datastore.hello = new nedb({
    // filename: path.join(__dirname + '../nedb_database/hello.db'),
    // filename: 'db_test.db',
    filename: path.join(__dirname + '/nedb_database/hello.db'),
    autoload: true,
    timestampData: true
});

datastore.servicios = new nedb({
    // filename: path.join(__dirname + '../nedb_database/hello.db'),
    // filename: 'db_test.db',
    filename: path.join(__dirname + '/nedb_database/servicios.db'),
    autoload: true,
    timestampData: true
});


// NEDB colección de servicios:


// create rest api router and connect it to datastore  
var restApi = expressNedbRest();
restApi.addDatastore('hello', datastore.hello);
restApi.addDatastore('servicios', datastore.servicios);


// setup express server to serve rest service
serverApp.use('/', restApi);

serverApp.listen(8080, function() {
    console.log('you may use nedb rest api at port 8080');
});

module.exports = { serverApp, datastore, restApi };