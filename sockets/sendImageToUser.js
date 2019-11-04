const userModel = require('../model/userModel');
let sendMessageToUser = (io,socket, clients) => {
    socket.on('send-image-to-user',async (data) => {
        let result = {
            file : data.data
        }
        if(clients[data.userId]){
            clients[data.userId].forEach(socketId => io.to(socketId).emit("response-send-image-to-user",result));
        }
    })
}
module.exports = sendMessageToUser;