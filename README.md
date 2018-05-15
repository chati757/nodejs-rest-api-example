# redis_rest_api
RESTFUL API (develop with nodejs and redis)

## installation
### editor (recommend)

    https://code.visualstudio.com/

### nodejs install (download LTS version)
   
    http://nodejs.org
    
   *set path env in installtion path
   *check installation with node -v

### redis database install (Stable)

    https://redis.io/download

## build structure
### create project (cmd) (result:project folder)

    ..\<project_space> $ git clone <clone url>

### create package list (result:package.json)

    ..\<project folder> $ create file package.json
    {
        "name": "redis_rest_api",
        "version": "1.0.0",
        "dependencies": {
            "body-parser": "1.18.3",
            "compression": "1.7.2",
            "express": "4.16.3",
            "express-validator": "5.2.0",
            "morgan": "1.9.0"
        },
        "dependenciesComments": {
            "morgan": "HTTP request logger middleware for node.js.",
            "compression": "Node.js compression middleware.",
            "body-parser": "Node.js body parsing middleware.",
            "express-validator":"for validate data form client request data (in middleware) https://github.com/chriso/validator.js,https://express-validator.github.io/docs/check-api.html,
            https://www.npmjs.com/package/express-validator"
        }
    }
    ..\<project folder> $ npm install

### create mvc file stucture

    ..\<project folder> $ create file server.js

    ..\<project folder> $ folder app
        ..\<project folder> $ folder controller
            ..\<project folder> $ file index.controller.js

        ..\<project folder> $ folder models 
            (for get and post json example)
            ..\<project folder> $ folder example
                ..\<project folder> $ file users.js
                    var users = [
                        {
                            "id": 1,
                            "username": "goldroger",
                            "name": "Gol D. Roger",
                            "position": "Pirate King"
                        },
                        {
                            "id": 2,
                            "username": "mrzero",
                            "name": "Sir Crocodile",
                            "position": "Former-Shichibukai"
                        },
                        {
                            "id": 3,
                            "username": "luffy",
                            "name": "Monkey D. Luffy",
                            "position": "Captain"
                        }
                    ]

        ..\<project folder> $ folder routers
            ..\<project folder> $ file index.route.js

        ..\<project folder> $ folder view (for future)
            ..\<project folder> $ file

    ..\<project folder> $ folder config
        ..\<project folder> $ folder dev
        ..\<project folder> $ folder prodection
        ..\<project folder> $ file express.js
            import module
                const express = require('express')
                const morgan = require('morgan')
                const compression = require('compression')
                const bodyParser = require('body-parser')
                const validator = require('express-validator')

            create application function
                const app = express()

            set env
                if(process.env.NODE_ENV === 'development') {
                app.use(morgan('dev'))
                }else{
                    app.use(compression)
                }

            set body-parser (for get datatype request from client Ex.req.body)
                app.use(bodyParser.urlencoded({
                    extended:true //false -> support string and array only , ture -> support more..
                }));

            set body-parser (json avaliable)
                app.use(bodyParser.json())//json avaliable

            set validator after json avaliable
                app.use(validator())

            set defult view render directory
                app.set('views','./app/views')

            set route for usr controller
                require('../app/routes/index.routes')(app)

            set public resource directoty for client
                app.use(express.static('./public'))
            
            return function (for server.js)
                return app;


    ..\<project folder> $ folder public (for future)

    ..\<project folder> $ file server.js

        set default env for start server
            process.env.NODE_ENV = process.env.NODE_ENV || 'development'; //default env is 'development'

        import internal config (express.js)
            var express = require('./config/express');

        usring express
            var app = express()

        set application server for listen port 3000
            app.listen(3000);

        (optional for reuse server application)
            module.exports = app; //for reuse

## configuration
### redis configuration