const express = require('express');
const router  = express.Router();
const AuthController = require('../controller/authController');             
const validationAuth = require('../validation/authValidation');
const passport = require('passport');
const initPassportLocal = require('../controller/passportController/local');
initPassportLocal();
let initRoutes = (app) => {
    router.get('/',AuthController.getLogin);
    router.get('/sign-in',AuthController.getLogin);
    router.get('/sign-up',AuthController.getRegister);
    router.post('/register',validationAuth.register , AuthController.register);
    router.get('/forgot-password',AuthController.getForgotPassword);
    router.get('/verify/:token',AuthController.verifyAccount);
    router.post('/forgot-password',AuthController.forgotPassword);
    // login Local
    router.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { 
                return res.render('sign-in' ,  {errors : req.flash('errors') , success : req.flash('success')} );
            }
            req.logIn(user, function(err) {
                if (err) { 
                    return next(err); 
                }
                return res.redirect('/chat');
            });
        })(req, res, next);
      });
    router.get('/chat',(req,res) => {
        res.render('chat', { errors : req.flash('errors') , success : req.flash('success')} );
    })
    return app.use('/',router);
}
module.exports = initRoutes;