const passportSocketIo =  require('passport.socketio');
let configSocketIo = (io,cookieParser,sessionStore) => {
    io.use(passportSocketIo.authorize({
        cookieParser : cookieParser,
        key :'thoaiky1992', // phải giống với config bên session
        secret : 'thoaiky1992',// phải giống với config bên session
        store :  sessionStore,
        success : (data,accept) => {
            if(!data.user.logged_in){
                return accept('Invalid User !',false);
            }
            return accept(null,true);
        },
        fail : (data,message,error,accept) => {
            if(error){
                console.log("Failed connect to socket.io : " ,  message);
                return accept(new Error(message),false);
            }
        }
    }))
}
module.exports = configSocketIo;