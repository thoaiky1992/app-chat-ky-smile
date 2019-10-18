const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const NotificationSchema = new Schema({
    senderId        : String ,
    receiverId      : String,
    type            : String,
    isRead          : {type:Boolean,default:false},
    file            : {data:Buffer,contentType:String,fileName:String},
    createdAt        : {type:Number,default:Date.now}, 
});
NotificationSchema.statics = {
    createNew(item){
        return this.create(item)
    },
    removeRequestContactNotification(senderId,receiverId,type){
        return this.deleteOne({
            $and : [
                {senderId : senderId},
                {receiverId : receiverId},
                {type : type}
            ]
        }).exec();
    },
    getByUserIdAndLimit(userId,limit){
        return this.find({receiverId : userId}).sort({createdAt:-1}).limit(limit).exec();
    },
    readMore(userId,skip,limit){
        return this.find({receiverId : userId}).sort({createdAt:-1}).skip(skip).limit(limit).exec();
    },
    countNofityUnread(userId){
        return this.countDocuments({
            $and : [
                {receiverId : userId},
                {"isRead":false}
            ]
        })
    },
    markNotificationAsRead(userId,markArrayUserId){
        return this.updateMany({
            $and : [
                { receiverId : userId },
                { senderId : {$in  : markArrayUserId}}
            ]
        },
        { "isRead" : true }).exec();
    }
}
const NOTIFICATION_TYPES = {
    ADD_CONTACT : "add_contact",
    APPROVE_CONTACT : "approve_contact"
}
const NOTIFICATION_CONTENTS = {
    getContent : (notificationType,isRead,userId,userName,userAvatar) => {
        if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT){
            if(!isRead){
                return `<div class="notify-readed-false" data-uid="${ userId }">
                <img class="avatar-small" src="images/users/${userAvatar}"alt="">
                <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
            }
            return `<div data-uid="${ userId }">
                <img class="avatar-small" src="images/users/${userAvatar}"alt="">
                <strong>${userName}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
        }
        if(notificationType === NOTIFICATION_TYPES.APPROVE_CONTACT){
            if(!isRead){
                return `<div class="notify-readed-false" data-uid="${ userId }">
                <img class="avatar-small" src="images/users/${userAvatar}"alt="">
                <strong>${userName}</strong> đã chấp nhận lời mời kết bạn !
                </div>`;
            }
            return `<div data-uid="${ userId }">
                <img class="avatar-small" src="images/users/${userAvatar}"alt="">
                <strong>${userName}</strong> đã chấp nhận lời mời kết bạn !
                </div>`;
        }
        return "No matching with any notification type.";
    }
    
}
module.exports = {
    model : mongoose.model('notification',NotificationSchema),
    types : NOTIFICATION_TYPES,
    contents : NOTIFICATION_CONTENTS
};