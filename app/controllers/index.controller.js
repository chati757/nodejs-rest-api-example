const jwt = require('jsonwebtoken')
let users_json_ex = require('../models/example/users')

//format of token
    //Authorization: Bearer <access_token> or api_key <api_key>
//<access token> or <api_key>
function verifyToken(req,res,next){
    console.log("in verifyToken stage")
    const api_key_header = req.headers['authotization']
    //check access token stage
    if(typeof api_key_header !=='undefined'){
        // Split at the space
        const api_key = api_key_header.split(' ')
        // Get token from array
        const api_key_header_Token = api_key[1]
        // check api_key_header_Token in database
            // set the token
            // get signature from post data
            // split signature --> <data_cmd> + <api_secret_key> = <api_secret_key>
            // req.data_cmd = <data_cmd>
            // req.api_secret_key = <api_secret_key>
            // goto next middleware
        next()
        //res.sendStatus(403)
    }else{
        //forbidden
        res.sendStatus(403)
    }
}

//how to use it ?
    /*                              add this position
                                        |
                                        v
        exports.middlewareexample = verifyToken,(req,res) => {
            ...
        }
    */

exports.main = (req,res) => {
    res.end('hello world')
}


exports.sign = (req,res) => {
    //--------------------------sanitize------------------------------
    //-------------------checkdata in database------------------------
    //---------------------response with token------------------------
    //generate api-key and get into database
    //send api-key and tokens(secret key)
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    jwt.sign({
        id:users_json_ex.id,
        username:users_json_ex.username,
        password:users_json_ex.password,
        api_key:api_key
    },'secretkey',(err,api_secret_key) => {
        console.log("token provided:",api_secret_key)
        req.api_secret_key
    })
    
}

exports.finddesination_user = verifyToken,(req,res) => {
    //verify api_secret_key
    jwt.verify(req.api_secret_key,'secretkey',(err,authData)=>{
        if(err){
            res.sendStatus(403)
        }else{
            res.json({authData})
            //use req.data_cmd for filter userdata
            //if can authData , response desination_user
        }

    })
}

exports.findall_user = verifyToken,(req,res) => {
    //check token first
    //console.log('findall_user')
    res.json(users_json_ex)
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
        /*
        //promise direction style
        let users_json_filter_Promise= new Promise((resolve,reject)=>{
            resolve(
                users_json_ex.filter(e=>e.id===req.params.id)
            )
            reject(
                'database filtering id failed'
            )
        })
        //res.json(users_json_filter)
        users_json_filter_Promise
        .then(e=>{
            //console.log('inthen')
            res.json(e)
            //console.log(getbyid(req.params.id))
        })
        .catch(e=>{
            //console.log('catch')
            res.json('error:',e)
        })
        */
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

exports.new_user = verifyToken,()=>{
//show new user object
}

exports.update_user = verifyToken,()=>{
//show update user object
}
//update or edit data

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
