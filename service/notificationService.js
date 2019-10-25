let notificationModel = require('../model/notificationModel');
const userModel = require('../model/userModel');
const LIMIT = 6;
let getNotifications = (currentUserId) => {
    return new Promise(async (resolve,reject) => {
        try {
            let notifications = await notificationModel.model.getByUserIdAndLimit(currentUserId,LIMIT);
            let getNotifyContents = notifications.map( async (notification) => {
                let sender = await userModel.getNormalUserDataById(notification.senderId);
                return await notificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username,sender.avatar,notification.createdAt);
            })
            resolve(await Promise.all(getNotifyContents));
        } catch (error) {
            reject(error);
        }
    })
};
module.exports = {
    getNotifications
}