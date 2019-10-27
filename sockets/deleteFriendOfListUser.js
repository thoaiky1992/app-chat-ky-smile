const userModel = require('../model/userModel');
let deleteFriendOfListUser = (io,socket, clients) => {
    socket.on('delete-friend-of-list-user',async (data) => { 
        if(clients[data]){
            clients[data].forEach(socketId => io.to(socketId).emit("response-delete-friend-of-list-user",socket.request.user._id));
        }
    })
}
module.exports = deleteFriendOfListUser;