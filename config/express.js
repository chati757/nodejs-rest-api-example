const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const validator = require('express-validator')


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
    app.use(validator())

    //-----------------view----------------------
    app.set('views','./app/views')

    //-----------------resource------------------
    app.use(express.static('./public'))

    //-----------------route---------------------
    require('../app/routes/index.route')(app) //call module.exports = function(app) in index.routes.js


    return app;
}