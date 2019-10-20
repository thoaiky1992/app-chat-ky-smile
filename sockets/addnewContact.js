let addNewContact = (io,socket, clients) => {
    socket.on('add-new-contact',(data) => {
    let result = {
        idUserReciever : data,
        user : socket.request.user
    }
    clients[data].forEach(socketId =>
        io.to(socketId).emit("response-add-new-contact",result));
    })
}
module.exports = addNewContact;