const jwt = require('../../config/express.js').jsonwebtoken()
const uuid_apikey_gen = require('../../config/express.js').uuid_api_key()
const key_pair = require('../../config/express.js').key_pair()
let users_json_ex = require('../models/example/users')

exports.main = (req,res) => {
    res.render('index',{title:'rest api example'})
}

exports.testheader = (req,res) => {
    console.log(req.headers)
    res.json({
        'reqstatus':'ok'
    })
    res.end()
}

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

exports.finddesination_user = (req,res) => {
    //decode data
    console.log("in finddesination_user")
    console.log(req.decoded)
    const decoded = req.decoded
    res.json({decoded})
    res.end()
}

exports.findall_user = (req,res) => {
    //check token first
    //console.log('findall_user')
    res.json(users_json_ex)
}

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