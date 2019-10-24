const contactModel = require('../model/contactModel');
const userModel = require('../model/userModel');
const notificationModel = require('../model/notificationModel');
const _ = require('lodash');
const LIMIT = 6;
let addNewContact = (idUserReceiver,currentIdUser) => {
    return new Promise( async (resolve,reject) => {
        let contactExists = await contactModel.checkExists(currentIdUser,idUserReceiver)
        if(contactExists){
            return reject(false);
        }
        //create contact
        let newContactItem = {
            userID: currentIdUser,
            contactID : idUserReceiver
        }
        let newContact = await contactModel.createNew(newContactItem);
        let notificationItem = {
            senderId : currentIdUser,
            receiverId : idUserReceiver,
            type : notificationModel.types.ADD_CONTACT
        }
        await notificationModel.model.createNew(notificationItem);
        resolve(newContact);
    })
}
let getListUserContact = (currentIdUser) => {
    return new Promise( async (resolve,reject) => {
        let contacts = await contactModel.getContacts(currentIdUser,LIMIT);
        let users = contacts.map( async (contact) => {
            if(contact.contactID == currentIdUser){
                return await userModel.getNormalUserDataById(contact.userID);
            }
            else{
                return await userModel.getNormalUserDataById(contact.contactID);
            }
        });
        resolve(await Promise.all(users));
    })
}
let getContactsSend = (currentIdUser) => {
    return new Promise(async(resolve,reject) => {
        try {
            let contactsSend = await contactModel.getContactsSend(currentIdUser,LIMIT);
            let users = contactsSend.map( async (contact) => {
                return await userModel.getNormalUserDataById(contact.contactID);
            })
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}
let getContactsRecevied = (currentIdUser) => {
    return new Promise(async(resolve,reject) => {
        try {
            let contactsRecevied = await contactModel.getContactsRecevied(currentIdUser,LIMIT);
            let users = contactsRecevied.map( async (contact) => {
                return await userModel.getNormalUserDataById(contact.userID);
            })
            resolve(await Promise.all(users));
        } catch (error) {
            reject(error);
        }
    })
}
let countAllContacts = (currentIdUser) => {
    return new Promise(async(resolve,reject) => {
        try {
            let count = await contactModel.countAllContacts(currentIdUser);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}
let countAllContactsSend = (currentIdUser) => {
    return new Promise(async(resolve,reject) => {
        try {
            let count = await contactModel.countAllContactsSend(currentIdUser);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}
let countAllContactsRecevied = (currentIdUser) => {
    return new Promise(async(resolve,reject) => {
        try {
            let count = await contactModel.countAllContactsRecevied(currentIdUser);
            resolve(count);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    addNewContact,
    getListUserContact,
    getContactsSend,
    getContactsRecevied,
    countAllContacts,
    countAllContactsSend,
    countAllContactsRecevied
}