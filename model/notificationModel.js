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
                return `
                <li> 
                    <a href="javascript:void(0);">
                        <div class="icon-circle bg-blue" style="width: 36px;float: left;height: auto;">
                            <img src="assets/images/${userAvatar}" style="border-radius: 50%;" width="36" height="36" alt="">
                        </div>
                        <div class="menu-info" style="float: left;height: auto;width: 200px;padding-bottom: 10px;">
                            <h4>${userName} đã gửi cho bạn 1 lời mời kết bạn</h4>
                            <p><i class="zmdi zmdi-time"></i> 14 mins ago </p>
                        </div>
                    </a> 
                </li>`;
            }
            return `
            <li> 
                <a href="javascript:void(0);">
                    <div class="icon-circle bg-blue" style="width: 36px;float: left;height: auto;">
                        <img src="assets/images/${userAvatar}" style="border-radius: 50%;" width="36" height="36" alt="">
                    </div>
                    <div class="menu-info" style="float: left;height: auto;width: 200px;padding-bottom: 10px;">
                        <h4>${userName} đã gửi cho bạn 1 lời mời kết bạn</h4>
                        <p><i class="zmdi zmdi-time"></i> 14 mins ago </p>
                    </div>
                </a> 
            </li>`;
        }
        if(notificationType === NOTIFICATION_TYPES.APPROVE_CONTACT){
            if(!isRead){
                return `
                <li> 
                    <a href="javascript:void(0);">
                        <div class="icon-circle bg-blue" style="width: 36px;float: left;height: auto;">
                            <img src="assets/images/${userAvatar}" style="border-radius: 50%;" width="36" height="36" alt="">
                        </div>
                        <div class="menu-info" style="float: left;height: auto;width: 200px;padding-bottom: 10px;">
                            <h4>${userName} đã chấp nhận lời mời kết bạn</h4>
                            <p><i class="zmdi zmdi-time"></i> 14 mins ago </p>
                        </div>
                    </a> 
                </li>`;
            }
            return `
            <li> 
                <a href="javascript:void(0);">
                    <div class="icon-circle bg-blue" style="width: 36px;float: left;height: auto;">
                        <img src="assets/images/${userAvatar}" style="border-radius: 50%;" width="36" height="36" alt="">
                    </div>
                    <div class="menu-info" style="float: left;height: auto;width: 200px;padding-bottom: 10px;">
                        <h4>${userName} đã chấp nhận lời mời kết bạn</h4>
                        <p><i class="zmdi zmdi-time"></i> 14 mins ago </p>
                    </div>
                </a> 
            </li>`;
        }
        return "No matching with any notification type.";
    }
    
}
module.exports = {
    model : mongoose.model('notification',NotificationSchema),
    types : NOTIFICATION_TYPES,
    contents : NOTIFICATION_CONTENTS
};