const express           = require('express');
const app               = express();
const http              = require('http');
const configViewEngine  = require('./config/configViewEngine');
const initRoutes        = require('./routes/web');
const bodyParser        = require('body-parser');
const cookieParser      = require('cookie-parser');
const connectFlash      = require('connect-flash');
const session           = require('./config/configSession');
const connectDB         = require('./config/connectDB');
const passport          = require('passport');
const configSocketIo    = require('./config/passportSocketio');
const socketio          = require('socket.io');
const initSockets       = require('./sockets/index');

require('dotenv').config();

const server    = http.createServer(app);
const io        = socketio(server);

connectDB();

session.configSession(app);

app.use(bodyParser.urlencoded({extended:true}));

app.use(connectFlash());

app.use(cookieParser());

// config passport js
app.use(passport.initialize());
app.use(passport.session());

// config socketIo
configSocketIo(io,cookieParser,session.sessionStore);

configViewEngine(app);

initRoutes(app);

// init all socket
initSockets(io);

server.listen(process.env.PORT);