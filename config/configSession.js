const session = require('express-session');
const connectMongo = require('connect-mongo');
require('dotenv').config();
const mongoStore = connectMongo(session);
/**
 * lưu session vào mongodb
 */
let sessionStore = new mongoStore({
    // url :  `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    url : `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    autoReconnect : true,
    // autoRemove : 'native'
})

let configSession = (app) => {
    app.use(session({
        key:'thoaiky1992',
        secret : 'thoaiky1992',
        store : sessionStore,
        resave : true,
        saveUninitialized : false,
        coookie : {
            maxAge : 1000 * 60 * 60 * 24 // 86400000 seconds =  1 day
        }
    }))
}
module.exports = {
    configSession,
    sessionStore
};