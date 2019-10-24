const userService = require('../service/userService');
const contactService = require('../service/contactService');
const ejs = require('ejs');
const { promisify } =  require('util');
// Make ejs function renderFile available with async/await
const renderFile = promisify(ejs.renderFile).bind(ejs);
let getChat = (req,res) => {
    
    res.render('chat', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        typeLleftSide : "chat",
        user : req.user
    });
}
let getContact = async (req,res) => {
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
        countAllContactsRecevied : countAllContactsRecevied
    });
}
let getEditUser = (req,res) => {
    res.render('edit-user', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        typeLleftSide : "edit",
        user : req.user
    });
}
let getChangePassword = (req,res) => {
    res.render('change-password', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        typeLleftSide : "edit",
        user : req.user
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
module.exports = {
    getChat,
    getContact,
    getEditUser,
    getChangePassword,
    searchUserToAddFriend,
    addContact,
    getDataByType
    
}