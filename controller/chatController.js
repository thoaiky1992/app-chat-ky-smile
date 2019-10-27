const userService = require('../service/userService');
const contactService = require('../service/contactService');
const notificationService = require('../service/notificationService');
const ejs = require('ejs');
const { promisify } =  require('util');
// Make ejs function renderFile available with async/await
const renderFile = promisify(ejs.renderFile).bind(ejs);
let getChat = async (req,res) => {
    //only 10 item on time
    let notifications = await notificationService.getNotifications(req.user._id);
    res.render('chat', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        typeLleftSide : "chat",
        user : req.user,
        notifications : notifications
    });
}
let getContact = async (req,res) => {
    //only 10 item on time
    let notifications = await notificationService.getNotifications(req.user._id);
    //count contact
    let countAllContacts = await contactService.countAllContacts(req.user._id);
    let countAllContactsSend = await contactService.countAllContactsSend(req.user._id);
    let countAllContactsRecevied = await contactService.countAllContactsRecevied(req.user._id)
    res.render('contact', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        typeLleftSide : "contact",
        user : req.user,
        countAllContacts : countAllContacts,
        countAllContactsSend : countAllContactsSend,
        countAllContactsRecevied : countAllContactsRecevied,
        notifications : notifications
    });
}
let getEditUser = async (req,res) => {
    //only 10 item on time
    let notifications = await notificationService.getNotifications(req.user._id);
    res.render('edit-user', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        typeLleftSide : "edit",
        user : req.user,
        notifications: notifications
    });
}
let getChangePassword = async (req,res) => {
    //only 10 item on time
    let notifications = await notificationService.getNotifications(req.user._id);
    res.render('change-password', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        typeLleftSide : "edit",
        user : req.user,
        notifications : notifications
    });
}
let searchUserToAddFriend = async(req,res) => {
    try {
        let keySearch = req.query.keySearch
        let getUserBykeySearch = await userService.getUserBykeySearch(keySearch,req.user._id);
        let tableUserSide = await renderFile('views/renderServerSide/tableSearchUserSide.ejs',{
            users : getUserBykeySearch
        })
        return res.status(200).send({tableUserSide:tableUserSide});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let addContact = async (req,res) => {
    try {
        let idUserReceiver = req.query.idUserReceiver;
        let newContact = await contactService.addNewContact(idUserReceiver,req.user._id);
        return res.status(200).send({success:!!newContact});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let getDataByType = async (req,res) => {
    let type = req.query.type;
    if(type == 1){
        return res.status(200).send({tableUserSide:""});
    }else if(type == "2"){
        let listUserContact = await contactService.getListUserContact(req.user._id);
        let tableSideListUserContact = await renderFile('views/renderServerSide/tableListUserContact.ejs',{
            users : listUserContact
        })
        return res.status(200).send({tableUserSide:tableSideListUserContact});
    }else if(type == 3){
        let listUserContactsSend = await contactService.getContactsSend(req.user._id);
        let tableSideListUserContact = await renderFile('views/renderServerSide/tableListUserContactSend.ejs',{
            users : listUserContactsSend
        })
        return res.status(200).send({tableUserSide:tableSideListUserContact});
    }
    else{
        let listUserContactsRecevied = await contactService.getContactsRecevied(req.user._id);
        let tableSideListUserContactsRecevied = await renderFile('views/renderServerSide/tableListUserContactRecevied.ejs',{
            users : listUserContactsRecevied
        })
        return res.status(200).send({tableUserSide:tableSideListUserContactsRecevied});
    }
}
let revertAddContactSend = async(req,res) => {
    try {
        let currentId = req.user._id;
        let contactId = req.query.idUser;
        let removeReq = await contactService.removeRequestContactSent(currentId,contactId);
        return res.status(200).send({success:!!removeReq});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let approveAddFriend = async (req,res) => {
    try {
        let currentId = req.user._id;
        let contactId = req.query.idUser;
        let approveReq = await contactService.approveRequestContactReceived(currentId,contactId);
        return res.status(200).send({success:true , data : approveReq});
    } catch (error) {
        return res.status(500).send(error);
    }
}
let deleteAddFriend = async (req,res) => {
    try {
        let currentId = req.user._id;
        let contactId = req.query.senderId;
        let removeReq = await contactService.removeRequestContactReceived(currentId,contactId);
        return res.status(200).send({success:!!removeReq});
    } catch (error) {
        return res.status(500).send(error);
    }
}
module.exports = {
    getChat,
    getContact,
    getEditUser,
    getChangePassword,
    searchUserToAddFriend,
    addContact,
    getDataByType,
    revertAddContactSend,
    approveAddFriend,
    deleteAddFriend
    
}