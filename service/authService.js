const userModel = require('../model/userModel');
const { transErrors ,  transSuccess , transMail } =  require('../lang/vi');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const sendMail = require('../config/mailer');
const random = require('../helpers/randomPassword');

let  saltRounds = 7 ;
let register =  (address,phone,email,password,gender,protocol,host) => {
    return new Promise(async(resolve,reject) => {
        let userByEmail = await userModel.findByEmail(email);
        if(userByEmail){
            if(!userByEmail.local.isActive){
                return reject(transErrors.account_not_active);
            }
            if(userByEmail.deletedAt != null){
                return reject(transErrors.account_removed);
            }
            return reject(transErrors.account_in_use);
        }
        let salt = bcrypt.genSaltSync(saltRounds);
        let userItem = {
            username : email.split('@')[0],
            address : address,
            gender : gender,
            phone : phone,
            local : {
                email : email , 
                password : bcrypt.hashSync(password,salt),
                verifyToken : uuidv4()
            },
            type : 1
        };
        let user = await userModel.createNew(userItem);
        //send Mail
        // linkVerify : http://localhost/verify/aksrbdas2348sdfh235sfj35
        let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
        sendMail(email,transMail.subject,transMail.template(linkVerify))
        .then(success => {
            resolve(transSuccess.userCreated(user.local.email));
        })
        .catch(async (error) => {
            //remove user
            await userModel.removeById(user._id)
            reject(transMail.send_failed);
        })
    })
};
let verifyAccount = (token) => {
    return new Promise(async(resolve,reject) => {
        let userByToken = await userModel.findByToken(token);
        if(!userByToken){
            return reject(transErrors.token_undefined);
        }
        await userModel.verify(token);
        resolve(transSuccess.account_actived)
    })
}
let forgotPassword = async (email) => {
    return new Promise(async(resolve,reject) => {
        let userByEmail = await userModel.findByEmail(email);
        if(!userByEmail){
            return reject(transErrors.email_not_find); 
        }
        let randomPassword = random.ramdomPassword();
        let salt = bcrypt.genSaltSync(saltRounds);
        let newPassword = bcrypt.hashSync(randomPassword,salt);
        await userModel.findEmailAndChangPassword(email,newPassword);
        sendMail(email,transMail.subject_forgot_password,transMail.template_forgot_password(randomPassword))
        .then(success => {
            resolve(transSuccess.forgotPassword(email));
        })
        .catch(async (error) => {
            //remove user
            reject(transMail.send_failed);
        })
    })
}
module.exports = {
    register,
    verifyAccount,
    forgotPassword
}