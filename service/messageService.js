const userModel = require('../model/userModel');
const LIMIT_CONVERSATIONS = 10;
const LIMIT_MESSAGES = 10; 
let letAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve,reject) => {
        try {
            let contacts = await contactModel.getContacts(currentUserId,LIMIT_CONVERSATIONS);
            let userConversationstPromise = contacts.map( async (contact) => {
                if(contact.contactID == currentUserId){
                    let getUserContact =  await userModel.getNormalUserDataById(contact.userID);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
                else{
                    let getUserContact = await userModel.getNormalUserDataById(contact.contactID);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversations =  await Promise.all(userConversationstPromise);
            userConversations = _.sortBy(userConversations , (item) => {
                return -item.updatedAt;
            })
            // get message to apply in screen chat
            let allConversationWidthMessagePromise = userConversations.map( async (conversation) => {
                conversation = conversation.toObject();
                let getMessage = await  messageModel.model.getMessageInPersonal(currentUserId,conversation._id,LIMIT_MESSAGES);
                conversation.messages = _.reverse(getMessage);
                return conversation;
            })
            let allConversationWithMessage = await Promise.all(allConversationWidthMessagePromise);
            // sort By updatedAt DESC
            allConversationWithMessage = _.sortBy(allConversationWithMessage,(item) => {
                return -item.updatedAt;
            })
            resolve({
                allConversationWithMessage : allConversationWithMessage
            });
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    letAllConversationItems
}