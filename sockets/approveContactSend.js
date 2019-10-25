let approveContactSend = (io,socket, clients) => {
    socket.on('approve-add-friend',(data) => {
        let result = {
            currentIdUser : socket.request.user._id,
            userSender : socket.request.user,
            notify : data.data
        }
        if(clients[data.senderId]){
            clients[data.senderId].forEach(socketId => io.to(socketId).emit("response-approve-add-friend",result));
        }
    })
}
module.exports = approveContactSend;