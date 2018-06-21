module.exports = function(app){
    
    //--------------------------------pre-route----------------------------------
    //Strict-Transport-Security
    app.use(function (req, res, next) {
        console.log('Strict-Transport-Security protection')
        res.setHeader('Strict-Transport-Security','max-age=8640000; includeSubDomains;')
        next()
    })

    //Content Security Policy
    const policy ="\
    default-src 'self' https://apis.google.com https://localhost:3000/;\
    script-src 'self';\
    form-action 'self' https://localhost:3000/*;"
        
    app.use(function (req, res, next) {
        console.log('Content Security Policy protection')
        //res.set is alias of express-framework
        res.set({
            "X-Content-Security-Policy":policy,
            "X-Webkit-CSP":policy
        })
        next()
    })

    //set multi-header with express-framework function
    app.use(function (req, res, next) {
        console.log('Anti-X-Frame')
        res.setHeader("X-Frame-Options","DENY")
        next()
    })

    //set an-ti DNS-Prefetch
    app.use(function (req, res, next) {
        console.log('Anti-DNS-Prefetch')
        res.setHeader("X-DNS-Prefetch-Control","off")
        next()
    })
    //-------------------------------------------------------------------------


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