const UserModel =  require('../model/userModel');
const contactModel = require('../model/contactModel');
const { transErrors } = require('../lang/vi');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

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
let getUserBykeySearch = (keySearch,currentUserId) => {
    return new Promise(async (resolve,reject) => {
        let deprecatedUserIds = [currentUserId]; // những ID không dùng nữa
        let contactByUsers = await contactModel.findAllByUser(currentUserId);
        contactByUsers.forEach((contact) => {
            deprecatedUserIds.push(contact.userID);
            deprecatedUserIds.push(contact.contactID);
        })
        deprecatedUserIds = _.uniqBy(deprecatedUserIds);
        let getAllUser = await UserModel.findAllOrAddContact(deprecatedUserIds,keySearch);
        resolve(getAllUser);
    })
}
module.exports = {
    updateUser,
    updateInfoUser,
    updatePassWord,
    getUserBykeySearch
}