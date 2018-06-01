const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const express_validator = require('express-validator')
const ejs = require('ejs')
//controller
const jwt = require('jsonwebtoken')
exports.jsonwebtoken = function(){
    return jwt
}
const uuid_api_key = require('uuid-apikey')
exports.uuid_api_key = function(){
    return uuid_api_key
}
const key_pair = require('keypair')
exports.key_pair = function(){
    return key_pair
}

exports.mainconfig = function(){
    const app = express()
    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }else{
        app.use(compression)
    }

    app.use(bodyParser.urlencoded({
        extended:true //false -> support string and array only , ture -> support more..
    }))
    app.use(bodyParser.json())//json avaliable
    app.use(express_validator())

    //-----------------view----------------------
    app.set('views','./app/views')
    app.set('view engine','ejs')
    //-----------------resource------------------
    app.use(express.static('./public'))

    //-----------------route---------------------
    require('../app/routes/index.route')(app) //call module.exports = function(app) in index.routes.js


    return app
}