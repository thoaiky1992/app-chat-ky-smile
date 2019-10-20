const express = require('express');
const router  = express.Router();
const AuthController = require('../controller/authController');     
const ChatController = require('../controller/chatController');        
const validationAuth = require('../validation/authValidation');
const passport = require('passport');
const initPassportLocal = require('../controller/passportController/local');
initPassportLocal();
let initRoutes = (app) => {
    //-----------------------Auth -----------------------------
    router.get('/',AuthController.checkLoggedOut,AuthController.getLogin);
    router.get('/sign-in',AuthController.checkLoggedOut,AuthController.getLogin);
    router.get('/sign-up',AuthController.checkLoggedOut,AuthController.getRegister);
    router.post('/register',validationAuth.register , AuthController.register);
    router.get('/forgot-password',AuthController.checkLoggedOut,AuthController.getForgotPassword);
    router.get('/verify/:token',AuthController.checkLoggedOut,AuthController.verifyAccount);
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
    router.get('/chat',AuthController.checkLoggedIn , ChatController.getChat);
    router.get('/change-password',AuthController.checkLoggedIn , ChatController.getChangePassword);
    router.get('/contact',AuthController.checkLoggedIn ,ChatController.getContact);
    router.get('/edit',AuthController.checkLoggedIn , ChatController.getEditUser);
    router.get('/logout',AuthController.checkLoggedIn , AuthController.getLogout);
    router.post('/update-avatar',AuthController.checkLoggedIn , AuthController.updateAvatar);
    router.post('/udpate-info-user',AuthController.checkLoggedIn , AuthController.updateInfoUser);
    router.post('/update-password',AuthController.checkLoggedIn,validationAuth.updatePassword , AuthController.updatePassword);

    router.get('/search-user-to-add-friend' , AuthController.checkLoggedIn , ChatController.searchUserToAddFriend );


    return app.use('/',router);
}
module.exports = initRoutes;