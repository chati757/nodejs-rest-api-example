let users_json_ex = require('../models/example/users')

exports.main = (req,res) => {
    res.end('hello world')
}

exports.findall_user = (req,res) => {
    //console.log('findall_user')
    res.json(users_json_ex)
}

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
        })
        .catch(e=>{
            //console.log('catch')
            res.json('error:',e)
        })
    }
    //------------------------------------------------------------------------------
    
    
}

exports.new_user = ()=>{
//show new user object
}
exports.update_user = ()=>{
//show update user object
}
//update or edit data