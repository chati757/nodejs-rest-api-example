const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');

module.exports = function(){
    const app = express();
    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }else{
        app.use(compression);
    }

    app.use(bodyParser.urlencoded({
        extended:true //false -> support string and array only , ture -> support more..
    }));
    app.use(bodyParser.json());//json avaliable

    app.set('views','./app/views');

    require('../app/routes/index.routes')(app); //call module.exports = function(app) in index.routes.js
    
    app.use(express.static('./public'));

    return app;
}