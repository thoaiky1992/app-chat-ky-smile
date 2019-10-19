const UserModel =  require('../model/userModel');
const { transErrors } = require('../lang/vi');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');

let saltRounds = 7 ;
let updateUser = (id,item) => {
    return UserModel.updateUser(id,item);
}
let updateInfoUser = async (item,idUser) => {
    return await UserModel.updateUser(idUser,item);
}
let updatePassWord =  (newPassword,currentPassword,idUser) => {
    return new Promise(async (resolve,reject) => {
        let currentUser = await UserModel.findUserByIdToUpdatePassword(idUser);
        if(!currentUser){
            return reject(transErrors.account_undefined);
        }
        let checkCurrentPassword = await currentUser.comparePassword(currentPassword); 
        if(!checkCurrentPassword){
            return reject(transErrors.user_current_password_failed);    
        }
        let salt = bcrypt.genSaltSync(saltRounds);
        await UserModel.updatePassword(idUser,bcrypt.hashSync(newPassword,salt))
        resolve(true);
    })
    
}
module.exports = {
    updateUser,
    updateInfoUser,
    updatePassWord
}