module.exports = function(app){
    
    app.use(function (req, res, next) {
        console.log('in pre-routing')
        res.setHeader('Strict-Transport-Security','max-age=8640000; includeSubDomains')
        next()
    })

    const index = require('../controllers/index.controller')
    app.get('/',index.main)
    //-----------------get token stage--------------------------
    //sign testing
    app.post('/sign',index.sign)
    //-----------------tokens protection stage------------------
    app.post('/user_desination',index.verifyToken,index.finddesination_user)
    //-----------------non verify tokens------------------------
    app.get('/header',index.testheader) //test get header data
    app.get('/users',index.findall_user)
    app.get('/users:id',index.findbyid_user)
}