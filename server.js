process.env.NODE_ENV = process.env.NODE_ENV || 'development' //default env is 'development'

var express = require('./config/express')
var app = express.mainconfig()

//https type
app.listen(3000,()=>{
    console.log("server running at https://localhost:3000")
})

module.exports = app //for reuse