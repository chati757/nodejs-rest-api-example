module.exports = function(app){
    
    var index = require('../controllers/index.controller');
    app.get('/user',index.go_index);

}