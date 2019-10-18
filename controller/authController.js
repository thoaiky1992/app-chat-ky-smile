const {validationResult} = require('express-validator');
const auth = require('../service/authService');
const _ = require('lodash');
let getLogin = (req,res) => {
    res.render('sign-in' ,  { errors : req.flash('errors') , success : req.flash('success')});
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
        let userCreateSuccess = await auth.register(req.body.email,req.body.password,req.protocol,req.get("host"));
        successArr.push(userCreateSuccess);
        req.flash('success',successArr);
        res.redirect('/sign-in');
    } catch (error) {
        errorArr.push(error);
        req.flash('errors',errorArr);
        res.redirect('/sign-up');
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
module.exports = {
    register,
    getLogin,
    getRegister,
    getForgotPassword,
    verifyAccount,
    forgotPassword
}