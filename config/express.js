const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const validator = require('express-validator')

module.exports = function(){
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

    app.set('views','./app/views')

    require('../app/routes/index.route')(app) //call module.exports = function(app) in index.routes.js
    
    app.use(express.static('./public'))

    return app;
}