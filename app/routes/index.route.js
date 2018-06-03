module.exports = function(app){
    
    const index = require('../controllers/index.controller')
    app.get('/',index.main)
    //-----------------get token stage--------------------------
    //sign testing
    app.post('/test',index.validator_testing)
    //-----------------tokens protection stage------------------
    app.post('/user_desination',index.verifyToken,index.finddesination_user)
    //-----------------non verify tokens------------------------
    app.post('/header',index.testheader) //test get header data
    app.get('/users',index.findall_user)
    app.get('/users:id',index.findbyid_user)
}