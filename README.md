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
        "name": "example_rest_api",
        "version": "1.0.0",
        "dependencies": {
            "body-parser": "1.18.3",
            "compression": "1.7.2",
            "ejs": "^2.6.1",
            "express": "4.16.3",
            "express-validator": "5.2.0",
            "jsonwebtoken": "^8.2.1",
            "morgan": "1.9.0",
            "uuid-apikey": "^1.3.5",
            "keypair" : "1.0.1"
        },
        "dependenciesComments": {
            "morgan": "HTTP request logger middleware for node.js.",
            "compression": "Node.js compression middleware.",
            "body-parser": "Node.js body parsing middleware.",
            "jsonwebtoken": "jsontokens for anti-csrf and customizing for future function in middleware.",
            "ejs": "Embedded JavaScript templates (templates engine)",
            "uuid-apikey": "generate apikey for client",
            "keypair" : "rsa (public key and private key) generator"
        }
    }
    ..\<project folder> $ npm install

### create mvc file stucture

    ..\<project folder> $ file server.js
        //set default environment
        process.env.NODE_ENV = process.env.NODE_ENV || 'development' //default env is 'development'

        //require express configuration
        var express = require('./config/express')
        var app = express.mainconfig()

        //listening
        app.listen(3000)

        console.log("server running at http://localhost:3000")

        module.exports = app //for reuse

    ..\<project folder> $ folder app
        ..\<project folder> $ folder routers
            ..\<project folder> $ file index.route.js
                module.exports = function(app){
    
                    const index = require('../controllers/index.controller')
                    app.get('/',index.main)
                    //------------------get token stage--------------------------
                    //sign stage
                    app.post('/sign',index.sign)
                    //------------------tokens protection stage------------------
                                                [token protection]
                                                        |
                                                        v
                    app.post('/user_desination',index.verifyToken,index.finddesination_user)
                    //---------non verify tokens or non token protection---------
                    app.post('/header',index.testheader) //test get header data
                    app.get('/users',index.findall_user)
                    app.get('/users:id',index.findbyid_user)
                }
                
        ..\<project folder> $ folder controller
            ..\<project folder> $ file index.controller.js
                //call module from express.js (config file)
                const jwt = require('../../config/express.js').jsonwebtoken()
                const uuid_apikey_gen = require('../../config/express.js').uuid_api_key()
                const key_pair = require('../../config/express.js').key_pair()

                //call database (example)
                let users_json_ex = require('../models/example/users')

                //connect routing index path and render view
                exports.main = (req,res) => {
                    res.render('index',{title:'rest api example'})
                }

                //testing receive json header [what is look like ?]
                exports.testheader = (req,res) => {
                    console.log(req.headers)
                    res.json({
                        'reqstatus':'ok'
                    })
                    res.end()
                }
                
                //connect routing sign path
                exports.sign = (req,res) => {
                    //------------------------------------checkdata-------------------------------------
                    req.checkBody('testusername','username is empty')
                    .notEmpty()
                    req.checkBody('testusername','username is not en-US please change your language first!')
                    .isAlphanumeric()
                    req.checkBody('testpassword','password is empty')
                    .notEmpty()
                    req.checkBody('testpassword','password is not en-US or password is spacial character!')
                    .isAlphanumeric()
                    req.checkBody('testemail','email not detected please check email input again')
                    .notEmpty().isEmail()
                    req.checkBody('testemail','use gmail or hotmail only Example: xxx@gmail.com or xxx@hotmail.com')
                    .matches('@gmail.com|@hotmail.com')//gmail and hotmail only
                    //-------------------------------------sanitize--------------------------------------
                    req.sanitizeBody('testemail').normalizeEmail()
                    //---------------------------------check in database---------------------------------
                    let errors = req.validationErrors()
                    if(errors){
                        //console.log(errors)
                        //res.end('error id not integer id')
                        res.end(errors[0].msg)
                        //console.log('findbyid_user:error')
                        //return
                    }else{
                        //msg to user : please wait
                        findbyuser_email_exist(req.body.testusername,req.body.testemail)
                        .then(e=>{
                            //found
                            if(e===true){
                                throw 'error : username is exist in database'
                            }else{
                                console.log('username is available')
                                //check api_key in database
                                const buffer_uuid_apikey=uuid_apikey_gen.create()
                                const buffer_keypair = key_pair()
                                findbypublicandapikeyexist(buffer_uuid_apikey.apiKey,buffer_keypair.public)
                                .then(e=>{
                                    if(e===true){
                                        throw 'error : apikey is exist in database'
                                    }
                                    else{
                                        console.log('apikey and public key is available')
                                        //put api_key in database [id,username,password,apiKey]
                                        console.log(buffer_keypair)
                                        console.log(buffer_uuid_apikey)
                                        //response api_key and secret_api_key
                                        res.json(
                                            {
                                                'api key':buffer_uuid_apikey.apiKey,
                                                'secret key':buffer_keypair.private
                                            }
                                        )
                                    }
                                },e=>{
                                    //[reject handle] cannot connect database
                                    res.end(e)
                                })
                                .catch(e=>{
                                    //[in resolve error]
                                    //error : apikey is exist in database
                                    res.end(e)
                                })
                            }
                        },e=>{
                            //[reject handle] cannot connect database
                            res.end(e)
                        })
                        .catch(e=>{
                            //[in resolve error]
                            //'error : username is exist in database'
                            res.end(e)
                        })
                        //console.log(req.body.testpassword)
                        //console.log(req.body.testemail)
                        
                    }
                }

                //sanitize testing
                exports.findbyid_user = (req,res) => {
                    //console.log('findbyid_user')
                    //console.log(req.params.id)
                    //--------------------------check and sanitize---------------------------------
                    req.checkParams('id','id not integer').isNumeric()//check isNumeric
                    req.sanitizeParams('id').trim(':')//':1'>'1'
                    req.sanitizeParams('id').toInt()//'1'>1 <--because database id is integer
                    //console.log('after sanitizeParams :',req.params.id)
                    //check error from checkParams and sanitizeParams
                    let errors = req.validationErrors()
                    if(errors){
                        //console.log(errors)
                        res.end('error id not integer id')
                        //console.log('findbyid_user:error')
                        //return
                    }
                    //------------------------------------------------------------------------------
                    //-------------------------------get data---------------------------------------
                    else{
                        //console.log('findbyid_user:pass')
                        getbyid(req.params.id)
                        .then(e=>{
                            res.end(e[0].name)
                        })
                        .catch(e=>{
                            console.log('error id data out of scope in database')
                            res.end('error:no id')
                        })
                        
                    }
                    //------------------------------------------------------------------------------
                }
                //format of token
                    //authorization: Bearer <access_token> or api_key <api_key>
                //<access token> or <api_key>
                exports.verifyToken = (req,res,next) =>{
                    console.log("in verifyToken stage")
                    const api_key = req.headers['api_key']
                    //check access token stage
                    if(typeof api_key !=='undefined'){
                        console.log('tokens handle..')
                        console.log(api_key)
                        // check api_key_header_Token in database
                        findbyapikeyexist(api_key)
                        .then(e=>{
                            if(e===true){
                                // set the token
                                // get signature from post data
                                // check is encoded base64
                                    //sanitize '-'
                                req.checkHeaders('signature','signature not detected')
                                .notEmpty()
                                console.log(req.headers['signature'])
                                    //check body is isAlphanumeric
                                req.checkHeaders('signature','signature not detected')
                                .matches('[A-Z]|[a-z]|[0-9]|\.|_')

                                let errors = req.validationErrors()
                                if(errors){
                                    //api_key is empty or not Alphanumeric
                                    res.sendStatus(403)
                                }else{
                                    console.log('signature detected')
                                    console.log('inelse:datapass:signature..')
                                    // verify signature using secret key to get apikey
                                    getpublickeybyid(api_key)
                                    .then(e=>{
                                        //e is object of user (users_json_ex)
                                        jwt.verify(req.headers['signature'],e.pub_key,{algorithm:'RS256'},(err,decoded)=>{
                                            if(err){
                                                console.log('cannot verify this signature')
                                                res.sendStatus(403)
                                            }else{
                                                console.log('verifyed')
                                                req.decoded = decoded
                                                next()
                                            }
                                        })
                                    },e=>{
                                        //error cannot getpublickeybyid
                                        console.log('in error')
                                        res.end(e)
                                    })
                                }
                            }else{
                                //apikey is not exist
                                res.end('apikey is not exist')
                            }
                        },e=>{
                            // reject
                            //error connot conncet database
                            console.log('in error')
                            res.end(e)
                        })
                    }else{
                        //forbidden
                        res.sendStatus(403)
                    }
                }
                /*
                    //sign stage
                jwt.sign({
                            id:users_json_ex.id,
                            username:users_json_ex.username,
                            api_key:buffer_apikey.apiKey
                            //algorithm:'HS256' is mean HMAC(algorithm) with SHA-256(hash function)
                            //and more algorithm https://github.com/auth0/java-jwt in Available Algorithms section
                        },'secretkey',{algorithm:'HS256'},(err,api_secret_key) => {
                            //console.log("token provided:",api_secret_key)
                            res.json({
                                title:'rest api example',
                                uu_id:buffer_apikey.uuid,
                                api_key:buffer_apikey.apiKey,
                                api_secret_key:api_secret_key
                            })
                        })
                */ 
                /*  
                    //verify token stage            
                                            add this position
                                                    |
                                                    v
                    exports.middlewareexample = verifyToken,(req,res) => {
                        ...
                    }
                    // and create verifyToken function
                    function verifyToken(req,res,next){...}
                */

                /* 
                    //verify stage
                    jwt.verify(api_secret_key,'secretkey',(err,authData)=>{
                        if(err){
                            res.sendStatus(403)
                        }else{
                            res.json({authData})
                            //use req.data_cmd for filter userdata
                            //if can authData , response desination_user
                        }

                    })
                */

                //after verifytoken stage(token protection) bypass function to find desination_user
                //can check in index.route.js
                exports.finddesination_user = (req,res) => {
                    //decode data
                    console.log("in finddesination_user")
                    console.log(req.decoded)
                    const decoded = req.decoded
                    res.json({decoded})
                    res.end()
                }

                //testing connect routing without token protection
                exports.findall_user = (req,res) => {
                    //check token first
                    //console.log('findall_user')
                    res.json(users_json_ex)
                }
                
                //-------------------------------function for controller------------------------------
                //get data with id function
                getbyid = (id) =>{
                    console.log("ingetbyid")
                    return new Promise((resolve,reject)=>{
                        resolve(
                            users_json_ex.filter(e=>e.id===id)
                        )
                        reject(
                            'database filtering id failed'
                        )
                    })
                }

                findbyuser_email_exist = (username,email) =>{
                    console.log("findbyuser_email_exist")
                    return new Promise((resolve,reject)=>{
                        resolve(
                            users_json_ex.some(e=>e.username===username || e.email===email)
                        )
                        reject(
                            'error connot conncet database'
                        )
                    })
                }

                findbypublicandapikeyexist = (api_key,pub_key) =>{
                    console.log("findbypublickeyexist")
                    return new Promise((resolve,reject)=>{
                        resolve(
                            users_json_ex.some(e=>e.pub_key===pub_key && e.api_key===api_key)
                        )
                        reject(
                            'error connot conncet database'
                        )
                    })
                }

                findbyapikeyexist = (api_key) =>{
                    console.log("findbypublickeyexist")
                    return new Promise((resolve,reject)=>{
                        resolve(
                            users_json_ex.some(e=>e.api_key===api_key)
                        )
                        reject(
                            'error connot conncet database'
                        )
                    })
                }

                getpublickeybyid = (api_key) =>{
                    console.log("getpublickeybyid")
                    return new Promise((resolve,reject)=>{
                        resolve(
                            users_json_ex.find(e=>e.uuid===uuid_apikey_gen.toUUID(api_key))
                        )
                        reject(
                            'error connot connect database'
                        )
                    })
                }
                //------------------------------------------------------------------------------------

        ..\<project folder> $ folder models 
            (for get and post json example)
            ..\<project folder> $ folder example
                ..\<project folder> $ file users.js
                    let users = [
                    {
                        "id": 0,
                        "uuid":"",
                        "pub_key":"",
                        "username": "admin",
                        "password": "admin123",
                        "email":"unknow@gmail.com",
                        "name": "black cyber master",
                        "position": "unknow"
                    },
                    {
                        "id": 1,
                        "uuid":"",
                        "pub_key":"",
                        "username": "goldroger",
                        "password": "goldroger123",
                        "email":"goldroger@gmail.com",
                        "name": "Gol D. Roger",
                        "position": "Pirate King",
                        "destination_id":2
                    },
                    {
                        "id": 2,
                        "uuid":"",
                        "pub_key":"",
                        "username": "mrzero",
                        "password": "mrzero123",
                        "email":"mrzero@gmail.com",
                        "name": "Sir Crocodile",
                        "position": "Former-Shichibukai",
                        "destination_id":3
                    },
                    {
                        "id": 3,
                        "uuid":"6d67733d-4901-410c-a9ef-4ab60fd87297",
                        "api_key":"DNKQ6FD-940M236-N7QMNDQ-1ZC755Z",
                        "pub_key":"-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAguzR5ESkHdsIWvueREuaG5y0dV2kovTgkVqpgTPS3lkcDrmp/J2bXKfJ/oKc\nbuDQdzuLzE/hLMwsMe5lVtOrEySxipWEyDsF0BvwPNklUmRBfWN9tZzPMspzvYNrdSPWgHFP\n1tvMNJwonkPmx1O+ksmFnzNg/7Hgp5IMGL/otsjvnNj4zi6Vv3KZ4abYGOYIdPpNzSyqXmjT\nVIYJ+M8n3V9K27Hp4rcpjFDbsUERpFo5iMnn+gx7hjtC9pP6X4/VdFfAwUw0ML58jN+ktEx3\niWxkd/P2Nx4aBrP5fE4yB8RCjxKnmlHMm49nOyr2sa1g6gja3AQ5Ua1qSqEperUaBwIDAQAB\n-----END RSA PUBLIC KEY-----\n",
                        "username": "testuser",
                        "password": "test123",
                        "email":"test@gmail.com",
                        "name": "Monkey D. Luffy",
                        "position": "Captain",
                        "desination_id":1
                    }
                ]

                module.exports = users

        ..\<project folder> $ folder view (for future)
            ..\<project folder> $ file index.ejs

    ..\<project folder> $ folder config
        ..\<project folder> $ folder dev
        ..\<project folder> $ folder production
        ..\<project folder> $ file express.js
            //require all module in package.json
            const express = require('express')
            const morgan = require('morgan')
            const compression = require('compression')
            const bodyParser = require('body-parser')
            const express_validator = require('express-validator')
            const ejs = require('ejs')

            //allow module in controller
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

            //main config for server
            exports.mainconfig = function(){
                //call express module
                const app = express()

                //set default for debug mode in development stage
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

    ..\<project folder> $ folder public (for future)(for share resource)

    ..\<project folder> $ file server.js
        //set default env for start server
            process.env.NODE_ENV = process.env.NODE_ENV || 'development'; //default env is 'development'

        //import internal config (express.js)
            var express = require('./config/express');

        //usring express
            var app = express()

        //set application server for listen port 3000
            app.listen(3000);

        (optional for reuse server application)
            module.exports = app; //for reuse

## security (additional)

### vulnerability syntax extension
    https://nodesecurity.io/advisories/

### data varidator
    https://validatejs.org/

### about oauth(open authorization) 2.0 password grant 4 type
    1.authorization code flow
    2.lmplicit flow
    3.owner password credentials flow <--usring this
    4.client credentials flow

    refer:https://medium.com/@taengtrirongpholphimai/%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B8%B9%E0%B9%89%E0%B8%88%E0%B8%B1%E0%B8%81-oauth2-%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B5%E0%B8%81%E0%B8%A7%E0%B9%88%E0%B8%B2-8b649fd5d675
    
    *all oauth 2.0 using token . Consequently ,the secure in rest api it's must have token to work with
    *some cases using a session(serversite) intead of a token

### about tokens (type of cookie)
    type of tokens
        self-contained tokens <--usring this
        reference tokens (doesn’t contain useful information)(this is similar to session)
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
    https://github.com/auth0/node-jsonwebtoken
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
                <Secret_Key> or <private key> and <public key>
            );
            var ZZZZ(token) = base64_encode(signature);
    *JWT have 2 mode
        1.asymmetric encryption (<private key> and <public key>)
            ref : https://github.com/auth0/node-jsonwebtoken
        2.one way encyption (<Secret_Key> )

    helmet ([csp]content security policy,[xframe]iframe protection from another)
    https://www.npmjs.com/package/helmet

