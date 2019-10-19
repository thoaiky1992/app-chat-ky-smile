const {validationResult} = require('express-validator');
const {transSuccess , transErrors } = require('../lang/vi');
const userService = require('../service/userService');
const auth = require('../service/authService');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const _ = require('lodash');


// udate Avatar
let StorageAvatar = multer.diskStorage({
    destination : (req,file,callback) => {
        callback(null,"public/assets/images");
    },
    filename : (req,file,callback) => {
        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null,avatarName);
    }
})
let avatarUploadFile = multer({
    storage : StorageAvatar,
}).single("avatar");
let updateAvatar = (req,res) => {
    avatarUploadFile(req,res, async (error) => {
        if(error){
            return res.status(500).send(error);
        }
        try {
            let updateUserItem = {
                avatar : req.file.filename,
                updatedAt : Date.now()+""
            }
            // update User
            await userService.updateUser(req.user._id,updateUserItem);
            // xoá avatar cũ
            // let remove_avatar_by_src = `public/assets/images/${userUpdate.avatar}`;
            // if(remove_avatar_by_src !== 'public/assets/images/avatar-default.jpg'){
            //     await fsExtra.remove(remove_avatar_by_src);
            // }
            let result = {
                message : transSuccess.user_info_or_avatar_updated,
                imageSrc : `assets/images/${req.file.filename}`
            }
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send(error);
        }
    });
}
let getLogin = (req,res) => {
    res.render('sign-in' ,  { errors : req.flash('errors') , success : req.flash('success')} );
}
let getRegister = (req,res) => {
    res.render('sign-up', { errors : req.flash('errors') , success : req.flash('success')} );
}
let getForgotPassword = (req,res) => {
    res.render('forgot-password' ,  { errors : req.flash('errors') , success : req.flash('success')} );
}
let register = async (req,res) => {
    let errorArr   = [];
    let successArr = [];
    const errorValidation = validationResult(req);
    if(!errorValidation.isEmpty()){
        
        let errors = Object.values(errorValidation.mapped()); // Object.values lấy tất cả các value bỏ vào mảng 
        errors.forEach(item => {
            errorArr.push(item.msg);
        })
        errorArr = _.reverse(errorArr);
        req.flash('errors',errorArr);
        return res.redirect('/sign-up');
    }
    try {
        let address = req.body.address;
        let phone = req.body.phone;
        let email = req.body.email;
        let password = req.body.password;
        let gender = req.body.gender;
        let userCreateSuccess = await auth.register(address,phone,email,password,gender,req.protocol,req.get("host"));
        successArr.push(userCreateSuccess);
        req.flash('success',successArr);
        res.redirect('/sign-in');
    } catch (error) {
        errorArr.push(error);
        req.flash('errors',errorArr);
        res.redirect('/sign-up',);
    }

}
let updatePassword = async (req,res) => {
    let errorArr   = [];
    const errorValidation = validationResult(req);
    if(!errorValidation.isEmpty()){
        
        let errors = Object.values(errorValidation.mapped()); // Object.values lấy tất cả các value bỏ vào mảng 
        errors.forEach(item => {
            errorArr.push(item.msg);
        })
        errorArr = _.reverse(errorArr);
        req.flash('errors',errorArr);
        return res.redirect('/change-password');
    }
    try {
        let newPassword = req.body.NewPassword;
        let currentPassword = req.body.currentPassword
        await userService.updatePassWord(newPassword,currentPassword,req.user._id);
        req.logout();
        req.flash('success',transSuccess.user_password_updated);
        return res.redirect('/sign-in');
        
    } catch (error) {
        req.flash('errors',error);
        return res.redirect('/change-password');
    }
}
let verifyAccount = async (req,res) => {
    let errorArr   = [];
    let successArr = [];
    try {
        let verifySuccess = await auth.verifyAccount(req.params.token);
        successArr.push(verifySuccess);
        req.flash('success',successArr);
        return res.redirect('/sign-in')
    } catch (error) {
        errorArr.push(error);
        req.flash('errors',errorArr);
        return res.redirect('/sign-up');
    }
}
let forgotPassword = async (req,res) => {
    let errorArr   = [];
    let successArr = [];
    try {
        let userChangePassword = await auth.forgotPassword(req.body.email);
        successArr.push(userChangePassword);
        req.flash('success',successArr);
        return res.redirect('/sign-in')
    } catch (error) {
        errorArr.push(error);
        req.flash('errors',errorArr);
        return res.redirect('/forgot-password');
    }
}
let getLogout = (req,res) => {
    req.logout(); // remove session passport
    req.flash('success',transSuccess.logout_success);
    return res.redirect('/sign-in')
}
let checkLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        return res.redirect('/sign-in');
    }
    next();
}
let checkLoggedOut = (req,res,next) => {
    if(req.isAuthenticated()){
        return res.redirect('/chat');
    }
    next();
}
let updateInfoUser = async (req,res) => {
    let item = {
        username : req.body.username,
        gender : req.body.gender,
        phone : req.body.phone,
        address : req.body.address
    }
    await userService.updateInfoUser(item,req.user._id);
    return res.status(200).send({message:transSuccess.user_info_or_avatar_updated })
}
module.exports = {
    register,
    getLogin,
    getRegister,
    getForgotPassword,
    verifyAccount,
    forgotPassword,
    getLogout,
    checkLoggedIn,
    checkLoggedOut,
    updateAvatar,
    updateInfoUser,
    updatePassword
}