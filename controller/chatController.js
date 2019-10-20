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
let getContact = (req,res) => {
    res.render('contact', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        typeLleftSide : "contact",
        user : req.user
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
module.exports = {
    getChat,
    getContact,
    getEditUser,
    getChangePassword,
    searchUserToAddFriend,
    addContact
    
}