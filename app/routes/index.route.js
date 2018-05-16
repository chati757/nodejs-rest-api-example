module.exports = function(app){
    
    const index = require('../controllers/index.controller')
    app.get('/',index.main)
    app.post('/users',index.findall_user)
    app.post('/users:id',index.findbyid_user)
}