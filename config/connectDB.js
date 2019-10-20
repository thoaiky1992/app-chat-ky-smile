const mongoose = require('mongoose');
const bluebird = require('bluebird');
require('dotenv').config();
let connectDB = () => {
    mongoose.Promise = bluebird;
     //mongodb://localhost:27017/awesome_chat
    let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    return mongoose.connect(URI,{ useNewUrlParser: true ,useFindAndModify: false , useUnifiedTopology: true});
}

module.exports = connectDB;