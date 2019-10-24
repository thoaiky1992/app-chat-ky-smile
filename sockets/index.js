const addNewContact = require('./addnewContact');

let initSockets = (io) => {
    let clients = {};
    io.on('connection', (socket) => {
        if(clients[socket.request.user._id]){
            clients[socket.request.user._id].push(socket.id); // nếu đã có thì thêm vào
        }else{
            clients[socket.request.user._id] = [socket.id]; // nếu chưa có thì tạo mới
        }
        for(let i = 0 ; i < clients.length ; i++){
            clients[i] = _.uniqBy(clients[i]); // loại bỏ các socket.id trùng
        }

        //socket on
        addNewContact(io,socket,clients);

        socket.on('disconnect',() => {
            // remove socketId when socket disconnected
            clients[socket.request.user._id] = clients[socket.request.user._id].filter(socketId => socketId !== socket.id );
            if(!clients[socket.request.user._id].length){
                delete clients[socket.request.user._id];
            }
        });
    })
}
module.exports = initSockets;  