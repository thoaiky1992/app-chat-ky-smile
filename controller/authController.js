const {validationResult} = require('express-validator');
const _ = require('lodash');
let getLogin = (req,res) => {
    res.render('sign-in');
}
let getRegister = (req,res) => {
    res.render('sign-up',{ errors : req.flash('errors') });
}
let getForgotPassword = (req,res) => {
    res.render('forgot-password');
}
let register = (req,res) => {
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
        res.redirect('/sign-up');
    }
}
module.exports = {
    register,
    getLogin,
    getRegister,
    getForgotPassword
}