### HTTPS/TLS
    https://nodejs.org/api/tls.html

### encyption
    type of encyption (3 types)
        1.symmetric encryption usring secret key for encypt and decypt
            Ex.
                plain text + secret key = encypted data
                user send secret key to receiver (confidential of solution)
                receiver use the scret key to decypt encypted data

        2.asymmetric encryption usring public key for encypt and privete key for decypt
            2.1 encyption type (keep secret of data)
                owner send public key to someone for encypt data (some one who needs to send data to owner) and the owner have a private keyfor decypt it 

            2.2 digital signature type (for authentication)
                1.sender -->[data]-->[digest data] + [private key] (for encypt) = [digital signature]
                2.sender send [digest data] and [digital signature] to receiver
                3.receiver --> [digital signature] + [public key] (for decypt) = digest data
                4.receiver compare between digest data from yourself and digest data from sender
                5.if data is match it's mean data form sender is correct

        3.message digest algorithm (one way encyption) 
            Ex.SHA-256:Is unkeyed cryptographic hash function
    *ref : http://vzrnote.blogspot.com/2015/11/blog-post.html

    type of hash function
        https://en.wikipedia.org/wiki/List_of_hash_functions
    
    

### encypt data library(Ex.post data)
    https://nodejs.org/api/crypto.html

### hiden x-power-by header (attacker can determine what technology)
    https://www.youtube.com/watch?v=W-8XeQ-D1RI
