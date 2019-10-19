let getChat = (req,res) => {
    res.render('chat', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        user : req.user
    });
}
let getContact = (req,res) => {
    res.render('contact', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        user : req.user
    });
}
let getEditUser = (req,res) => {
    res.render('edit-user', { 
        errors : req.flash('errors') , 
        success : req.flash('success'),
        user : req.user
    });
}
module.exports = {
    getChat,
    getContact,
    getEditUser,
    

}