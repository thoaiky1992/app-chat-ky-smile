const moment = require('moment');
let convertTimestampsToDMY = (timestamp) => {
    if(!timestamp){
        return "";
    }
    return moment(timestamp).format('DD/MM/YYYY, HH:mm:ss');
}
module.exports = convertTimestampsToDMY;