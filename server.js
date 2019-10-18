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

require('dotenv').config();

const server = http.createServer(app);

connectDB();

session.configSession(app);

app.use(bodyParser.urlencoded({extended:true}));

app.use(connectFlash());

app.use(cookieParser());

// config passport js
app.use(passport.initialize());
app.use(passport.session());

configViewEngine(app);

initRoutes(app);

server.listen(process.env.PORT);