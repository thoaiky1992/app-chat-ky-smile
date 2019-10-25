const moment = require('moment');
let convertTimestampToHumanTime = (timestamp) => {
    if(!timestamp){
        return "";
    }
    return moment(timestamp).locale("vi").startOf("seconds").fromNow();
}
module.exports = convertTimestampToHumanTime;