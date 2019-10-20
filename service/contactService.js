const contactModel = require('../model/contactModel');
const notificationModel = require('../model/notificationModel');
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
module.exports = {
    addNewContact
}