const express = require('express');
const router  = express.Router();
const auth = require('../controller/authController');             
const validationAuth = require('../validation/authValidation');
let initRoutes = (app) => {
    router.get('/',auth.getLogin);
    router.get('/sign-in',auth.getLogin);
    router.get('/sign-up',auth.getRegister);
    router.post('/register',validationAuth.register , auth.register);
    router.get('/forgot-password',auth.getForgotPassword)
    router.get('/chat',(req,res) => {
        res.render('chat');
    })
    return app.use('/',router);
}
module.exports = initRoutes;