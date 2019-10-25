let addNewContact = (io,socket, clients) => {
    socket.on('revert-add-contact-send',(data) => {
        let result = {
            idSender : socket.request.user._id
        }
        if(clients[data]){
            clients[data].forEach(socketId => io.to(socketId).emit("response-revert-add-contact-send",result));
        }
    })
}
module.exports = addNewContact;