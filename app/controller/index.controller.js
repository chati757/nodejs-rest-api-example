users_json_ex = require('../models/example/users')

exports.findall_user = function(req,res){
    console.log("findall_user")
    res.json(users_json_ex)
}
//next is goto next middle