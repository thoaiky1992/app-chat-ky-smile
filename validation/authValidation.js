const {check} = require('express-validator');
const { transValidation } = require('../lang/vi');

let register = [
    check("email",transValidation.email_incorrect)
        .isEmail()
        .trim(),
    check('phone',transValidation.update_phone)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/), 
    check('password',transValidation.password_incorrect)
        .isLength({min:8})
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    check('confirmPassword',transValidation.password_confirmation_incorrect)
        .custom((value,{req})=>{
            return value===req.body.password
        })
];
let updatePassword = [
    check("currentPassword",transValidation.password_incorrect)
        .isLength({min:8})
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    check("NewPassword",transValidation.password_incorrect)
        .isLength({min:8})
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    check("confirmNewPassword",transValidation.password_confirmation_incorrect)
        .custom((value,{req}) => value === req.body.NewPassword )
]
module.exports = {
    register,
    updatePassword
}