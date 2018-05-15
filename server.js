process.env.NODE_ENV = process.env.NODE_ENV || 'development'; //default env is 'development'

var express = require('./config/express');
var app = express();
app.listen(3000);

console.log("server running at http://localhost:3000");

module.exports = app; //for reuse