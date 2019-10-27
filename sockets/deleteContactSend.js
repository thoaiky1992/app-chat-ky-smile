const userModel = require('../model/userModel');
let deleteContactSend = (io,socket, clients) => {
    socket.on('delete-add-friend',async (data) => {
        let user = await userModel.getNormalUserDataById(socket.request.user._id); 
        if(clients[data.senderId]){
            clients[data.senderId].forEach(socketId => io.to(socketId).emit("response-delete-add-friend",user));
        }
    })
}
module.exports = deleteContactSend;