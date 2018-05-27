module.exports = function(app){
    
    const index = require('../controllers/index.controller')
    app.get('/',index.main)
    //-----------------get token stage--------------------------
    app.post('/get_api_key',index.get_api_key)
    //-----------------tokens protection stage------------------
    app.get('/user_desination',index.finddesination_user)
    app.get('/users',index.findall_user)
    app.get('/users:id',index.findbyid_user)
}