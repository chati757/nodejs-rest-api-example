# nodejs-rest-api-example
RESTFUL API (develop with nodejs and redis)

## installation
### editor (recommend)

    https://code.visualstudio.com/

### install nodejs (download LTS version)
   
    http://nodejs.org
    
   *set path env in installtion path
   *check installation with node -v

## build structure
### create project (cmd) (result:project folder)

    ..\<project_space> $ git clone <clone url>

### create package list (result:package.json)

    ..\<project folder> $ create file package.json
    {
        "name": "nodejs_rest_api_example",
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

## security (additional)

### vulnerability syntax extension
    https://nodesecurity.io/advisories/

### about oauth(open authorization) 2.0 password grant 4 type
    1.authorization code flow
    2.lmplicit flow
    3.owner password credentials flow <--usring this
    4.client credentials flow

    refer:https://medium.com/@taengtrirongpholphimai/%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B8%B9%E0%B9%89%E0%B8%88%E0%B8%B1%E0%B8%81-oauth2-%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B5%E0%B8%81%E0%B8%A7%E0%B9%88%E0%B8%B2-8b649fd5d675
    
    *all oauth 2.0 using token . Consequently , secure rest api it's must have token to work
    *some cases using a session(serversite) intead of a token

### about tokens (type of cookie)
    type of tokens
        self-contained tokens
        reference tokens
            access token
            refresh token

    token rules
        1.unique
        2.can not edit token (even if editing that it's must be invalid stage or cannot use)
        3.short life span (should be (1min<1hr) for access token and (<2week) for refresh token)
        4.hard to predictable (hashing use uuid(if same value re-generate),private key(one key),secret key
        (per token)) *incase token have been stolen ,changing private key for resolve
        5.one time to use (stateful way : store token in to database like redis database)(if client request token again,old token it's must be revoke immediately)
        6.can revoke *incase revoke refresh token or regenerate refresh token ,should be revoke access token pair itself too
        7.no important data in the token to decypted (*do not store data like password or credential of transfer in token)
        8.using one way hashing (cannot decypt) (recommended SHA-3)
        9.limit token authority to access level (Ex.token1 can access level 1-3 token2 can access level 4-6 etc..) * token authority data should be store in database ,do not store in token because server can not edit authority data in realtime (cache in redis or store another database)

        *timing attack protection (compare stage) 
            Ex.public static boolean  MessageDigest.isEqual(byte[] digesta, byte[] digestb)

### anti CSRF ,insecure caching and clickjacking (middleware security)
    express.csrf (cross-site request forgery protection with troken)
    https://www.youtube.com/watch?v=_mp535F18Qg

    JWT(json-web-tokens) (one in many standard token)
    https://www.youtube.com/watch?v=xBYr9DxDqyU
        structure XXXX.YYYY.ZZZZ
        XXXX = base64_encode(header)
            typ : 'JWT' 
            alg : '<algorithm for hash Ex.HS512>'
        YYYY = base64_encode(payload)
            iss : "<unique id >"
            iat : <create time>
            exp : <expiration time>
        ZZZZ = base64_encode(sign(payload, header.algorithm, SECRET_KEY))(signature)
            var signature = sign(
                payload, 
                header.alg, 
                <Secret_Key>
            );
            var ZZZZ = base64_encode(signature);

    helmet ([csp]content security policy,[xframe]iframe protection from another)
    https://www.npmjs.com/package/helmet

### HTTPS/TLS
    https://nodejs.org/api/tls.html

### HTTP Digest Authentication

### encypt data (Ex.post data)
    https://nodejs.org/api/crypto.html

### hiden x-power-by header (attacker can determine what technology)
    https://www.youtube.com/watch?v=W-8XeQ-D1RI
