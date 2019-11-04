const userModel = require('../model/userModel');
const contactModel = require('../model/contactModel');
const messageModel = require('../model/messageModel');
const LIMIT_CONVERSATIONS = 10;
const LIMIT_MESSAGES = 10; 
const _ = require('lodash');
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
let addNewTextEmoji = (sender,receiverId,messageVal) => {
    return new Promise( async (resolve,reject) => {
        try {
            let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id : getUserReceiver._id,
                    name : getUserReceiver.username,
                    avatar : getUserReceiver.avatar
                }
                let newMessageItem = {
                    senderId    : sender.id,
                    receiverId  : receiver.id,
                    conversationType : messageModel.conversationTypes.PERSONAL,
                    messageType : messageModel.messageType.TEXT,
                    sender : sender,
                    receiver : receiver,
                    text        : messageVal,
                    createdAt    : Date.now(),
                }
                // create new message
                let newMessage = await messageModel.model.createNew(newMessageItem);
                // update contact
                await contactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id)
                resolve(newMessage);
        } catch (error) {
            reject(error);
        }
    })
}
let addNewImage = (sender,receiverId,fileName) => {
    return new Promise( async (resolve,reject) => {
        try {
            let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
            if(!getUserReceiver){
                return reject(transErrors.conversation_not_found);
            }
            let receiver = {
                id : getUserReceiver._id,
                name : getUserReceiver.username,
                avatar : getUserReceiver.avatar
            }
            let newMessageItem = {
                senderId    : sender.id,
                receiverId  : receiver.id,
                conversationType : messageModel.conversationTypes.PERSONAL,
                messageType : messageModel.messageType.IMAGE,
                sender : sender,
                receiver : receiver,
                fileName : fileName,
                createdAt : Date.now(),
            }
            // create new message
            let newMessage = await messageModel.model.createNew(newMessageItem);
            // update contact
            await contactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id)
            resolve(newMessage);
        } catch (error) {
            reject(error);
        }
    })
}
let loadMoreMessage = (currentUserId,targetId,skipMessage) => {
    return new Promise(async (resolve,reject) => {
        try {
            let getMessages = await  messageModel.model.readMoreMessageInPersonal(currentUserId,targetId,skipMessage,LIMIT_MESSAGES);
            getMessages = _.reverse(getMessages);
            return resolve(getMessages);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    letAllConversationItems,
    addNewTextEmoji,
    addNewImage,
    loadMoreMessage
}