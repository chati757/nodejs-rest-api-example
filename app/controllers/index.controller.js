const jwt = require('jsonwebtoken')
let users_json_ex = require('../models/example/users')

//format of token
    //Authorization: Bearer <access_token> or api_key: <api_key>
//<access token>
function verifyToken(req,res,next){
    console.log("in verifyToken stage")
    const bearerHeader = req.headers['authotization']
    //check access token stage
    if(typeof bearerHeader !=='undefined'){
        // Split at the space
        const bearer = bearerHeader.split(' ')
        // Get token from array
        const bearerToken = bearer[1]
        // set the token
        req.token = bearerToken
        // goto next middleware
        next()
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


exports.get_api_key = (req,res) => {
    //--------------------------sanitize------------------------------
    //-------------------checkdata in database------------------------
    //---------------------response with token------------------------
    //send token to client
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    jwt.sign({
        id:users_json_ex.id,
        username:users_json_ex.username,
        password:users_json_ex.password
    },'secretkey',(err,token) => {
        console.log("token provided:",token)
    })
    
}

exports.finddesination_user = verifyToken,(req,res) => {

}

exports.findall_user = verifyToken,(req,res) => {
    //check token first
    //console.log('findall_user')
    res.json(users_json_ex)
}

//user and admin
exports.findbyid_user = verifyToken,(req,res) => {
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
        getbyid(1)
        .then(e=>{
            res.json(e)
        })
        .catch(e=>{
            res.json('error:',e)
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
