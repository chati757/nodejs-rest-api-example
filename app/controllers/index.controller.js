let users_json_ex = require('../models/example/users')

exports.main = (req,res) => {
    res.end('hello world')
}

exports.findall_user = (req,res) => {
    console.log('findall_user')
    res.json(users_json_ex)
}

exports.findbyid_user = (req,res) => {
    console.log('findbyid_user')
    console.log(req.params.id)
    req.sanitizeParams().trim(':')
    //req.checkParams('id','id not integer').isNumeric()
    let errors = req.validationErrors()
    if(errors){
        console.log(errors)
        res.end('error id not integer')
        console.log('findbyid_user:error')
        return
    }
    else{
        console.log('findbyid_user:pass')
        console.log(req.params)
        return
    }
    //req.params.id.
    //check id is number
    
}

//update or edit data