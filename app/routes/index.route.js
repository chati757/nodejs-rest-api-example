module.exports = function(app){
    
    const index = require('../controllers/index.controller')
    app.get('/',index.main)
    //-----------------get token stage--------------------------
    //sign testing
    app.post('/test',index.validator_testing)
    //-----------------tokens protection stage------------------
    app.post('/user_desination',index.finddesination_user)
    app.get('/users',index.findall_user)
    app.get('/users:id',index.findbyid_user)
}