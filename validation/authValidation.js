const {check} = require('express-validator');
const { transValidation } = require('../lang/vi');

let register = [
    check("email",transValidation.email_incorrect)
        .isEmail()
        .trim(),
    check('password',transValidation.password_incorrect)
        .isLength({min:8})
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    check('confirmPassword',transValidation.password_confirmation_incorrect)
        .custom((value,{req})=>{
            return value===req.body.password
        })
];
module.exports = {
    register
}