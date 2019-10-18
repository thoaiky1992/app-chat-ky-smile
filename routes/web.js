const express = require('express');
const router  = express.Router();
const AuthController = require('../controller/authController');             
const validationAuth = require('../validation/authValidation');
let initRoutes = (app) => {
    router.get('/',AuthController.getLogin);
    router.get('/sign-in',AuthController.getLogin);
    router.get('/sign-up',AuthController.getRegister);
    router.post('/register',validationAuth.register , AuthController.register);
    router.get('/forgot-password',AuthController.getForgotPassword)
    router.get('/verify/:token',AuthController.verifyAccount)
    router.post('/forgot-password',AuthController.forgotPassword)


    router.get('/chat',(req,res) => {
        res.render('chat');
    })
    return app.use('/',router);
}
module.exports = initRoutes;