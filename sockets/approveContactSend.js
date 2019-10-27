const userModel = require('../model/userModel');
let approveContactSend = (io,socket, clients) => {
    socket.on('approve-add-friend',async (data) => {
        let userApproveAddFriend = await userModel.getNormalUserDataById(data.IdUserApproveAddFriend); 
        let result = {
            userApproveAddFriend : userApproveAddFriend,
            userReceived : socket.request.user,
            notify : data.data,
            currentIdUser : socket.request.user._id
        }
        if(clients[data.senderId]){
            clients[data.senderId].forEach(socketId => io.to(socketId).emit("response-approve-add-friend",result));
        }
    })
}
module.exports = approveContactSend;