module.exports = function(app){
    
    const index = require('../controllers/index.controller')
    app.get('/',index.main)
    app.get('/users',index.findall_user)
    app.get('/users:id',index.findbyid_user)
}