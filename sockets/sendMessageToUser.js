const userModel = require('../model/userModel');
let sendMessageToUser = (io,socket, clients) => {
    socket.on('send-massage-to-user',async (data) => {
        let result = {
            message : data.message,
            receivedId : data.senderId, 
            receivedName : data.senderName 
        }
        if(clients[data.userId]){
            clients[data.userId].forEach(socketId => io.to(socketId).emit("response-send-massage-to-user",result));
        }
    })
}
module.exports = sendMessageToUser;